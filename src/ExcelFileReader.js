/* 
 Input : rows(array) extracted from  student/class/curriculum/preqcoreq xls file
 Output : javacript object
*/
import XLSX from 'xlsx';

export const readExcelFile = (file, callback) => {
  let reader = new FileReader();
  const rABS = !!reader.readAsBinaryString;
  let result;

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

    //convert data into object
    result = dataConverter(studentRows, classRows, curriculumRows, prereqCoreqRows);
    callback(result);
  };
  if (rABS) reader.readAsBinaryString(file);
  else reader.readAsArrayBuffer(file);
};

function dataConverter(studentRows, classRows, curriculumRows, preqcoreqRows) {
  let students;
  let courses;
  let curriculums;
  let preqcoreqTable;

  students = convertStudentRows(studentRows);
  courses = convertClassRows(classRows);
  curriculums = convertCurriculumRows(curriculumRows);
  preqcoreqTable = convertPreqTable(preqcoreqRows);
  return { students, courses, curriculums, preqcoreqTable };
}

function convertStudentRows(studentRows) {
  //Input: student Rows(array) extracted from xls file
  //Output: an array of student object

  let students = [];
  let student = {
    major: '',
    id: '',
    name: '',
    email: '',
    curriculumModules: []
  };
  let curriculumModule = {};

  for (let i = 1; i < studentRows.length + 1; i++) {
    //Get a row
    let row = studentRows[i];

    //If a row is a blank then stop all
    if (row === undefined) {
      break;
    }
    if (row.length === 0) {
      break;
    }
    //1. Set student
    let studentTemp = { ...student };
    studentTemp.major = row[0];
    studentTemp.id = row[1];
    studentTemp.name = row[2];
    studentTemp.email = row[3];

    //2.Set Curriculum Module
    //- priority
    let curriculumModuleTemp = { ...curriculumModule };
    curriculumModuleTemp.priority = i;
    //- isCompleted & assigned Course
    if (row[3 + i] !== undefined) {
      curriculumModuleTemp.isCompleted = true;
      curriculumModuleTemp.assignedCourse = row[3 + i];
    } else {
      curriculumModuleTemp.isCompleted = false;
    }
    student.curriculumModules.push(curriculumModuleTemp);

    //3. Push Student into array
    students.push(studentTemp);
  }
  return students;
}
function convertClassRows(classRows) {
  //Input: student Rows(array) extracted from xls file
  //Output: an array of student object

  //Define courses & classes
  let courses = {};
  let course = {
    title: '',
    credit: '',
    classes: []
  };

  let classData = {
    combinedCourseNumber: 'INT2000',
    crn: 90042,
    section: 'B50',
    campusCode: 'BOS',
    maxEnroll: 30,
    enroll: 20,
    seatLeft: 10,
    part: '1/A/B',
    dayOfWeek: 'W',
    startTime: '1750',
    endTime: '2020'
  };

  // Data conversion
  for (let i = 1; i < classRows.length + 1; i++) {
    let row = classRows[i];

    //If a row is a blank then stop all
    if (row === undefined) {
      break;
    }
    if (row.length === 0) {
      break;
    }

    //Deep copy
    let newClass = JSON.parse(JSON.stringify(classData));

    //1.Set Classes
    //- priority
    newClass.combinedCourseNumber = row[1];
    newClass.crn = row[0];
    newClass.section = row[2];
    newClass.campusCode = row[4];
    newClass.maxEnroll = row[5];
    newClass.enroll = row[6];
    newClass.seatLeft = row[7];
    newClass.part = row[9];
    newClass.startTime = row[15];
    newClass.endTime = row[16];
    //dayofWeek
    if (row[10] !== undefined) {
      newClass.dayOfWeek = 'M';
    } else if (row[11] !== undefined) {
      newClass.dayOfWeek = 'T';
    } else if (row[12] !== undefined) {
      newClass.dayOfWeek = 'W';
    } else if (row[13] !== undefined) {
      newClass.dayOfWeek = 'T';
    } else if (row[14] !== undefined) {
      newClass.dayOfWeek = 'F';
    } else {
      newClass.dayOfWeek = 'VTL';
    }

    //2. Check Course already exist
    //if already exist, add to exist one
    if (courses[newClass.combinedCourseNumber] !== undefined) {
      let existCourse = courses[newClass.combinedCourseNumber];
      existCourse.classes.push(newClass);
    }
    //if not exist, create new one.
    else {
      let newCourse = JSON.parse(JSON.stringify(course));
      newCourse.title = row[3];
      newCourse.credit = row[8];
      newCourse.classes.push(newClass);
      courses[newClass.combinedCourseNumber] = newCourse;
    }
  }
  return courses;
}
function convertCurriculumRows(curriculumRows) {
  //Input: curriculum Rows(array) extracted from xls file
  //Output: curriculums object
  let curriculums = [];
  let module = {
    courseOptions: [],
    isAvaialbleCourseExist: true,
    availableCourses: []
  };
  let modules = [];
  // Data conversion
  for (let i = 1; i < curriculumRows.length + 1; i++) {
    let row = curriculumRows[i];

    //If a row is a blank then stop all
    if (row === undefined) {
      break;
    }
    if (row.length === 0) {
      break;
    }

    //Create module
    let newModule = JSON.parse(JSON.stringify(module));
    let newModules = JSON.parse(JSON.stringify(modules));

    //1.initialize Module
    let major = row[0];
    newModule.courseOptions = [];
    newModule.isAvaialbleCourseExist = false;
    newModule.availableCourses = [];

    //2. Set module
    for (let j = 1; j < row.length; j++) {
      /* In excel file, Curriculum tab, course Options are string,separated by '/'(ex INT2000/PHL2000/MTH1200). 
       This fucntion changes that into array of courses (ex [INT2000,PHL2000,MTH1200]) */
      let courseOptionsString = row[j];
      let courseOptions = courseOptionsString.split('/');
      newModules[`${j}`] = { courseOptions: courseOptions, isAvailableCourseExist: false, availableCourses: [] };
    }

    //3.add Module
    curriculums[major] = { modules: newModules };
  }

  return curriculums;
}
function convertPreqTable(preqcoreqRows) {
  let preqTable = {};
  let combinedCourseNumber;
  let prereqData;
  let coreq;
  let row;

  for (let i = 1; i < preqcoreqRows.length; i++) {
    row = preqcoreqRows[i];

    combinedCourseNumber = row[0];
    prereqData = row[1];
    coreq = row[2];

    preqTable[combinedCourseNumber] = { prereqData, coreq };
  }
  return preqTable;
}
