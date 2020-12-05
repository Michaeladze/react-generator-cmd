const tsxTemplate = (name, answers) => {

  let storeImport = '';
  let historyImport = '';
  let locationImport = '';
  let formImport = '';
  let formTemplate = '';
  let childrenImport = false;

  answers.componentOptions.forEach((o) => {
    if (o === 'Redux') {
      storeImport = `import { useDispatch, useSelector } from 'react-redux';\nimport { IStore } from '../../../_store';\n`;
    }

    if (o === 'useLocation') {
      locationImport = `import { useLocation } from 'react-router-dom';\n`;
    }

    if (o === 'useHistory') {
      if (locationImport) {
        locationImport = `import { useLocation, useHistory } from 'react-router-dom';\n`;
      } else {
        historyImport = `import { useHistory } from 'react-router-dom';\n`;
      }
    }

    if (o === 'Children') {
      childrenImport = true;
    }

    if (o === 'useReactiveForm') {
      formImport = `import { useReactiveForm } from 'use-reactive-form';\nimport { object } from 'yup';\n`;
      formTemplate = `const config = {
    fields: {},
    schema: object().shape({
    })
  }
    
  const { ref, values, errors, validate } = useReactiveForm(config);
    
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log(values);
    } else {
      console.log(errors);
    }
  };
    
  // -------------------------------------------------------------------------------------------------------------------
  `
    }
  })


  return `import React${childrenImport ? ', { ReactNode } ' : ''} from 'react';
import './${ name }.scss';
${storeImport}${locationImport}${historyImport}${formImport}

interface IProps {
    ${childrenImport ? 'children: ReactNode | ReactNode[];' : ''}
}

const ${ name }: React.FC<IProps> = ({${childrenImport ? 'children' : ''}}: IProps) => {
  ${storeImport ? 'const dispatch = useDispatch();\n' : ''}${locationImport ? '  const location = useLocation();\n' : ''}${historyImport ? '  const history = useHistory();\n' : ''}
  ${storeImport ? 'const store = useSelector((store: IStore) => store);' : ''}

  // -------------------------------------------------------------------------------------------------------------------
    
  ${formTemplate}

  return (
    <div className=''>
      ${formImport ? `<form className='' ref={ref} onSubmit={onSubmit}>

      </form>` : ''}
    </div>
  );
};

export default ${ name };
  `
};

// ---------------------------------------------------------------------------------------------------------------------

const indexTemplate = (name) => {
  return `import ${ name } from './${ name }';

export default ${ name };
`
}

// ---------------------------------------------------------------------------------------------------------------------

module.exports = {
  tsxTemplate,
  indexTemplate
}
