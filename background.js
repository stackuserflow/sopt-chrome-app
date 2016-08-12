chrome.app.runtime.onLaunched.addListener(function() {

    chrome.app.window.create('body.html', {
        'outerBounds': {
            'width': 1000,
            'height': 600,
        }
    });

    chrome.notifications.onClicked.addListener(function(id, byUser) {
        
        if (/^(http|https):\/\//.test(id)) {

            setTimeout(function() {
                chrome.tabs.create({
                    "url": id
                });
            }, 1);
        }

        chrome.notifications.clear(id);
    });
});