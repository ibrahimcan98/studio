const fs = require('fs');

const fileContent = fs.readFileSync('src/data/turkce-hazinem-data.ts', 'utf8');

const regex = /("2":\s*\{\s*okuyorumAnliyorum:\s*\{[\s\S]*?\},[\s\S]*?"Etkinlik 2: Hecelerine Ayır"[\s\S]*?sentences:\s*\[)([\s\S]*?)(\],\s*words:\s*\[[\s\S]*?\])/;

const match = fileContent.match(regex);
if (match) {
  const newSentences = `
          { text: "Kalem: {blank}", answer: "ka lem", options: ["kal em", "ka lem", "k alem"] },
          { text: "Çanta: {blank}", answer: "çan ta", options: ["çan ta", "ça nta", "çant a"] },
          { text: "Pencere: {blank}", answer: "pen ce re", options: ["pen ce re", "pe nce re", "penc ere"] },
          { text: "Oyuncak: {blank}", answer: "o yun cak", options: ["oy un cak", "o yun cak", "oyu ncak"] },
          { text: "Balık: {blank}", answer: "ba lık", options: ["bal ık", "b alık", "ba lık"] }
        `;
        
  // Also remove the "words" array for this activity to avoid confusion, or just leave it since sentences now have options
  const replacement = match[1] + newSentences + "\n        ]"; // removing the words array part
  
  let newContent = fileContent.replace(regex, replacement);
  fs.writeFileSync('src/data/turkce-hazinem-data.ts', newContent, 'utf8');
  console.log('Successfully updated Chest 2 Etkinlik 2 options!');
} else {
  console.log('Match not found!');
}
