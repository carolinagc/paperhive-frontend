'use strict';

const _ = require('lodash');
const $ = require('jquery');

export default function(app) {

  app.directive(
    'toc',
    ['$parse', '$window', '$timeout', function($parse, $window, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          const parsedToc = $parse(attrs.toc);
          const parsedOffset = $parse(attrs.tocScrollspyOffset);
          let toc;

          function getElements() {
            return element.find('[id]').filter(function(index, el) {
              return parseInt($(el).attr('toc-level'));
            }).toArray();
          }

          function getToc(elements, parentLevel) {
            if (elements === undefined) {
              elements = getElements();
              parentLevel = Number.NEGATIVE_INFINITY;
            }
            if (!elements.length) { return []; }

            const toc = [];
            let currentLevel;
            while (elements.length &&
                   (currentLevel = parseInt($(elements[0]).attr('toc-level'))) >
                   parentLevel
                  ) {
              const el = $(elements[0]);
              const newTocElement = {
                id: el.attr('id'),
                text: el.attr('toc-text') || el.text(),
                subToc: undefined
              };
              // kick out first element
              elements.shift();

              // get subtoc
              newTocElement.subToc = getToc(elements, currentLevel);

              // append new element
              toc.push(newTocElement);
            }

            return toc;
          }

          function updateScrollspy() {
            function getScrollspyId() {
              const elements = _.sortBy(_.map(getElements(), function(element) {
                const rect = element.getBoundingClientRect();
                return {
                  id: $(element).attr('id'),
                  offset: rect.top
                };
              }), 'offset');
              const offset = parsedOffset(scope) || 0;

              if (!elements.length) { return; }

              let id = elements[0].id;
              _.forEach(elements, function(element) {
                if (element.offset < offset) {
                  id = element.id;
                }
              });

              return id;
            }

            function applyScrollspyId(toc, id) {
              if (!toc) { return; }
              let contained = false;
              _.forEach(toc, function(entry) {
                entry.active = false;
                if (applyScrollspyId(entry.subToc, id) || entry.id === id) {
                  entry.active = true;
                  contained = true;
                }
              });
              return contained;
            }

            scope.$apply(function() {
              const id = getScrollspyId();
              applyScrollspyId(toc, id);
            });
          }

          $timeout(function() {
            // set toc
            toc = getToc(undefined, undefined);

            // register handler
            $($window).on('scroll resize', updateScrollspy);
            element.on('$destroy', function() {
              $($window).off('scroll resize', updateScrollspy);
            });
            updateScrollspy();

            parsedToc.assign(scope, toc);
          });
        }
      };
    }]
  );
};
