# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

projectPageReady = ->
  return if !$('#summary-view').length
  # $("a.trend_type").click ->
  #   $('#dd_types_text').text($(this).text())
  #   $("#dd_types").dropdown("toggle")
  #   return

$(document).ready projectPageReady
$(document).on 'page:load', projectPageReady
#$(document).on 'page:change', projectPageReady
