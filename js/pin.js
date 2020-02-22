'use strict';

window.pin = (function () {
  var LEFT_BUTTON = 0;

  var elements = {
    mapPinMain: document.querySelector('.map__pin--main'),
    mapPins: document.querySelector('.map__pins'),
    noticeTemplate: document.querySelector('#pin').content.querySelector('.map__pin')
  };

  var pinBoundaries = {
    minTop: window.data.LOCATIONY_CONSTRAINTS.min - elements.mapPinMain.offsetHeight,
    maxTop: window.data.LOCATIONY_CONSTRAINTS.max,
    minLeft: -elements.mapPinMain.offsetWidth / 2,
    maxLeft: elements.mapPins.offsetWidth - elements.mapPinMain.offsetWidth / 2
  };

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

    if (isAllowedPin && window.mainModule.getPageActivation()) {
      window.card.fillPopup(window.card.findNotice(targetLocation));
      window.card.onPopupOpen();
    }
  };

  var togglePageState = function (isActive) {
    if (isActive) {
      window.appDefaults.elements.map.classList.toggle('map--faded');
      window.appDefaults.elements.noticeForm.classList.toggle('ad-form--disabled');
      if (window.mainModule.getNotices()) {
        window.appDefaults.elements.mapFilterSelects
          .forEach(function (el) {
            el.disabled = !el.disabled;
          });
        var mapFilterFieldSet = window.appDefaults.elements.mapFilterFieldSet;
        mapFilterFieldSet.disabled = !mapFilterFieldSet.disabled;
      }
    }
    window.appDefaults.elements.noticeFieldSets.forEach(function (el) {
      el.disabled = !el.disabled;
    });
  };

  var activatePageState = function () {
    window.mainModule.setPageActivation(true);
    togglePageState(window.mainModule.getPageActivation());
    window.form.fillDefaultAddress(window.mainModule.getPageActivation());
  };

  var handleMainPinMove = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var dragged = false;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      dragged = true;

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var tmpTop = elements.mapPinMain.offsetTop - shift.y;
      var tmpLeft = elements.mapPinMain.offsetLeft - shift.x;

      if (tmpTop < pinBoundaries.minTop) {
        tmpTop = pinBoundaries.minTop;
      }
      if (tmpTop > pinBoundaries.maxTop) {
        tmpTop = pinBoundaries.maxTop;
      }
      if (tmpLeft < pinBoundaries.minLeft) {
        tmpLeft = pinBoundaries.minLeft;
      }
      if (tmpLeft > pinBoundaries.maxLeft) {
        tmpLeft = pinBoundaries.maxLeft;
      }

      elements.mapPinMain.style.top = tmpTop + 'px';
      elements.mapPinMain.style.left = tmpLeft + 'px';
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      if (dragged) {
        var onClickPreventDefault = function (clickEvt) {
          clickEvt.preventDefault();
          elements.mapPinMain.removeEventListener('click', onClickPreventDefault);
        };
        elements.mapPinMain.addEventListener('click', onClickPreventDefault);

        window.form.fillDefaultAddress(window.mainModule.getPageActivation());
      }

    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  elements.mapPins.addEventListener('keydown', function (evt) {
    window.util.doEnterEvent(evt, onMapPinClickEnter);
  }, true);

  elements.mapPins.addEventListener('click', function (evt) {
    onMapPinClickEnter(evt);
  }, true);

  elements.mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === LEFT_BUTTON && !window.mainModule.getPageActivation()) {
      activatePageState();
    }
    handleMainPinMove(evt);
  });
  elements.mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter' && !window.mainModule.getPageActivation()) {
      activatePageState();
    }
  });

  var renderNotices = function (notice) {
    var noticeElement = elements.noticeTemplate.cloneNode(true);
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
    elements: elements,
    getNoticesFragment: getNoticesFragment,
    togglePageState: togglePageState
  };

})();
