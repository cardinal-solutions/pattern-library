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
    
  $.cardinal.collapsible = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;
    
    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.collapsible", base);
    
    base.init = function(){
      base.options = $.extend({},$.cardinal.collapsible.defaultOptions, options);
      
      // --------------------------------------------------------
      // Set up variables
      // -------------------------------------------------------- 
      var collapsibleParent     = base.$element,
          collapsibleAction     = '',
          collapsiblePanel      = '';

      // --------------------------------------------------------
      // Click event on the collapsible-action
      // -------------------------------------------------------- 
      collapsibleParent.children('.collapsible-action').on('click', function(){
        // Assign the action and panel to variables 
        // so we can use them later without having to
        // call $(this) every time.
        collapsibleAction = $(this);
        collapsiblePanel  = collapsibleAction.next();

        // Adds animation if it's set as an option
        if (base.options.animate) {
          // Toggles open/close the panel clicked on
          collapsiblePanel.stop().slideToggle({
            duration: base.options.speed,
            easing:   base.options.easing,
            // Sets the correct data attributes on the action
            // as soon as it's clicked
            start:    function() {
              // If the action clicked is already active close it
              // otherwise hide it and open the action clicked.
              if (collapsibleAction.attr('data-active') == 'true') {
                collapsibleAction.attr('data-active', false);
              } else {
                collapsibleAction.attr('data-active', true);
              }
            },
            // Sets the correct data attributes on the panel
            // when an action is clicked
            complete: function() {
              if (collapsibleAction.attr('data-active') == 'true') {
                collapsiblePanel.attr('data-active', false);
              } else {
                collapsiblePanel.attr('data-active', true);
              }
            }
          });
        } else {
          if (collapsibleAction.attr('data-active') == 'true') {
            collapsibleAction.attr('data-active', false);
            collapsiblePanel.attr('data-active', false);
          } else {
            collapsibleAction.attr('data-active', true);
            collapsiblePanel.attr('data-active', true);
          }
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
  
  $.cardinal.collapsible.defaultOptions = {
    animate: true,
    easing: 'swing',
    speed: 200
  };
  
  $.fn.cardinal_collapsible = function(options){
    return this.each(function(){
      (new $.cardinal.collapsible(this, options));
    });
  };
})(jQuery);