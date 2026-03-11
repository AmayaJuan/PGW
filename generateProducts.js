const fs = require("fs");
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");

const imagesFolder = "./img/products";
const docsFolder = "./doc/products";
const outputFile = "./data/products.json";

const images = fs.readdirSync(imagesFolder);
const docs = fs.readdirSync(docsFolder);

function normalize(name){
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|pdf)/g,"")
    .replace(/-/g,"")
    .replace(/\s/g,"");
}

function detectCategory(name){

  const n = name.toLowerCase();

  if(n.includes("hl")) return "Line Array";
  if(n.includes("woofer")) return "Woofer";
  if(n.includes("lf")) return "Woofer";
  if(n.includes("pa")) return "Parlante";
  if(n.includes("sheffield")) return "Parlante";

  return "Audio";

}

async function readPDFText(path){

  try{

    const buffer = fs.readFileSync(path);
    const data = await pdf(buffer);

    if(data.text && data.text.length > 100){
      return data.text.toLowerCase();
    }

  }catch(e){}

  // OCR fallback
  console.log("OCR leyendo:", path);

  const result = await Tesseract.recognize(path,"eng");

  return result.data.text.toLowerCase();

}

function find(text, labels){

  for(const label of labels){

    const r = new RegExp(label + "\\s*:?\\s*(.+)", "i");
    const m = text.match(r);

    if(m){
      return m[1].split("\n")[0].trim();
    }

  }

  return "";

}

async function extractSpecs(pdfPath){

  const text = await readPDFText(pdfPath);

  return [

    ["Modelo", find(text,["modelo","model"])],

    ["Tipo", find(text,["tipo","type"])],

    ["Amplificador", find(text,["amplificador","amplifier"])],

    ["Potencia total", find(text,[
      "potencia total",
      "power",
      "program power",
      "max power"
    ])],

    ["Potencia RMS", find(text,[
      "rms",
      "continuous power"
    ])],

    ["Frecuencia", find(text,[
      "frecuencia",
      "frequency response"
    ])],

    ["SPL máximo", find(text,[
      "spl",
      "max spl",
      "sensitivity"
    ])]

  ];

}

const groupedImages = {};

images.forEach(img => {

  const base = img
    .replace(/\.(png|jpg|jpeg)/i,"")
    .split("-")[0];

  if(!groupedImages[base]){
    groupedImages[base] = [];
  }

  groupedImages[base].push(img);

});

async function generateProducts(){

  const products = [];

  for(const [index, productName] of Object.keys(groupedImages).entries()){

    const productImages = groupedImages[productName];

    const mainImage =
      productImages.find(img => img.includes("-1")) ||
      productImages[0];

    const watermark =
      productImages.find(img => img.includes("-2")) ||
      null;

    const relatedDoc = docs.find(doc =>
      normalize(doc).includes(normalize(productName))
    );

    let specs = [
      ["Modelo", productName.toUpperCase()],
      ["Tipo",""],
      ["Amplificador",""],
      ["Potencia total",""],
      ["Potencia RMS",""],
      ["Frecuencia",""],
      ["SPL máximo",""]
    ];

    if(relatedDoc){
      specs = await extractSpecs(`${docsFolder}/${relatedDoc}`);
    }

    products.push({

      id: index + 1,

      name: productName,

      category: detectCategory(productName),

      images:{
        main:`img/products/${mainImage}`,
        watermark: watermark
          ? `img/products/${watermark}`
          : null
      },

      document: relatedDoc
        ? `doc/products/${relatedDoc}`
        : null,

      specs: specs

    });

  }

  if(!fs.existsSync("./data")){
    fs.mkdirSync("./data");
  }

  fs.writeFileSync(
    outputFile,
    JSON.stringify(products,null,2)
  );

  console.log("✅ products.json generado con OCR");

}

generateProducts();