// import controller from './modules/controller_module';
// import data from './modules/data_module';
// import ui from './modules/ui_module';
//BUDGET CONTROLLER
var budgetController = (function () {

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allitems[type].forEach(function(current, index, el){
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allitems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  //Public method
  return {
    addItem: function (type, des, val) {
      var newItem, ID;
      //create new ID 
      if (data.allitems[type].length > 0) {
        ID = data.allitems[type][data.allitems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      //push new item into our data structure
      data.allitems[type].push(newItem);

      //return new element
      return newItem;
    },

    calculateBudget: function () {

      //calculate total inc and exp
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget income - exp
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the % of inc that we spent
      data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function () {
      console.log(data);

    }
  };



})();

//UI CONTROLLER
var UIController = (function () {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list'
  };

  //Public method
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },
    addListItem: function (obj, type) {

      var html, newHtml, element;
      // 1.Create HTML string with placeholder text
      if (type === 'inc') {

        element = DOMstrings.incomeContainer;

        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i ></button></div></div></div>';
      }

      // 2.Replace placeholder text  with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // 3. Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    getDOMstrings: function () {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONROLLER
var controller = (function (budgetCtrl, UICtrl) {

  var DOM = UICtrl.getDOMstrings();
  var setupEventListeners = function () {
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        event.preventDefault();
        ctrlAddItem();
      }
    });

  };

  var updateBudget = function () {

    // 1. Calculate budget
    budgetCtrl.calculateBudget();
    // 2. return budget 
    var budget = budgetCtrl.getBudget();
    // 3. Display a new budget value
    console.log(budget);
    
  };

  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Recieve input data from input fields
    input = UICtrl.getInput();
    // def from empty string, not a number and 0
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2.Add element to a budget contoller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add new element to UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear fields after data input
      UIController.clearFields();

      // 5. Calculate and refresh budget
      updateBudget();

    }
  };
  //APP initialization
  return {
    init: function () {
      console.log('App has started');
      setupEventListeners();

    }
  }

})(budgetController, UIController);


controller.init();