'use strict';

window.mainModule = (function () {
  var isPageActivated = false;
  var _notices;

  var setNotices = function (notices) {
    _notices = notices;
  };

  var getNotices = function () {
    return _notices;
  };

  var setPageActivation = function (isActivated) {
    isPageActivated = isActivated;
  };

  var getPageActivation = function () {
    return isPageActivated;
  };
  var applyNotices = function (filteredByDefaultNotices) {
    window.pin.elements.mapPins.querySelectorAll('.map__pin').forEach(function (el) {
      if (!el.classList.contains('map__pin--main')) {
        window.pin.elements.mapPins.removeChild(el);
      }
    });
    window.pin.elements.mapPins.appendChild(window.pin.getNoticesFragment(filteredByDefaultNotices));
  };

  var successHandler = function (data) {
    setNotices(data);
    window.pin.togglePageState(getPageActivation());
    window.form.fillDefaultAddress(getPageActivation());
  };

  window.data.loadNotices(successHandler, window.util.errorHandler);

  return {
    getNotices: getNotices,
    setPageActivation: setPageActivation,
    getPageActivation: getPageActivation,
    applyNotices: applyNotices
  };

})();

