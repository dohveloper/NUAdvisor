export let setAvailableCourses = (courses, curriculums) => {
  let isCourseExist = false;
  let subjectCode;

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
        /*
        //Case 1) if courseOption is like ITC*,PHL*, then include all of that courses.
        if (courseOption.includes('*')) {
          //Extract subjectCode ex)ITC* -> ITC
          subjectCode = courseOption.substr(0, courseOption.indexOf('*'));
          //Get list of course's combinedCourseNumber that include subjectCode(ex. ITC)
          let courseNumbers = Object.keys(courses).filter(key => key.includes(subjectCode));
          courseNumbers.forEach(courseNumber => {
            let course = courses[courseNumber];
            let availableCourse = { combinedCourseNumber: courseNumber, classes: course.classes };
            selectedModule.availableCourses.push(availableCourse);
            selectedModule.isAvailableCourseExist = true;
          });
        } else {
          //Case 2)if courseOption is like ITC2300
          //Check if classes of that course exist in this term
          let isCourseExist = courses.hasOwnProperty(courseOption);
          if (isCourseExist) {
            //1) Add data to available Courses
            let course = courses[courseOption];
            let availableCourse = { combinedCourseNumber: courseOption, classes: course.classes };
            selectedModule.availableCourses.push(availableCourse);
            //2) Change isAvailableCourseExist to true
            selectedModule.isAvailableCourseExist = true;
          }
        }*/
        let courseNumbers;
        if (courseOption.includes('*')) {
          //Extract subjectCode ex)ITC* -> ITC
          subjectCode = courseOption.substr(0, courseOption.indexOf('*'));
          //Get list of course's combinedCourseNumber that include subjectCode(ex. ITC)
          courseNumbers = Object.keys(courses).filter(key => key.includes(subjectCode));
        } else {
          courseNumbers = Object.keys(courses).filter(key => key === courseOption);
        }
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
