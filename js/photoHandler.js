'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var userAvatarInput = document.querySelector('#avatar');
  var userAvatarPreview = document.querySelector('.ad-form-header__preview').firstElementChild; //img
  var noticeImageInput = document.querySelector('#images');
  var noticeImagePreview =document.querySelector('.ad-form__photo'); //div

  var addFile = function(inputSource, imgDest){
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

  userAvatarInput.addEventListener('change', function () {
    addFile(userAvatarInput, userAvatarPreview);
  });

  noticeImageInput.addEventListener('change', function () {
    var img = document.createElement('img');
    img.width = noticeImagePreview.offsetWidth;
    img.height = noticeImagePreview.offsetHeight;
    noticeImagePreview.append(img);
    addFile(noticeImageInput, img);
  });

})();
