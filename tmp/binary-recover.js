const fs = require('fs');
const path = '.env.local';
try {
    const buf = fs.readFileSync(path);
    console.log('FILE SIZE:', buf.length);
    console.log('FIRST 10 BYTES:', buf.slice(0, 10));
    
    // Attempt UTF-16 LE
    const le = buf.toString('utf16le');
    if (le.includes('FIREBASE')) {
        console.log('SUCCESS: RECOVERED UTF-16LE');
        console.log(le);
    } else {
        // Attempt UTF-8 Cleaning
        const cleaned = buf.toString('utf8').replace(/\0/g, '').replace(/[^\x20-\x7E\n]/g, '');
        console.log('CLEANED UTF-8:');
        console.log(cleaned);
    }
} catch (e) {
    console.error('Recovery failed:', e.message);
}
