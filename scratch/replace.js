const fs = require('fs');

const path = "c:/Users/ibrah/studio/src/app/kurslar/kurslar-client.tsx";
let content = fs.readFileSync(path, 'utf8');

const regex = /className="relative[^>]+>\s*<div className="w-16 h-16[^>]+>\s*<BookOpen[^>]+\/>\s*<\/div>\s*<h4 className="font-bold text-gray-800">\{([a-zA-Z]+)\.title\}<\/h4>\s*<p className="text-sm text-gray-500">\(\{.*?\.details\.duration\}\)<\/p>\s*<p className=".*?mt-2.*?">.*?<\/p>\s*<PerLessonPrice.*?\s*<PriceDisplay.*?\s*<Button.*?<\/Button>\s*<\/div>/gs;

content = content.replace(regex, (match, courseVar) => {
    const isGcse = courseVar === "gcseKursu";
    const isGrup = courseVar === "grupKursu";
    
    const extraClasses = (isGcse || isGrup) ? " w-full max-w-xs" : "";
    let borderClass = isGrup ? "border-purple-200 shadow-md hover:shadow-xl hover:scale-105 transition-all" : "border-gray-200 shadow-sm hover:shadow-lg transition-shadow";
    
    if (isGrup) {
        borderClass = "border-2 " + borderClass;
    } else {
        borderClass = "border " + borderClass;
    }
    
    const classNameAttr = `className={\`relative rounded-2xl p-8 flex flex-col items-center text-center bg-white \${pkg.lessons === 12 ? "border-2 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-shadow" : "${borderClass}"}${extraClasses}\`}`;
    
    const headerText = isGrup ? "{pkg.lessons} Haftalık Grup Paketi" : "{pkg.lessons} Derslik Paket";
    
    return `${classNameAttr}>
                                            {pkg.lessons === 12 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-20">
                                                    ÖNERİLEN
                                                </div>
                                            )}
                                            {pkg.lessons === 24 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-20">
                                                    EN AVANTAJLI
                                                </div>
                                            )}
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-${isGrup ? "purple" : "gray"}-100 mb-4 mt-2">
                                                <BookOpen className="w-8 h-8 text-${isGrup ? "purple-600" : "gray-500"}"/>
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-lg mb-1">${headerText}</h4>
                                            <p className="text-sm text-gray-500 font-medium">{${courseVar}.details.duration}</p>
                                            <PerLessonPrice perLessonPriceInGbp={perLessonPrice} courseId={${courseVar}.id} packageLessons={pkg.lessons} />
                                            <PriceDisplay price={pkg.price} courseId={${courseVar}${(!isGrup && !isGcse && courseVar !== "konusmaKursu") ? "!" : ""}.id} packageLessons={pkg.lessons} />
                                            <Button className="w-full mt-auto bg-${isGrup ? "purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200" : "primary text-primary-foreground hover:bg-primary/90"}" onClick={() => handleAddToCart(${courseVar}, pkg)}>
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Sepete Ekle
                                            </Button>
                                        </div>`;
});

fs.writeFileSync(path, content, 'utf8');
console.log("Done");
