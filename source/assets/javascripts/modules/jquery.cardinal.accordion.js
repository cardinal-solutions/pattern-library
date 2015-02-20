// the semi-colon before the function invocation is a safety 
// net against concatenated scripts and/or other plugins 
// that are not closed properly.
// window and document are passed through as local 
// variables rather than as globals, because this (slightly) 
// quickens the resolution process and can be more 
// efficiently minified (especially when both are 
// regularly referenced in your plugin).
;(function ( $, window, document, undefined ) {
  if(!$.cardinal){
    $.cardinal = new Object();
  };
    
  $.cardinal.accordion = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;
    
    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.accordion", base);
    
    base.init = function(){
      base.options = $.extend({},$.cardinal.accordion.defaultOptions, options);
      
      // --------------------------------------------------------
      // Set up variables
      // -------------------------------------------------------- 
      var accordionParent     = base.$element,
          accordionAction     = '',
          accordionPanel      = '';

      // --------------------------------------------------------
      // Click event on the accordion-action
      // -------------------------------------------------------- 
      accordionParent.children('.accordion-action').on('click', function(){
        // Assign the action and panel to variables 
        // so we can use them later without having to
        // call $(this) every time.
        accordionAction = $(this);
        accordionPanel  = accordionAction.next();

        // Adds animation if it's set as an option
        if (base.options.animate) {
          // Close all panels before opening the action clicked on
          accordionParent.children('.accordion-panel').stop().slideUp(base.options.speed);
          // Toggles open/close the panel clicked on
          accordionPanel.stop().slideToggle({
            duration: base.options.speed,
            easing:   base.options.easing,
            // Sets the correct data attributes on the action
            // as soon as it's clicked
            start:    function() {
              // If the action clicked is already active close it
              // otherwise hide it and open the action clicked.
              if (accordionAction.attr('data-active') == 'true') {
                accordionAction.attr('data-active', false);
              } else {
                accordionParent.children('.accordion-action').attr('data-active', false);
                accordionAction.attr('data-active', true);
              }
            },
            // Sets the correct data attributes on the panel
            // when an action is clicked
            complete: function() {
              accordionParent.children('.accordion-panel').attr('data-active', false);
              accordionPanel.attr('data-active', true);
            }
          });
        } else {
          accordionParent.children().attr('data-active', false);
          accordionAction.attr('data-active', true);
          accordionPanel.attr('data-active', true);
        }
      });
    };
    
    // Sample Function, Uncomment to use
    // base.functionName = function(paramaters){
    // 
    // };
    
    // Run initializer
    base.init();
  };
  
  $.cardinal.accordion.defaultOptions = {
    animate: true,
    easing: 'swing',
    speed: 200
  };
  
  $.fn.cardinal_accordion = function(options){
    return this.each(function(){
      (new $.cardinal.accordion(this, options));
    });
  };
})(jQuery);