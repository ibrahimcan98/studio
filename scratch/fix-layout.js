const fs = require('fs');

const path = "c:/Users/ibrah/studio/src/app/kurslar/kurslar-client.tsx";
let content = fs.readFileSync(path, 'utf8');

const regex = /className={\`relative rounded-2xl p-8 flex flex-col items-center text-center bg-white \$\{pkg\.lessons === 12 \? "border-2 border-teal-400 shadow-\[0_0_15px_rgba\(45,212,191,0\.3\)\] hover:shadow-\[0_0_25px_rgba\(45,212,191,0\.5\)\] transition-shadow" : ".*?"\}(.*?)\`}>\s*\{pkg\.lessons === 12 && \(\s*<div className="absolute -top-3 left-1\/2 -translate-x-1\/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-20">\s*ÖNERİLEN\s*<\/div>\s*\)\}\s*\{pkg\.lessons === 24 && \(\s*<div className="absolute -top-3 left-1\/2 -translate-x-1\/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-20">\s*EN AVANTAJLI\s*<\/div>\s*\)\}\s*<div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-(gray|purple)-100 mb-4 mt-2">\s*<BookOpen className="w-8 h-8 text-(gray-500|purple-600)"\/>\s*<\/div>\s*<h4 className="font-bold text-gray-800 text-lg mb-1">(.*?)<\/h4>/gs;

content = content.replace(regex, (match, extraClasses, bgClass, textClass, headerText) => {
    
    // We will clean up the border for 12, use a simpler ring or border.
    // The previous border was: border-2 border-teal-400 shadow-[...]
    // We'll replace it entirely by just passing a simpler string.
    
    // Actually, it's easier to just rebuild the whole top section of the card instead of relying on complex matching since we know exactly what we want.
    // Wait, the regex matched the whole top section up to the h4.
    
    const isGrup = bgClass === "purple";
    let borderClass = isGrup ? "border-purple-200 shadow-md hover:shadow-xl hover:scale-105 transition-all" : "border-gray-200 shadow-sm hover:shadow-lg transition-shadow";
    
    if (isGrup) {
        borderClass = "border-2 " + borderClass;
    } else {
        borderClass = "border " + borderClass;
    }
    
    const classNameAttr = `className={\`relative rounded-2xl p-8 flex flex-col items-center text-center bg-white \${pkg.lessons === 12 ? "border-2 border-teal-400 shadow-lg shadow-teal-100 hover:shadow-xl hover:shadow-teal-200 transition-all" : "${borderClass}"}${extraClasses}\`}`;
    
    return `${classNameAttr}>
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-${bgClass}-100 mb-4 mt-2">
                                                <BookOpen className="w-8 h-8 text-${textClass}"/>
                                            </div>
                                            {pkg.lessons === 12 && (
                                                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-teal-200">Önerilen</span>
                                            )}
                                            {pkg.lessons === 24 && (
                                                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border border-purple-200">En Avantajlı</span>
                                            )}
                                            <h4 className="font-bold text-gray-800 text-lg mb-1">${headerText}</h4>`;
});

fs.writeFileSync(path, content, 'utf8');
console.log("Done");
