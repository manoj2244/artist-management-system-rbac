function escapeCSVField(value) {
  const str = String(value === null || value === undefined ? '' : value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function formatCSV(headers, rows) {
  const headerLine = headers.join(',');
  const dataLines = rows.map((row) =>
    headers.map((header) => escapeCSVField(row[header])).join(',')
  );
  return [headerLine, ...dataLines].join('\n');
}

function parseCSV(text) {
  const lines = text.split('\n').map((line) => line.trimEnd());
  const nonEmptyLines = lines.filter((line) => line.length > 0);

  if (nonEmptyLines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = nonEmptyLines[0].split(',').map((h) => h.trim());
  const rows = [];

  for (let i = 1; i < nonEmptyLines.length; i++) {
    const values = nonEmptyLines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] !== undefined ? values[index].trim() : '';
    });
    rows.push(row);
  }

  return { headers, rows };
}

module.exports = { formatCSV, parseCSV };
