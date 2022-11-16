import React from 'react';
import { render } from '@testing-library/react';
import { Atom } from './Atom';

describe('Test Atom component', () => {

  it('should render Atom component', () => {
    const { container } = render(<Atom />);
  });

});
