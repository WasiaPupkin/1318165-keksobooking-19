'use strict';

window.pin = (function () {
  var LEFT_BUTTON = 0;
  var elements = {
    mapPinMain: document.querySelector('.map__pin--main'),
    mapPins: document.querySelector('.map__pins'),
    noticeTemplate: document.querySelector('#pin').content.querySelector('.map__pin')
  };
  var mapPinMainDefaultStyle = {
    left: elements.mapPinMain.style.left,
    top: elements.mapPinMain.style.top,
  };

  var pinBoundaries = {
    minTop: window.data.LocationYConstraints.MIN - elements.mapPinMain.offsetHeight,
    maxTop: window.data.LocationYConstraints.MAX - elements.mapPinMain.offsetHeight,
    minLeft: -elements.mapPinMain.offsetWidth / 2,
    maxLeft: elements.mapPins.offsetWidth - elements.mapPinMain.offsetWidth / 2
  };

  var onMapPinClickEnter = function (evt) {
    var activePin = document.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }

    var target = evt.target;
    var mapPin = target.closest('.map__pin');

    if (!target || !mapPin || !window.mainModule.getPageActivation()) {
      return;
    }

    mapPin.classList.add('map__pin--active');

    var targetLocation = {
      x: parseInt(mapPin.style.left, 10),
      y: parseInt(mapPin.style.top, 10)
    };

    if (elements.mapPinMain !== mapPin && window.mainModule.getPageActivation()) {
      window.card.fillPopup(window.card.findNotice(targetLocation));
      window.card.onPopupOpen();
    }
  };

  var disableFormFields = function (isDisabled) {
    window.appDefaults.elements.mapFilterSelects
      .forEach(function (el) {
        el.disabled = isDisabled;
      });
    var mapFilterFieldSet = window.appDefaults.elements.mapFilterFieldSet;
    mapFilterFieldSet.disabled = isDisabled;

    window.appDefaults.elements.noticeFieldSets.forEach(function (el) {
      el.disabled = isDisabled;
    });
  };

  var deactivatePageState = function () {
    window.appDefaults.elements.map.classList.add('map--faded');
    window.appDefaults.elements.noticeForm.classList.add('ad-form--disabled');
    disableFormFields(true);
  };

  var activatePageState = function () {
    if (window.mainModule.getNotices()) {
      window.appDefaults.elements.map.classList.remove('map--faded');
      window.appDefaults.elements.noticeForm.classList.remove('ad-form--disabled');
      disableFormFields(false);

      window.mainModule.applyNotices(window.mainModule.getNotices().slice(window.appDefaults.Constants.START_ARRAY_INDEX, window.appDefaults.Constants.MAX_NOTICES_ON_PAGE));
    }

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

      window.form.fillDefaultAddress(window.mainModule.getPageActivation());
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
  });

  elements.mapPins.addEventListener('click', function (evt) {
    onMapPinClickEnter(evt);
  });

  elements.mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === LEFT_BUTTON && window.mainModule && !window.mainModule.getPageActivation()) {
      window.mainModule.setPageActivation(true);
      activatePageState();
    }
    handleMainPinMove(evt);
  });
  elements.mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === 'Enter' && window.mainModule && !window.mainModule.getPageActivation()) {
      window.mainModule.setPageActivation(true);
      activatePageState();
    }
  });

  var renderNotices = function (notice) {
    var noticeElement = elements.noticeTemplate.cloneNode(true);
    var image = noticeElement.querySelector('img');

    noticeElement.style = 'left: ' + (notice.location.x + noticeElement.offsetWidth / 2) + 'px; top: ' + (notice.location.y + noticeElement.offsetHeight) + 'px;';
    image.alt = notice.offer.title;
    if (notice.author) {
      image.src = notice.author.avatar;
    }

    return noticeElement;
  };

  var getNoticesFragment = function (notices) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < notices.length; i++) {
      fragment.appendChild(renderNotices(notices[i]));
    }
    return fragment;
  };

  var resetForms = function () {
    window.card.onPopupClose();
    window.appDefaults.elements.mapFilters.reset();
    window.mainModule.applyNotices([]);
    deactivatePageState();
    window.mainModule.setPageActivation(false);
    elements.mapPinMain.style = 'left: ' + mapPinMainDefaultStyle.left + '; top: ' + mapPinMainDefaultStyle.top;
    window.form.fillDefaultAddress(window.mainModule.getPageActivation());
    window.appDefaults.elements.noticeImagePreview.innerHTML = '';
    window.appDefaults.elements.userAvatarPreview.src = window.appDefaults.elements.userAvatarPreviewDefaultSrc;
  };

  return {
    elements: elements,
    getNoticesFragment: getNoticesFragment,
    resetForms: resetForms,
    activatePageState: activatePageState,
    deactivatePageState: deactivatePageState
  };

})();
