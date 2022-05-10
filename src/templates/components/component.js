const tsxTemplate = (name, answers, json) => {

  let storeImport = '';
  let routerDomImport = '';
  let useHistory = '';
  let useLocation = '';
  let useParams = '';
  let outlet = '';
  let formImport = '';
  let formTemplate = '';
  let childrenImport = false;

  answers.componentOptions.forEach((o) => {
    if (o === 'Dispatch and Selector') {
      storeImport = `import { useDispatch, useSelector } from 'react-redux';\nimport { IStore } from '../../../${json.redux.folder}';\n`;
    }

    if (o === 'useLocation') {
      useLocation = '  const location = useLocation();\n';
      routerDomImport = 'useLocation';
    }

    if (o === 'useHistory') {
      useHistory = '  const history = useHistory();\n';
      routerDomImport += routerDomImport === '' ? 'useHistory' : ', useHistory';
    }

    if (o === 'useParams') {
      useParams = '  const params = useParams<{}>();\n';
      routerDomImport += routerDomImport === '' ? 'useParams' : ', useParams';
    }

    if (o === 'Nested routes') {
      outlet = '<Outlet/>';
      routerDomImport += routerDomImport === '' ? 'Outlet' : ', Outlet';
    }

    if (o === 'Children') {
      childrenImport = true;
    }

    if (o === 'useFormHook') {
      formImport = `import { FormProvider, useForm } from 'react-hook-form';`;
      formTemplate = `const form = useForm({
    defaultValues: {},
    // resolver: yupResolver(schema)
  });
  
  const { handleSubmit } = form;
  
  const onSubmit = () => {
    handleSubmit((data: any) => {
      console.log(data);
    }, (errors) => {
      console.log(errors);
    })();
  };
    
  // -------------------------------------------------------------------------------------------------------------------
  `
    }
  })

  if (routerDomImport) {
    routerDomImport = `import { ${routerDomImport} } from 'react-router-dom';\n`;
  }

  let styledPrefix = ''
  let cssExtension = '';

  switch (json.css) {
    case 'styled':
      styledPrefix = 'SC from ';
      cssExtension = '.styled';
      break;
    case 'scss':
      cssExtension = '.scss';
      break;
    case 'less':
      cssExtension = '.less';
      break;
    case 'css':
      cssExtension = '.css';
      break;
    default:
      cssExtension = json.css || '.css';
  }


  return `import React${childrenImport ? ', { ReactNode } ' : ''} from 'react';
import ${styledPrefix}'./${ name }${cssExtension}';
${storeImport}${routerDomImport}${formImport}

interface IProps {
    ${childrenImport ? 'children: ReactNode | ReactNode[];' : ''}
}

export const ${ name }: React.FC<IProps> = ({${childrenImport ? 'children' : ''}}: IProps) => {
  ${storeImport ? 'const dispatch = useDispatch();\n' : ''}${useLocation}${useHistory}${useParams}
  ${storeImport ? 'const store = useSelector((store: IStore) => store);' : ''}

  // -------------------------------------------------------------------------------------------------------------------
    
  ${formTemplate}

  return (
    <>
      ${formImport ? `<FormProvider { ...form }>

      </FormProvider>` : ''}${outlet}
    </>
  );
};
  `
};

// ---------------------------------------------------------------------------------------------------------------------

const indexTemplate = (name) => {
  return `/* istanbul ignore file */
import { ${ name } } from './${ name }';

export default ${ name };
`
}

// ---------------------------------------------------------------------------------------------------------------------

const styledComponentTemplate = (name, answers, json) => {
  return `import styled from 'styled-components/macro';
  
export const ${name}Wrapper = styled.div\`\`;

export default {
  ${name}Wrapper
}
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  tsxTemplate,
  indexTemplate,
  styledComponentTemplate
}
