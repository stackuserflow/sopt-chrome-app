angular.module('app', [])

.controller('FeedController', function ($interval, $scope, $http, $sce) {

    var url = 'http://rss2json.com/api.json?rss_url=http%3A%2F%2Fpt.stackoverflow.com%2Ffeeds%2F';

    $scope.html = $sce.trustAsHtml;

    $scope.tags = [];

    $scope.showPost = function (item) {
        $scope.feed = angular.copy(item);
    };  

    $scope.reload = function () {

        $scope.loading = true;

        $http.get(url).then(function (response) {

            $scope.feeds = response.data;

            $scope.feed || $scope.showPost(response.data.items[0]);

            $scope.loading = false;
        });
    };

    $scope.toggleTag = function (category) {

        var i = $scope.tags.indexOf(category);

        (i !== -1) ? $scope.tags.splice(i, 1) : $scope.tags.push(category);
    };

    $scope.reload();

    $interval($scope.reload, 100000);

});