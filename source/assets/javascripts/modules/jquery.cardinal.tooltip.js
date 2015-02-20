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
    
  $.cardinal.tooltip = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;
    
    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;
    
    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.tooltip", base);
    
    base.init = function(){
      base.options = $.extend({},$.cardinal.tooltip.defaultOptions, options);
      
      // --------------------------------------------------------
      // Set up variables
      // -------------------------------------------------------- 
      var tooltipParent     = base.$element;


    };
    
    // Sample Function, Uncomment to use
    // base.functionName = function(paramaters){
    // 
    // };
    
    // Run initializer
    base.init();
  };
  
  $.cardinal.tooltip.defaultOptions = {
    animate: true,
    easing: 'swing',
    speed: 200
  };
  
  $.fn.cardinal_tooltip = function(options){
    return this.each(function(){
      (new $.cardinal.tooltip(this, options));
    });
  };
})(jQuery);