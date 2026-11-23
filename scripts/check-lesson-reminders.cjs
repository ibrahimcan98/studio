const fs=require('fs'),path=require('path'),ts=require('typescript'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function load(file,deps={}){const module={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(name=>Object.hasOwn(deps,name)?deps[name]:require(name),module,module.exports);return module.exports;}
const stamp=date=>({toDate:()=>new Date(date),seconds:Math.floor(new Date(date).getTime()/1000),nanoseconds:0});
const field={serverTimestamp:()=> 'server-time'};
const grouping=load('src/lib/lesson-reminders.ts');
const delivery=load('src/lib/reminder-delivery.ts',{'firebase-admin/firestore':{FieldValue:field}});
function fakeDb(slots=[],failFlagWrite=false){
 const records=new Map([['users/p',{firstName:'Veli',email:'parent@example.com',timezone:'Europe/London'}],['users/p/children/c',{firstName:'Çocuk'}],['users/t',{firstName:'Öğretmen'}]]);
 for(const slot of slots)records.set('lesson-slots/'+slot.id,slot);
 let queue=Promise.resolve(),flagWrites=0;
 const snapshot=key=>({exists:records.has(key),data:()=>records.has(key)?{...records.get(key)}:undefined});
 const reference=key=>({key,id:key.split('/').pop(),get:async()=>snapshot(key),collection:name=>collection(key+'/'+name)});
 const collection=key=>({doc:id=>reference(key+'/'+id),where(field,operator,value){assert.equal(field,'startTime','Only the existing single-field index may be required');return this;},async get(){return {docs:[...records.entries()].filter(([id])=>id.startsWith(key+'/')).map(([id,data])=>({id:id.split('/').pop(),ref:reference(id),data:()=>({...data})}))};}});
 const db={records,collection,runTransaction(callback){const operation=queue.then(async()=>{const writes=[];const value=await callback({get:async ref=>snapshot(ref.key),set:(ref,data)=>writes.push([ref.key,data])});for(const [id,data]of writes)records.set(id,{...records.get(id),...data});return value;});queue=operation.catch(()=>{});return operation;},batch(){const writes=[];return {update:(ref,data)=>writes.push([ref.key,data]),async commit(){flagWrites++;if(failFlagWrite&&flagWrites===1)throw new Error('Simulated post-send flag failure');for(const [id,data]of writes)records.set(id,{...records.get(id),...data});}};}};
 return db;
}
const base=new Date(Date.now()+10*60000);
const slot=(id,offset,overrides={})=>({id,status:'booked',bookedBy:'p',childId:'c',teacherId:'t',packageCode:'B12',bookedAt:stamp(new Date('2026-11-01T10:00:00Z')),startTime:stamp(new Date(base.getTime()+offset*60000)),...overrides});
(async()=>{
 const slots=[slot('a',0),slot('b',5),slot('c',10),slot('other',0,{childId:'other-child'}),slot('later',50),slot('new-booking',15,{bookedAt:stamp(new Date('2026-11-02T10:00:00Z'))})];
 const grouped=grouping.groupReminderSessions(slots);
 assert.equal(grouped.length,4);
 assert.deepEqual(grouped.find(s=>s.id==='a').slotIds,['a','b','c']);
 assert.equal(grouping.groupReminderSessions([slot('a',0),slot('copy',0),slot('b',5)]).length,1);
 const db=fakeDb();let sends=0;const send=async()=>{sends++;await new Promise(resolve=>setTimeout(resolve,5));return 'provider-id';};
 const concurrent=await Promise.all([delivery.deliverReminderOnce(db,'same-session','email',send),delivery.deliverReminderOnce(db,'same-session','email',send)]);
 assert.equal(sends,1);assert.ok(concurrent.includes('busy'));assert.equal(await delivery.deliverReminderOnce(db,'same-session','email',send),'already-sent');
 const retryDb=fakeDb();const keys=[];let fail=true;
 const retrySend=async key=>{keys.push(key);if(fail){fail=false;throw new Error('Simulated provider failure');}return 'ok';};
 await assert.rejects(delivery.deliverReminderOnce(retryDb,'retry','email',retrySend));
 assert.equal(await delivery.deliverReminderOnce(retryDb,'retry','email',retrySend),'sent');assert.equal(keys[0],keys[1]);
 const routeDb=fakeDb([slot('a',0),slot('b',5),slot('c',10),slot('later',50)],true);let emails=0,pushes=0;
 const route=load('src/app/api/cron/reminders/route.ts',{
  'next/server':{NextResponse:{json:(body,options)=>({body,status:options?.status||200})}},
  '@/lib/firebase-admin':{db:routeDb},'firebase-admin/firestore':{Timestamp:{fromDate:stamp},FieldValue:field},
  '@/lib/notifications':{sendPushNotification:async()=>{pushes++;return {success:true};}},
  '@/lib/resend':{FROM_EMAIL:'sender@example.com',resend:{emails:{send:async(payload,options)=>{assert.ok(options.idempotencyKey);emails++;return {data:{id:'email-1'}};}}}},
  '@/lib/email-templates':{getLessonReminderTemplate:()=>'<p>test</p>'},
  '@/lib/lesson-reminders':grouping,'@/lib/reminder-delivery':delivery,
 });
 const req={url:'https://example.com/api/cron/reminders?secret='+encodeURIComponent(process.env.CRON_SECRET||'dev_secret_123')};
 assert.equal((await route.GET({url:'https://example.com/api/cron/reminders'})).status,401);
 assert.equal((await route.GET(req)).body.remindersSentCount,1);
 // Repeat the scheduler run: root flag write failed, but durable receipt still prevents sending twice.
 assert.equal((await route.GET(req)).body.remindersSentCount,0);
 assert.equal(emails,1);assert.equal(pushes,1);
 assert.equal(routeDb.records.get('lesson-slots/later').pushReminderSent,undefined);
 console.log('Lesson reminder checks passed: concurrent runs, repeated cron after flag failure, provider retry key, five-minute grouping, duplicate slots, separate bookings, unrelated later lessons and authorization. No real messages were sent.');
})().catch(error=>{console.error(error);process.exitCode=1;});
