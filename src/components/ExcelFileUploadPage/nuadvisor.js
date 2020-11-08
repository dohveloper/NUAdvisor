export let setAvailableCourses = (courses, curriculums) => {
  /*
  [purpose]: Get available modules & courses for curriculums for this term (is class of Module courseOption exist)
  [result]: Update curriculums data with ("isAvailableCourseExist","availableCourses")
  */
  for (let key of Object.keys(curriculums)) {
    let curriculum = curriculums[key];
    //Repeat for all curriculums
    for (let i = 1; i < Object.keys(curriculum.modules).length + 1; i++) {
      let selectedModule = curriculum.modules[i];
      //Repeat for all courses Options
      selectedModule.courseOptions.forEach(courseOption => {
        let subjectCode;
        let courseNumbers;
        if (courseOption.includes('*')) {
          //Case 1. CourseOption with *
          //1.1 Extract subjectCode ex)ITC* -> ITC
          subjectCode = courseOption.substr(0, courseOption.indexOf('*'));
          //1.2 Get list of course's combinedCourseNumber that include subjectCode(ex. ITC)
          courseNumbers = Object.keys(courses).filter(key => key.includes(subjectCode));
        } else {
          //Case 2. CourseOption with *
          courseNumbers = Object.keys(courses).filter(key => key === courseOption);
        }
        //Add availableCourses & Change isAvailableCourseExist to true
        courseNumbers.forEach(courseNumber => {
          let course = courses[courseNumber];
          let availableCourse = { combinedCourseNumber: courseNumber, classes: course.classes };
          selectedModule.availableCourses.push(availableCourse);
          selectedModule.isAvailableCourseExist = true;
        });
      });
    }
  }
};
const LAST_SEMESTER_MAX = 5;
const ONLINE_MAX = 5;
class Term {
  constructor() {
    this.totalCourse = 0;
    this.onlineCourse = 0;
    this.crns = [];
    this.classList = [{ moduleId: 0, classData: {} }];
    this.timeTable = {
      M: [],
      T: [],
      W: [],
      T: [],
      F: []
    };
  }

  addClass(moduleId, classData) {
    //increment totalCourse
    this.totalCourse++;
    //increment onlineCourse if online
    if (classData.campusCode == 'VTL') {
      this.onlineCourse++;
    }
    //add to crn
    this.crns.push(classData.crn);
    //add to classes with module id
    let newClassData = { moduleId, classData };
    this.classList.push(newClassData);
    //add to timetable
    let newSchedule = { startTime: classData.startTime, endTime: classData.endTime };
    this.timeTable[classData.dayOfWeek].push(newSchedule);
  }
}
