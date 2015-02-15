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
            '//cdn.rawgit.com/lcavadas/arenite/0.0.10/js/extensions/bus/bus.js',
            '//cdn.rawgit.com/lcavadas/arenite/0.0.10/js/extensions/storage/storage.js',
            '//cdn.rawgit.com/lcavadas/arenite/0.0.10/js/extensions/template/dot.js',
            '//cdn.rawgit.com/lcavadas/arenite/0.0.10/js/extensions/router/router.js',

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