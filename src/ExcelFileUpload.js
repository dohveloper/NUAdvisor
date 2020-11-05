import React, { useReducer } from 'react';
import XLSX from 'xlsx';
import { dataConverter } from './DataConverter';

const initialState = {
  excelFile: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'upload':
      return { ...state, excelFile: action.value };
    default:
      return state;
  }
};

const readExcelFile = (file, dispatch) => {
  let reader = new FileReader();
  const rABS = !!reader.readAsBinaryString;
  reader.onload = e => {
    /* Parse data */
    const bstr = e.target.result;
    const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
    /* Get worksheets */
    const wsname1 = wb.SheetNames[0];
    const wsStudent = wb.Sheets[wsname1];

    const wsname2 = wb.SheetNames[1];
    const wsClass = wb.Sheets[wsname2];

    const wsname3 = wb.SheetNames[2];
    const wsCurriculum = wb.Sheets[wsname3];

    const wsname4 = wb.SheetNames[3];
    const wsPrereqCoreq = wb.Sheets[wsname4];

    /* Convert array of arrays */
    const studentRows = XLSX.utils.sheet_to_json(wsStudent, { header: 1 });
    const classRows = XLSX.utils.sheet_to_json(wsClass, { header: 1 });
    const curriculumRows = XLSX.utils.sheet_to_json(wsCurriculum, { header: 1 });
    const prereqCoreqRows = XLSX.utils.sheet_to_json(wsPrereqCoreq, { header: 1 });

    dataConverter(studentRows, classRows, curriculumRows, prereqCoreqRows);
  };
  if (rABS) reader.readAsBinaryString(file);
  else reader.readAsArrayBuffer(file);
  dispatch({ type: 'upload', value: file });
};

function ExcelFileUpload() {
  const [excelFile, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <input
        type="file"
        name="excelFile"
        accept=".xls, .xlsx"
        onChange={e => {
          readExcelFile(e.target.files[0], dispatch);
        }}
        onClick={e => {
          e.target.value = null;
        }}
      />
    </div>
  );
}

export default ExcelFileUpload;
