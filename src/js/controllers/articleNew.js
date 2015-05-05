'use strict';
module.exports = function(app) {
  app.controller('ArticleNewCtrl', [
    '$scope', '$http', '$q', '$location', 'config', 'authService',
    'notificationService',
    function($scope, $http, $q, $location, config, authService,
             notificationService) {
      $scope.check = {};

      $scope.submitApproved = function() {
        $scope.submitting = true;
        $http.post(config.apiUrl + '/articles/sources', undefined, {
          params: {handle: $scope.handle},
        })
          .success(function(article) {
            $scope.submitting = false;
            $location.path('/articles/' + article._id);
          })
          .error(function(data) {
            $scope.submitting = false;
            var message;
            if (data && data.message) {
              message = data.message;
            } else {
              message = 'could not add article (unknown reason)';
            }
            notificationService.notifications.push({
              type: 'error',
              message: message
            });
          });

      };
    }
  ]);
};
