const fs = require('fs');
const path = '.env.local';
try {
    const raw = fs.readFileSync(path, 'utf8');
    // Keep only ASCII printable characters, newlines, and common JSON/Env symbols
    // This removes the '' and other binary junk
    const recovered = raw.replace(/[^\x20-\x7E\n]/g, '').trim();
    console.log('RECOVERED CONTENT START');
    console.log(recovered);
    console.log('RECOVERED CONTENT END');
} catch (e) {
    console.error('Error recovering .env.local:', e.message);
}
