import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

jest.mock('./queries/datoCMSClient', () => ({
  __esModule: true,
  hasDatoCmsCredentials: false,
  requestDatoCMS: jest.fn(),
  default: null,
}));

test('renders landing logo', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const logoElement = screen.getByLabelText(/mohammed azeezulla/i);
  expect(logoElement).toBeInTheDocument();
});
