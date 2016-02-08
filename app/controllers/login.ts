'use strict';
export default function(app) {
  app.controller('LoginCtrl', ['$scope', '$location', 'authService', 'returnPathService',
    function($scope, $location, authService, returnPathService) {

      $scope.auth = authService;
      $scope.returnPath = returnPathService;

      $scope.login = {
        email: '',
        password: ''
      };

      $scope.login = function() {
        console.log($scope.login.email);
        console.log($scope.login.password);
        $location.path($scope.returnPath.returnPath);
      };

    }
  ]);
};
