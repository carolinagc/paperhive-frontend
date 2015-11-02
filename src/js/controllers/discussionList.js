'use strict';

module.exports = function(app) {

  app.controller('DiscussionListCtrl', [
    '$scope', 'metaService',
    function($scope, metaService) {
      // set meta data
      $scope.$watch('article', function(article) {
        if (article) {
          var meta = [{
            name: 'description',
            content: 'Discussions overview for ' + article.title +
              ' by ' + article.authors.join(', ')
          }];

          $scope.addArticleMetaData(meta);

          metaService.set({
            title: 'Discussions · ' + article.title + ' · PaperHive',
            meta: meta
          });
        }
      });
    }
  ]);
};
