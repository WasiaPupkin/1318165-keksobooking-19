'use strict';

window.util = (function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

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
    }
  };
})();
