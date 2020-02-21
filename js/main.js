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
  var applyNotices = function () {
    document.querySelector('.map__pins').appendChild(window.pin.getNoticesFragment(getNotices()));
  };

  var successHandler = function (data) {
    setNotices(data);
    applyNotices();
    window.pin.togglePageState(isPageActivated);
    window.form.fillDefaultAddress(isPageActivated);
  };

  window.data.loadNotices(successHandler, window.util.errorHandler);

  return {
    getNotices: getNotices,
    setPageActivation: setPageActivation,
    getPageActivation: getPageActivation
  };

})();

