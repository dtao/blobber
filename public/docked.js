(function(window, document) {

  var BASE_URL = 'http://docked.herokuapp.com';
  var callbackId = 1;

  function createCallback(callback, script) {
    var callbackName = 'docked_callback_' + callbackId++;

    // Odds of this are miniscule, but might as well play it safe.
    while (callbackName in window) {
      callbackName = 'docked_callback_' + callbackId++;
    }

    window[callbackName] = function() {
      try {
        callback.apply(this, arguments);

      } finally {
        document.head.removeChild(script);
        delete window[callbackName];
      }
    };

    return callbackName;
  }

  window.Docked = {
    open: function(id, callback) {
      var script = document.createElement('script');
      script.src = BASE_URL + '/' + id + '?callback=' + createCallback(callback, script);
      document.head.appendChild(script);
    },

    save: function(content) {
      var form = document.createElement('form');
      form.style.display = 'none';
      document.body.appendChild(form);

      var textarea = document.createElement('textarea');
      textarea.setAttribute('name', 'content');
      textarea.value = content;
      form.appendChild(textarea);

      form.submit();
    }
  };

}(window, document));
