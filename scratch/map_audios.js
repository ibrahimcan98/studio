const fs = require('fs');
const path = require('path');

const audioBaseDir = path.join(process.cwd(), 'public', 'audio');
const topicsJsonPath = path.join(process.cwd(), 'src', 'data', 'topics.json');

// Read topics.json
const topics = JSON.parse(fs.readFileSync(topicsJsonPath, 'utf8'));

// Get all directories in public/audio
const audioDirs = fs.readdirSync(audioBaseDir).filter(f => fs.statSync(path.join(audioBaseDir, f)).isDirectory());

const missingFiles = [];
let totalMatched = 0;
let totalMissing = 0;

// Slugify function to match filenames
function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's')
        .replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c')
        .replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

// Map audios
topics.forEach((topic, index) => {
    const topicNumber = index + 1;
    const actualDir = audioDirs.find(d => d.startsWith(`${topicNumber}-`));
    
    if (!actualDir) {
        topic.wordList.forEach(w => {
            missingFiles.push(`${topic.name} -> ${w.word} (Klasör eksik: ${topicNumber}-...)`);
            totalMissing++;
        });
        return;
    }

    const filesInDir = fs.readdirSync(path.join(audioBaseDir, actualDir));

    topic.wordList.forEach(wordObj => {
        let slug = slugify(wordObj.word);
        
        // Special manual mappings
        if (wordObj.word === 'Kilolu') slug = 'sisman';
        if (wordObj.word === 'Hamuru aç') slug = 'hamur-ac';

        // Search for matching file with various normalization
        const audioFile = filesInDir.find(f => {
            const ext = path.extname(f).toLowerCase();
            const name = path.basename(f, ext).toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
            const targetSlug = slug.replace(/_/g, '-');
            
            return (ext === '.m4a' || ext === '.mp3' || ext === '.wav') && 
                   (name === targetSlug || name === targetSlug.replace(/-/g, ''));
        });

        if (audioFile) {
            wordObj.audio = `/audio/${actualDir}/${audioFile}`;
            totalMatched++;
        } else {
            wordObj.audio = ""; 
            missingFiles.push(`${topic.name} -> ${wordObj.word} (Eksik veya isim farklı: ${slug}.m4a)`);
            totalMissing++;
        }
    });
});

// Save updated topics.json
fs.writeFileSync(topicsJsonPath, JSON.stringify(topics, null, 2), 'utf8');

console.log(`\nMapping Complete!`);
console.log(`Total Matched: ${totalMatched}`);
console.log(`Total Missing: ${totalMissing}`);

if (missingFiles.length > 0) {
    console.log(`\nMissing Files List:`);
    missingFiles.forEach(m => console.log(`- ${m}`));
} else {
    console.log(`\nAll files matched perfectly! 🌟 Tüm ses dosyaları hazır!`);
}
