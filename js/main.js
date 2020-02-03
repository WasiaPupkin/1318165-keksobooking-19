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

var generateAddress = function (locationX, locationY) {
  return locationX + ', ' + locationY;
};

var generateAvatar = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

var generateTitle = function (rooms, type) {
  return rooms + ' rooms ' + type;
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

var removeMapFading = function () {
  document.querySelector('.map').classList.remove('map--faded');
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

var convertType = function (type) {
  switch (type) {
    case 'flat': return 'Квартира';
    case 'bungalo': return 'Бунгало';
    case 'house': return 'Дом';
    case 'palace': return 'Дворец';
    default : return 'нечто';
  }
};

var fillFeaturesList = function (notice, noticeCardElement) {
  var defaultFeaturesNode = noticeCardElement.querySelector('.popup__features');
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
  var defaultPhoto = photosNode.querySelector('.popup__photo');

  photosNode.removeChild(defaultPhoto);

  if (notice.offer.photos.length) {
    for (var i = 0; i < notice.offer.photos.length; i++) {
      var photo = defaultPhoto.cloneNode();
      photo.src = notice.offer.photos[i];
      photosNode.appendChild(photo);
    }
  } else {
    photosNode.classList.add('hidden');
  }
};

var renderNoticeCard = function (notice) {
  var noticeCardElement = noticeCardTemplate.cloneNode(true);

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

var fillPopup = function () {
  var cardFragment = document.createDocumentFragment();
  cardFragment.appendChild(renderNoticeCard(notices[0]));
  document.querySelector('.map').insertBefore(cardFragment, document.querySelector('.map__filters-container'));
};

generateNotices();
removeMapFading();
applyNotices();
fillPopup();
