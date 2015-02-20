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

  $.cardinal.pagepush = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;

    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.pagepush", base);

    base.init = function(){
      base.options = $.extend({},$.cardinal.pagepush.defaultOptions, options);

      // --------------------------------------------------------
      // Set up variables
      // --------------------------------------------------------
      var pagepushControl     = base.$element,
          controlHash         = "",
          pagepushPanels      = pagepushControl.parent().next();

      pagepushControl.on("click", function(event){
        controlHash = $(this).attr('href');

        if ($(this).attr("data-active") === "true") {
          $(this).attr('data-active', "false");
          $(controlHash).attr('data-active', "false");
          $(this).closest('.page-push').attr('data-active', "false");
        } else {
          // Update the controls
          $(this).siblings().attr('data-active', "false");
          $(this).attr('data-active', "true");

          // Update the panels
          pagepushPanels.children().attr('data-active', "false");
          $(controlHash).attr('data-active', "true");
          $(this).closest('.page-push').attr('data-active', "true");
        }

        // to-do
        // - Break then show/hide/state into their own function
        // - Add options for animations for the panels and the controls
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

  $.cardinal.pagepush.defaultOptions = {

  };

  $.fn.cardinal_pagepush = function(options){
    return this.each(function(){
      (new $.cardinal.pagepush(this, options));
    });
  };
})(jQuery);
