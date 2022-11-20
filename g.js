export default {
  'variables': {
    'root': './output'
  },
  'domains': [
    {
      'name': 'test',
      'templates': [
        {
          'name': 'test.ts',
          'template': '../templates/test.js'
        }
      ],
      'questions': [
        {
          'name': 'pendingType',
          'message': 'Field?',
          'default': 'void',
          'type': 'input'
        },
        {
          'name': 'successType',
          'message': 'Field?',
          'default': 'void',
          'type': 'input'
        }
      ]
    },
    {
      'name': 'component',
      'structure': {
        'applications': {
          ':appId': {
            'components': {
              'shared': '',
              'features': {
                ':id': ''
              },
              'pages': '',
              'layouts': '',
              'popups': ''
            }
          }
        }
      },
      'templates': [
        {
          'name': ({ ComponentName }) => `${ComponentName}/${ComponentName}.tsx`,
          'template': '../templates/components/component.template.js'
        },
        // {
        //   'name': ({ ComponentName }) => `${ComponentName}/${ComponentName}.css`,
        //   'template': '../templates/components/style.template.js'
        // },
        // {
        //   'name': ({ ComponentName }) => `${ComponentName}/${ComponentName}.test.tsx`,
        //   'template': '../templates/components/tests.template.js'
        // },
        // {
        //   'name': ({ ComponentName }) => `${ComponentName}/index.ts`,
        //   'template': '../templates/components/index.template.js'
        // },
        // {
        //   'name': './router/index.tsx',
        //   'template': '../templates/router/index.template.js',
        //   'when': ({ $createPath }) => $createPath.includes('pages')
        // }
      ],
      'questions': [
        {
          'name': 'ComponentName',
          'message': 'How to name the component?',
          'type': 'input'
        },
        {
          'name': 'ComponentDetails',
          'message': 'What to add to the component?',
          'type': 'checkbox',
          'choices': [
            {
              'name': 'Children'
            },
            {
              'name': 'useDispatch'
            },
            {
              'name': 'useSelector'
            },
            {
              'name': 'useLocation'
            },
            {
              'name': 'useNavigate'
            },
            {
              'name': 'Outlet'
            },
            {
              'name': 'useForm'
            }
          ]
        },
        {
          'name': 'routePath',
          'message': 'What route?',
          'type': 'input',
          'validate': (input) => input !== '',
          'when': (answers) => Object.values(answers).some((v) => v === 'pages')
        },
        {
          'name': 'withReducer',
          'message': 'Use reducer?',
          'type': 'confirm',
          'default': true,
          'when': (answers) => Object.values(answers).some((v) => v === 'pages')
        }
      ]
    },
    {
      'name': 'redux',
      'structure': {
        'applications': {
          ':appId': {
            'components': {
              'pages': {
                ':id': ''
              }
            }
          }
        }
      },
      'templates': [
        {
          'name': ({ FileName }) => `redux/${FileName}/slice.ts`,
          'template': '../templates/redux/slice.template.js'
        },
        {
          'name': ({ FileName }) => `redux/${FileName}/selectors.ts`,
          'template': '../templates/redux/selector.template.js'
        },
        {
          'name': ({ FileName }) => `redux/${FileName}/thunks.ts`,
          'template': '../templates/redux/thunk.template.js'
        },
        {
          'name': ({ FileName }) => `redux/${FileName}/types.ts`,
          'template': '../templates/redux/types.template.js'
        },
        {
          'name': ({ FileName }) => `redux/${FileName}/services.ts`,
          'template': '../templates/redux/service.template.js'
        },
        {
          'name': () => 'redux/reducer.ts',
          'template': '../templates/redux/reducer.template.js'
        }
      ],
      'questions': [
        {
          'name': 'FileName',
          'message': 'How to name file?',
          'type': 'input'
        },
        {
          'name': 'reducerName',
          'message': 'How to name reducer?',
          'type': 'input'
        },
        {
          'name': 'sliceName',
          'message': 'How to name slice?',
          'type': 'input'
        },
        {
          'name': 'fieldName',
          'message': 'How to name field?',
          'type': 'input'
        },
        {
          'name': 'thunkName',
          'message': 'How to name thunk?',
          'type': 'input'
        },
        {
          'name': 'serviceNamespace',
          'message': 'What service namespace?',
          'type': 'input'
        },
        {
          'name': 'pendingType',
          'message': 'Payload type?',
          'type': 'input'
        },
        {
          'name': 'successType',
          'message': 'Response type',
          'type': 'input'
        }
      ]
    }
  ]
};
