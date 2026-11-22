const fs = require('fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function load(file, dependencies = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require', 'module', 'exports', code)(name => Object.hasOwn(dependencies, name) ? dependencies[name] : require(name), module, module.exports);
  return module.exports;
}
const navigation = load('src/lib/homework-navigation.ts');
const notification = load('src/lib/homework-notification.ts');
assert.deepEqual(navigation.activeHomeworkTopics({activeHomeworkTopics:[16,'16','ev'],activeHomeworkTopic:'ev'}), ['16','ev']);
assert.equal(navigation.hasActiveHomework({activeHomeworkTopics:[16]}, '16'), true);
assert.equal(navigation.hasActiveHomework({}, undefined), false);
assert.equal(navigation.homeworkDestination('child','16'), '/cocuk-modu/child/turkce-hazinem/16');
assert.equal(navigation.homeworkDestination('child','sari-top'), '/cocuk-modu/child/hikayeler/sari-top');
assert.equal(navigation.homeworkDestination('child','ev-isleri'), '/cocuk-modu/child/ev-isleri');
const content = notification.homeworkNotificationContent({studentName:'Çocuk <img>',parentName:'Veli',phone:'0044 7700 900123',title:'Ev işleri & oyun',category:'Oyun Adası',teacherName:'Öğretmen',childId:'c1',game:true});
const whatsapp = new URL(content.whatsappUrl);
assert.equal(whatsapp.pathname, '/447700900123');
assert.equal(whatsapp.searchParams.get('text'), content.message);
assert.ok(content.message.includes('Ev işleri & oyun'));
assert.ok(content.html.includes('&lt;img&gt;'));
assert.ok(!content.html.includes('<img>'));
assert.equal(notification.homeworkNotificationContent({studentName:'A',parentName:'B',phone:'',title:'C',category:'D',teacherName:'T',childId:'c1',game:true}).whatsappUrl, null);

async function apiCase({role='teacher',owner='teacher1',auth=true,alreadySent=false,fail=false,attachment=false}={}) {
  const sent=[];const stored=[];
  const records={
    'users/teacher1':{role,firstName:'Öğretmen'},
    'game-homeworks/hw1':{teacherId:owner,parentId:'p1',childId:'c1',topicName:'Ev işleri',category:'Oyun Adası'},
    'lesson-slots/lesson1':{teacherId:owner,bookedBy:'p1',childId:'c1',homeworks:[{url:'https://example.com/homework.pdf',title:'Dosya Ödevi'}]},
    'users/p1':{firstName:'Veli',phoneNumber:'+447700900123'},
    'users/p1/children/c1':{firstName:'Çocuk'},
  };
  const db={doc(id){return {async get(){const value=id.startsWith('homework-notifications/') ? (alreadySent?{sentAt:true}:undefined) : records[id];return {exists:!!value,data:()=>value};},async set(value){stored.push(value);}};}};
  const route=load('src/app/api/game-homeworks/notify/route.ts',{
    'next/server':{NextResponse:{json:(body,options)=>({body,status:options?.status||200})}},
    'firebase-admin/firestore':{FieldValue:{serverTimestamp:()=> 'now'}},
    '@/lib/firebase-admin':{auth:{verifyIdToken:async()=>({uid:'teacher1'})},db},
    '@/lib/resend':{FROM_EMAIL:'test@example.com',resend:{emails:{send:async(payload,options)=>{sent.push({payload,options});return fail?{error:{message:'failed'}}:{data:{id:'email1'}};}}}},
    '@/lib/email-templates':{getBaseTemplate:html=>html},
    '@/lib/homework-notification':notification,
  });
  const response=await route.POST({headers:{get:()=>auth?'Bearer test':null},json:async()=>attachment?{lessonId:'lesson1',homeworkUrl:'https://example.com/homework.pdf'}:{homeworkId:'hw1'}});
  return {response,sent,stored};
}
(async()=>{
  assert.equal((await apiCase({auth:false})).response.status,401);
  assert.equal((await apiCase({role:'parent'})).response.status,403);
  assert.equal((await apiCase({owner:'other'})).response.status,403);
  const good=await apiCase();assert.equal(good.response.status,200);assert.equal(good.sent[0].payload.to,'iletisim@turkcocukakademisi.com');assert.equal(good.sent[0].payload.subject,'Yeni Ödev — Çocuk / Ev işleri');assert.ok(good.sent[0].options.idempotencyKey);assert.equal(good.stored.length,1);
  const duplicate=await apiCase({alreadySent:true});assert.equal(duplicate.sent.length,0);
  const file=await apiCase({role:'admin',attachment:true});assert.equal(file.response.status,200);assert.ok(file.sent[0].payload.html.includes('Dosya Ödevi'));
  const failed=await apiCase({fail:true});assert.equal(failed.response.status,500);assert.equal(failed.stored.length,0);
  console.log('Homework checks passed: routing, legacy IDs, HTML escaping, WhatsApp message, permissions, game/file notifications, deduplication, delivery failure. No email was sent.');
})().catch(error=>{console.error(error);process.exitCode=1;});
