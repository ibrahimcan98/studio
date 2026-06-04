const fs = require('fs');

const dataStr = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

// I'll parse the file by removing the `export const turkceHazinemData: Record<string, ChestContent> = ` 
// and the last `;` so it becomes valid JS, then eval it.
// Actually evaling might be dangerous or fail because of syntax.
// A simpler way: we know where `tekrar-1` is in the string.
// Let's do it with a script that requires the file after compiling, or we can just replace the string.

// Let's compile the file first, or just read it and do a string replacement.
