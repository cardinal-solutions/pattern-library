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

  $.cardinal.fileupload = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;

    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.fileupload", base);

    base.init = function(){
      base.options = $.extend({},$.cardinal.fileupload.defaultOptions, options);

      // --------------------------------------------------------
      // Set up variables
      // --------------------------------------------------------
      var fileInput       = base.$element,
          customInput     = fileInput.next(),
          filename        = '';

      fileInput.on({
        change: function() {
          filename = fileInput.val().split('\\').pop();
          customInput.val(filename);
          // console.log(filename);
          // console.log('change');
        },
        focus: function() {
          customInput.attr('data-focus', 'true');
          // console.log('focus');
        },
        blur: function() {
          customInput.attr('data-focus', 'false');
          // console.log('blur');
        },
        mouseenter: function() {
          customInput.attr('data-hover', 'true');
          // console.log('hover');
        },
        mouseout: function() {
          customInput.attr('data-hover', 'false');
        }
      });
    }
    // Sample Function, Uncomment to use
    // base.functionName = function(paramaters){
    //
    // };

    // Run initializer
    base.init();
  };

  $.cardinal.fileupload.defaultOptions = {
  };

  $.fn.cardinal_fileupload = function(options){
    return this.each(function(){
      (new $.cardinal.fileupload(this, options));
    });
  };
})(jQuery);
