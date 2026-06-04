const fs = require("fs");
const file = "c:/Users/ibrah/studio/src/data/turkce-hazinem-data.ts";
let data = fs.readFileSync(file, "utf8");

data = data.replace(
  /(\{\s*type:\s*"image_selection",\s*title:\s*"Etkinlik 1: Eşleştirme",\s*desc:\s*"Yiyeceği veya içeceği doğru görselle eşleştir.",\s*)questions:([\s\S]*?\}),(\s*\{\s*type:\s*"true_false")/g,
  function (match, p1, p2, p3) {
    return (
      p1 +
      `questions: [
            { 
              q: "Aşağıdakilerden hangisi Simit'tir?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.simit.png" }, 
                { src: "/turkce-hazinem/15.cay.png" }, 
                { src: "/turkce-hazinem/15.baklava.png" }
              ], 
              correct: 0 
            },
            { 
              q: "Aşağıdakilerden hangisi Çay'dır?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.dolma.png" }, 
                { src: "/turkce-hazinem/15.cay.png" }, 
                { src: "/turkce-hazinem/15.kahve.png" }
              ], 
              correct: 1 
            },
            { 
              q: "Aşağıdakilerden hangisi Baklava'dır?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.simit.png" }, 
                { src: "/turkce-hazinem/15.kahve.png" }, 
                { src: "/turkce-hazinem/15.baklava.png" }
              ], 
              correct: 2 
            },
            { 
              q: "Aşağıdakilerden hangisi Türk kahvesidir?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.kahve.png" }, 
                { src: "/turkce-hazinem/15.cay.png" }, 
                { src: "/turkce-hazinem/15.dolma.png" }
              ], 
              correct: 0 
            },
            { 
              q: "Aşağıdakilerden hangisi Dolma'dır?", 
              imageOptions: [
                { src: "/turkce-hazinem/15.dolma.png" }, 
                { src: "/turkce-hazinem/15.baklava.png" }, 
                { src: "/turkce-hazinem/15.simit.png" }
              ], 
              correct: 0 
            }
          ] },` +
      p3
    );
  },
);

// We also need to change the type to "multiple_choice"
data = data.replace(
  /type:\s*"image_selection",(\s*title:\s*"Etkinlik 1: Eşleştirme")/g,
  'type: "multiple_choice",$1',
);

fs.writeFileSync(file, data);
console.log("Chest 15 fixed");
