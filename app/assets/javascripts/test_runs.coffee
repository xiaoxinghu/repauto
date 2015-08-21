# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

resizeView = ->
  if $('#main-view').length
    nh = $(window).height() - $('nav').height() - $('#header').height() - $('#header').outerHeight()
    $('#main-view').css('height', nh)
  if $('#testRunsTable').length
    th = $(window).height() - $('nav').height() - $('.pagination').height() - $('.pagination').outerHeight() - $('#testRunsTable .header').height() - $('#testRunsTable .header').outerHeight() - 20
    $('#testRunsTable .content').css('height', th)

test_run_ready = ->
  # generate the treeview
  return if !$('#testRunsTable').length
  # $('.test-run-selector').on 'switchChange.bootstrapSwitch', (event, state) ->
  $('.test-run-selector').change ->
    # console.log state
    console.log @checked
    # selected = $('.bootstrap-switch-on')
    selected = $('.test-run-selector:checked')
    selected_count = selected.length
    $('#globalToolbar>.message').text(selected_count + ' selected')
    switch selected_count
      when 2
        $('#globalToolbar').show()
        $('.show-only-with-2').show()
        id = $(selected[0]).closest('.test-run-row').data('id')
        baseline = $(selected[1]).closest('.test-run-row').data('id')
        $('#id').val(id)
        $('#baseline').val(baseline)
      when 0
        $('#globalToolbar').hide()
      else
        $('.show-only-with-2').hide()
        $('#globalToolbar').show()
  # $('#by-errors').on 'click', (event, data) ->
  #   $.ajax
  #     url: '/fetch_tree'
  #     type: 'GET'
  #     data: {id: $('#main-view').data('test-run-id'), group_by: 'errors'}
  # $('#by-features').on 'click', (event, data) ->
  #   $.ajax
  #     url: '/fetch_tree'
  #     type: 'GET'
  #     data: {id: $('#main-view').data('test-run-id'), group_by: 'features'}
  # $.ajax
  #   url: '/fetch_tree'
  #   type: 'GET'
  #   data: {id: $('#main-view').data('test-run-id')}

  # $('.test-run-row').click (e) ->
  #   if $(e.target).is('button')
  #     e.preventDefault()
  #     return
  #   if $(this).hasClass('selected')
  #     $(this).removeClass('selected bg-primary')
  #   else
  #     $(this).addClass('selected bg-primary')
  #
  #   # console.log $('.selected').length
  #   selected = $('.selected')
  #   count = selected.length
  #   $('#globalToolbar>.message').text(count + ' selected')
  #   switch count
  #     when 2
  #       $('#globalToolbar').show()
  #       $('.show-only-with-2').show()
  #       $('#id').val($(selected[0]).data('id'))
  #       $('#baseline').val($(selected[1]).data('id'))
  #     when 0
  #       $('#globalToolbar').hide()
  #     else
  #       $('.show-only-with-2').hide()
  #       $('#globalToolbar').show()

    # if $('.selected').length > 0
    #   $('#globalToolbar').css('visibility', 'visible')
    # else
    #   $('#globalToolbar').css('visibility', 'hidden')
    # $(this).addClass('active')

  $('#delete-button').click (e) ->
    # selected_rows = $('.test-run-row.selected')
    selected = $('.test-run-selector:checked')
    # ids = []
    # selected_rows.each ->
    #   ids.push $(this).data('id')
    selected.each ->
      row = $(this).closest('.test-run-row')
      $.ajax
        url: '/test_runs/' + row.data('id') + '/archive'
        type: 'GET'
        success: ->
          row.css("background-color", "#FF3700")
          row.fadeOut 400, ->
            row.remove()
          return
    $('#globalToolbar').hide()

  $('#clear-button').click (e) ->
    $('input.test-run-selector').prop('checked', false)
    $('#globalToolbar').hide()

# $(document).ready test_run_ready
$(document).on 'page:change', test_run_ready
# $(document).on 'page:change', test_run_ready
#$(document).on 'page:change', getTree

$(document).ready resizeView
$(window).resize resizeView
$(document).on 'page:change', resizeView

# $(document).on 'click', '.delete-button', ->
#   $(this).parent().next().toggle()
#   return
#
# $(document).on 'click', '.confirm button', ->
#   $(this).parent().hide()
#   return

$(document).on 'ajax:success', '.mini-toolbar .delete', ->
  tr = $(this).closest('.test-run-row')
  tr.css("background-color", "#FF3700")
  tr.fadeOut 400, ->
    tr.remove()
  return

$(document).on 'ajax:success', '.restore', ->
  tr = $(this).closest('.test-run-row')
  tr.css("background-color", "#FF3700")
  tr.fadeOut 400, ->
    tr.remove()
  return

$(document).on 'change', '#filterByType', ->
  selected = $(this).find("option:selected").val()
  if selected == 'All Types'
    $(".test-run-row").show()
  else
    $(".test-run-row[data-type='" + selected + "']").show()
    $(".test-run-row[data-type!='" + selected + "']").hide()
