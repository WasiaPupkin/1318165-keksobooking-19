'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var addFile = function (inputSource, imgDest) {
    var file = inputSource.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgDest.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  window.appDefaults.elements.userAvatarInput.addEventListener('change', function () {
    addFile(window.appDefaults.elements.userAvatarInput, window.appDefaults.elements.userAvatarPreview);
  });

  window.appDefaults.elements.noticeImageInput.addEventListener('change', function () {
    var img = document.createElement('img');
    img.width = window.appDefaults.elements.noticeImagePreview.offsetWidth;
    img.height = window.appDefaults.elements.noticeImagePreview.offsetHeight;
    window.appDefaults.elements.noticeImagePreview.append(img);
    addFile(window.appDefaults.elements.noticeImageInput, img);
  });

})();
