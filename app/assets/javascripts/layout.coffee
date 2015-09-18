resizeView = ->
  if $('.full-height').length
    $('.full-height').each (index) ->
      height = $(window).height() - $(this).offset().top
      $(this).css('height', height)

$(document).ready resizeView
$(window).resize resizeView
$(document).on 'page:change', resizeView
