module.exports = {
  'variables': {
    'root': './output'
  },
  'domains': [
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
          'name': ({ ComponentName }) => `${ComponentName}.tsx`,
          'template': '../templates/components/component.template.js'
        },
        {
          'name': ({ ComponentName }) => `${ComponentName}.css`,
          'template': '../templates/components/style.template.js'
        },
        {
          'name': ({ ComponentName }) => `${ComponentName}.test.tsx`,
          'template': '../templates/components/tests.template.js'
        },
        {
          'name': 'index.ts',
          'template': '../templates/components/index.template.js'
        },
        {
          'name': '../../../router/index.tsx',
          'template': '../templates/router/index.template.js',
          'when': ({ $createPath }) => $createPath.includes('pages')
        }
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
        }
      ]
    },
    {
      'name': 'redux',
      'structure': {
        'applications': {
          ':appId': {
            'components': {
              'pages': ''
            }
          }
        }
      },
      'templates': [
        {
          'name': ({ FileName }) => `redux/${FileName}.selectors.ts`,
          'template': '../templates/redux/redux.template.js'
        },
        {
          'name': ({ FileName }) => `redux/${FileName}.slice.ts`,
          'template': '../templates/redux/redux.template.js'
        },
        {
          'name': ({ FileName }) => `redux/${FileName}.thunks.ts`,
          'template': '../templates/redux/redux.template.js'
        },
        {
          'name': ({ FileName }) => `./services/api/${FileName}.services.ts`,
          'template': '../templates/redux/redux.template.js'
        }
      ],
      'questions': [
        {
          'name': 'FileName',
          'message': 'How to name file?',
          'type': 'input'
        }
      ]
    }
  ]
};
