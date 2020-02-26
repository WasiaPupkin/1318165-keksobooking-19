'use strict';

window.mapFiltersHandler = (function () {
  var START_ARRAY_INDEX = 0;
  var filterElements = Array.from(window.appDefaults.elements.mapFilters.elements);
  var priceDictionary = {
    low: 10000,
    high: 50000
  };

  var filterArr = function (arr, elValue, compareWithValue) {
    var nestingElements = elValue.split('.');

    if (compareWithValue === 'any') {
      return arr;
    }

    return arr.filter(function (el) {
      if (nestingElements.length === 1) {
        return el[nestingElements[0]] + '' === compareWithValue;
      } else if (nestingElements.length === 2) {
        var nestingEl = el[nestingElements[0]][nestingElements[1]];
        if (Array.isArray(nestingEl)) {
          return nestingEl.indexOf(compareWithValue) >= 0;
        } else {
          if (nestingElements[1] === 'price') {
            switch (compareWithValue) {
              case 'low':
                return nestingEl < priceDictionary[compareWithValue];
              case 'high':
                return nestingEl > priceDictionary[compareWithValue];
              case 'middle':
                return nestingEl >= priceDictionary['low'] && nestingEl <= priceDictionary['high'];
            }
          } else {
            return nestingEl + '' === compareWithValue;
          }
        }

      }
      return false;
    });
  };

  var doNoticesFiltration = function (arr, notices) {
    arr.forEach(function (el) {
      switch (el.name) {
        case 'housing-type':
          notices = filterArr(notices, 'offer.type', el.value);
          break;
        case 'housing-price':
          notices = filterArr(notices, 'offer.price', el.value);
          break;
        case 'housing-rooms':
          notices = filterArr(notices, 'offer.rooms', el.value);
          break;
        case 'housing-guests':
          notices = filterArr(notices, 'offer.guests', el.value);
          break;
        case 'features':
          notices = filterArr(notices, 'offer.features', el.value);
          break;
      }
    });

    return notices;
  };

  var combineCheckedElements = function () {
    return filterElements.filter(function (el) {
      return el.checked || (el.options && el.options[el.selectedIndex]);
    });
  };

  var onSelectInput = function () {
    var filteredNotices = doNoticesFiltration(combineCheckedElements(), window.mainModule.getNotices());

    if (filteredNotices) {
      window.mainModule.applyNotices(filteredNotices.slice(START_ARRAY_INDEX, window.appDefaults.constants.MAX_NOTICES_ON_PAGE));
    }
    window.card.onPopupClose();
  };

  Array.from(window.appDefaults.elements.mapFilters.children).forEach(function (el) {
    el.addEventListener('input', window.debounce(onSelectInput));
  });

})();
