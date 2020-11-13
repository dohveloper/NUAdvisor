import { FaStackExchange } from 'react-icons/fa';

/*
Since Prerequisite has complicated structure such as 
SOC 1100 D- OR PSY 1100 D- OR ( PSY 1010 D- AND PSY 1210 D-) OR ( PSY 1010 D- AND PSY 1410 D-) OR ( PSY 1210 D- AND PSY 1410 D-)

We use PreqBlock as the way to manage preq.
- preqblocks: Preqblocks can contain another preqblocks.
- operation: Preq Block has three operation types. ex) AND: AND  // OR: OR // null: just one course 
*/

class PreqBlock {
  constructor() {
    this.operation = '';
    this.preqBlocks = [];
  }
  setType(operation) {
    if (operation === 'AND') {
      this.operation = 'AND';
    }
    if (operation === 'OR') {
      this.operation = 'OR';
    }
    if (operation === null) {
      this.operation = null;
    }
  }
  setOperation(operation) {
    this.operation = operation;
  }
  addPreqBlock(preqBlock) {
    this.preqBlocks.push(preqBlock);
  }
  isCompleted(completedCourses) {
    let isCompleted = this.isCompletedRecursion(this, completedCourses);
    return isCompleted;
  }
  isCompletedRecursion(preqBlock, completedCourses) {
    let self = this;
    if (preqBlock.operation === null) {
      return completedCourses.includes(preqBlock.preqBlocks[0]);
    }
    let isCompletedList = [];
    for (let i = 0; i < preqBlock.preqBlocks.length; i++) {
      let childPreqBlock = preqBlock.preqBlocks[i];
      let isCompleted = self.isCompletedRecursion(childPreqBlock, completedCourses);

      if (preqBlock.operation === 'OR' && isCompleted === true) {
        return true;
      }
      if (preqBlock.operation === 'AND' && isCompleted === false) {
        return false;
      }
      isCompletedList.push(isCompleted);
    }
    //after check all child preqBlocks
    if (preqBlock.operation === 'OR') {
      return false;
    }
    if (preqBlock.operation === 'AND') {
      return true;
    }
  }
}

/*
- NAME   : preqBlockConverter
- PURPOSE: parse preqBlockString into preqBlock
- INPUT  : string, (ex) "A OR (A AND B)"
- OUTPUT : PreqBlock, (ex) {preqBlocks:[{preqBlocks:["A"],operation:null},{preqBlocks:["A","B"],operation:"AND"}], operation:"OR"}
*/
export let preqBlockConverter = preqBlockString => {
  //new preqBlock
  let preqBlock = new PreqBlock();
  //1.parse preqBlockString into singlePreqBlocks & groupPreqBlockStrings & operation (ex.singlePreqBlocks:A/null groupPreqBlockStrings:["(A OR B)","(A OR (A AND B))"], operation:AND)
  let result = parsePreqBlockString(preqBlockString);
  //2.set preqBlocks and operation
  result.singlePreqBlocks.forEach(singlePreqBlock => {
    preqBlock.addPreqBlock(singlePreqBlock);
  });
  preqBlock.setOperation(result.operation);
  //3.repeat until no () aka groupPreqBlocks
  for (let i = 0; i < result.groupPreqBlockStrings.length; i++) {
    let groupPreqBlockString = result.groupPreqBlockStrings[i];
    //3.1. remove highest()
    let newPreqBlockString = groupPreqBlockString.substring(1, groupPreqBlockString.length - 1);
    //3.2. run preqBlockStringConverter
    let newPreqBlock = preqBlockConverter(newPreqBlockString);
    //3.3. add to preqBlocks
    preqBlock.addPreqBlock(newPreqBlock);
  }

  return preqBlock;
};

/*
- NAME   : parsePreqBlockString
- PURPOSE: parse preqBlockString into singlePreqBlocks & groupPreqBlockStrings & operation (parse parenthesis only one depth)
- INPUT  : string, (ex) "A OR B OR (A AND B)"
- OUTPUT : Object, (ex) {singlePreqBlocks:[{preqBlocks:["A"] operation:null},{...}] groupPreqBlockStrings:["(A OR B)","(A OR (A AND B))"], operation:"AND"}
*/
let parsePreqBlockString = preqBlockString => {
  let courseRegex = /\w\w\w\s\d\d\d\d\s\w\-?/;
  let current = preqBlockString;
  let result = { singlePreqBlocks: [], operation: '', groupPreqBlockStrings: [] };
  while (current !== '') {
    //1.if first char is '('
    if (current.charAt(0) === '(') {
      //if first char is '(', then get all until')'
      let unclosedParanthesis = 1;
      let index = 1;
      while (unclosedParanthesis >= 1) {
        if (current.charAt(index) === '(') {
          unclosedParanthesis++;
        }
        if (current.charAt(index) === ')') {
          unclosedParanthesis--;
        }
        index++;
      }
      //add
      let groupPreqBlockString = current.slice(0, index);
      result.groupPreqBlockStrings.push(groupPreqBlockString);
      //set next current
      current = current.slice(index + 1);
    } else {
      //2.if first char is not '('
      //if first char is not '(', then get course data in right format and put that into singlePreqBlocks.
      let course = current.slice(0, 8);
      //remove space =>"ACC 3410"" to "ACC3410"
      course = course.replace(/\s/g, '');
      //add
      let singlePreqBlock = { preqBlocks: [course], operation: null };
      result.singlePreqBlocks.push(singlePreqBlock);
      //set next current
      current = current.slice(12);
    }

    //3. Get operation
    if (current !== '') {
      if (current.charAt(0) === 'O') {
        //OR
        result.operation = 'OR';
        current = current.slice(3);
      }
      if (current.charAt(0) === 'A') {
        //AND
        result.operation = 'AND';
        current = current.slice(4);
      }
    }
  }
  return result;
};
