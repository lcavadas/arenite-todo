/*global App*/
App.ToolbarView = function (arenite, $) {
  var _$list;
  var _$counter;
  var _$filterAll;
  var _$filterActive;
  var _$filterCompleted;
  var _$clean;

  var _clearActiveFilter = function (e) {
    _$filterAll.removeClass('selected');
    _$filterActive.removeClass('selected');
    _$filterCompleted.removeClass('selected');
  };

  var _init = function () {
    _$list = $('#todo-list');
    _$counter = $('#todo-count strong');
    _$filterAll = $('#filters .all');
    _$filterActive = $('#filters .active');
    _$filterCompleted = $('#filters .completed');
    _$clean = $('#clear-completed');

    _$filterAll.click(function (e) {
      _clearActiveFilter(e);
      _$filterAll.addClass('selected');
      arenite.bus.publish('filter-change', 'all');
    });

    _$filterActive.click(function (e) {
      _clearActiveFilter(e);
      _$filterActive.addClass('selected');
      arenite.bus.publish('filter-change', 'active');
    });

    _$filterCompleted.click(function (e) {
      _clearActiveFilter(e);
      _$filterCompleted.addClass('selected');
      arenite.bus.publish('filter-change', 'completed');
    });

    _$clean.click(function () {
      arenite.bus.publish('clear-completed');
    });
  };

  var _update = function (amount) {
    _$counter.html(amount);
    if (amount !== _$list.find('li').length) {
      _$clean.show();
    } else {
      _$clean.hide();
    }
    if(_$list.find('li').length){
      $('#footer').slideDown();
    } else {
      $('#footer').slideUp();
    }
  };

  return {
    init: _init,
    update: _update
  };
};