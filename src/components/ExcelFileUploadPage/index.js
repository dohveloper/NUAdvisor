import React, { useReducer } from 'react';
import './ExcelFileUploadPage.css';
import { readExcelFile } from './ExcelFileReader';
import { FaDownload, FaUpload } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

const imagePath = process.env.PUBLIC_URL + '/assets/img';

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

function ExcelFileUpload() {
  const [excelFile, dispatch] = useReducer(reducer, initialState);
  const history = useHistory();
  return (
    <div className="file__page">
      <div className="file__box">
        <img src={`${imagePath}/logo.png`} className="file__logo"></img>
        <p className="file__guide">Please upload an excel file (required) </p>
        <button
          id="excelFile_style"
          className="button file__button"
          onClick={() => {
            document.getElementById('excelFile').click();
          }}
        >
          <FaDownload className="file__buttonIcon" />
          Download Template File
        </button>
        <button
          id="excelFile_style"
          className="button file__button"
          onClick={() => {
            document.getElementById('excelFile').click();
          }}
        >
          <FaUpload className="file__buttonIcon" />
          Upload Excel File
        </button>
        <input
          style={{ display: 'none' }}
          type="file"
          id="excelFile"
          name="excelFile"
          accept=".xls, .xlsx"
          onChange={e => {
            readExcelFile(e.target.files[0], result => {
              dispatch({ type: 'upload', value: result });
              history.push('/');
            });
          }}
          onClick={e => {
            e.target.value = null;
          }}
        />
        <div className="file__blackBottom"></div>
      </div>

      {console.log(excelFile)}
    </div>
  );
}

export default ExcelFileUpload;
