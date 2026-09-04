const fs = require('fs');
const files = [
    'src/app/cocuk-modu/[childId]/hikayeler/kaptan-kahvaltisi/page.tsx',
    'src/app/cocuk-modu/[childId]/hikayeler/gokusagi-partisi/page.tsx',
    'src/app/cocuk-modu/[childId]/hikayeler/bir-iki-uc-basardim/page.tsx'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // 1. router.push
    content = content.replace(/router\.push\(`\/cocuk-modu\/\$\{childId\}\/hikayeler`\);/g, 
      "if (childId === 'demo') { router.push('/ogretmen-portali/oyunlar'); } else { router.push(`/cocuk-modu/${childId}/hikayeler`); }"
    );

    // 2. useEffect progress
    content = content.replace(/\/\/ Kaldığı yeri kaydet\s*useEffect\(\(\) => \{\s*if \(childDocRef && currentIndex > 0\)/g, 
      "// Kaldığı yeri kaydet\n  useEffect(() => {\n    if (childId === 'demo') return;\n    if (childDocRef && currentIndex > 0)"
    );

    // 3. updateDoc
    content = content.replace(/await updateDoc\(childDocRef, updates\);/g, 
      "if (childId !== 'demo') { await updateDoc(childDocRef, updates); }"
    );
    
    fs.writeFileSync(f, content);
});
console.log('done');
