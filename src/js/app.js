// import controller from './modules/controller_module';
// import data from './modules/data_module';
// import ui from './modules/ui_module';
//BUDGET CONTROLLER
var budgetController = (function () {


})();

//UI CONTROLLER
var UIController = (function () {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn'

  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
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

  }

 

  var ctrlAddItem = function () {
    // 1. Получить данные поля ввода
    var input = UICtrl.getInput();


    // 2.Добавить элемент в budget contoller

    // 3. Добавить новый элемент в UI

    // 4. Расчитать бюджет

    // 5. Отобразить новое значение бюджета в UI


  }

  return {
    init: function() {
      console.log('App has started');
      setupEventListeners();
      
    }
  }

})(budgetController, UIController);

controller.init();