
window.onload = function () {
  console.log("Map loading with svg-pan-zoom and Sheet integration...");

  const svg = document.querySelector("svg");
  if (!svg) {
    console.error("SVG not found.");
    return;
  }

  const colorMap = {
    "Docks": "burlywood",
    "Land": "cornsilk",
    "Water": "blue",
    "Parking Lot": "darkgray",
    "Fenced Yard": "lightgray",
    "Uphill": "darkolivegreen",
    "Building": "black"
  };

  const shapes = svg.querySelectorAll("path");
  shapes.forEach((el) => {
    const label = el.getAttribute("data-label");
    const baseColor = colorMap[label] || "yellow";
    el.style.fill = baseColor;
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

        const shape = svg.querySelector(`[data-label='${label}']`);
        if (shape) {
          console.log("Row", i, "label=", label, "status=", status);
          if (status === "occupied") {
            shape.style.fill = "lightgreen";
          }
        } else {
          console.warn("No shape found for label:", label);
        }
      });
    })
    .catch(err => console.error("Error fetching sheet:", err));
};
