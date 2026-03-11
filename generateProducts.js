const fs = require("fs");

const imagesFolder = "./img/products";
const docsFolder = "./doc/products";
const outputFile = "./data/products.json";

const images = fs.readdirSync(imagesFolder);
const docs = fs.readdirSync(docsFolder);

// normalizar nombres
function normalize(name) {
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|pdf|docx)/g, "")
    .replace(/-/g, "")
    .replace(/\s/g, "")
    .replace(/\d$/g, "");
}

// agrupar imágenes por producto
const groupedImages = {};

images.forEach(img => {

  const base = img
  .replace(/\.(png|jpg|jpeg)/i, "")
  .split("-")[0];

  if (!groupedImages[base]) {
    groupedImages[base] = [];
  }

  groupedImages[base].push(img);

});

const products = Object.keys(groupedImages).map((productName, index) => {

  const productImages = groupedImages[productName];

  const mainImage = productImages.find(img => img.includes("-1")) || productImages[0];
  const watermark = productImages.find(img => img.includes("-2")) || null;

  const relatedDoc = docs.find(doc =>
    normalize(doc).includes(normalize(productName))
  );

 return {
   id: index + 1,
   name: productName,
  category: "audio",
  images: {
    main: `img/products/${mainImage}`,
    watermark: watermark ? `img/products/${watermark}` : null
  },
  document: relatedDoc ? `doc/products/${relatedDoc}` : null,

  specs: [
    ["Modelo", productName.toUpperCase()],
    ["Tipo", ""],
    ["Amplificador", ""],
    ["Potencia total", ""],
    ["Potencia RMS", ""],
    ["Frecuencia", ""],
    ["SPL máximo", ""]
  ]
};

});

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));

console.log("✅ products.json generado con imágenes agrupadas");