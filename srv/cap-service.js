// const cds = require('@sap/cds');
// const { errors } = require('@sap/xssec');
// const req = require('express/lib/request');
// const { employee } = cds.entities;
// const db = cds.connect.to('db');
// module.exports = cds.service.impl(srv => {
// //   srv.before('CREATE', 'Orders', capitalizename);
//   srv.before('READ', 'employee', capitalizeitem);
// })

// async function capitalizeitem(req){
//     req.data.eName = 'test Name';
// }













const cds = require('@sap/cds');
const db=cds.connect.to('db');
const {Readable,PassThrough} = require('stream');
const { excelFile } = cds.entities;
const XLSX = require('xlsx');
// const moment = require('moment');

console.log('------------------hello-----------');

module.exports = cds.service.impl(srv => {

  srv.on('DELETE', 'excelFile', async (req) => {
    console.log('----------------------------deleting...................');

    // Delete all records from the excelFile entity
    const result = await cds.transaction(req).run(DELETE.from(excelFile).where({ exId : 10 }));

    // Respond with a success message
    return { success: true, message: `All records deleted from excelFile entity` };
});

  srv.before('CREATE', 'excelFile', async (req) => {
    console.log('----------------------------creating...................');
    console.log(req.data);
    // Create a new record in the excelFile entity

  // let runQuery = `INSERT INTO MAVENDB_EXCELFILE (exId, exEmail, exFirst_name, exLast_name, exAvatar) VALUES (${Number(req.data.exId)}, ${req.data.exEmail}, ${req.data.exFirst_name}, ${req.data.exLast_name}, ${req.data.exAvatar})`;
  // console.log(runQuery);
  // let result = await cds.run(
  //   INSERT.into('MAVENDB_EXCELFILE')
  //     .columns('exId', 'exEmail', 'exFirst_name', 'exLast_name', 'exAvatar')
  //     .values(
  //       req.data.exId,
  //       req.data.exEmail,
  //       req.data.exFirst_name,
  //       req.data.exLast_name,
  //       req.data.exAvatar
  //     )
  //   );
    // console.log('result',result);
    // if(result){
      // Respond with a success message
      return { success: true, message: `New record inserted into excelFile entity`, payload: req.data };
    // }else{
      // Respond with a failure message
      // return { error: true, message: `Failed to insert record into excelFile entity` };
    // }
  })

  srv.after('CREATE', 'files', async (req,res) => {
    // console.log("res:",res);
    // console.log("req--Base64 file for Excel----:",req.base64Data);
    const base64Data = req.base64Data;

    // Decode base64 to obtain file content
    const fileContent = Buffer.from(base64Data, 'base64');

    // Process the Excel file content
    const workbook = XLSX.read(fileContent, { type: 'buffer' });

    // Example: Log the sheet names
    const sheetNames = workbook.SheetNames;
    console.log('Sheet names:', sheetNames);

    // Example: Access data from the first sheet
    const firstSheet = workbook.Sheets[sheetNames[0]];
    const data = XLSX.utils.sheet_to_json(firstSheet);
    console.log('Excel data:', data);
    data.forEach(item => {
      item = {
        exId: Number(item.id),
        exEmail: item.email,
        exFirst_name: item.first_name,
        exLast_name: item.last_name,
        exAvatar: item.avatar
      }
      cds.run(INSERT.into(excelFile).entries(item));
    })
  })


  // srv.on('ExcelUpload', async (req) => {
    
  //   console.log('excel file upload start..................');
    
  //   const { file } = req.data;

  //   if (file) {
  //     const buffers = [];
  //     const stream = file.stream();
      
  //     // Read the file stream and collect buffers
  //     await new Promise((resolve, reject) => {
  //       stream.on('data', dataChunk => {
  //         buffers.push(dataChunk);
  //       });
  //       stream.on('end', () => resolve());
  //       stream.on('error', error => reject(error));
  //     });

  //     // Concatenate buffers into a single buffer
  //     const buffer = Buffer.concat(buffers);

  //     // Process the Excel file
  //     const workbook = XLSX.read(buffer, { type: 'buffer' });
  //     const sheetName = workbook.SheetNames[0]; // Assuming only one sheet

  //     const excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

  //     // Add the processed data to the excelFile entity
  //     await cds.run(INSERT.into(excelFile).entries(excelData));

  //     return { success: true, message: 'Excel file processed and data added to excelFile entity' };
  //   } else {
  //     return { success: false, message: 'No file provided' };
  //   }
  // });

}) 

