import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Notes from '../components/Notes'

describe('Note componente', () => {
  test('clicking the button calls event handler once', () => {
    const note = {
      content: 'This is a note',
      important: true
    }

    const mockHandle = jest.fn()

    const view = render(<Notes note={note} toggleImportance={mockHandle} />)

    const button = view.getByText('make not important')
    fireEvent.click(button)

    expect(mockHandle).toHaveBeenCalledTimes(1)
  })
})