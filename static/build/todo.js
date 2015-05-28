window.App = function () {
  return {
    context: {
      dependencies: {
        default: {
          async: [
            {
              url: 'build/todo.min.js',
              instances: {
                jquery: '$',
                doT: 'doT',
                storagejs: 'storage'
              }
            }
          ]
        },
        dev: {
          async: [
            {
              url: '//cdn.rawgit.com/lcavadas/jquery/2.1.3/dist/jquery.min.js',
              instances: {
                jquery: '$'
              }
            },
            {
              url: '//cdn.rawgit.com/lcavadas/doT/1.0.1/doT.js',
              instances: {
                doT: 'doT'
              }
            },
            {
              url: '//cdn.rawgit.com/lcavadas/Storage.js/4c0b9016c5536d55bf55e21bf4e83d29f3483750/build/storage.js',
              instances: {
                storagejs: 'storage'
              }
            },
            '//cdn.rawgit.com/lcavadas/arenite/1.0.4/js/extensions/bus/bus.js',
            '//cdn.rawgit.com/lcavadas/arenite/1.0.4/js/extensions/storage/storage.js',
            '//cdn.rawgit.com/lcavadas/arenite/1.0.4/js/extensions/template/dot.js',
            '//cdn.rawgit.com/lcavadas/arenite/1.0.4/js/extensions/router/router.js',

            'js/model.js',
            'js/list/list.js',
            'js/list/listView.js',
            'js/list/toolbarView.js',
            'js/todo/todo.js',
            'js/todo/todoView.js'
          ]
        }
      },
      extensions: {
        bus: {
          namespace: 'Arenite.Bus'
        },
        templates: {
          namespace: 'Arenite.Templates',
          args: [
            {ref: 'arenite'},
            {ref: 'doT'}
          ],
          init: {
            wait: true,
            func: 'add',
            args: [{
              value: ['templates/template.html']
            }]
          }
        },
        storage: {
          namespace: 'Arenite.Storage',
          args: [
            {ref: 'arenite'},
            {ref: 'storagejs'}
          ],
          init: 'init'
        },
        router: {
          namespace: 'Arenite.Router',
          args: [{ref: 'arenite'}],
          init: {
            func: 'init',
            args: [
              {
                value: {
                  '/': [{
                    instance: 'arenite',
                    func: 'bus.publish',
                    args: [
                      {value: 'filter-change'},
                      {value: 'all'}
                    ]
                  }],
                  '/active': [{
                    instance: 'arenite',
                    func: 'bus.publish',
                    args: [
                      {value: 'filter-change'},
                      {value: 'active'}
                    ]
                  }],
                  '/completed': [{
                    instance: 'arenite',
                    func: 'bus.publish',
                    args: [
                      {value: 'filter-change'},
                      {value: 'completed'}
                    ]
                  }]
                }
              },
              {value: true}]
          }
        }
      },
      start: [
        {
          instance: 'model',
          func: 'load'
        }
      ],
      instances: {
        model: {
          namespace: 'App.Model',
          args: [
            {ref: 'arenite'}
          ]
        },
        list: {
          namespace: 'App.List',
          init:'init',
          args: [
            {ref: 'arenite'},
            {ref: 'model'},
            {
              instance: {
                namespace: 'App.ListView',
                args: [
                  {ref: 'arenite'},
                  {ref: 'jquery'}
                ],
                init: 'init'
              }
            },
            {
              instance: {
                namespace: 'App.ToolbarView',
                args: [
                  {ref: 'arenite'},
                  {ref: 'jquery'}
                ],
                init: 'init'
              }
            }
          ]
        },
        todo: {
          factory: true,
          namespace: 'App.Todo',
          args: [
            {ref: 'arenite'},
            {ref: 'model'},
            {
              instance: {
                namespace: 'App.TodoView',
                args: [
                  {ref: 'arenite'},
                  {ref: 'jquery'}
                ]
              }
            }
          ]
        }
      }
    }
  };
};
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
/*global App*/
App.List = function (arenite, model, listView, toolbarView) {

  var count = 0;
  var _filter = 'all';

  var _handleFilterChange = function (filter) {
    _filter = filter;
    toolbarView.setFilter(filter);
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
/*global App*/
App.ListView = function (arenite, $) {
  var _$createInput;
  var _$list;
  var _$toggleAll;

  var _init = function () {
    _$createInput = $('#new-todo');
    _$list = $('#todo-list');
    _$toggleAll = $('#toggle-all');

    _$createInput.bind('keydown', function (e) {
      if (e.keyCode === 13) {
        arenite.bus.publish('create-todo', _$createInput.val());
        _$createInput.val('');
      }
    });

    _$toggleAll.click(function () {
      arenite.bus.publish('select-all', _$toggleAll.is(':checked'));
    });
  };

  var _update = function (amount) {
    _$toggleAll[0].checked = !amount;
  };

  return {
    init: _init,
    update: _update,
    container: function () {
      return _$list;
    }
  };
};
/*global App*/
App.ToolbarView = function (arenite, $) {
  var _$list;
  var _$counter;
  var _$filterAll;
  var _$filterActive;
  var _$filterCompleted;
  var _$clean;

  var _setFilter = function(filter){
    _clearActiveFilter();
    $('a.'+filter).addClass('selected');
  };

  var _clearActiveFilter = function () {
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
    update: _update,
    setFilter:_setFilter
  };
};
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
/*global App*/
App.TodoView = function (arenite, $) {
  var _$todo;
  var _$check;
  var _$label;
  var _$input;
  var _$remove;
  var _todo;

  var _save = function () {
    var value = _$input.val();
    _$label.html(value);
    arenite.bus.publish('todo-change-' + _todo.id, value);
    _$todo.removeClass('editing');
  };

  var _init = function (todo, parent) {
    _todo = todo;
    _$todo = $(arenite.templates.apply('todo', _todo));
    parent.append(_$todo);
    _$remove = _$todo.find('.destroy');
    _$check = _$todo.find('.toggle');

    _$check.click(function () {
      _$todo.toggleClass('completed');
      arenite.bus.publish('todo-state-change-' + _todo.id, _$check.is(':checked'));
    });
    _$remove.click(function () {
      arenite.bus.publish('todo-remove-' + _todo.id);
    });

    _$label = _$todo.find('label');
    _$label.dblclick(function () {
      var value = _$label.html();
      _$input.val(value);
      _$input[0].setSelectionRange(value.length, value.length);
      _$todo.addClass('editing');
    });

    _$input = _$todo.find('.edit');
    _$input.bind('keyup', function (e) {
      if (e.keyCode === 13) {
        _save();
      } else if (e.keyCode === 27) {
        _$todo.removeClass('editing');
      }
    });

    _$input.focusout(function () {
      _save();
    });
  };

  var _show = function () {
    _$todo.slideDown(function () {
      _$check.show();
    });
  };

  var _hide = function () {
    _$todo.slideUp();
  };

  var _remove = function () {
    _$check.hide();
    _$todo.slideUp(function () {
      _$todo.remove();
    });
  };

  var _update = function (flag) {
    _$check[0].checked = flag;
    if (flag) {
      _$todo.addClass('completed');
    }
    else {
      _$todo.removeClass('completed');
    }
  };

  return {
    init: _init,
    show: _show,
    hide: _hide,
    remove: _remove,
    update: _update
  };
};