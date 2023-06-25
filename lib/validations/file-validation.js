const csv = require("csvtojson");

const sanitizedCsv = async (file) => {
  let extractedData = await csv({
    noheader: true,
    trim: true,
    quote: "double quote",
  }).fromFile(file.path);

  if (!validateCsvRow(extractedData)) {
    return new Error("Invalid field");
  }

  return file;
};

const validateCsvRow = (row) => {
  return !!row[0]["field1"];
};

module.exports = {
  sanitizedCsv,
};
