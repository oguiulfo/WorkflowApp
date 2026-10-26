import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import WorkflowProperties from './WorkflowProperties.jsx'

describe('workflow properties', () => {
  it('emits edits for workflow name, description, status, and threshold', () => {
    const onChange = vi.fn()
    const workflow = { name: 'Expense approvals', description: 'Review expenses', category: 'Finance', status: 'Active', amountThreshold: 500, steps: [{ id: 1 }] }
    render(<WorkflowProperties workflow={workflow} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Workflow name'), { target: { value: 'Equipment requests' } })
    fireEvent.change(screen.getByLabelText('Workflow description'), { target: { value: 'Review hardware orders' } })
    fireEvent.change(screen.getByLabelText('Workflow status'), { target: { value: 'Paused' } })
    fireEvent.change(screen.getByLabelText('Amount threshold'), { target: { value: '1200' } })

    expect(onChange).toHaveBeenNthCalledWith(1, { name: 'Equipment requests' })
    expect(onChange).toHaveBeenNthCalledWith(2, { description: 'Review hardware orders' })
    expect(onChange).toHaveBeenNthCalledWith(3, { status: 'Paused' })
    expect(onChange).toHaveBeenNthCalledWith(4, { amountThreshold: 1200 })
  })
})