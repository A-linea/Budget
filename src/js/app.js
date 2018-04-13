// import controller from './modules/controller_module';
// import data from './modules/data_module';
// import ui from './modules/ui_module';
//BUDGET CONTROLLER
var budgetController = (function () {

  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentages = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.allitems[type].forEach(function (current, index, el) {
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

    deleteItem: function (type, id) {
      var ids, index;
      ids = data.allitems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);

      if (index !== -1) {
        data.allitems[type].splice(index, 1);
      }

    },

    calculateBudget: function () {

      //calculate total inc and exp
      calculateTotal('exp');
      calculateTotal('inc');

      //calculate the budget income - exp
      data.budget = data.totals.inc - data.totals.exp;

      //calculate the % of inc that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      data.allitems.exp.forEach(function(current){
        current.calcPercentages(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPercentages = data.allitems.exp.map(function(current) {
        return current.getPercentage();
      });
      return allPercentages;
    },

    getBudget: function () {
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
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercentageLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  formatNumber = function(num, type) {
    var numSplit,int,dec,sign;
    // + or - before the number. 
    //two decimal points,
    // coma separating the thousands
    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split('.');
    int = numSplit[0];

    if(int.length > 3) {
      int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, 3); //input 23100 = out 23,100
    }
    dec = numSplit[1];
   
    return  (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
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

        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i ></button></div></div></div>';
      }

      // 2.Replace placeholder text  with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      // 3. Insert HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function (selectorID) {
      var el;
      el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
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

    displayBudget: function (obj) {
      obj.budget > 0 ? type = 'inc': type = 'exp';
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent =formatNumber( obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '--';
      }
    },

    displayPercentages: function (percentages) {
      var fields, nodeListForEach;
      fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);
      
      nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i)   
        }
      };
      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '--';
        }
      });
    },
    displayMonth : function () {
      var now, year, month, months;
      now = new Date();
      year = now.getFullYear();
      months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
      month = now.getMonth();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;

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

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

  };

  var updateBudget = function () {

    // 1. Calculate budget
    budgetCtrl.calculateBudget();
    // 2. return budget 
    var budget = budgetCtrl.getBudget();
    // 3. Display a new budget value
    UICtrl.displayBudget(budget);

  };
  var updatePercentages = function () {
    
    //1. Calculate percentages
    budgetCtrl.calculatePercentages();

    //2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    //3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
  }

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
      // 6.Calculate and update percentages
      updatePercentages();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. Delete item from the data structure
      budgetCtrl.deleteItem(type, ID);

      //2. Delete item from UI
      UICtrl.deleteListItem(itemID);

      //3. Update and show new budget
      updateBudget();
    }

  };
  //APP initialization
  return {
    init: function () {
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();

    }
  };

})(budgetController, UIController);


controller.init();
