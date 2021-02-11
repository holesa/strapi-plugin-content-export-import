const csvParser = require("csv-parse/lib/sync");
// import { parse } from "@babel/core";

export const readLocalFile = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (event) => {
      const parseData = csvParser(event.target.result, {
        trim: true,
        skip_empty_lines: true,
        columns: true,
      });

      resolve(parseData);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
