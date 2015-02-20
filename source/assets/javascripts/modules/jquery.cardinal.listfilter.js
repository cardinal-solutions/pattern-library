jQuery.fn.listfilter = function(list, options) {
  // Options: input, list, timeout, callback
  options = options || {};
  list = jQuery(list);

  var input = this;
  var lastFilter = '';
  var timeout = options.timeout || 0;
  var callback = options.callback || function() {};

  var keyTimeout;

  // NOTE: because we cache lis & len here, users would need to re-init the plugin
  // if they modify the list in the DOM later.  This doesn't give us that much speed
  // boost, so perhaps it's not worth putting it here.
  var lis = list.children();
  var len = lis.length;
  var oldDisplay = len > 0 ? lis[0].style.display : "block";
  callback(len); // do a one-time callback on initialization to make sure everything's in sync

  input.on({
    change: function(){
      var filter = input.val().toLowerCase();
      var li, innerText;

      // Loop over each item to filter
      for (var i = 0; i < len; i++) {
        li = lis[i];
        $li = $(li);

        // set all children to filtered, false
        // $li.attr('data-filtered', 'false');

        innerText = !options.selector ?
          (li.textContent || li.innerText || "") :
          $(li).find(options.selector).text();

        // No filter
        if (innerText.toLowerCase().indexOf(filter) >= 0) {
          if ($li.attr('data-filtered') == "true") {
            $li.attr('data-filtered', oldDisplay);
          }

        // Filter
        } else {
          if ($li.attr('data-filtered') != "false") {
            $li.attr('data-filtered', 'true');
          }
        }
      }

      return false;
    },
    keydown: function(){
      clearTimeout(keyTimeout);

      keyTimeout = setTimeout(function() {
        if( input.val() === lastFilter ) return;
        lastFilter = input.val();
        input.change();
      }, timeout);
    }
  });

  return this; // maintain jQuery chainability
}
