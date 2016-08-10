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

            $scope.getFiltererByTags();

            $scope.loading = false;
        });


    };

    $scope.getFiltererByTags = function () {    

        if ($scope.tags.length) {

            return $scope.feeds.items.filter(function (item) {

                return $scope.tags.some(function (tag) {
                    return item.categories.indexOf(tag) !== -1;
                });
            });
        }

        return $scope.feeds.items;
    }

    $scope.toggleTag = function (category) {

        var i = $scope.tags.indexOf(category);

        (i !== -1) ? $scope.tags.splice(i, 1) : $scope.tags.push(category);

        chrome.storage.sync.set({
            'tags' : $scope.tags,
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