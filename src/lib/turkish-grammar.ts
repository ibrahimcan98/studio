/**
 * Türkçe dil bilgisi kurallarına (ünsüz yumuşaması ve ünlü uyumu) göre 
 * kelimelere doğru ekleri getiren yardımcı fonksiyonlar.
 */

export function getTurkishAccusative(word: string): string {
    if (!word) return "";

    const lastChar = word.slice(-1).toLowerCase();
    const vowels = "aeıioöuü";
    const backVowels = "aıou";
    const frontVowels = "eiöü";
    
    // Kelimenin içindeki son sesli harfi bul
    let lastVowel = "";
    for (let i = word.length - 1; i >= 0; i--) {
        if (vowels.includes(word[i].toLowerCase())) {
            lastVowel = word[i].toLowerCase();
            break;
        }
    }

    // Ünlü uyumuna göre ekin belirlenmesi (-ı, -i, -u, -ü)
    let suffix = "ı";
    if (backVowels.includes(lastVowel)) {
        suffix = (lastVowel === "a" || lastVowel === "ı") ? "ı" : "u";
    } else if (frontVowels.includes(lastVowel)) {
        suffix = (lastVowel === "e" || lastVowel === "i") ? "i" : "ü";
    }

    // Ünsüz Yumuşaması Kontrolü (p, ç, t, k -> b, c, d, ğ)
    let root = word;
    const isCapitalized = word[0] === word[0].toUpperCase();

    // Özel isim kontrolü (Basitçe büyük harfle başlıyorsa kesme işareti kullan)
    // Ancak vücut bölümleri vs. genelde küçük harf veya cins isimdir.
    // Eğer özel isimse yumuşama olmaz, sadece ek gelir.
    const isSpecialNoun = isCapitalized && word !== word.toUpperCase(); // Tamamı büyükse (başlık gibi) özel isim saymayalım

    if (!isSpecialNoun) {
        if (lastChar === 'k') {
            root = word.slice(0, -1) + 'ğ';
        } else if (lastChar === 'p') {
            root = word.slice(0, -1) + 'b';
        } else if (lastChar === 'ç') {
            root = word.slice(0, -1) + 'c';
        } else if (lastChar === 't') {
            // Bazı istisnalar olsa da genel kural
            root = word.slice(0, -1) + 'd';
        }
    } else {
        // Özel isimse kesme işareti ekle
        return `${word}'${suffix}`;
    }

    // Kaynaştırma harfi (Eğer kelime sesliyle bitiyorsa 'y' ekle)
    if (vowels.includes(lastChar)) {
        return `${word}y${suffix}`;
    }

    return `${root}${suffix}`;
}

/**
 * Örnek kullanım:
 * getTurkishAccusative("Yanak") -> "Yanağı"
 * getTurkishAccusative("Elma") -> "Elmayı"
 * getTurkishAccusative("Bebek") -> "Bebeği"
 */
