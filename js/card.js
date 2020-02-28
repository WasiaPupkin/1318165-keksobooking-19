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

    noticeCardElement.querySelector('.popup__title').textContent = notice.offer.title;
    noticeCardElement.querySelector('.popup__text--address').textContent = notice.offer.address;
    noticeCardElement.querySelector('.popup__text--price').textContent = notice.offer.price + ' ₽/ночь';
    noticeCardElement.querySelector('.popup__type').textContent = typeDictionary[notice.offer.type];
    noticeCardElement.querySelector('.popup__text--capacity').textContent = notice.offer.rooms + ' комнаты для ' + notice.offer.guests + ' гостей';
    noticeCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + notice.offer.checkin + ', выезд до ' + notice.offer.checkout;
    fillFeaturesList(notice, noticeCardElement);
    noticeCardElement.querySelector('.popup__description').textContent = notice.offer.description;
    fillPhotos(notice, noticeCardElement);
    noticeCardElement.querySelector('.popup__avatar').src = notice.author.avatar;

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
