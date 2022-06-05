const componentTestTemplate = (name, answers) => {

  return `import React from 'react';
import { render } from '@testing-library/react';
import {${ name }} from './${ name }';

describe('Test ${ name } component', () => {

  it('should render ${ name } component', () => {
    const { container } = render(<${ name } />);
  });

})

`;
};

module.exports = {
  componentTestTemplate
};
