const dropArea = document.getElementById("drop-area");
const fileElem = document.getElementById("fileElem");
const tableContainer = document.getElementById("table-container");
const editButton = document.getElementById("editButton");
const saveButton = document.getElementById("saveButton");
const jsonButton = document.getElementById("jsonButton");
const clearButton = document.getElementById("clearButton");

let isEditing = false;
let csvData = [];

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
    reader.readAsText(file, 'UTF-8');
  } else {
    alert("Please upload a valid CSV file.");
  }
}

function displayCSV(csvText) {
  csvData = csvText
    .trim()
    .split("\n")
    .map((row) => row.split(","));
  renderTable(csvData);
  editButton.disabled = false;
  clearButton.disabled = false;
  saveButton.disabled = true;
  jsonButton.disabled = true;
}

function renderTable(data) {
  const table = document.createElement("table");

  data.forEach((row, rowIndex) => {
    const tr = document.createElement("tr");
    row.forEach((cell, cellIndex) => {
      const cellElement =
        rowIndex === 0
          ? document.createElement("th")
          : document.createElement("td");
      cellElement.textContent = cell.trim();
      if (rowIndex > 0) cellElement.contentEditable = isEditing; // Make cells editable if editing mode is enabled
      tr.appendChild(cellElement);
    });
    table.appendChild(tr);
  });

  tableContainer.innerHTML = ""; // Clear previous table
  tableContainer.appendChild(table);
}

editButton.addEventListener("click", () => {
  isEditing = !isEditing;

  if (isEditing) {
    editButton.textContent = "Stop Editing";
    saveButton.disabled = false;
    jsonButton.disabled = false;
  } else {
    saveEdits(); // Save the changes when stopping editing
    editButton.textContent = "Edit";
  }

  renderTable(csvData);
});

clearButton.addEventListener("click", () => {
  tableContainer.innerHTML = "";
  csvData = [];
  editButton.disabled = true;
  saveButton.disabled = true;
  jsonButton.disabled = true;
  clearButton.disabled = true;
});

saveButton.addEventListener("click", () => {
  const csvBlob = new Blob([convertArrayToCSV(csvData)], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(csvBlob);
  downloadLink.download = "edited_data.csv";
  downloadLink.click();
});

jsonButton.addEventListener("click", () => {
  const jsonBlob = new Blob(
    [JSON.stringify(convertArrayToJSON(csvData), null, 2)],
    { type: "application/json" }
  );
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(jsonBlob);
  downloadLink.download = "data.json";
  downloadLink.click();
});

function saveEdits() {
  const tableRows = tableContainer.querySelectorAll("tr");
  csvData = Array.from(tableRows).map((row) => {
    const cells = row.querySelectorAll("th, td");
    return Array.from(cells).map((cell) => cell.textContent.trim());
  });
}

function convertArrayToCSV(data) {
  return data.map((row) => row.join(",")).join("\n");
}

function convertArrayToJSON(data) {
  const headers = data[0];
  const rows = data.slice(1);
  return rows.map((row) => {
    const rowObject = {};
    row.forEach((cell, index) => {
      rowObject[headers[index]] = cell;
    });
    return rowObject;
  });
}
