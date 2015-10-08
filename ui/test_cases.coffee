# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$(document).delegate '*[data-toggle="lightbox"]', 'click', (event) ->
  event.preventDefault()
  $(this).ekkoLightbox()
  return

$(document).on 'click', '#commentSubmit', ->
  $('#commentForm').submit()
  return

test_case_ready = ->
  $('#commentForm').validator().on 'submit', (e) ->
    if e.isDefaultPrevented()
      return false
    return

  $('#commenting').on 'hidden.bs.modal', (e) ->
    $('#commentForm')[0].reset()
    return
$(document).on 'page:change', test_case_ready
