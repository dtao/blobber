(function(window, document) {

  function getParamsFromData(data) {
    var params = [];
    for (var key in data) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    return params.join('&');
  }

  function makeRequest(method, route, data, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open(method, Docked.BASE_URL + route);

    var params = getParamsFromData(data);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        callback(JSON.parse(xhr.responseText));
      }
    };

    xhr.send(params);
  }

  var Docked = {
    open: function(id, callback) {
      makeRequest('GET', '/' + id, {}, callback);
    },

    save: function(content, callback) {
      makeRequest('POST', '/', { content: content }, callback);
    },

    // config var(s?)
    BASE_URL: 'http://docked.herokuapp.com'
  };

  window.Docked = Docked;

}(window, document));
