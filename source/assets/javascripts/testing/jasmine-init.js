jQuery(document).ready(function($) {
  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var currentWindowOnload = window.onload;
  if (currentWindowOnload) {
    currentWindowOnload();
  }

  jasmineEnv.execute();
  $('#HTMLReporter').appendTo('#jasmine-tests');
});
// (function() {
  
// })();