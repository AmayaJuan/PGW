const fs = require("fs");

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

function generateProducts(){

  const products = [];

  Object.keys(groupedImages).forEach((productName,index)=>{

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

      specs: []

    });

  });

  if(!fs.existsSync("./data")){
    fs.mkdirSync("./data");
  }

  fs.writeFileSync(
    outputFile,
    JSON.stringify(products,null,2)
  );

  console.log("✅ products.json generado");

}

generateProducts();