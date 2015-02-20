(function ($) {
  $.fn.accessibleOptions = function () {
    return this.each(function () { 
      
      var input     = $(this);
      var inputType = input.attr('type');
      var label     = $('label[for=' + '"' + input.attr('id') + '"' + ']');

      // Add a hover on the labels so we can apply
      // a visual style (the same style will be used
      // when the native input or label have focus)
      label.hover(function(){
        input.next().addClass('hover'); 
      }, function(){
        input.next().removeClass('hover');
      });

      // checks to see if the input is checked by
      // default then adds the appropriate class 
      // to the custom label
      if (input.is(':checked')){
        input.next().addClass('checked');    
      }

      // 1. Bind the inputs to a custom event to 
      //    the inputs will update themselves
      //    if clicked, via javascript or through
      //    keyboard navigation
      // 2. Trigger the event
      // 3. Update the input via click event
      // 4. Update the input when either have focus
      // 5. Update the input when focus is lost
      input.bind('change', function(){   
        input.is(':checked') ? input.next().addClass('checked').attr("checked", true) : input.next().removeClass('checked').attr("checked", false); 
      })
      .click(function(){ 
        $('input[name='+ input.attr('name') +']').trigger('change'); 
      })
      .focus(function(){ 
        input.next().addClass('focus'); 
        if(input.is(':checked')){  
          input.next().addClass('focus'); 
        } 
      })
      .blur(function(){ 
        input.next().removeClass('focus'); 
      });
    });
  };
})(jQuery);