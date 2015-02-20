describe("cardinal Checkboxes & Radio Inputs", function() {
  var customCheckbox1 = $('#checkbox-group-1'),
      customCheckbox2 = $('#checkbox-group-2'),
      customRadio1    = $('#radio-group-1'),
      customRadio2    = $('#radio-group-2');

  describe("Clicking a checkbox", function() {
    it("Selects the custom checkbox", function () {
      customCheckbox1.trigger('click');
      expect(customCheckbox1.prop('checked')).toEqual(true);
    });
    it("Selects the native checkbox", function () {
      expect(customCheckbox1.next().attr('checked')).toEqual('checked');
    });
  });

  describe("Clicking a selected checkbox", function() {
    it("De-selects the custom checkbox", function () {
      customCheckbox1.trigger('click');
      expect(customCheckbox1.prop('checked')).toEqual(false);
    });
    it("Selects the native checkbox", function () {
      expect(customCheckbox1.next().attr('checked')).toEqual(undefined);
    });
  });

  describe("Clicking a radio button", function() {
    it("Selects the custom radio", function () {
      customRadio1.trigger('click');
      expect(customRadio1.prop('checked')).toEqual(true);
    });
    it("Selects the native radio", function () {
      expect(customRadio1.next().attr('checked')).toEqual('checked');
    });
  });

  describe("Clicking a selected radio", function() {
    it("Doesn't de-select the selected radio", function () {
      customRadio1.trigger('click');
      expect(customRadio1.prop('checked')).toEqual(true);
    });
  });
});