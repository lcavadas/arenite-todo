/*global App*/
App.Todo = function (arenite, model, view) {

  var _todo;

  var _handleChange = function (newVal) {
    _todo.text = newVal;
    model.update(_todo);
  };

  var _handleSelectAll = function (state) {
    view.update(state);
    _handleStateChange(state);
  };

  var _handleStateChange = function (state) {
    if (_todo.complete !== state) {
      _todo.complete = state;
      model.changeState(_todo);
    }
  };

  var _handleClearComplete = function () {
    if (_todo.complete) {
      _handleRemove();
    }
  };

  var _handleRemove = function () {
    model.remove(_todo);
    _stop();
  };

  var _handleFilterChange = function (filter) {
    switch (filter) {
      case 'all':
        view.show();
        break;
      case 'active':
        if (_todo.complete) {
          view.hide();
        } else {
          view.show();
        }
        break;
      case 'completed':
        if (_todo.complete) {
          view.show();
        } else {
          view.hide();
        }
        break;
    }
  };

  var _start = function (todo, container, filter) {
    _todo = todo;
    arenite.bus.subscribe('select-all', _handleSelectAll);
    arenite.bus.subscribe('todo-change-' + _todo.id, _handleChange);
    arenite.bus.subscribe('todo-state-change-' + _todo.id, _handleStateChange);
    arenite.bus.subscribe('todo-remove-' + _todo.id, _handleRemove);
    arenite.bus.subscribe('clear-completed', _handleClearComplete);
    arenite.bus.subscribe('filter-change', _handleFilterChange);
    view.init(todo, container);
    _handleFilterChange(filter);
  };

  var _stop = function () {
    arenite.bus.unsubscribe('select-all', _handleStateChange);
    arenite.bus.unsubscribe('todo-change-' + _todo.id, _handleChange);
    arenite.bus.unsubscribe('todo-state-change-' + _todo.id, _handleStateChange);
    arenite.bus.unsubscribe('todo-remove-' + _todo.id, _handleRemove);
    arenite.bus.unsubscribe('clear-completed', _handleClearComplete);
    arenite.bus.unsubscribe('filter-change', _handleFilterChange);
    view.remove();
  };

  return {
    start: _start
  };
};