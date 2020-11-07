export let setAvailableCourses = (courses, curriculums) => {
  let subjectCode;
  let courseNumbers;

  /*
  [purpose]: Get available modules & courses for curriculums for this term (is class of Module courseOption exist)
  [result]: Update curriculums data with ("isAvailableCourseExist","availableCourses")
  */
  for (let key of Object.keys(curriculums)) {
    let curriculum = curriculums[key];
    //Repeat for all curriculums
    for (let i = 1; i < Object.keys(curriculum.modules).length + 1; i++) {
      let selectedModule = curriculum.modules[i];
      //Check whether if there are courses for any of courses Options
      selectedModule.courseOptions.forEach(courseOption => {
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
