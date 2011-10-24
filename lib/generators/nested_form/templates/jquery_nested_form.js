// taken from: https://github.com/ryanb/nested_form/issues/45

jQuery(function($) {
  $('form a.add_nested_fields').live('click', function() {
    // Setup
    var assoc   = $(this).attr('data-association');            // Name of child
    var content = $('#' + assoc + '_fields_blueprint').html(); // Fields template

    // Make a unique ID for the new child
    var regexp  = new RegExp('new_' + assoc, 'g');
    var new_id  = new Date().getTime();
    content     = content.replace(regexp, "new_" + new_id);

    $(this).before(content);

    var model_attribute_name, parent_name, new_name;

    // Change name attributes of inserted fields to be correct in deep nesting
    var new_fields = $("[id*='"+new_id+"'][name]");
    new_fields.each( function(index, field) {
      // Name of the attribute (ie: title) which is represented by an input
      model_attribute_name = $(field).attr("name").match(/\[(\w*)\]$/)[0];

      // Name of parent field in the tree (ie: if we're displaying a project's tasks, then the name is related to "project")
      parent_name = $(field).closest(".fields").parents(".fields").find("input").first().attr("name"); 

      // Use parent's field name (in nesting) to generate child field's name
      new_name = parent_name.replace(/\[\w*\]$/, "["+assoc+"_attributes][new_"+new_id+"]"+model_attribute_name); // Correct name

      // Change it in the DOM
      $(field).attr("name",new_name);
    });

    $(this).closest("form").trigger('nested:fieldAdded');
    return false;
  });

  $('form a.remove_nested_fields').live('click', function() {
    var hidden_field = $(this).prev('input[type=hidden]')[0];
    if(hidden_field) {
      hidden_field.value = '1';
    }
    $(this).closest('.fields').hide();
    $(this).closest("form").trigger('nested:fieldRemoved');
    return false;
  });
});
