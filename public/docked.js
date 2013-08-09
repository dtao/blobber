(function(window, document) {

  function getParamsFromData(data) {
    var params = [];
    for (var key in data) {
      params.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    }
    return params.join('&');
  }

  function getBaseUrl() {
    return Docked.PROTOCOL + '://' + Docked.HOSTNAME;
  }

  function makeRequest(method, route, data, callback) {
    var xhr = new XMLHttpRequest();

    xhr.open(method, getBaseUrl() + route);

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

    update: function(id, data, callback) {
      makeRequest('POST', '/' + id, data, callback);
    },

    save: function(data, callback) {
      makeRequest('POST', '/', data, callback);
    }
  };

  // config vars
  Docked.PROTOCOL = 'https';
  Docked.HOSTNAME = 'docked.herokuapp.com';

  window.Docked = Docked;

}(window, document));
