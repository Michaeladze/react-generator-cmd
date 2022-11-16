import React from 'react';
import { render } from '@testing-library/react';
import { p } from './p';

describe('Test p component', () => {

  it('should render p component', () => {
    const { container } = render(<p />);
  });

});
