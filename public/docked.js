(function(window, document) {

  var BASE_URL = 'http://docked.herokuapp.com';

  function getParamsFromData(data) {
    var params = [];
    for (var key in data) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    return params.join('&');
  }

  function makeRequest(method, route, data, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open(method, BASE_URL + route);

    var params = getParamsFromData(data);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Content-Length', params.length);

    xhr.addEventListener('progress', function() {
      if (xhr.readyState === 4) {
        callback(xhr.responseText);
      }
    });
  }

  window.Docked = {
    open: function(id, callback) {
      makeRequest('GET', '/' + id, {}, callback);
    },

    save: function(content, callback) {
      makeRequest('POST', '/', { content: content }, callback);
    }
  };

}(window, document));
