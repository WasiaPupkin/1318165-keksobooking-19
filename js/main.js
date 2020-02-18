'use strict';

window.mainModule = (function () {
  var isPageActivated = false;
  var notices = window.data.generateNotices();

  var applyNotices = function () {
    document.querySelector('.map__pins').appendChild(window.pin.getNoticesFragment(notices));
  };

  applyNotices();
  window.pin.togglePageState(isPageActivated);
  window.form.fillDefaultAddress(isPageActivated);

  return {
    notices: notices
  };

})();

