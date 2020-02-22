'use strict';

window.mapFiltersHandler = (function () {
  var START_ARRAY_INDEX = 0;

  var filterArr = function (arr, elValue, compareWithValue) {
    var nestingElements = elValue.split('.');

    if (compareWithValue === 'any') {
      return arr.slice(START_ARRAY_INDEX, window.appDefaults.constants.MAX_NOTICES_ON_PAGE);
    }

    return arr.filter(function (el) {
      if (nestingElements.length === 1) {
        return el[nestingElements[0]] === compareWithValue;
      } else if (nestingElements.length === 2) {
        return el[nestingElements[0]][nestingElements[1]] === compareWithValue;
      }
      return false;
    }).slice(START_ARRAY_INDEX, window.appDefaults.constants.MAX_NOTICES_ON_PAGE);
  };

  var onSelectInput = function (evt) {
    var target = evt.target;
    var notices = window.mainModule.getNotices();
    var filteredNotices;
    switch (target.name) {
      case 'housing-type':
        filteredNotices = filterArr(notices, 'offer.type', target.options[target.selectedIndex].value);
        break;
      case 'housing-price':

        break;
      case 'housing-rooms':

        break;

      case 'housing-guests':

        break;

    }
    if (filteredNotices) {
      window.mainModule.applyNotices(filteredNotices);
    }
    window.card.onPopupClose();
  };

  var onFieldInput = function () {
    window.card.onPopupClose();
  };

  window.appDefaults.elements.mapFilterSelects.forEach(function (el) {
    el.addEventListener('input', onSelectInput);
  });

  window.appDefaults.elements.mapFilterFieldSet.addEventListener('input', onFieldInput);
})();
