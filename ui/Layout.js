var $, processLayout, resizeView;

$ = require('jquery');

resizeView = function() {
  console.log('resizing...');
  if ($('.full-height').length) {
    return $('.full-height').each(function(index) {
      var height;
      height = $(window).height() - $(this).offset().top;
      return $(this).css('height', height);
    });
  }
};

processLayout = function() {
  $(document).ready(resizeView);
  $(window).resize(resizeView);
  return $(document).on('page:change', resizeView);
};

module.exports = {
  process: processLayout
};
