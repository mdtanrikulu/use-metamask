import { render, screen } from '@testing-library/react';
import App from './App';

test('renders chain info', () => {
  render(<App />);
  const linkElement = screen.getByText(/Dapp connected to the/i);
  expect(linkElement).toBeInTheDocument();
});
