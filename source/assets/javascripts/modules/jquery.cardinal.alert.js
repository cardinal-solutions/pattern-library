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

  $.cardinal.alert = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;

    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.alert", base);

    base.init = function(){
      base.options = $.extend({},$.cardinal.alert.defaultOptions, options);

      // --------------------------------------------------------
      // Set up variables
      // --------------------------------------------------------
      var alertControl     = base.$element,
          alertParent      = alertControl.parent().parent();

      alertControl.on('click', function(event){
        alertParent.slideUp(250);
        event.preventDefault();
      });

    };

    // Sample Function, Uncomment to use
    // base.functionName = function(paramaters){
    //
    // };

    // Run initializer
    base.init();
  };

  $.cardinal.alert.defaultOptions = {

  };

  $.fn.cardinal_alert = function(options){
    return this.each(function(){
      (new $.cardinal.alert(this, options));
    });
  };
})(jQuery);
