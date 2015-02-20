// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
// window and document are passed through as local
// variables rather than as globals, because this (slightly)
// quickens the resolution process and can be more
// efficiently minified (especially when both are
// regularly referenced in your plugin).
;(function ( $, window, undefined ){
  if(!$.cardinal){
    $.cardinal = new Object();
  };

  $.cardinal.select = function(element, options){
    // To avoid scope issues, use 'base' instead of 'this'
    // to reference this class from internal events and functions.
    var base = this;

    // Access to jQuery and DOM versions of element
    base.$element = $(element);
    base.element = element;

    // Add a reverse reference to the DOM object
    base.$element.data("cardinal.select", base);

    base.init = function(){
      base.options = $.extend({},$.cardinal.select.defaultOptions, options);

      // --------------------------------------------------------
      // Set up variables
      // --------------------------------------------------------
      var originalSelect          = base.$element,
          originalSelectedOption  = originalSelect.children('option:selected').index();

      // Find the correct select and assign them to variables so
      // we can cache and select them later on
      var customSelect            = originalSelect.next(),
          customSelectOptions     = customSelect.children('.custom-select-list'),
          customSelectText        = customSelect.children('.custom-select-text'),
          customSelectType        = base.options.type,
          customSelectFilter      = customSelect.children('.custom-select-filter'),
          currentOption           = "",
          totalIndex              = customSelectOptions.children().length,
          currentIndex            = "";

      // Placeholder
      var customPlaceholder       = customSelectText.data("placeholder");

      // Key Codes
      var escapeKey               = 27,
          spaceKey                = 32,
          enterKey                = 13,
          upArrowKey              = 38,
          downArrowKey            = 40,
          deleteKey               = 46,
          backspaceKey            = 8;
          tabKey                  = 9;

      // --------------------------------------------------------
      // Set Placeholder Text on Init
      // --------------------------------------------------------
      // base.setPlaceholderText(customPlaceholder, customSelectOptions, originalSelectedOption, customSelectText, originalSelect);

      // --------------------------------------------------------
      // Type data-attr
      // Set the correct type as a data attribute on the
      // custom select
      // --------------------------------------------------------
      customSelect.attr('data-type', customSelectType);

      // --------------------------------------------------------
      // Clear Action Setup
      // Adds an 'x' icon to clear the on click
      //
      // Wrapped this in some basic logic. In the cardinal env
      // it looks like when an item is selected it in-inits
      // the custom select without refreshing the page and
      // adds another clear button
      // --------------------------------------------------------
      if (base.options.clearAction === true && customSelect.children('.custom-select-clear').length < 1) {
        $('<div class="custom-select-clear icon-x">&nbsp</div>').insertAfter(customSelectText);
        customSelect.children('.custom-select-clear').on({
          click: function(event) {
            base.clearSelect(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder);
          }
        });
      }

      // --------------------------------------------------------
      // Open the select
      //
      // - Click, spacebar, up and down keys open the select
      // - If the select has focus, the delete/backspace keys
      //   will clear out the select
      // --------------------------------------------------------
      customSelect.on({
        click: function(event) {
          base.closeAllOpenSelects();
          base.openList(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectFilter);
        },
        focus: function() {
          customSelectOptions.attr("data-focus", true);
        },
        blur: function() {
          customSelectOptions.attr("data-focus", false);
        },
        keydown: function(event) {
          switch(event.keyCode) {
            case spaceKey:
              base.openList(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectFilter);
              event.preventDefault();
            break;
            case upArrowKey:
              if (customSelect.data('open') == true) {
                base.closeList(event, customSelect, customSelectOptions);
              } else {
                base.openList(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectFilter);
              }
              event.preventDefault();
            break;
            case downArrowKey:
              base.openList(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectFilter);
              event.preventDefault();
            break;
            case deleteKey:
            case backspaceKey:
              base.clearSelect(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder, customSelectFilter);
            break;
            case tabKey:
              base.closeList(event, customSelect, customSelectOptions);
            break;
          }
        }
      });

      // --------------------------------------------------------
      // Navigation in the select list
      //
      // You can navigate the select with the arrow keys. The
      // enter/return or spacebar or click events will choose
      // the item in the list.
      // --------------------------------------------------------
      customSelectOptions.children().each(function() {
        var thisOption = $(this);

        thisOption.on({
          click: function(event) {
            if (thisOption.data('disabled') != true) {
              base.chooseOption(event, thisOption, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder, customSelectFilter);
            }
          },
          mouseenter: function(event) {
            customSelectOptions.children().attr("data-focus", false);

            switch(base.options.type) {
              case "basic":
                thisOption.attr("data-focus", true);
              break;

              case "typeahead":
                thisOption.attr("data-focus", true).focus();
              break;
            }
          },
          mouseout: function(event) {
            customSelectOptions.children().attr("data-focus", false);
            event.stopPropagation();
          },
          keydown: function(event) {
            switch(event.keyCode) {
              case escapeKey:
                base.closeList(event, customSelect, customSelectOptions);
                event.preventDefault();
              break;
              case downArrowKey:
                base.moveDown(event, currentOption, totalIndex, customSelectOptions, customSelectFilter);
              break;
              case upArrowKey:
                base.moveUp(event, currentOption, totalIndex, customSelectOptions, customSelect, customSelectFilter);
              break;
              case spaceKey:
              case enterKey:
                base.chooseOption(event, thisOption, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder, customSelectFilter);
              break;
            }
          }
        });
      });

      // --------------------------------------------------------
      // Filter
      // Typeahead filter that displays items in the select
      // options list according to what types in the text box
      // --------------------------------------------------------
      if (base.options.type == "typeahead") {
        customSelect.attr("data-open", "false");

        customSelectFilter.listfilter(customSelectOptions);

        customSelectFilter.on({
          change: function(event) {
            // Add a filtered attr on the input
            // in order to run some logic later with
            // the up/down keyboard controls
            if (customSelectFilter.val() > 0) {
              customSelectFilter.attr('data-filtered', 'true');
            } else {
              customSelectFilter.attr('data-filtered', 'false');
            }
            // Set the focus to the first filtered item
            customSelectOptions.children().attr('data-focus', 'false');
            customSelectOptions.children().not("[data-filtered='true']").first().attr('data-focus', 'true');
          },

          keydown: function(event) {
            switch(event.keyCode) {
              // Select the 2nd child (after the placeholder)
              case downArrowKey:
                base.moveDown(event, currentOption, totalIndex, customSelectOptions, customSelectFilter);
              break;
              case upArrowKey:
                base.moveUp(event, currentOption, totalIndex, customSelectOptions, customSelectFilter);
              break;
              case escapeKey:
                base.closeList(event, customSelect, customSelectOptions);
                event.preventDefault();
              break;
              case spaceKey:
                event.stopPropagation();
              break;
              case enterKey:
                base.chooseOption(event, currentOption, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder, customSelectFilter);
                event.preventDefault();
              break;
              case deleteKey:
              case backspaceKey:
                event.stopPropagation();
              break;
            }
          }
        });
      }

      // --------------------------------------------------------
      // Map the original select back to the custom select
      // if it changes. If you change the native select
      // pragmatically you just need to trigger a change event
      // --------------------------------------------------------
      originalSelect.on({
        change: function(index) {
          customSelectText.text($(this).children('option:selected').text()); // Change the customSelect text
          customSelectOptions.children().attr("data-selected", false);
          customSelectOptions.children().eq($(this).children('option:selected').index()).attr("data-selected", true);
        }
      });

      // --------------------------------------------------------
      // Close the custom select if you click anywhere
      // else on the screen
      // --------------------------------------------------------
      $(document).on("click", function(){
        base.closeAllOpenSelects();
      });
    }; // End init();


    // --------------------------------------------------------
    // Set Placeholder Text
    //
    // Set the option in the custom select to whichever
    // is currently selected and change the custom option text
    // or set the custom placeholder text from the data attr.
    // --------------------------------------------------------
    base.setPlaceholderText = function(customPlaceholder, customSelectOptions, originalSelectedOption, customSelectText, originalSelect) {
      if (customPlaceholder == undefined) {
        // Set the custom select text to either the option that's selected on load
        customSelectOptions.children().eq(originalSelectedOption).attr('data-selected', true);
        customSelectText.text(originalSelect.children('option:selected').text());
      } else {
        // Set the custom select to the placeholder
        customSelectText.text(customPlaceholder);
        // Clear the selected value of the
        originalSelect.val('').prop('selectedIndex', -1);
      }
    }; // End setPlaceholderText();

    // --------------------------------------------------------
    // Open select list
    // --------------------------------------------------------
    base.openList = function(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectFilter) {
      // Create an offset of the select options to get the top position
      // We'll use this below to determine the offset of it's parent
      // and reposition the position of the list based on which option
      // is selected. This more closely mimics native select functionality
      var offsetListCoordinate = "";

      // Prevents opening a select if it's disabled
      if (customSelect.data('disabled') === false || customSelect.data('disabled') === undefined) {
        switch(base.options.type) {
          case "basic":
            // Open the select and set the focus
            customSelect.attr("data-open", true);
            customSelectOptions.attr("data-focus", true);

            // Takes into account that the first li is a for the placeholders.
            // Sets focus to the first item in the select list to trigger the
            // correct keyboard controls.
            if (customSelectOptions.children('[data-selected="true"]').length == 0) {
              customSelectOptions.children().eq(1).attr("data-focus", true).focus();
              offsetListCoordinate = customSelectOptions.children().eq(1).position().top + 1; // +1 for parents border

            // Looks through the children li's for the one that's selected and
            // sets focus. This allows the up/down keyboard controls to start
            // from the currently selected li.
            } else {
              customSelectOptions.children().attr('data-focus', false);
              customSelectOptions.find('[data-selected="true"]').attr("data-focus", true).focus();
              offsetListCoordinate = customSelectOptions.find('[data-selected="true"]').position().top + 1; // +1 for parents border
            }
          break;

          case "typeahead":
            // Toggle the select
            if (customSelect.attr('data-open') === 'true') {
              customSelect.attr("data-open", 'false');
              customSelectOptions.attr("data-focus", 'false');
            } else {
              customSelect.attr("data-open", 'true');
              customSelectOptions.attr("data-focus", 'true');
            }

            // This is causing the above toggle and click events
            // on the typeahead select not to work.
            customSelectFilter.focus();

            // Clear the text input when opened
            customSelectFilter.val("");

            // Takes into account that the first li is a for the placeholders.
            // Sets focus to the first item in the select list to trigger the
            // correct keyboard controls.
            if (customSelectOptions.children('[data-selected="true"]').length == 0) {
              customSelectOptions.children().eq(1).attr("data-focus", true);
              offsetListCoordinate = customSelectOptions.children().eq(1).position().top + 1; // +1 for parents border

            // Looks through the children li's for the one that's selected and
            // sets focus. This allows the up/down keyboard controls to start
            // from the currently selected li.
            } else {
              customSelectOptions.children().attr('data-focus', false);
              customSelectOptions.find('[data-selected="true"]').attr("data-focus", true);
              offsetListCoordinate = customSelectOptions.find('[data-selected="true"]').position().top + 1; // +1 for parents border
            }
          break;
        }
      };
      event.stopPropagation();
      event.preventDefault();
    }; // End openList();

    // --------------------------------------------------------
    // Move down the list
    // --------------------------------------------------------
    base.moveDown = function(event, currentOption, totalIndex, customSelectOptions, customSelectFilter) {
      switch(base.options.type) {
        case "basic":
          // Set the currently selected option to a variable to
          // we can run some logic based on it's index
          currentOption = customSelectOptions.find('[data-focus="true"]');

          // 1. Find the current option and remove focus
          // 2. Go to the next option and set focus
          // 3. if statement prevents moving past the last option
          if (currentOption.index() < (totalIndex - 1)) {
            customSelectOptions
              .find('[data-focus="true"]')
              .attr("data-focus", false)
              .nextAll(':not("[data-disabled=true]")') // Skips the next option if it's disabled
              .first()
              .attr("data-focus", true);
          }
        break;
        case "typeahead":
          // Set the current option to the first result that's not:
          // - the placeholder
          // - and the first item in the list that hasn't been filtered
          currentOption = customSelectOptions.find('[data-focus="true"][data-filtered!="true"]')

          // 1. Find the current option and remove focus
          // 2. Go to the next option that is visible and set focus
          // 3. if statement prevents moving past the last option
          if (currentOption.index() < (totalIndex - 1) && currentOption.index() > -1) {
            customSelectOptions.find('[data-focus="true"]').attr("data-focus", false).nextAll(':not("[data-filtered=true]")').first().attr("data-focus", true);
          }
        break;
      }

      event.preventDefault();
      event.stopPropagation();
    }; // End moveDown();

    // --------------------------------------------------------
    // Move up the list
    // --------------------------------------------------------
    base.moveUp = function(event, currentOption, totalIndex, customSelectOptions, customSelect, customSelectFilter) {
      switch(base.options.type) {
        case "basic":
          // Set the currently selected option to a variable to
          // we can run some logic based on it's index
          currentOption = customSelectOptions.find('[data-focus="true"]');

          // 1. Find the current option and remove focus
          // 2. Go to the next option and set focus
          // 3. if statement prevents moving past the first option
          if (currentOption.index() == 1) {
            base.closeList(event, customSelect, customSelectOptions);
          }
          if (currentOption.index() > 1) {
            customSelectOptions
              .find('[data-focus="true"]')
              .attr("data-focus", false)
              .prevAll(':not("[data-disabled=true]")') // Skips the previous option if it's disabled
              .first()
              .attr("data-focus", true);
          }
        break;
        case "typeahead":
          // Set the current option to the first result that's not:
          // - the placeholder
          // - and the first item in the list that hasn't been filtered
          currentOption = customSelectOptions.find('[data-focus="true"][data-filtered!="true"]');

          if (currentOption.index() == 1) {
            base.closeList(event, customSelect, customSelectOptions);
          }
          if (currentOption.index() > 1 && currentOption.index() != -1) {
            customSelectOptions.find('[data-focus="true"]').attr("data-focus", false).prevAll(':not("[data-filtered=true]")').first().attr("data-focus", true);
          }
        break;
      }

      event.preventDefault();
      event.stopPropagation();
    }; // end moveUp();

    // --------------------------------------------------------
    // Choose option
    // --------------------------------------------------------
    base.chooseOption = function(event, currentOption, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder, customSelectFilter) {
      currentOption = customSelectOptions.find('[data-focus="true"]');

      // De-select all options
      customSelectOptions.children().attr("data-selected", false);

      // Select the current option
      currentOption.attr("data-selected", "true");

      //Set the value of the original select.
      originalSelect.children('option:eq(' + currentOption.index() +')').prop('selected', true).trigger('change');

      // Change the text of the custom select
      customSelectText.text(currentOption.text());

      // Close the custom select list
      base.closeList(event, customSelect, customSelectOptions);

      // Clear the text input when an option is chosen
      switch(base.options.type) {
        case "typeahead":
          customSelectFilter.val("");
        break;
      }

      event.preventDefault();
      event.stopPropagation();
    }; // End chooseOption();

    // --------------------------------------------------------
    // Clear the Select
    //
    // Binding to the delete & backspace keys and custom UI
    // element to click and clear the select.
    // --------------------------------------------------------
    base.clearSelect = function(event, originalSelect, originalSelectedOption, customSelect, customSelectOptions, customSelectText, customPlaceholder) {

      // Set each <li> as unselected
      customSelectOptions.children().attr('data-selected', false);

      // Clear the original select
      if (customPlaceholder == undefined) {
        // Set the custom select text to either the option that's selected on load
        customSelectOptions.children().eq(originalSelectedOption).attr('data-selected', true);
        customSelectText.text(originalSelect.children('option:selected').text());

      } else {
        // Set the custom select to the placeholder
        customSelectText.text(customPlaceholder);
        // Clear the selected value of the original select
        originalSelect.children('option:eq(0)').prop('selected', true);
      }
      event.stopPropagation();
    }; // End clearSelect();

    // --------------------------------------------------------
    // Close select list
    // --------------------------------------------------------
    base.closeList = function(event, customSelect, customSelectOptions) {
      customSelect.attr('data-open', 'false').focus();
      customSelectOptions.attr("data-focus", "true");
    }; // End closeList();

    // --------------------------------------------------------
    // Close other selects that are showing options
    // --------------------------------------------------------
    base.closeAllOpenSelects = function() {
      $('.custom-select').attr("data-open", "false");
      $('.custom-select-list').attr("data-focus", "false");
    };

    // --------------------------------------------------------
    // Run Initializer
    // --------------------------------------------------------
    base.init();
  };

  $.cardinal.select.defaultOptions = {
    width:        false,
    placeholder:  true,
    type:         "basic", // basic | typeahead
    clearAction:  true
  };

  $.fn.cardinal_select = function(options){
    return this.each(function(){
      (new $.cardinal.select(this, options));
    });
  };

  // This function breaks the chain, but returns
  // the cardinal.select if it has been attached to the object.
  $.fn.getcardinal_select = function(){
    this.data("cardinal.select");
  };
})(jQuery);
