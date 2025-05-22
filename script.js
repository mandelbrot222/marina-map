
window.onload = function () {
  console.log("Map loading with dynamic water pattern and Sheet integration...");

  const svg = document.querySelector("svg");
  if (!svg) {
    console.error("SVG not found.");
    return;
  }

  // Create <defs> and <pattern> dynamically
  const svgNS = "http://www.w3.org/2000/svg";

  const defs = document.createElementNS(svgNS, "defs");
  const pattern = document.createElementNS(svgNS, "pattern");
  pattern.setAttribute("id", "waterPattern");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("width", "150");
  pattern.setAttribute("height", "150");

  const image = document.createElementNS(svgNS, "image");
  image.setAttributeNS(null, "width", "150");
  image.setAttributeNS(null, "height", "150");
  image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "data:image/jpeg;base64,{encoded_image}");

  pattern.appendChild(image);
  defs.appendChild(pattern);
  svg.insertBefore(defs, svg.firstChild);

  const colorMap = {
    "Docks": "burlywood",
    "Land": "cornsilk",
    "Water": null,
    "Parking Lot": "darkgray",
    "Fenced Yard": "lightgray",
    "Uphill": "darkolivegreen",
    "Building": "black"
  };

  const shapes = Array.from(svg.querySelectorAll("path"));
  shapes.forEach((el) => {
    const label = el.getAttribute("data-label");
    if (label === "Water") {
      el.style.fill = "url(#waterPattern)";
    } else {
      const baseColor = colorMap[label] || "yellow";
      el.style.fill = baseColor;
    }
  });

  const zoomScript = document.createElement("script");
  zoomScript.src = "https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js";
  zoomScript.onload = () => {
    const panZoom = svgPanZoom(svg, {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      contain: true,
      minZoom: 0.5,
      maxZoom: 20,
      zoomScaleSensitivity: 0.2
    });
    console.log("Pan/Zoom initialized.");
    panZoom.fit();
    panZoom.center();
  };
  document.body.appendChild(zoomScript);

  fetch("https://docs.google.com/spreadsheets/d/1_6MBsTuFBe-dY4y6Yag-4Y7uwhv1CuoXXBMaG-w9axU/export?format=csv")
    .then(response => response.text())
    .then(csv => {
      const rows = csv.split("\n").map(row => row.split(","));
      console.log("CSV Rows:", rows.slice(0, 5));
      rows.forEach((row, i) => {
        const label = row[2]?.trim();
        const status = row[3]?.trim().toLowerCase();
        if (!label) return;

        const shape = shapes.find(el => el.getAttribute("data-label") === label);
        if (shape && status === "occupied" && shape.getAttribute("data-label") !== "Water") {
          shape.style.fill = "lightgreen";
        }
      });
    })
    .catch(err => console.error("Error fetching sheet:", err));
};
