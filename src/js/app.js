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
  }

  var data = {
    allitems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
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
  }

  //Public method
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
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
        ctrlAddItem();
      }
    });

  };



  var ctrlAddItem = function () {
    var input, newItem;
    // 1. Получить данные поля ввода
    input = UICtrl.getInput();


    // 2.Добавить элемент в budget contoller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // 3. Добавить новый элемент в UI
    UICtrl.addListItem(newItem, input.type)
    // 4. Расчитать бюджет

    // 5. Отобразить новое значение бюджета в UI


  }
  //APP initialization
  return {
    init: function () {
      console.log('App has started');
      setupEventListeners();

    }
  }

})(budgetController, UIController);

controller.init();