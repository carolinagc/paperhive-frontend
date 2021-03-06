'use strict';

export default function(app) {
    app.component('navbarSearch', {
      controller: ['$scope', '$http', '$location', '$routeSegment', 'config',
        'notificationService',
        function(
          $scope, $http, $location, $routeSegment, config,
          notificationService
        ) {

          $scope.showAllResults = function(input) {
            $location.path('/searchResults/').search({query: input, page: 1});
          };

          $scope.search = {};
          $scope.phSearch = function(query, limit) {
            return $http.get(config.apiUrl + '/documents/', {
              params: {q: query, limit: limit, restrictToLatest: true}
            })
            .then(
              function(response) {
                return response.data.documents;
              },
              function(response) {
                notificationService.notifications.push({
                  type: 'error',
                  message: 'Could not fetch documents'
                });
              }
            );
          };

          $scope.goToDocument = function(item, model, label) {
            $location.path($routeSegment.getSegmentUrl(
              'documents', {documentId: item.id}
            ));
            $scope.search.body = '';
          };
        }
      ],
      templateUrl: 'html/shared/navbar-search.html',
    });
};
