import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkflowOverview from './WorkflowOverview.jsx'

afterEach(cleanup)

describe('workflow overview', () => {
  it('shows pending runs by default and filters completed decisions', async () => {
    const user = userEvent.setup()
    render(<WorkflowOverview onOpenWorkflows={vi.fn()} />)

    expect(screen.getByText('Conference travel')).toBeTruthy()
    expect(screen.queryByText('Laptop replacement')).toBeNull()

    await user.click(screen.getByRole('tab', { name: /Completed/ }))

    expect(screen.getByText('Laptop replacement')).toBeTruthy()
    expect(screen.getByText('Client dinner')).toBeTruthy()
    expect(screen.queryByText('Conference travel')).toBeNull()
  })

  it('opens the workflow editor from the overview', async () => {
    const user = userEvent.setup()
    const onOpenWorkflows = vi.fn()
    render(<WorkflowOverview onOpenWorkflows={onOpenWorkflows} />)

    await user.click(screen.getByRole('button', { name: 'Open workflow editor' }))

    expect(onOpenWorkflows).toHaveBeenCalledOnce()
  })
})