export let getBestCombination = data => {
  let moduleCombinations = [[1, 2, 3, 5]];
  let bestClassCombination = [];
  let completedCourses = [];
  console.log(data);
  //1. Get Module Combination of remain module of student
  moduleCombinations = getCombinationsOfRemainModules(data.students[0]);
  /*
  //2. Get Completed Courses of Student
  completedCourses = getCompletedCourses(data.students[0]);

  //3. Get Best Class Combination for that moduleCombination until possibleCombination found
  for (let i = 0; i < moduleCombinations.length; i++) {
    let moduleCombination = moduleCombinations[i];
    bestClassCombination = getBestClassCombination(data, completedCourses, moduleCombination);
    if (bestClassCombination.length !== 0) {
      break;
    }
  }
  
  return bestClassCombination;
  */
};

//1
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
  getCombinations(count, listOfModules, current, combinations);
  return combinations;
};

//Recursion
let getCombinations = (count, listOfModules, current, combinations) => {
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

    getCombinations(count - 1, newListOfModules, combinationTest, combinations);
  }
};

//2
let getCompletedCourses = student => {
  let completedCourses = [];
  student.curriculumModules.forEach(module => {
    if (module.isCompleted) {
      completedCourses.push(module.id);
    }
  });
  return completedCourses;
};

//3
let getBestClassCombination = (data, completedCourses, moduleCombination) => {
  let bestClassCombination = [];
  let currentClassCombination = [];
  let courseCount = 4; // number of totalcourses per semester
  let onlineCount = 1; // number of online courses per semester
  //2. Get Best Class Combination
  getBestClassCombinationRecursion(data, completedCourses, 0, moduleCombination, bestClassCombination, currentClassCombination, courseCount, onlineCount);
  return bestClassCombination;
};

let getBestClassCombinationRecursion = (data, completedCourses, nthModule, moduleCombination, bestClassCombination, currentClassCombination, courseCount, onlineCount) => {
  // if courseCount get 0 successfully, it means course combination was found. so add to bestClassCombination return 1 for break all loops.
  if (courseCount === 0) {
    return 1;
  }

  //get available classes of module (no schedule conflict, no sevp conflict)
  let availableClassesOfModule = getAvailableClassesOfModule(data, completedCourses, nthModule, moduleCombination, currentClassCombination, onlineCount);
  // if avlailableClassesOfModule not exist, it means there is no possible classes for this combination. so return false;
  if (availableClassesOfModule.length === 0) {
    return 0;
  }

  let isCombinationExist = false;

  //loop all classes to find all combinations until combination found.
  for (let i = 0; i < availableClassesOfModule.length; i++) {
    let selectedClass = availableClassesOfModule[i];
    currentClassCombination.push(selectedClass);

    //if Coreq exist pushCoreq too.
    let coreq = data.preqTable[selectedClass.combinedCourseNumber].coreq;
    if (coreq !== '') {
      let coreqClasses = data.courses[coreq];
      coreqClasses.every(coreqClass => {
        if (checkScheduleOK(coreqClass)) {
          currentClassCombination.push(coreqClass);
          return false;
        } else {
          return true;
        }
      });
    }
    //online
    if (selectedClass.isOnline) {
      onlineCount--; // OnlineCount == OnlineMax
    }

    nthModule++;
    courseCount--;

    //get next available courses
    isCombinationExist = getBestClassCombinationRecursion(nthModule, bestClassCombination, currentClassCombination, courseCount, onlineCount);
    if (isCombinationExist) {
      break;
    }
  }
};

let getAvailableClassesOfModule = (data, completedCourses, nthModule, moduleCombination, currentClassCombination, onlineCount) => {
  let moduleId = moduleCombination[nthModule];
  let availableClasses = [];

  //get available courses of that module
  let availableCourses = data.curriculums['IT'].modules[moduleId].availableCourses;

  //get Available Classes
  for (let i = 0; i < availableCourses; i++) {
    let course = availableCourses[i];

    //is preq completed?
    let isPreqOK = checkPreqOK(data, course.combinedCourseNumber, completedCourses);
    //is already done in other modules?
    let isFirstTime = completedCourses.includes(course.combinedCourseNumber);
    //is Coreq OK
    let isCoreqOK = checkCoreqOK(data, course.combinedCourseNumber);

    course.classes.forEach(classData => {
      let isScheduleOK = checkScheduleOK(currentClassCombination, classData);

      //isSevpOK?
      let isSevpOK = checkSevpOK(onlineCount, classData);

      //if all ok, then add
      if (isPreqOK && isFirstTime && isCoreqOK && isScheduleOK && isSevpOK) {
        availableClasses.push(classData);
      }
    });
  }
  return availableClasses;
};

let checkPreqOK = (data, combinedCourseNumber, completedCourses) => {
  let preqData = data.preqTable[combinedCourseNumber].preq;
  //parsing
  //is true?
  return true;
};

let checkCoreqOK = (data, combinedCourseNumber) => {
  let coreq = data.preqTable[combinedCourseNumber].coreq;
  if (coreq === '') {
    return true;
  }
  let availableCoreqCourses = data.courses[coreq];

  if (availableCoreqCourses.length === 0) {
    return false;
  }
  return true;
};

let checkScheduleOK = (currentClassCombination, classData) => {
  //check whether is there any coflicts with classData and classes in currentClassCombination
  let isScheduleOK = true;
  let currentClass = classData;
  for (let i = 0; i < 10; i++) {
    let prevClass = currentClassCombination[i];
    let isNotConflict = currentClass.endTime >= prevClass.startTime || currentClass.startTime >= prevClass.endTime;
    if (!isNotConflict) {
      return false;
    }
  }
  return isScheduleOK;
};

let checkSevpOK = (onlineCount, classData) => {
  if (onlineCount === 0 && classData.campusCode === 'VTL') {
    return false;
  }
  return true;
};
