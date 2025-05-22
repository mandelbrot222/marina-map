
window.onload = function () {
  console.log("Map with corrected occupancy logic and new sheet loaded.");

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

  // Fetch data from sanitized Google Sheet CSV
  fetch("https://docs.google.com/spreadsheets/d/1_6MBsTuFBe-dY4y6Yag-4Y7uwhv1CuoXXBMaG-w9axU/export?format=csv")
    .then(response => response.text())
    .then(csv => {
      const rows = csv.split("\n").map(row => row.split(","));
      rows.forEach(row => {
        const label = row[2]?.trim(); // Column C
        const status = row[3]?.trim().toLowerCase(); // Column D
        if (!label) return;

        const shape = svg.querySelector(`[data-label='${label}']`);
        if (shape && shape.getAttribute("data-label")) {
          if (status === "occupied") {
            shape.style.fill = "lightgreen";
          }
        }
      });
    })
    .catch(err => console.error("Error fetching sheet:", err));
};
