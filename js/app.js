angular.module('app', [])
.controller('FeedController', function ($interval, $scope, $http, $sce, $httpParamSerializer, chromeNotify) {

    //var url = 'http://rss2json.com/api.json';

    
    $scope.html = $sce.trustAsHtml;

    $scope.tags = [];

    chrome.storage.sync.get('tags', function (object) {
        $scope.tags = object.tags;
    });

    $scope.showPost = function (item) {
        $scope.feed = angular.copy(item);
    };  

    $scope.reload = function () {

        $scope.loading = true;

        $http({
            params: {rss_url: 'http://pt.stackoverflow.com/feeds'},
            type: 'GET',
            url: 'http://rss2json.com/api.json',
        }).then(function (response) {

            $scope.feeds = response.data;

            $scope.feed || $scope.showPost(response.data.items[0]);

            console.log($scope.feed);

            $scope.getFiltererByTags();

            $scope.loading = false;
        });


    };

    $scope.getFiltererByTags = function () {    

        chrome.storage.sync.get('notifieds', function (object) {

            var notifieds = object.notifieds || [];

            console.log(notifieds);

            angular.forEach($scope.feeds.items, function (item) {

                var contains = $scope.tags.some(function (tag) {
                    return item.categories.indexOf(tag) !== -1;
                });

                if (contains && notifieds.indexOf(item.guid) == -1) {
                    chromeNotify(item.content, item.title);
                    notifieds.push(item.guid);
                }

            });

            chrome.storage.sync.set({
                'notifieds' : notifieds,
            });
        });

    };

    $scope.toggleTag = function (category) {

        var i = $scope.tags.indexOf(category);

        (i !== -1) ? $scope.tags.splice(i, 1) : $scope.tags.push(category);

        chrome.storage.sync.set({
            'tags' : $scope.tags,
        });
    };

    $scope.containsAnyTag = function (item) {

        return item.categories.some(function (tag) {
            return $scope.tags.indexOf(tag) != -1;
        });
    };

    $scope.reload();

    $interval($scope.reload, 100000);

})

.factory('chromeNotify', function () {

    return function (message, title) {

        chrome.notifications.create({
              type: 'basic',
              message: message,
              title: title || "Notificação",
              iconUrl: 'img/icon.png'
          })
    };
});

$(function(){

    $('.modal-trigger').leanModal();
});