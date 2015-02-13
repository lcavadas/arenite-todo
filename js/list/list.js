/*global App*/
App.List = function (arenite, model, listView, toolbarView) {

  var count = 0;
  var _filter = 'all';

  var _handleFilterChange = function (filter) {
    _filter = filter;
    alert(_filter);
  };

  var _update = function () {
    listView.update(count);
    toolbarView.update(count);
  };

  var _handleLoad = function (todos) {
    todos.forEach(function (todo) {
      _handleCreated(todo);
    });
  };

  var _handleNew = function (text) {
    model.add({id: new Date().getTime(), text: text, complete: false});
  };

  var _handleCreated = function (todo) {
    alert('1' + _filter);
    arenite.context.get('todo').start(todo, listView.container(), _filter);
    if (!todo.complete) {
      count++;
    }
    _update();
  };

  var _handleStateChange = function (todo) {
    if (todo.complete) {
      count--;
    } else {
      count++;
    }
    _update();
  };

  var _handleRemoved = function (todo) {
    if (!todo.complete) {
      count--;
    }
    _update();
  };

  var _init = function () {
    arenite.bus.subscribe('todos-loaded', _handleLoad);
    arenite.bus.subscribe('create-todo', _handleNew);
    arenite.bus.subscribe('todo-added', _handleCreated);
    arenite.bus.subscribe('todo-removed', _handleRemoved);
    arenite.bus.subscribe('todo-state-changed', _handleStateChange);
    arenite.bus.subscribe('filter-change', _handleFilterChange);
  };

  return {
    init: _init
  };
};