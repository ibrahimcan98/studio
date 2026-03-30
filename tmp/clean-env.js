const fs = require('fs');
const path = '.env.local';
try {
    const raw = fs.readFileSync(path);
    // Check for UTF-16 (null bytes often appear if interpreted as UTF-8)
    const content = raw.toString('utf8');
    const cleaned = content.replace(/^\uFEFF/, '').replace(/\0/g, '').trim();
    // Add a newline at top to prevent first key from being mangled
    const final = '\n' + cleaned;
    fs.writeFileSync(path, final, 'utf8');
    console.log('Successfully cleaned .env.local encoding.');
} catch (e) {
    console.error('Error cleaning .env.local:', e.message);
}
