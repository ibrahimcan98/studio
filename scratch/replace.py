import re

path = r"c:\Users\ibrah\studio\src\app\kurslar\kurslar-client.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

def replace_card(match):
    course_var = match.group(1) # baslangicKursu, konusmaKursu vb.
    is_gcse = course_var == "gcseKursu"
    is_grup = course_var == "grupKursu"
    
    extra_classes = " w-full max-w-xs" if is_gcse or is_grup else ""
    border_class = "border-purple-200 shadow-md hover:shadow-xl hover:scale-105 transition-all" if is_grup else "border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
    if is_grup:
        border_class = "border-2 " + border_class
    else:
        border_class = "border " + border_class
    
    # We will use dynamic classes for 12 lessons (turquoise frame)
    # The original string uses template literals or just strings. We'll replace it with a template literal.
    
    className_attr = f'className={{`relative rounded-2xl p-8 flex flex-col items-center text-center bg-white ${{pkg.lessons === 12 ? "border-2 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:shadow-[0_0_25px_rgba(45,212,191,0.5)] transition-shadow" : "{border_class}"}}{extra_classes}`}}'
    
    header_text = "{pkg.lessons} Haftalık Grup Paketi" if is_grup else "{pkg.lessons} Derslik Paket"
    
    return f'''{className_attr}>
                                            {{pkg.lessons === 12 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-20">
                                                    ÖNERİLEN
                                                </div>
                                            )}}
                                            {{pkg.lessons === 24 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md whitespace-nowrap z-20">
                                                    EN AVANTAJLI
                                                </div>
                                            )}}
                                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-{"purple" if is_grup else "gray"}-100 mb-4 mt-2">
                                                <BookOpen className="w-8 h-8 text-{"purple-600" if is_grup else "gray-500"}"/>
                                            </div>
                                            <h4 className="font-bold text-gray-800 text-lg mb-1">{header_text}</h4>
                                            <p className="text-sm text-gray-500 font-medium">{{{course_var}.details.duration}}</p>
                                            <PerLessonPrice perLessonPriceInGbp={{perLessonPrice}} courseId={{{course_var}.id}} packageLessons={{pkg.lessons}} />
                                            <PriceDisplay price={{pkg.price}} courseId={{{course_var}{"!" if not is_grup and not is_gcse and not course_var=="konusmaKursu" else ""}.id}} packageLessons={{pkg.lessons}} />
                                            <Button className="w-full mt-auto bg-{"purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-200" if is_grup else "primary text-primary-foreground hover:bg-primary/90"}" onClick={{() => handleAddToCart({course_var}, pkg)}}>
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Sepete Ekle
                                            </Button>
                                        </div>'''

# We will use regex to find the start of the card up to the closing </div> inside the map
# Pattern: className="relative border ... "> ... </div>
import re

pattern = re.compile(
    r'className="relative[^>]+>\s*<div className="w-16 h-16[^>]+>\s*<BookOpen[^>]+/>\s*</div>\s*<h4 className="font-bold text-gray-800">\{([a-zA-Z]+)\.title\}</h4>\s*<p className="text-sm text-gray-500">\(\{.*?\.details\.duration\}\)</p>\s*<p className=".*?mt-2.*?">.*?</p>\s*<PerLessonPrice.*?\s*<PriceDisplay.*?\s*<Button.*?</Button>\s*</div>',
    re.DOTALL
)

new_content = pattern.sub(replace_card, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(new_content)

print("Done")
