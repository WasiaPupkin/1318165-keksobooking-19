'use strict';

window.data = (function () {
  var LOCATIONY_CONSTRAINTS = {
    min: 130,
    max: 630
  };
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_URL = 'https://js.dump.academy/keksobooking';
  var StatusCode = {
    OK: 200
  };
  var TIMEOUT_IN_MS = 10000;

  var _createXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT_IN_MS;

    return xhr;
  };

  var _loadNotices = function (onLoad, onError) {
    var xhr = _createXHR(onLoad, onError);

    xhr.open('GET', GET_URL);
    xhr.send();
  };

  var _saveNotice = function (data, onLoad, onError) {
    var xhr = _createXHR(onLoad, onError);
    xhr.requestType = 'multipart/form-data';

    xhr.open('POST', SAVE_URL);
    xhr.send(data);
  };

  return {
    loadNotices: _loadNotices,
    saveNotice: _saveNotice,
    LOCATIONY_CONSTRAINTS: LOCATIONY_CONSTRAINTS
  };
})();
