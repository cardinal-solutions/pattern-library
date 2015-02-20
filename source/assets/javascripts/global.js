jQuery(document).ready(function($) {
  $('.custom-option').find('input[type=checkbox],input[type=radio]').accessibleOptions();
  $('[data-type="basic-select"]').cardinal_select({
    clearAction: false
  });
  $('[data-type="typeahead-select"]').cardinal_select({
    clearAction: false,
    type:        "typeahead"
  });
  $('.tabs').cardinal_tabs();
  $('.accordion').cardinal_accordion();
  $('.collapsible').cardinal_collapsible();
  $('.alert-remove-control').cardinal_alert();
  $('[data-tooltip]').cardinal_collapsible();
  $('[data-popover]').cardinal_collapsible();
  $('.page-push').find('a').cardinal_pagepush();
  $('[type="file"]').cardinal_fileupload();

  // Kendo
  $('[data-type="kendo-combobox"]').kendoComboBox();
  $('[data-type="kendo-multiselect"]').kendoMultiSelect();
  $('[data-type="kendo-dropdown"]').kendoDropDownList();
  $('[type="date"]').kendoDatePicker({
    format: "MM/dd/yy"    
  }).kendoMaskedTextBox({
      mask: "00/00/00"
  });
  $('[data-mask="phone"]').kendoMaskedTextBox({
      mask: "(999) 000-0000"
  });
  $('[data-mask="zip"]').kendoMaskedTextBox({
      mask: "0000-00000"
  });
  $('[data-mask="currency"]').kendoNumericTextBox({
    format: "c",
    decimals: 3,
    spinners: false
  });
  $('[data-mask="percent"]').kendoNumericTextBox({
    format: "p0",
    min: 0,
    // max: 1,
    step: 1,
    spinners: false
  });
  $('[data-mask="date"]').kendoMaskedTextBox({
      mask: "00/00/0000"
  });
  $('[data-mask="ssn"]').kendoMaskedTextBox({
      mask: "000-00-0000"
  });
  $('.tooltip').kendoTooltip({
    position: "top",
    autoHide: true,
    animation: {
      close: {
        effects: "fade:out"
      },
      open: {
        effects: "fade:in"
      }
    }

  });

  // Navigation accordion - Styleguide specific
  $('#styleguide-nav-primary').find('header').find('a').on('click', function(event) {
    $('#styleguide-nav-primary > ul').data('hidden', true).stop().slideUp(250);
    // if ($(this).parent().parent().next().is(':visible')) {
    //   $(this).parent().parent().next().data('hidden', false);
    //   $(this).removeClass('active');
    // } else {
    //   $(this).addClass('active');
    // }
    $(this).toggleClass('active');
    $(this).parent().parent().next().stop().slideToggle(250);
    $(this).parent().parent().siblings('header').find('a').removeClass('active');
    event.preventDefault();
  });

  // $('.highlight').find('.code').children().wrap('<div class="code-wrapper"></div>');

  // Temporary rate override actions
  $('.rate-override-boolean').find('[type="checkbox"]').on({
    change: function(){
      if($(this).is(':checked')){
        console.log($(this).is(':checked'));
        $(this).parent().parent().attr('data-override', 'true');
      } else {
        console.log($(this).is(':checked'));
        $(this).parent().parent().attr('data-override', 'false');
      };
    }
  });
});
