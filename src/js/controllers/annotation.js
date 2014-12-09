// TODO fetch from database
var users = [
  {
  _id: "08ea4",
  orcidId: "dasdasd0",
  userName: "hondi",
  displayName: "Hondanz",
  gravatarMd5: ""
},
{
  _id: "152ea4",
  orcidId: "dasdasd1",
  userName:  "hoppenstedt",
  displayName: "Opa Hoppenstedt",
  gravatarMd5: ""
},
{
  _id: "ea5411",
  orcidId: "dasdasd2",
  userName: "jimmy",
  displayName: "Jimmy",
  email: "jimmy@best.com",
  gravatarMd5: ""
}
];

module.exports = function (app) {
  app.controller('AnnotationCtrl', [
    '$scope', 'AuthService',
    function($scope, AuthService) {
      $scope.isEditMode = false;

      $scope.users = users;

      console.log($scope.users);


      $scope.items = [
        'xxy', 'yxy', 'zxy'
      ];

      $scope.items2 = [
        {label: 'asdf',
          asda: 'gfg'
      },
        {label: 'bksdkf'},
        {label: 'ccc'}
      ];

      $scope.items3 = [
        {name: 'gfg'},
        {name: 'bksdkf'},
        {name: 'ccc'}
      ];

      $scope.getPeopleText = function(item) {
        return '<strong><a href="#/users/' + item.userName + '">@' + item.userName + '</a></strong>';
      };

      // For a more advanced example, using promises, see
      // <https://github.com/jeff-collins/ment.io/blob/master/ment.io/scripts.js>.
      $scope.searchPeople = function(term) {
        // Fill localItems, used as mentio-items in the respective directive.
        var results = [];
        angular.forEach($scope.users, function(item) {
          if (item.userName.toUpperCase().indexOf(term.toUpperCase()) >= 0) {
            results.push(item);
          }
        });
        $scope.localItems = results;
      };

      $scope.updateAnnotation = function(newBody) {
        $scope.annotation.body = newBody;
        $scope.annotation.editTime = new Date();
        $scope.isEditMode = false;
      };

      // Needed for access from child scope
      $scope.setEditOn = function () {
        $scope.isEditMode = true;
        $scope.tmpBody = $scope.annotation.body;
      };

      // Needed for access from child scope
      $scope.setEditOff = function () {
        $scope.isEditMode = false;
      };
      //$scope.auth = AuthService;
      //$scope.annotationBody = null;
      //$scope.isEditMode = false;

      //$scope.updateAnnotation = function(body) {
      //  $scope.annotationBody = body;
      //};
    }]);
};
