'use strict';

window.util = (function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  return {
    doEscEvent: function (evt, action) {
      if (evt.key === ESC_KEY) {
        action(evt);
      }
    },
    doEnterEvent: function (evt, action) {
      if (evt.key === ENTER_KEY) {
        action(evt);
      }
    },
    errorHandler: errorHandler
  };
})();
