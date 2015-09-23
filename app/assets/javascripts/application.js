//= require include
require('./components/all');

var ready = function() {
  return $('div[data-load]').each(function() {
    var path = $(this).attr('data-load');
    $.get(path);
  });
};

$(document).ready(ready);
$(document).on("page:change", ready);
