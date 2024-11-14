const dropArea = document.getElementById("drop-area");
const fileElem = document.getElementById("fileElem");
const tableContainer = document.getElementById("table-container");

// Drag and drop handlers
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.classList.remove("dragover");
  const file = event.dataTransfer.files[0];
  handleFile(file);
});

dropArea.addEventListener("click", () => fileElem.click());

fileElem.addEventListener("change", () => {
  const file = fileElem.files[0];
  handleFile(file);
});

function handleFile(file) {
  if (file && file.type === "text/csv") {
    const reader = new FileReader();
    reader.onload = (event) => displayCSV(event.target.result);
    reader.readAsText(file);
  } else {
    alert("Please upload a valid CSV file.");
  }
}

function displayCSV(csvText) {
  const rows = csvText.split("\n").map((row) => row.split(","));
  const table = document.createElement("table");

  rows.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const cellElement =
        rowIndex === 0
          ? document.createElement("th")
          : document.createElement("td");
      cellElement.textContent = cell.trim();
      tr.appendChild(cellElement);
    });
    table.appendChild(tr);
  });

  tableContainer.innerHTML = ""; // Clear previous table
  tableContainer.appendChild(table);
}
