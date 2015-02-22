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