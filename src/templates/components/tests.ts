import { IAnswersBase } from '../../types/types';

export const componentTestTemplate = (name: string, answers: IAnswersBase) => {

  return `import React from 'react';
import { render } from '@testing-library/react';
import {${name}} from './${name}';

describe('Test ${name} component', () => {

  it('should render ${name} component', () => {
    const { container } = render(<${name} />);
  });

})

`;
};
