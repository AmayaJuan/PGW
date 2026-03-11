
const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const pdf = require("pdf-parse");

const imagesFolder = "./img/products";
const docsFolder = "./doc/products";
const outputFile = "./data/products.json";

const images = fs.readdirSync(imagesFolder);
const docs = fs.readdirSync(docsFolder);

// Función para normalizar nombres
function normalize(name){
  return name
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|pdf|docx)/g,"")
    .replace(/-/g,"")
    .replace(/á/g,"a")
    .replace(/é/g,"e")
    .replace(/í/g,"i")
    .replace(/ó/g,"o")
    .replace(/ú/g,"u")
    .replace(/ñ/g,"n")
    .replace(/\s/g,"");
}

// Función para encontrar el mejor documento coincidente
function findBestDocument(productName) {
  const manualMapping = {
    "pa10n": "FICHA TECNICA PARLANTE 10 NEODIMIO.docx",
    "parlante 10 sheffieeld": "FICHA TECNICA PARLANTE 10 SHEFIEELD.docx",
    "parlante 12 sheffield": "FICHA TECNICA PARLANTE 12 SHEFFIELD.docx",
    "hl10a": "FICHA TECNICA PA HL 10A.docx",
    "hl30a": "FICHA TECNICA PA HL30A.docx",
    "lf18x": "FICHA TECNICA PARLANTE LF18X401+.docx",
    "woofer18lw2420+": "FICHA TECNICA WOOFER 18LW2420+.docx",
    "pa8n600": "FICHA TECNICA WOOFER PA8N600.pdf",
    "pa12n1000": "FICHA TECNICA WOOFER PA12N1000.pdf"
  };
  
  if (manualMapping[productName]) {
    const mappedDoc = manualMapping[productName];
    if (docs.includes(mappedDoc)) {
      return mappedDoc;
    }
  }
  
  const normalizedProduct = normalize(productName);
  return docs.find(doc => normalize(doc).includes(normalizedProduct)) || null;
}

// Función para detectar la categoría correcta
function detectCategory(name, docName){
  const n = name.toLowerCase();
  const d = (docName || "").toLowerCase();
  
  if(n.includes("hl")) return "Line Array";
  if(d.includes("woofer")) return "Woofer";
  return "Parlantes";
}

// Función para leer archivos DOCX
async function readDocx(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value;
  } catch (error) {
    console.error("Error leyendo DOCX " + filePath + ":", error.message);
    return null;
  }
}

// Función para leer archivos PDF
async function readPdf(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    const result = await pdf(buffer);
    return result.text;
  } catch (error) {
    console.error("Error leyendo PDF " + filePath + ":", error.message);
    return null;
  }
}

// Función para extraer la descripción - MEJORADA
function extractDescription(text, productName) {
  if (!text) return "Producto de audio profesional " + productName;
  
  const lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
  
  // Buscar "Descripción:" al inicio (primera línea del documento)
  for (let i = 0; i < Math.min(lines.length, 3); i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.match(/^descripción\s*:?/i) || lowerLine.match(/^descripcion\s*:?/i)) {
      let descParts = [];
      const afterDesc = line.replace(/^descripción\s*:*/i, "").replace(/^descripcion\s*:*/i, "").trim();
      if (afterDesc && afterDesc.length > 10) {
        descParts.push(afterDesc);
      }
      
      // Collect siguientes líneas hasta specs
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j];
        const nextLower = nextLine.toLowerCase();
        
        if (nextLower.includes("especificaciones") ||
            nextLower.includes("ítem") ||
            nextLower.includes("item") ||
            nextLower.includes("especificaciones técnicas")) {
          break;
        }
        
        if (nextLine.length > 20) {
          descParts.push(nextLine);
        }
      }
      
      if (descParts.length > 0) {
        let desc = descParts.join(' ').replace(/\s+/g, ' ').trim();
        if (desc.length > 500) {
          desc = desc.substring(0, 497) + "...";
        }
        return desc;
      }
    }
  }
  
  // Segundo: después de specs para documentos HL
  let foundLastSpec = false;
  let descriptionLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if ((lowerLine.includes("color") && lowerLine.includes("acabados")) ||
        (lowerLine === "dimensiones" && lines[i].length < 20)) {
      foundLastSpec = true;
      continue;
    }
    
    if (foundLastSpec) {
      if (lowerLine === "respuesta en frecuencia" || 
          lowerLine === "respuesta" ||
          lowerLine.includes("gráfico") ||
          lowerLine === "aplicaciones" || 
          lowerLine.includes("aplicaciones recomendadas")) {
        break;
      }
      
      if (line.length > 30 && (line.includes('.') || line.includes(','))) {
        descriptionLines.push(line);
      }
    }
  }
  
  if (descriptionLines.length > 0) {
    let desc = descriptionLines.join(' ').replace(/\s+/g, ' ').trim();
    if (desc.length > 500) {
      desc = desc.substring(0, 497) + "...";
    }
    return desc;
  }
  
  // Tercer: después de "Características" para PDFs
  let foundFeatures = false;
  let featureLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes("características") || lowerLine.includes("caracteristicas")) {
      foundFeatures = true;
      continue;
    }
    
    if (foundFeatures) {
      if (lowerLine.includes("especificaciones") ||
          lowerLine.includes("especificaciones técnicas") ||
          lowerLine.includes("ítem") ||
          lowerLine.includes("aplicaciones")) {
        break;
      }
      
      if (line.length > 15 && (line.includes('') || line.includes('•') || line.includes('-') || line.includes('✔'))) {
        const cleanLine = line.replace(/^[•\-\*•\u2022\u2023\u25E6\u2043\u2219\s✔]+/, "").trim();
        if (cleanLine.length > 10) {
          featureLines.push(cleanLine);
        }
      }
    }
  }
  
  if (featureLines.length > 0) {
    let desc = featureLines.join('. ').replace(/\s+/g, ' ').trim();
    if (!desc.endsWith('.')) desc += '.';
    if (desc.length > 500) {
      desc = desc.substring(0, 497) + "...";
    }
    return desc;
  }
  
  return "Producto de audio profesional " + productName;
}

// Función para extraer especificaciones
function extractSpecs(text) {
  if (!text) return {};
  
  const specs = {};
  const lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
  
  let inSpecs = false;
  let pendingKey = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    if (lowerLine.includes("especificaciones") ||
        lowerLine.includes("especificaciones técnicas") ||
        lowerLine.includes("ítem") ||
        lowerLine.includes("item") ||
        lowerLine.includes("especificación")) {
      inSpecs = true;
      continue;
    }
    
    if (inSpecs && (lowerLine.includes("aplicaciones") ||
        lowerLine.includes("gráfico") ||
        lowerLine.includes("dimensiones"))) {
      break;
    }
    
    if (!inSpecs) continue;
    
    if (lowerLine.includes("ítem") || 
        lowerLine.includes("item") ||
        lowerLine.includes("descripcion") ||
        lowerLine.includes("especific") ||
        lowerLine.includes("descripción") ||
        line.length < 3) {
      continue;
    }
    
    // Manejo de formato PDF: "Key Value" en la misma línea
    if (!line.includes(':') && line.length > 15 && line.length < 80) {
      const parts = line.trim().split(/\s{2,}|\t+/);
      if (parts.length >= 2) {
        let key = parts[0]
          .toLowerCase()
          .replace(/á/g, "a")
          .replace(/é/g, "e")
          .replace(/í/g, "i")
          .replace(/ó/g, "o")
          .replace(/ú/g, "u")
          .replace(/ñ/g, "n")
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
        
        let value = parts.slice(1).join(' ').replace(/\s+/g, ' ').trim();
        value = value.replace(/^[•\-\*•\u2022\u2023\u25E6\u2043\u2219\s➢]+/, "").trim();
        
        if (key.length > 2 && value.length > 0 && value.length < 60) {
          specs[key] = value;
          continue;
        }
      }
    }
    
    if (pendingKey) {
      let value = line.replace(/\s+/g, ' ').trim();
      if (value.length > 0 && value.length < 50) {
        specs[pendingKey] = value;
      }
      pendingKey = null;
    } else {
      if (line.length >= 3 && line.length < 35 && !/^\d+$/.test(line)) {
        let key = line
          .toLowerCase()
          .replace(/á/g, "a")
          .replace(/é/g, "e")
          .replace(/í/g, "i")
          .replace(/ó/g, "o")
          .replace(/ú/g, "u")
          .replace(/ñ/g, "n")
          .replace(/\s+/g, "_")
          .replace(/[^a-z0-9_]/g, "");
        
        if (key.length > 2 && !key.includes("item") && !key.includes("descrip")) {
          pendingKey = key;
        }
      }
    }
  }
  
  return specs;
}

// Función para extraer aplicaciones - MEJORADA para collectr más líneas
function extractApplications(text) {
  if (!text) return "";
  
  const lines = text.split('\n').map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
  let apps = [];
  let inApps = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lowerLine = line.toLowerCase();
    
    // Detectar inicio de aplicaciones
    if (lowerLine === "aplicaciones" || 
        lowerLine === "aplicaciones recomendadas:" ||
        lowerLine.includes("aplicaciones recomendadas")) {
      inApps = true;
      continue;
    }
    
    if (inApps) {
      // Detener en otra sección
      if (lowerLine.includes("gráfico") ||
          lowerLine.includes("dimensiones") ||
          lowerLine.startsWith("respuesta") ||
          lowerLine.includes("ficha técnica") ||
          line.length < 3) {
        break;
      }
      
      // Limpiar bullets - múltiples tipos
      const cleanLine = line
        .replace(/^[•\-\*•\u2022\u2023\u25E6\u2043\u2219\u00BF\u00A0➢\s]+/, "")
        .replace(/^[✔✓●○■□◆◇★☆►◄‣‟"„\t]+/, "")
        .trim();
      
      // Verificar que es una aplicación válida
      if (cleanLine && cleanLine.length > 3 && cleanLine.length < 80) {
        apps.push(cleanLine);
      }
    }
  }
  
  return apps.join(", ");
}

// Agrupar imágenes por producto
const groupedImages = {};

images.forEach(function(img) {
  const base = img
    .replace(/\.(png|jpg|jpeg)/i,"")
    .split("-")[0];

  if(!groupedImages[base]){
    groupedImages[base] = [];
  }

  groupedImages[base].push(img);
});

// Función principal
async function generateProducts() {
  const products = [];
  const productNames = Object.keys(groupedImages);
  
  console.log("Procesando " + productNames.length + " productos...");
  console.log("");

  for (let i = 0; i < productNames.length; i++) {
    const productName = productNames[i];
    const productImages = groupedImages[productName];

    const mainImage = productImages.find(function(img) { return img.includes("-1"); }) || productImages[0];
    const watermark = productImages.find(function(img) { return img.includes("-2"); }) || null;
    const relatedDoc = findBestDocument(productName);

    let description = "";
    let specs = {};
    let applications = "";
    const category = detectCategory(productName, relatedDoc);

    if (relatedDoc) {
      const docPath = path.join(docsFolder, relatedDoc);
      console.log("  " + productName + " -> " + relatedDoc);
      
      if (relatedDoc.toLowerCase().endsWith('.docx')) {
        const text = await readDocx(docPath);
        if (text) {
          description = extractDescription(text, productName);
          specs = extractSpecs(text);
          applications = extractApplications(text);
        }
      } else if (relatedDoc.toLowerCase().endsWith('.pdf')) {
        const text = await readPdf(docPath);
        if (text) {
          description = extractDescription(text, productName);
          specs = extractSpecs(text);
          applications = extractApplications(text);
        }
      }
    } else {
      console.log("  Sin documento: " + productName);
      description = "Producto de audio profesional " + productName;
    }

    if (applications) {
      specs.aplicaciones = applications;
    }

    products.push({
      id: i + 1,
      name: productName,
      category: category,
      images: {
        main: "img/products/" + mainImage,
        watermark: watermark ? "img/products/" + watermark : null
      },
      description: description,
      document: relatedDoc ? "doc/products/" + relatedDoc : null,
      specs: Object.keys(specs).length > 0 ? specs : {}
    });
  }

  if(!fs.existsSync("./data")){
    fs.mkdirSync("./data");
  }

  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));

  console.log("");
  console.log("products.json generado con " + products.length + " productos");
  console.log("");
  console.log("Resumen de categorias:");
  const categories = {};
  products.forEach(function(p) {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });
  Object.keys(categories).forEach(function(cat) {
    console.log("   - " + cat + ": " + categories[cat]);
  });
  
  console.log("");
  console.log("Resumen de extraccion:");
  products.forEach(function(p) {
    const descLen = p.description.length;
    const specsCount = Object.keys(p.specs).length;
    const appsLen = p.specs.aplicaciones ? p.specs.aplicaciones.length : 0;
    const docStatus = p.document ? "OK" : "FALTA";
    console.log("   " + docStatus + " " + p.name + ": desc=" + descLen + " chars, specs=" + specsCount + " campos, apps=" + appsLen + " chars");
  });
}

generateProducts();

