//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require bootstrap-sprockets
//= require d3
//= require "tipsy/src/javascripts/jquery.tipsy"
//= require jstzdetect
//= require moment
//= require "dimple/dist/dimple.v2.1.2.min"
//= require "ladda-bootstrap/dist/spin.min"
//= require "ladda-bootstrap/dist/ladda.min"
//= require bootstrap-multiselect
//= require bootstrap-treeview
//= require fuelux
//= require_tree .


@PageSpinner =
spin: (ms=50)->
  @spinner = setTimeout( (=> @add_spinner()), ms)
  $(document).on 'page:change', =>
    @remove_spinner()
  spinner_html: '
  <div class="modal hide fade" id="page-spinner">
    <div class="modal-head card-title">Please Wait...</div>
      <div class="modal-body card-body">
        <i class="icon-spinner icon-spin icon-2x"></i>
          &emsp;Loading...
      </div>
        </div>
          '
  spinner: null
  add_spinner: ->
    $('body').append(@spinner_html)
    $('body div#page-spinner').modal()
  remove_spinner: ->
    clearTimeout(@spinner)
    $('div#page-spinner').modal('hide')
    $('div#page-spinner').on 'hidden', ->
      $(this).remove()

# ready = ->
  #   $('label.tree-toggler').click ->
    #     $(this).parent().children('ul.tree').toggle 300
#     return
# 	$('nav-tabs').click ->
  #   	PageSpinner.spin()
# 		return
#   return
ready = ->
  $('label.tree-toggler').click ->
    $(this).parent().children('ul.tree').toggle 300

  # $('.btn').click ->
  #   $('#processing').modal 'show'
  # $('.btn').bind 'ajax:beforeSend', ->
  #   $('#processing').modal 'show'
  #   return
  # $('.btn').bind 'ajax:complete', ->
  #   $('#processing').modal 'hide'
  #   return

  # Ladda.bind('.ladda-button')

  $('[data-toggle="tooltip"]').tooltip()
  # $('#tag-list').tags
  #   tagData: [
  #     'boilerplate'
  #     'tags'
  #   ]
  #   suggestions: [
  #     'basic'
  #     'suggestions'
  #   ]
  #   excludeList: [
  #     'not'
  #     'these'
  #     'words'
  #   ]
  $('#tags').multiselect checkboxName: 'tags[]'

  return

$(document).ready ready
#$(document).on 'page:load', ready
$(document).on 'page:change', ready
# $(window).unload ->
#   $('#processing').modal 'hide'
#   alert 'leaving this page'
#   return
#$(document).on('click', 'a[data-remote=true]')
