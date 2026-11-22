const fs=require('fs'),path=require('path'),ts=require('typescript'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
function load(file,deps={}) {const module={exports:{}};new Function('require','module','exports',ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText)(name=>deps[name]||require(name),module,module.exports);return module.exports;}
const nav=load('src/lib/homework-navigation.ts');
const {collectHomeworkNotices,unseenHomeworkNotices}=load('src/lib/homework-notice.ts',{'./homework-navigation':nav});
const children=[{id:'a',firstName:'Ada',activeHomeworkTopics:['ev-isleri']},{id:'b',firstName:'Bora',activeHomeworkTopics:[16]}];
const homeworks=[{id:'h1',childId:'a',topicId:'ev-isleri',topicName:'Ev İşleri',status:'assigned'},{id:'h2',childId:'b',topicId:'16',topicName:'Sandık 16',status:'assigned'},{id:'done',childId:'a',topicId:'ev-isleri',status:'completed'},{id:'stale',childId:'a',topicId:'uzay',status:'assigned'},{id:'deleted-child',childId:'c',topicId:'ev-isleri',status:'assigned'}];
const slots=[{childId:'a',homeworks:[{fileName:'1_work.pdf',url:'https://example.com/work.pdf',title:'Çalışma'}]},{childId:'a',homeworks:[{fileName:'1_work.pdf',url:'https://example.com/work.pdf',title:'Çalışma'}]}];
const notices=collectHomeworkNotices(homeworks,children,slots);
assert.equal(notices.length,3);assert.deepEqual(notices.map(n=>n.childName),['Ada','Bora','Ada']);
assert.equal(notices.filter(n=>n.kind==='file').length,1);
assert.equal(unseenHomeworkNotices(notices,notices.map(n=>n.key)).length,0);
assert.equal(unseenHomeworkNotices(notices,['game:h1']).length,2);
const next=collectHomeworkNotices([...homeworks,{...homeworks[0],id:'h3'}],children,slots);
assert.deepEqual(unseenHomeworkNotices(next,notices.map(n=>n.key)).map(n=>n.key),['game:h3']);
assert.equal(collectHomeworkNotices([],[]).length,0);
assert.equal(homeworks[0].status,'assigned');
console.log('Homework popup checks passed: multiple children, numeric chest IDs, completed/stale records, repeated file slots, seen items, newly reassigned homework and unchanged completion status.');
