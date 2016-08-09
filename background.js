chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('body.html', {
    'outerBounds': {
      'width': 1000,
      'height': 600,
      // 'left': 0,
      // 'top' : 0,
    }
  });
});