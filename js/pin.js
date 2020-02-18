'use strict';

window.pin = (function () {
  var LEFT_BUTTON = 0;
  var mapPinMain = document.querySelector('.map__pin--main');
  var mapPins = document.querySelector('.map__pins');
  var noticeTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var isPageActivated = false;

  var onMapPinClickEnter = function (evt) {
    var target = evt.target;
    var mapPin = target.closest('.map__pin');

    if (!target || !mapPin) {
      return;
    }

    var allowedPins = document.querySelectorAll('[class="map__pin"]');

    var targetLocation = {
      x: parseInt(mapPin.style.left, 10),
      y: parseInt(mapPin.style.top, 10)
    };

    var isAllowedPin = false;

    for (var i = 0; i < allowedPins.length; i++) {
      var allowedPin = allowedPins[i];

      if (allowedPin === mapPin) {
        isAllowedPin = true;
        break;
      }
    }

    if (isAllowedPin) {
      window.card.fillPopup(window.card.findNotice(targetLocation));
      window.card.onPopupOpen();
    }
  };

  var togglePageState = function (isActive) {
    var noticeForm = document.querySelector('.ad-form');
    if (isActive) {
      document.querySelector('.map').classList.toggle('map--faded');
      noticeForm.classList.toggle('ad-form--disabled');
    }

    var noticeFieldSets = noticeForm.querySelectorAll('fieldset');
    for (var i = 0; i < noticeFieldSets.length; i++) {
      noticeFieldSets[i].disabled = !noticeFieldSets[i].disabled;
    }
    var mapFilters = document.querySelector('.map__filters');
    var mapFilterSelects = mapFilters.querySelectorAll('select');
    for (var j = 0; j < mapFilterSelects; j++) {
      mapFilterSelects[j].disabled = !mapFilterSelects[j].disabled;
    }
    var mapFilterFieldSets = mapFilters.querySelectorAll('fieldset');
    for (var k = 0; k < mapFilterFieldSets; k++) {
      mapFilterFieldSets[k].disabled = !mapFilterFieldSets[k].disabled;
    }
  };

  var activatePageState = function () {
    isPageActivated = true;
    togglePageState(isPageActivated);
    window.form.fillDefaultAddress(isPageActivated);
  };

  mapPins.addEventListener('keydown', function (evt) {
    window.util.doEnterEvent(evt, onMapPinClickEnter);
  }, true);

  mapPins.addEventListener('click', function (evt) {
    onMapPinClickEnter(evt);
  }, true);

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === LEFT_BUTTON && !isPageActivated) {
      activatePageState();
    }
  });
  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter' && !isPageActivated) {
      activatePageState();
    }
  });

  var renderNotices = function (notice) {
    var noticeElement = noticeTemplate.cloneNode(true);
    var image = noticeElement.querySelector('img');

    noticeElement.style = 'left: ' + (notice.location.x + noticeElement.offsetWidth / 2) + 'px; top: ' + (notice.location.y + noticeElement.offsetHeight) + 'px;';
    image.alt = notice.offer.title;
    image.src = notice.author.avatar;

    return noticeElement;
  };

  var getNoticesFragment = function (notices) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < notices.length; i++) {
      fragment.appendChild(renderNotices(notices[i]));
    }
    return fragment;
  };

  return {
    getNoticesFragment: getNoticesFragment,
    togglePageState: togglePageState
  };

})();
