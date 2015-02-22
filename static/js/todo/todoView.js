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