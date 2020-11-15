import React, { useContext } from 'react';
import { DataContext } from '../App';
import './ExcelFileUploadPage.css';
import { readExcelFile } from './ExcelFileReader';
import { FaDownload, FaUpload } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
const imagePath = process.env.PUBLIC_URL + '/assets/img';

function ExcelFileUpload() {
  const { updateData } = useContext(DataContext);
  const history = useHistory();
  return (
    <div className="file__page">
      <div className="file__box">
        <img src={`${imagePath}/logo.png`} alt="logo" className="file__logo" />
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
              //HOW TO USE::let classCombinations = getClassCombinationsByStudentId(result, result.students[0].id, 5);
              updateData(result);
              history.push('/students');
            });
          }}
          onClick={e => {
            e.target.value = null;
          }}
        />
        <div className="file__blackBottom"></div>
      </div>
    </div>
  );
}

export default ExcelFileUpload;
