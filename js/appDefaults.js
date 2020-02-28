'use strict';

window.appDefaults = (function () {
  var map = document.querySelector('.map');
  var mapFilters = document.querySelector('.map__filters');
  var mapFilterSelects = mapFilters.querySelectorAll('.map__filter');
  var mapFilterFieldSet = mapFilters.querySelector('.map__features');
  var noticeForm = document.querySelector('.ad-form');
  var noticeFieldSets = noticeForm.querySelectorAll('fieldset');
  var userAvatarPreview = document.querySelector('.ad-form-header__preview').firstElementChild;

  var Constants = {
    MAX_NOTICES_ON_PAGE: 5,
    START_ARRAY_INDEX: 0
  };

  var elements = {
    map: map,
    mapFilters: mapFilters,
    mapFilterSelects: mapFilterSelects,
    mapFilterFieldSet: mapFilterFieldSet,
    noticeForm: noticeForm,
    noticeFieldSets: noticeFieldSets,
    userAvatarInput: document.querySelector('#avatar'),
    userAvatarPreview: userAvatarPreview,
    userAvatarPreviewDefaultSrc: userAvatarPreview.src,
    noticeImageInput: document.querySelector('#images'),
    noticeImagePreview: document.querySelector('.ad-form__photo')
  };

  return {
    elements: elements,
    Constants: Constants
  };

})();
