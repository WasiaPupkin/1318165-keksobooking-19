'use strict';

window.card = (function () {
  var PHOTO_WIDTH = 45;
  var PHOTO_HEIGHT = 40;
  var cardPopup;
  var noticeCardTemplate = document.querySelector('#card')
    .content
    .querySelector('.map__card');

  var typeDictionary = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var fillFeaturesList = function (notice, noticeCardElement) {
    var defaultFeaturesNode = noticeCardElement.querySelector('.popup__features');
    defaultFeaturesNode.classList.remove('hidden');
    var defaultFeaturesList = defaultFeaturesNode.querySelectorAll('li');
    for (var i = defaultFeaturesList.length - 1; i >= 0; i--) {
      defaultFeaturesNode.removeChild(defaultFeaturesList[i]);
    }

    if (notice.offer.features && notice.offer.features.length) {
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

    if (notice.offer.photos && notice.offer.photos.length) {
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

    var popupTitle = noticeCardElement.querySelector('.popup__title');
    var popupAddress = noticeCardElement.querySelector('.popup__text--address');
    var popupPrice = noticeCardElement.querySelector('.popup__text--price');
    var popupType = noticeCardElement.querySelector('.popup__type');
    var popupCapacity = noticeCardElement.querySelector('.popup__text--capacity');
    var popupTime = noticeCardElement.querySelector('.popup__text--time');
    var popupDescription = noticeCardElement.querySelector('.popup__description');
    var popupAvatar = noticeCardElement.querySelector('.popup__avatar');

    if (notice.offer.title) {
      popupTitle.classList.remove('hidden');
      popupTitle.textContent = notice.offer.title;
    } else {
      popupTitle.textContent = '';
      popupTitle.classList.add('hidden');
    }

    if (notice.offer.address) {
      popupAddress.classList.remove('hidden');
      popupAddress.textContent = notice.offer.address;
    } else {
      popupAddress.textContent = '';
      popupAddress.classList.add('hidden');
    }

    if (notice.offer.price) {
      popupPrice.classList.remove('hidden');
      popupPrice.textContent = notice.offer.price + ' ₽/ночь';
    } else {
      popupPrice.textContent = '';
      popupPrice.classList.add('hidden');
    }

    if (notice.offer.type && typeDictionary[notice.offer.type]) {
      popupType.classList.remove('hidden');
      popupType.textContent = typeDictionary[notice.offer.type];
    } else {
      popupType.textContent = '';
      popupType.classList.add('hidden');
    }

    if (notice.offer.rooms && notice.offer.guests) {
      popupCapacity.classList.remove('hidden');
      popupCapacity.textContent = notice.offer.rooms + ' комнаты для ' + notice.offer.guests + ' гостей';
    } else {
      popupCapacity.textContent = '';
      popupCapacity.classList.add('hidden');
    }

    if (notice.offer.checkin && notice.offer.checkout) {
      popupTime.classList.remove('hidden');
      popupTime.textContent = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
    } else {
      popupTime.textContent = '';
      popupTime.classList.add('hidden');
    }

    fillFeaturesList(notice, noticeCardElement);

    if (notice.offer.description) {
      popupDescription.classList.remove('hidden');
      popupDescription.textContent = notice.offer.description;
    } else {
      popupDescription.textContent = '';
      popupDescription.classList.add('hidden');
    }

    fillPhotos(notice, noticeCardElement);

    if (notice.author && notice.author.avatar) {
      popupAvatar.src = notice.author.avatar;
    } else {
      popupAvatar.src = '';
    }

    return noticeCardElement;
  };

  var findNotice = function (location) {
    var notices = window.mainModule.getNotices();
    for (var i = 0; i < notices.length; i++) {
      var notice = notices[i];
      if (notice.location.x === location.x && notice.location.y === location.y) {
        return notice;
      }
    }
    return null;
  };

  var onPopupOpen = function () {
    if (cardPopup) {
      cardPopup.classList.remove('hidden');
      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  var onPopupEscPress = function (evt) {
    window.util.doEscEvent(evt, onPopupClose);
  };

  var onPopupClose = function () {
    if (cardPopup) {
      cardPopup.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var initPopupEvents = function (popup) {
    var popupCloseBtn = popup.querySelector('.popup__close');
    document.addEventListener('keydown', onPopupEscPress);
    popupCloseBtn.addEventListener('click', onPopupClose);

    popupCloseBtn.addEventListener('keydown', function (evt) {
      window.util.doEnterEvent(evt, onPopupClose);
    });

    popupCloseBtn.addEventListener('click', function () {
      onPopupClose();
    });
  };

  var fillPopup = function (notice) {
    if (!notice) {
      return;
    }
    var map = window.appDefaults.elements.map;

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

  return {
    fillPopup: fillPopup,
    findNotice: findNotice,
    onPopupOpen: onPopupOpen,
    onPopupClose: onPopupClose
  };
})();
