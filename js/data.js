'use strict';

window.data = (function () {
  var REALTY_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var REALTY_ROOM_NUMS = [1, 2, 3, 4, 5, 6, 7, 8];
  var CHECKIN_TIMES = ['12:00', '13:00', '14:00'];
  var REALTY_FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var REALTY_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var notices = [];
  var NOTICES_NUM = 8;
  var MAX_PRICE = 20500;
  var LOCATIONY_CONSTRAINTS = {
    min: 130,
    max: 630
  };

  var getArrayRandomElement = function (array) {
    return array[getRandomNum(array.length)];
  };

  var getArrayRandomSlice = function (array) {
    return array.slice(getRandomNum(array.length), getRandomNum(array.length));
  };

  var generateAddress = function (locationX, locationY) {
    return locationX + ', ' + locationY;
  };

  var generateAvatar = function (number) {
    return 'img/avatars/user0' + number + '.png';
  };

  var generateTitle = function (rooms_, type_) {
    return rooms_ + ' rooms ' + type_;
  };

  var generateDescriptions = function (tmpOffer) {
    return tmpOffer.rooms + ' rooms ' + tmpOffer.type + ' with ' + tmpOffer.guests + ' guests places. Also we offer some features: ' + tmpOffer.features;
  };

  var getRandomNum = function (min, max) {
    if (min && max) {
      return Math.floor(Math.random() * (max - min) + min);
    } else if (min) {
      return Math.floor(Math.random() * min);
    }
    return Math.floor(Math.random());
  };

  var generateNotices = function () {
    for (var i = 1; i <= NOTICES_NUM; i++) {
      var locationX = getRandomNum(document.querySelector('.map__pins').offsetWidth);
      var locationY = getRandomNum(LOCATIONY_CONSTRAINTS.min, LOCATIONY_CONSTRAINTS.max);

      var tmpOffer = {
        type: getArrayRandomElement(REALTY_TYPES),
        rooms: getArrayRandomElement(REALTY_ROOM_NUMS),
        guests: getArrayRandomElement(REALTY_ROOM_NUMS),
        checkin: getArrayRandomElement(CHECKIN_TIMES),
        checkout: getArrayRandomElement(CHECKIN_TIMES),
        price: getRandomNum(MAX_PRICE),
        features: getArrayRandomSlice(REALTY_FEATURES)
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
          photos: getArrayRandomSlice(REALTY_PHOTOS)
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
    generateNotices: generateNotices,
    LOCATIONY_CONSTRAINTS: LOCATIONY_CONSTRAINTS
  };
})();
