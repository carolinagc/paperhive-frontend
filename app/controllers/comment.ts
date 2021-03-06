'use strict';
export default function(app) {

  app.controller('CommentCtrl', [
    '$scope', '$location', '$routeSegment', '$http', 'config',
    'notificationService',
    function(
      $scope, $location, $routeSegment, $http, config,
      notificationService
    ) {
      $scope.save = function() {
        $scope.submitting = true;
        const promise = $scope.addDiscussion($scope.comment);
        if (promise) {
          promise.success(function(data) {
            $location.path($routeSegment.getSegmentUrl(
              'documents.discussions.thread',
              {
                documentId: $routeSegment.$routeParams.documentId,
                discussionId: data.id
              }
            ));
          })
          .finally(function() {
            $scope.submitting = false;
          });
        }
      };

      $scope.searchUsers = function(query, limit) {
        if (!query) {
          $scope.foundUsers = [];
          return;
        }
        $http.get(config.apiUrl + '/people/', {
          params: {q: query, limit: limit, onlyUsers: true}
        })
        .success(function(response) {
          $scope.foundUsers = response.data;
        })
        .error(notificationService.httpError('could not fetch users'));

      };

      $scope.getMentioText = function(user) {
        return '@' + account.username;
      };

    }]);
};
