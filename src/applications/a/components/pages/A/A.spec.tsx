import React from 'react';
import { render } from '@testing-library/react';
import {A} from './A';

describe('Test A component', () => {

  it('should render A component', () => {
    const { container } = render(<A />);
  });

})

