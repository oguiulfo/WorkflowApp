import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WorkflowLibrary from './WorkflowLibrary.jsx'

afterEach(cleanup)

const workflows = [{ id: 'expense', name: 'Expense approvals', description: 'Review expenses', category: 'Finance', amountThreshold: 500, status: 'Active', steps: [{ id: 1 }, { id: 2 }] }]

describe('workflow library', () => {
  it('creates a workflow with its editable properties', async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()
    render(<WorkflowLibrary workflows={workflows} onCreate={onCreate} onOpen={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'New workflow' }))
    await user.type(screen.getByLabelText('Workflow name'), 'Equipment requests')
    await user.type(screen.getByLabelText('Description'), 'Review hardware purchases')
    await user.selectOptions(screen.getByLabelText('Category'), 'IT')
    await user.clear(screen.getByLabelText('Amount threshold'))
    await user.type(screen.getByLabelText('Amount threshold'), '1200')
    await user.click(screen.getByRole('button', { name: 'Create workflow' }))

    expect(onCreate).toHaveBeenCalledWith({ name: 'Equipment requests', description: 'Review hardware purchases', category: 'IT', amountThreshold: 1200 })
  })

  it('opens an existing workflow for editing', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    render(<WorkflowLibrary workflows={workflows} onCreate={vi.fn()} onOpen={onOpen} />)

    await user.click(screen.getByRole('button', { name: 'Edit Expense approvals' }))

    expect(onOpen).toHaveBeenCalledWith('expense')
  })
})