const fs = require("fs");
const pdf = require("pdf-parse");

const imagesFolder = "./img/products";
const docsFolder = "./doc/products";
const outputFile = "./data/products.json";

const images = fs.readdirSync(imagesFolder);
const docs = fs.readdirSync(docsFolder);

// normalizar nombres
function normalize(name){
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|pdf|docx)/g,"")
    .replace(/-/g,"")
    .replace(/\s/g,"")
    .replace(/\d$/g,"");
}

// detectar categoría
function detectCategory(name){

  const n = name.toLowerCase();

  if(n.includes("hl")) return "Line Array";
  if(n.includes("woofer")) return "Woofer";
  if(n.includes("pa")) return "Woofer";
  if(n.includes("sheffield")) return "Parlante";

  return "Audio";

}

// extraer datos del pdf
async function extractSpecs(pdfPath){

  try{

    const buffer = fs.readFileSync(pdfPath);
    const data = await pdf(buffer);
    const text = data.text.toLowerCase();

    function find(label){
      const r = new RegExp(label + "\\s*:?\\s*(.+)", "i");
      const m = text.match(r);
      return m ? m[1].split("\n")[0].trim() : "";
    }

    return [
      ["Modelo", find("modelo")],
      ["Tipo", find("tipo")],
      ["Amplificador", find("amplificador")],
      ["Potencia total", find("potencia")],
      ["Potencia RMS", find("rms")],
      ["Frecuencia", find("frecuencia")],
      ["SPL máximo", find("spl")]
    ];

  }catch(e){
    return [];
  }

}

// agrupar imágenes por producto
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
        watermark: watermark ? `img/products/${watermark}` : null
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

  console.log("✅ products.json generado automáticamente");

}

generateProducts();