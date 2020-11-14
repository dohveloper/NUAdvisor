export let getClassCombinationsByStudentId = (data, studentId) => {
  let moduleCombinations = [[1, 2, 3, 5]];
  let classCombinations = [];

  //0. Get Student by ID
  let students = data.students;
  let student = students.find(student => student.id === studentId);

  //1. Get Module Combination of remain module of student
  moduleCombinations = getCombinationsOfRemainModules(student);

  //2. Get Class Combination
  for (let i = 0; i < moduleCombinations.length; i++) {
    console.log('--------Module test:', i, ' ----------');
    let moduleCombination = moduleCombinations[i];
    let testCombinations = getCombinationsOfClasses(data, student, moduleCombination);
    if (testCombinations.length !== 0) {
      classCombinations.push(testCombinations);
    }
    if (classCombinations.length === 10) {
      break;
    }
  }
  console.log('----------totalCombinations:', classCombinations, '------------');
  return classCombinations;
};

//1 Module Combination
let getCombinationsOfRemainModules = student => {
  let combinations = [];
  let count = 5;
  let current = [];
  let listOfModules = [];

  //get remain modules
  student.curriculumModules.forEach(module => {
    if (!module.isCompleted) {
      listOfModules.push(module.id);
    }
  });

  //get Combination of Remain modules
  getModuleCombinations(count, listOfModules, current, combinations);
  console.log(combinations);
  return combinations;
};
//1.1 Recursion
let getModuleCombinations = (count, listOfModules, current, combinations) => {
  if (count === 0) {
    combinations.push(current);
    return 1;
  }
  if (listOfModules.length === 0) {
    return 0;
  }

  for (let i = 0; i < listOfModules.length; i++) {
    //select one module
    let selectedModule = listOfModules[i];
    //add to current combination
    let combinationTest = [...current];
    combinationTest.push(selectedModule);
    // make newlist by removing all modules that is already included to current
    let newListOfModules = [...listOfModules];
    for (let j = i; j > -1; j--) {
      let index = newListOfModules.indexOf(listOfModules[j]);
      newListOfModules.splice(index, 1);
    }
    getModuleCombinations(count - 1, newListOfModules, combinationTest, combinations);
  }
};

//2 Class Combination
let getCombinationsOfClasses = (data, student, moduleCombination) => {
  let classCombinations = [];
  let currentCombination = [];
  let classCount = moduleCombination.length;
  let onlineCount = 1; // number of online courses per semester
  let nth = 0;
  //Get Completed Courses of Student
  let completedCourses = getCompletedCourses(student);
  console.log('moduleCombination', moduleCombination);
  getClassCombinations(classCombinations, classCount, onlineCount, moduleCombination, nth, data, student, completedCourses, currentCombination);

  return classCombinations;
};

//2.1 Recursion
let getClassCombinations = (classCombinations, count, onlineCount, moduleCombination, nth, data, student, completedCourses, currentCombination) => {
  //1.if courseCount get 0 successfully, it means course combination was found. so add to bestCombination return 1 for break all loops.
  if (count === 0) {
    classCombinations.push(currentCombination);
    return 1;
  }
  //2. Get availableClasses for current module
  let availableClassesOfModule = getAvailableClasses(data, student, currentCombination, completedCourses, nth, moduleCombination, onlineCount);

  //TEST START
  let moduleId = moduleCombination[nth];
  let modules = data.curriculums[student.major].modules;
  console.log(moduleId, modules[moduleId].courseOptions);
  console.log('availableClassesOfModule', availableClassesOfModule);
  //TEST END

  if (availableClassesOfModule.length === 0) {
    return [];
  }

  //3.loop all classes to find all combinations until combination found.
  for (let i = 0; i < availableClassesOfModule.length; i++) {
    let combinationTest = [...currentCombination];
    let selectedClass = availableClassesOfModule[i];
    combinationTest.push(selectedClass);

    //completedCourses considering currentCombinations
    let currentCompletedCourses = [...completedCourses];
    currentCompletedCourses.push(selectedClass.combinedCourseNumber);

    //if Coreq exist pushCoreq too.
    let isCoreqExist = checkCoreqExist(data, selectedClass.combinedCourseNumber);
    if (isCoreqExist) {
      let coreqClass = getAvailableCoreqClass(data, combinationTest, selectedClass.combinedCourseNumber);
      combinationTest.push(coreqClass);
      currentCompletedCourses.push(coreqClass.combinedCourseNumber);
      console.log('COREQ ADDED');
    }

    //online
    let updatedOnlineCount = onlineCount;
    if (selectedClass.campusCode === 'VTL') {
      updatedOnlineCount = onlineCount - 1; // OnlineCount == OnlineMax
    }

    //TEST START
    console.log('combinationTest', combinationTest);
    //TEST END
    //get next available courses
    getClassCombinations(classCombinations, count - 1, updatedOnlineCount, moduleCombination, nth + 1, data, student, currentCompletedCourses, combinationTest);
  }
};

//helper

let getCompletedCourses = student => {
  let completedCourses = [];
  student.curriculumModules.forEach(module => {
    if (module.isCompleted) {
      completedCourses.push(module.id);
    }
  });
  return completedCourses;
};

let getAvailableClasses = (data, student, currentCombination, completedCourses, nth, moduleCombination, onlineCount) => {
  let availableClasses = [];
  //get Available courses of that module
  let moduleId = moduleCombination[nth];
  console.log('moduleCombination', moduleCombination);
  console.log('moduleId:', moduleId, 'curriculum modules:', data.curriculums[student.major]);
  let availableCourses = data.curriculums[student.major].modules[moduleId].availableCourses;

  //get Available Classes that are filtered with conditions
  for (let i = 0; i < availableCourses.length; i++) {
    let course = availableCourses[i];

    //is preq completed?
    let isPreqOK = checkPreqOK(data, course.combinedCourseNumber, completedCourses);
    //is already done in other modules?
    let isFirstTime = !completedCourses.includes(course.combinedCourseNumber);
    //is Coreq OK - If exist, ScheduleOK?
    let isCoreqOK = checkCoreqOK(data, currentCombination, course.combinedCourseNumber);

    course.classes.forEach(classData => {
      let isScheduleOK = checkScheduleOK(currentCombination, classData);
      let isSeatOK = classData.seatLeft > 0;
      //isSevpOK?
      let isSevpOK = checkSevpOK(onlineCount, classData);

      console.log(isPreqOK, isFirstTime, isCoreqOK, isScheduleOK, isSevpOK, isSeatOK);
      //if all ok, then add
      if (isPreqOK && isFirstTime && isCoreqOK && isScheduleOK && isSevpOK && isSeatOK) {
        availableClasses.push(classData);
      }
    });
  }
  return availableClasses;
};

let checkPreqOK = (data, combinedCourseNumber, completedCourses) => {
  let preqInfo = data.preqTable[combinedCourseNumber];
  if (preqInfo === undefined) {
    //no preq
    return true;
  }
  if (preqInfo.preqBlock !== null) {
    let preqBlock = data.preqTable[combinedCourseNumber].preqBlock;
    let isCompleted = preqBlock.isCompleted(completedCourses);
    return isCompleted;
  }
  return true;
};

let checkCoreqOK = (data, currentCombination, combinedCourseNumber) => {
  //If no data in preqtable => no requirements so return true
  let courseCoreqData = data.preqTable[combinedCourseNumber];
  if (courseCoreqData === undefined) {
    return true;
  }
  let coreq = courseCoreqData.coreq;
  if (coreq === '') {
    return true;
  }
  //If Exist, find one coreq class that schedule OK and if not found return false.
  let coreqClass = getAvailableCoreqClass(data, currentCombination, combinedCourseNumber);
  if (coreqClass.length === 0) {
    return false;
  }
  return true;
};

let checkCoreqExist = (data, combinedCourseNumber) => {
  //If no data in preqtable => no requirements so return true
  let courseCoreqData = data.preqTable[combinedCourseNumber];
  if (courseCoreqData === undefined) {
    return false;
  }
  let coreq = courseCoreqData.coreq;
  if (coreq === '') {
    return false;
  }
  return true;
};

let getAvailableCoreqClass = (data, currentCombination, combinedCourseNumber) => {
  //If no coreq requirment
  if (!checkCoreqExist(data, combinedCourseNumber)) {
    return [];
  }
  //no classes available
  let coreq = data.preqTable[combinedCourseNumber].coreq;
  let availableCoreqClasses = data.courses[coreq].classes;
  if (availableCoreqClasses.length === 0) {
    return [];
  }
  //check coreq available in current schedule
  for (let i = 0; i < availableCoreqClasses.length; i++) {
    let coreqClass = availableCoreqClasses[i];
    let isScheduleOK = checkScheduleOK(currentCombination, coreqClass);
    if (isScheduleOK) {
      return coreqClass;
    }
  }
  return [];
};

let checkScheduleOK = (currentCombination, classData) => {
  //check whether is there any coflicts with classData and classes in currentCombination
  let currentClass = classData;
  if (currentClass.campusCode === 'VTL') {
    return true;
  }
  for (let i = 0; i < currentCombination.length; i++) {
    let prevClass = currentCombination[i];
    let isTimeConflict = !(currentClass.endTime >= prevClass.startTime || currentClass.startTime >= prevClass.endTime);
    if (prevClass.dayOfWeek === currentClass.dayOfWeek && isTimeConflict) {
      return false;
    }
  }
  return true;
};

let checkSevpOK = (onlineCount, classData) => {
  if (onlineCount <= 0 && classData.campusCode === 'VTL') {
    return false;
  }
  return true;
};
