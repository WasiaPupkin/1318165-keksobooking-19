'use strict';

window.form = (function () {
  var form = document.querySelector('.ad-form');
  var adSubmitBtn = document.querySelector('.ad-form__submit');
  var title = document.querySelector('#title');
  var capacity = document.querySelector('#capacity');
  var price = document.querySelector('#price');
  var type = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  var mainPin = window.pin.elements.mapPinMain;
  var errorMessageTemplate = document.querySelector('#error').content;
  var errorMessagePopup;
  var successMessageTemplate = document.querySelector('#success').content;
  var successPopup;
  var clearFormBtn = document.querySelector('.ad-form__reset');
  var mainTag = document.querySelector('main');
  var defaultPricePlaceHolder = price.placeholder;
  var defaultPriceMin = price.min;
  var FLAT_PRICE_MIN_PLACEHOLDER = 1000;
  var BUNGALO_PRICE_MIN_PLACEHOLDER = 0;
  var HOUSE_PRICE_MIN_PLACEHOLDER = 5000;
  var PALACE_PRICE_MIN_PLACEHOLDER = 10000;

  var fillDefaultAddress = function (isActive) {
    var address = document.querySelector('#address');
    var mainPinLeftPos = parseFloat(mainPin.style.left);
    var mainPinTopPos = parseFloat(mainPin.style.top);
    if (isActive) {
      address.value = Math.round(mainPinLeftPos + mainPin.offsetWidth / 2) + ', '
        + Math.round(mainPinTopPos + mainPin.offsetHeight);
    } else {
      address.value = Math.round(mainPinLeftPos + mainPin.offsetWidth / 2) + ', '
        + Math.round(mainPinTopPos + mainPin.offsetHeight / 2);
    }
  };

  var validateCapacity = function () {
    var roomNumberVal = document.querySelector('#room_number').value;
    var guestNumVal = capacity.value;

    if (guestNumVal === '0' && roomNumberVal !== '100') {
      capacity.setCustomValidity(capacity.options[capacity.selectedIndex].textContent + ' требуется 100 комнат');
    } else if (guestNumVal > roomNumberVal) {
      capacity.setCustomValidity('Для ' + guestNumVal + ' гостей требуется такое же количество комнат');
    } else {
      capacity.setCustomValidity('');
    }
  };

  type.addEventListener('input', function () {
    switch (type.value) {
      case 'flat': price.min = FLAT_PRICE_MIN_PLACEHOLDER; price.placeholder = FLAT_PRICE_MIN_PLACEHOLDER; break;
      case 'bungalo': price.min = BUNGALO_PRICE_MIN_PLACEHOLDER; price.placeholder = BUNGALO_PRICE_MIN_PLACEHOLDER; break;
      case 'house': price.min = HOUSE_PRICE_MIN_PLACEHOLDER; price.placeholder = HOUSE_PRICE_MIN_PLACEHOLDER; break;
      case 'palace': price.min = PALACE_PRICE_MIN_PLACEHOLDER; price.placeholder = PALACE_PRICE_MIN_PLACEHOLDER; break;
      default : break;
    }
  });

  var onTimeInInput = function () {
    if (timein.value !== timeout.value) {
      timeout.removeEventListener('input', onTimeOutInput);
      timeout.value = timein.value;
      timeout.addEventListener('input', onTimeOutInput);
    }
  };

  var onTimeOutInput = function () {
    if (timein.value !== timeout.value) {
      timein.removeEventListener('input', onTimeInInput);
      timein.value = timeout.value;
      timein.addEventListener('input', onTimeInInput);
    }
  };

  var validatePrice = function () {
    price.checkValidity();
  };

  price.addEventListener('invalid', function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Минимальное значение ' + price.min);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Максимальное значение ' + price.max);
    } else {
      price.setCustomValidity('');
    }
  });

  title.addEventListener('invalid', function () {
    if (title.validity.tooShort) {
      title.setCustomValidity('Минимальная длина ' + title.minLength + ' и максимальная длина ' + title.maxLength + ' символов');
    } else {
      title.setCustomValidity('');
    }
  });

  title.addEventListener('input', function () {
    title.checkValidity();
  });

  adSubmitBtn.addEventListener('click', function () {
    validateCapacity();
    validatePrice();
  });

  clearFormBtn.addEventListener('click', function () {
    form.reset();
    window.pin.resetForms();
  });

  var onSubmitError = function () {
    if (!errorMessagePopup) {
      var errorMessageFrag = errorMessageTemplate.cloneNode(true);
      mainTag.appendChild(errorMessageFrag);
      errorMessagePopup = document.querySelector('.error');
      errorMessagePopup.querySelector('.error__button').addEventListener('click', function () {
        onErrorClose();
      });
      onErrorShow();
    } else {
      onErrorShow();
    }
  };

  var onErrorShow = function () {
    errorMessagePopup.classList.remove('hidden');
    document.addEventListener('click', onErrorClose);
    document.addEventListener('keydown', onErrorEscPress);
  };

  var onErrorClose = function () {
    errorMessagePopup.classList.add('hidden');
    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorClose);
  };

  var onErrorEscPress = function (evt) {
    window.util.doEscEvent(evt, onErrorClose);
  };

  var onSuccessShow = function () {
    successPopup.classList.remove('hidden');
    document.addEventListener('click', onSuccessClose);
    document.addEventListener('keydown', onSuccessEscPress);
  };

  var onSuccessEscPress = function (evt) {
    window.util.doEscEvent(evt, onSuccessClose);
  };

  var onSuccessClose = function () {
    successPopup.classList.add('hidden');
    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', onSuccessShow);
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.data.saveNotice(new FormData(form), function () {
      if (!successPopup) {
        var successMessage = successMessageTemplate.cloneNode(true);
        mainTag.appendChild(successMessage);
        successPopup = document.querySelector('.success');
        onSuccessShow();
      } else {
        onSuccessShow();
      }
      form.reset();
      window.pin.resetForms();

    }, onSubmitError);
  });

  timein.addEventListener('input', onTimeInInput);
  timeout.addEventListener('input', onTimeOutInput);

  return {
    fillDefaultAddress: fillDefaultAddress,
    price: price,
    defaultPricePlaceHolder: defaultPricePlaceHolder,
    defaultPriceMin: defaultPriceMin
  };
})();
