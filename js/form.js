'use strict';

window.form = (function () {
  var adSubmitBtn = document.querySelector('.ad-form__submit');
  var title = document.querySelector('#title');
  var capacity = document.querySelector('#capacity');
  var price = document.querySelector('#price');
  var type = document.querySelector('#type');
  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');

  var fillDefaultAddress = function (isActive) {
    var address = document.querySelector('#address');
    var mainPinLeftPos = parseFloat(document.querySelector('.map__pin--main').style.left);
    var mainPinTopPos = parseFloat(document.querySelector('.map__pin--main').style.top);
    if (isActive) {
      address.value = Math.round(mainPinLeftPos / 2) + ', ' + Math.round(mainPinTopPos);
    } else {
      address.value = Math.round(mainPinLeftPos / 2) + ', ' + Math.round(mainPinTopPos / 2);
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
      case 'flat': price.min = 1000; price.placeholder = 1000; break;
      case 'bungalo': price.min = 0; price.placeholder = 0; break;
      case 'house': price.min = 5000; price.placeholder = 5000; break;
      case 'palace': price.min = 10000; price.placeholder = 10000; break;
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

  timein.addEventListener('input', onTimeInInput);
  timeout.addEventListener('input', onTimeOutInput);

  return {
    fillDefaultAddress: fillDefaultAddress
  };
})();
