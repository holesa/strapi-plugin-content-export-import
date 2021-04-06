const csvParser = require("csv-parse/lib/sync");
import { importData } from "./api";
import { find, get, map } from "lodash";

export const readLocalFile = (file,model) => {
  return new Promise((resolve, reject) => { 
    // 10KB 
    const CHUNK_SIZE = 10 * 1024;
    const fr = new FileReader();
    let start = -CHUNK_SIZE;
    let end = 0;
    let result = '';
    let previousLastLine = '';
    let header = '';
    fr.onload = function () {
      // Stop FileReader when we get the last slice
      if(start>=file.size){
        resolve(true)
      } else {
        parseAndImport();
          async function parseAndImport() {   
              let buffer = new Uint8Array(fr.result);
              let snippet = new TextDecoder('utf-8').decode(buffer.slice(0, buffer.length));
              let lines = snippet.split('\n');
              // Use first row as a header
              header = header === '' ? lines.shift() : header;
              // Remove last line and store it
              let currentLastLine = lines.length <= 2 ?  '' : lines.pop();
              // Join everything together to get valid CSV string
              result = header + '\n' + previousLastLine + lines.join('\n');
              previousLastLine = currentLastLine;
              try {
                    // Convert CSV into JSON
                    const parseData = csvParser(result, {
                      trim: true,
                      skip_lines_with_error: true,
                      skip_empty_lines: true,
                      columns: true,
                    });

                    // Import JSON into DB
                    await importData({
                      targetModel: model.uid,
                      source:parseData,
                      kind: get(model, 'schema.kind')
                    }).then((info) => {
                    }).catch((error) => {
                      reject(error.message)
                    })
                  }

              catch (error) {
                reject(error);
              }

              // In the end, call seek() to get a new slice
              seek();   
          }
        }   
      }
      
    fr.onerror = function() {
      console.log(fr.error);
      fr.abort();
    };

    // Call seek() for the first time
    seek()
    // Slice next 10KB of the file
    function seek() {
      start+=CHUNK_SIZE;
      end = start + CHUNK_SIZE;
      let slice = file.slice(start, end);
      fr.readAsArrayBuffer(slice);
    }
  });
};