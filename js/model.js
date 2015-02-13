/*global App*/
App.Model = function (arenite) {

  var _load = function () {
    arenite.storage.sessionStore().getAll('todo', function (todos) {
      arenite.bus.publish('todos-loaded', todos);
    });
  };

  var _add = function (todo) {
    arenite.storage.sessionStore().set('todo', todo, function () {
      arenite.bus.publish('todo-added', todo);
    });
  };

  var _update = function (todo) {
    arenite.storage.sessionStore().set('todo', todo, function () {
      arenite.bus.publish('todo-updated', todo);
    });
  };

  var _changeState = function (todo) {
    arenite.storage.sessionStore().set('todo', todo, function () {
      arenite.bus.publish('todo-state-changed', todo);
    });
  };

  var _remove = function (todo) {
    arenite.storage.sessionStore().remove('todo', todo.id, function () {
      arenite.bus.publish('todo-removed', todo);
    });
  };

  return {
    load: _load,
    add: _add,
    update: _update,
    changeState: _changeState,
    remove: _remove
  };
};