'use strict';

var notices = [];

var generateAvatar = function (number) {
  return 'img/avatars/user' + number + '.png';
};

var generateTitle = function () {

};

var generateAddress = function () {

};

var generateNotices = function () {
  for (var i = 1; i <= 8; i++) {
    notices.push({
      author: {
        avatar: generateAvatar(i)
      },
      offer: {
        title: generateTitle(),
        address: generateAddress(),
        price:,
        type:,
        rooms:,
        guests:,
        checkin:,
        checkout:,
        features:,
        description:,
        photos:
      },
      location: {
        x:,
        y:
      },
    });
  }
};
