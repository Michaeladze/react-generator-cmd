import React from 'react';
import { render } from '@testing-library/react';
import MessageAuthor from './MessageAuthor';

describe('Test MessageAuthor component', () => {

  it('should render MessageAuthor component', () => {
    const { container } = render(<MessageAuthor />);
  });

})

