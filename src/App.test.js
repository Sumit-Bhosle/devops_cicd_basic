import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weather dashboard header', () => {
  render(<App />);
  const title = screen.getByText(/Weather Dashboard/i);
  expect(title).toBeInTheDocument();
});

test('has location input and search button', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter City \(e\.g\., London\)/i);
  const button = screen.getByRole('button', { name: /Search Location/i });
  expect(input).toBeInTheDocument();
  expect(button).toBeInTheDocument();
});
