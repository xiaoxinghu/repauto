ready = ->
  $('div[data-load]').filter(':visible').each ->
    path = $(this).attr('data-load')
    $.get(path)
    #$(this).load path
    return
  # $.fn.bootstrapSwitch.defaults.size = 'mini'
  #
  # $('.switch').bootstrapSwitch()
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
