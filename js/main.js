'use strict';

var notices = [];
var NOTICES_NUM = 8;
var REALTY_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var REALTY_ROOM_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];
var MAX_PRICE = 20500;
var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
var REALTY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var REALTY_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var MIN_LOCATIONY = 130;
var MAX_LOCATIONY = 630;
var noticeTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var noticeCardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');
var LEFT_BUTTON = 0;
var ESC_KEY = 'Escape';
var ENTER_KEY = 'Enter';
var adSubmitBtn = document.querySelector('.ad-form__submit');
var title = document.querySelector('#title');
var capacity = document.querySelector('#capacity');
var price = document.querySelector('#price');
var type = document.querySelector('#type');
var timein = document.querySelector('#timein');
var timeout = document.querySelector('#timeout');
var isPageActivated = false;
var mapPinMain = document.querySelector('.map__pin--main');
var mapPins = document.querySelector('.map__pins');
var cardPopup;
var PHOTO_WIDTH = 45;
var PHOTO_HEIGHT = 40;

var generateAddress = function (locationX, locationY) {
  return locationX + ', ' + locationY;
};

var generateAvatar = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

var generateTitle = function (rooms_, type_) {
  return rooms_ + ' rooms ' + type_;
};

var generatePrice = function () {
  return Math.floor(Math.random() * MAX_PRICE);
};

var generateType = function () {
  return REALTY_TYPES[Math.floor(Math.random() * REALTY_TYPES.length)];
};

var generateRooms = function () {
  return REALTY_ROOM_NUMS[Math.floor(Math.random() * REALTY_ROOM_NUMS.length)];
};

var generateGuests = function () {
  return REALTY_ROOM_NUMS[Math.floor(Math.random() * REALTY_ROOM_NUMS.length)];
};

var generateCheckin = function () {
  return CHECKIN_TIMES[Math.floor(Math.random() * CHECKIN_TIMES.length)];
};

var generateCheckout = function () {
  return CHECKIN_TIMES[Math.floor(Math.random() * CHECKIN_TIMES.length)];
};

var generateFeatures = function () {
  return REALTY_FEATURES.slice(Math.floor(Math.random() * REALTY_FEATURES.length), Math.floor(Math.random() * REALTY_FEATURES.length));
};

var generateDescriptions = function (tmpOffer) {
  return tmpOffer.rooms + ' rooms ' + tmpOffer.type + ' with ' + tmpOffer.guests + ' guests places. Also we offer some features: ' + tmpOffer.features;
};

var generatePhotos = function () {
  return REALTY_PHOTOS.slice(Math.floor(Math.random() * REALTY_PHOTOS.length), Math.floor(Math.random() * REALTY_PHOTOS.length));
};

var generateLocationX = function () {
  return Math.floor(Math.random() * document.querySelector('.map__pins').offsetWidth);
};

var generateLocationY = function () {
  return Math.floor(Math.random() * (MAX_LOCATIONY - MIN_LOCATIONY) + MIN_LOCATIONY);
};

var generateNotices = function () {
  for (var i = 1; i <= NOTICES_NUM; i++) {
    var locationX = generateLocationX();
    var locationY = generateLocationY();

    var tmpOffer = {
      type: generateType(),
      rooms: generateRooms(),
      guests: generateGuests(),
      checkin: generateCheckin(),
      checkout: generateCheckout(),
      price: generatePrice(),
      features: generateFeatures()
    };

    notices.push({
      author: {
        avatar: generateAvatar(i)
      },
      offer: {
        title: generateTitle(tmpOffer.rooms, tmpOffer.type),
        address: generateAddress(locationX, locationY),
        price: tmpOffer.price,
        type: tmpOffer.type,
        rooms: tmpOffer.rooms,
        guests: tmpOffer.guests,
        checkin: tmpOffer.checkin,
        checkout: tmpOffer.checkout,
        features: tmpOffer.features,
        description: generateDescriptions(tmpOffer),
        photos: generatePhotos()
      },
      location: {
        x: locationX,
        y: locationY
      }
    });
  }
};

var renderNotices = function (notice) {
  var noticeElement = noticeTemplate.cloneNode(true);
  var image = noticeElement.querySelector('img');

  noticeElement.style = 'left: ' + (notice.location.x + noticeElement.offsetWidth / 2) + 'px; top: ' + (notice.location.y + noticeElement.offsetHeight) + 'px;';
  image.alt = notice.offer.title;
  image.src = notice.author.avatar;

  return noticeElement;
};

var getNoticesFragment = function () {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < notices.length; i++) {
    fragment.appendChild(renderNotices(notices[i]));
  }
  return fragment;
};

var applyNotices = function () {
  document.querySelector('.map__pins').appendChild(getNoticesFragment());
};

var convertType = function (type_) {
  switch (type_) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
    default : return 'нечто';
  }
};

var fillFeaturesList = function (notice, noticeCardElement) {
  var defaultFeaturesNode = noticeCardElement.querySelector('.popup__features');
  defaultFeaturesNode.classList.remove('hidden');
  var defaultFeaturesList = defaultFeaturesNode.querySelectorAll('li');
  for (var i = defaultFeaturesList.length - 1; i >= 0; i--) {
    defaultFeaturesNode.removeChild(defaultFeaturesList[i]);
  }

  if (notice.offer.features.length) {
    for (var j = 0; j < notice.offer.features.length; j++) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + notice.offer.features[j]);
      defaultFeaturesNode.appendChild(li);
    }
  } else {
    defaultFeaturesNode.classList.add('hidden');
  }
};

var fillPhotos = function (notice, noticeCardElement) {
  var photosNode = noticeCardElement.querySelector('.popup__photos');
  var defaultPhotos = photosNode.querySelectorAll('.popup__photo');
  photosNode.classList.remove('hidden');

  for (var i = defaultPhotos.length - 1; i >= 0; i--) {
    photosNode.removeChild(defaultPhotos[i]);
  }

  if (notice.offer.photos.length) {
    for (var j = 0; j < notice.offer.photos.length; j++) {
      var photo = document.createElement('img');
      photo.classList.add('popup__photo');
      photo.width = PHOTO_WIDTH;
      photo.height = PHOTO_HEIGHT;
      photo.alt = 'Фотография жилья';
      photo.src = notice.offer.photos[j];
      photosNode.appendChild(photo);
    }
  } else {
    photosNode.classList.add('hidden');
  }
};

var renderNoticeCard = function (notice) {
  var noticeCardElement;
  if (cardPopup) {
    noticeCardElement = cardPopup;
  } else {
    noticeCardElement = noticeCardTemplate.cloneNode(true);
  }

  noticeCardElement.querySelector('.popup__title').textContent = notice.offer.title;
  noticeCardElement.querySelector('.popup__text--address').textContent = notice.offer.address;
  noticeCardElement.querySelector('.popup__text--price').textContent = notice.offer.price + ' ₽/ночь';
  noticeCardElement.querySelector('.popup__type').textContent = convertType(notice.offer.type);
  noticeCardElement.querySelector('.popup__text--capacity').textContent = notice.offer.rooms + ' комнаты для ' + notice.offer.guests + ' гостей';
  noticeCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
  fillFeaturesList(notice, noticeCardElement);
  noticeCardElement.querySelector('.popup__description').textContent = notice.offer.description;
  fillPhotos(notice, noticeCardElement);
  noticeCardElement.querySelector('.popup__avatar').src = notice.author.avatar;

  return noticeCardElement;
};

var findNotice = function (location) {
  for (var i = 0; i < notices.length; i++) {
    var notice = notices[i];
    if (notice.location.x === location.x && notice.location.y === location.y) {
      return notice;
    }
  }
  return null;
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

  if (isAllowedPin) {
    fillPopup(findNotice(targetLocation));
    onPopupOpen();
  }
};

mapPins.addEventListener('keydown', function (evt) {
  if (evt.key === ENTER_KEY) {
    onMapPinClickEnter(evt);
  }
}, true);

mapPins.addEventListener('click', function (evt) {
  onMapPinClickEnter(evt);
}, true);

var onPopupOpen = function () {
  cardPopup.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var onPopupEscPress = function (evt) {
  if (evt.key === ESC_KEY) {
    onPopupClose();
  }
};

var onPopupClose = function () {
  cardPopup.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

var initPopupEvents = function (popup) {
  var popupCloseBtn = popup.querySelector('.popup__close');
  document.addEventListener('keydown', onPopupEscPress);
  popupCloseBtn.addEventListener('click', onPopupClose);

  popupCloseBtn.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER_KEY) {
      onPopupClose();
    }
  });

  popupCloseBtn.addEventListener('click', function () {
    onPopupClose();
  });
};

var fillPopup = function (notice) {
  if (!notice) {
    return;
  }
  var map = document.querySelector('.map');

  if (!map.querySelector('.map__card')) {
    var cardFragment = document.createDocumentFragment();
    cardFragment.appendChild(renderNoticeCard(notice));
    map.insertBefore(cardFragment, document.querySelector('.map__filters-container'));
    cardPopup = map.querySelector('.map__card');
    initPopupEvents(cardPopup);
  } else {
    renderNoticeCard(notice);
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

mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === LEFT_BUTTON && !isPageActivated) {
    isPageActivated = true;
    togglePageState(isPageActivated);
    fillDefaultAddress(isPageActivated);
  }
});
mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter' && !isPageActivated) {
    isPageActivated = true;
    togglePageState(isPageActivated);
    fillDefaultAddress(isPageActivated);
  }
});

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

generateNotices();
applyNotices();
togglePageState(isPageActivated);
fillDefaultAddress(isPageActivated);
