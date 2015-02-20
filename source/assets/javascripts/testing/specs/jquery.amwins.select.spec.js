describe("cardinal Select", function() {
  var originalSelect    = $('#basic-select'),
      cardinalSelect      = originalSelect.next(),
      cardinalSelectList  = cardinalSelect.find('.custom-select-list'),
      cardinalSelectText  = cardinalSelect.find('.custom-select-text');

  // Key Codes
  var escapeKey               = 27,
      spaceKey                = 32,
      enterKey                = 13,
      upArrowKey              = 38,
      downArrowKey            = 40,
      deleteKey               = 46,
      backspaceKey            = 8;

  describe("Initializes the select", function() {
    it("Creates the clear select action", function () {
      expect(cardinalSelect.find('.custom-select-clear')).toExist();
    });
  });

  describe("Clicking the select", function(){
    it("Opens the options list", function() {
      cardinalSelect.trigger('click');
      expect(cardinalSelectList).toBeVisible();
    });

    describe("Clicking a select list item", function(){
      it("Chooses a list item", function() {
        cardinalSelectList.find('li:eq(3)').trigger('click');
        console.log(cardinalSelectList.find('li:eq(3)').text());
      });
      it("Closes the options list", function() {
        expect(cardinalSelectList).toBeHidden();
        console.log(cardinalSelectList.find('li:eq(3)').text());
      });
      it("Sets the select text", function() {
        expect(cardinalSelectText.text()).toEqual('Option 3');
        console.log(cardinalSelectText.text())
      });
      it("Maps the selected list item to the original select", function() {
        expect(originalSelect.find('option:eq(3)')).toBeSelected();
        console.log(originalSelect.val());
      });
    });

    describe("Clicking a disabled select list item", function() {
      it("Selects nothing", function() {
        cardinalSelect.trigger('click');
        cardinalSelectList.find('li:eq(2)').trigger('click');
        expect(cardinalSelectList).toBeVisible();
        expect(originalSelect.find('option:eq(2)')).not.toBeSelected();
        $('body').trigger('click');
      });
    });

    describe("Typing escape", function() {
      it("Closes the select list", function() {
        cardinalSelect.trigger('click');
        var esc = $.Event("keydown", { keyCode: escapeKey });
        cardinalSelectList.find('li:eq(3)').trigger(esc);
        expect(cardinalSelectList).toBeHidden();
      });
    });
  });

  describe("Clicking the clear action", function() {
    it("Unselects any list item in the select", function() {
      cardinalSelect.find('.custom-select-clear').trigger('click');
      cardinalSelectList.children().each(function(){
        expect($(this).data('selected')).toBe(false);
      });
    });
    it("Resets the select text to the placeholder test", function() {
      expect(cardinalSelectText.text()).toEqual('--Choose One--');
    });
    it("Unselects the native select", function() {
      expect(originalSelect).toHaveValue('--Choose One--');
    });
  });

  describe("Typing spacebar or up / down arrow when the select has focus", function() {
    it("Opens the options list", function() {
      cardinalSelect.focus().trigger('focus');
      var spacebar = $.Event("keydown", { keyCode: spaceKey });
      cardinalSelect.trigger(spacebar);
      expect(cardinalSelectList).toBeVisible();
    });
    it("Sets focus to the first list item or the currently selected list item", function() {
      var originalSelectedItem = originalSelect.children('option:selected').index();

      if (originalSelectedItem == 0) {
        expect(cardinalSelectList.find('[data-focus=true]').index() > 1);
      } else {
        expect(cardinalSelectList.find('[data-selected=true]').index()).toEqual(originalSelectedItem);
      }
    });

    describe("Typing the down arrow", function() {
      it("Moves to the next list item", function() {
        var downArrow = $.Event("keydown", { keyCode: downArrowKey });
        cardinalSelectList.find('[data-focus=true]').trigger(downArrow);
        expect(cardinalSelectList.find('[data-focus=true]').index()).toEqual(3);
      });
    });

    describe("Typing the up arrow", function() {
      it("Moves to the previous list item", function() {
        var upArrow = $.Event("keydown", { keyCode: upArrowKey });
        cardinalSelectList.find('[data-focus=true]').trigger(upArrow);
        expect(cardinalSelectList.find('[data-focus=true]').index()).toEqual(1);
      });
    });

    describe("Typing enter", function() {
      it("Chooses the list item", function() {
        var enter = $.Event("keydown", { keyCode: enterKey });
        cardinalSelectList.find('[data-focus=true]').trigger(enter);
        expect(cardinalSelectList.find('[data-selected=true]').index()).toEqual(1);
      });
      it("Closes the options list", function() {
        expect(cardinalSelectList).toBeHidden();
      });
      it("Sets the select text", function() {
        expect(cardinalSelectText.text()).toEqual('Option 1');
      });
      it("Maps the selected list item to the original select", function() {
        expect(originalSelect.find('option:eq(1)')).toBeSelected();
      });
    });
  });
});
