'use strict';

window.data = (function () {
  var REALTY_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var REALTY_ROOM_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var REALTY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var REALTY_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var MIN_LOCATIONY = 130;
  var MAX_LOCATIONY = 630;
  var notices = [];
  var NOTICES_NUM = 8;
  var MAX_PRICE = 20500;

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
    return notices;
  };

  return {
    generateNotices: generateNotices
  };
})();
