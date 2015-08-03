# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
  $("a.trend_type").click ->
    $('#dd_types_text').text($(this).text())
    $("#dd_types").dropdown("toggle")
    return
