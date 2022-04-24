import React from 'react';
import { render } from '@testing-library/react';
import Message from './Message';

describe('Test Message component', () => {

  it('should render Message component', () => {
    const { container } = render(<Message />);
  });

})

