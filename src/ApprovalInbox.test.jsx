import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApprovalInbox from './ApprovalInbox.jsx'

afterEach(cleanup)

const steps = [
  { id: 1, title: 'Manager review', assigneeId: 'jordan-lee', name: 'Jordan Lee' },
  { id: 2, title: 'Finance review', assigneeId: 'taylor-kim', name: 'Taylor Kim' },
]

const reports = [
  { id: 'EXP-1042', workflowId: 'expense-approvals', description: 'Conference travel', amount: 842.6, requester: 'Riley Chen', purpose: 'Conference attendance', submittedAt: 'Today', status: 'pending', currentStepIndex: 0, approvals: [] },
  { id: 'EXP-1047', workflowId: 'expense-approvals', description: 'Software licenses', amount: 1240, requester: 'Morgan Reed', purpose: 'Design software', submittedAt: 'Yesterday', status: 'pending', currentStepIndex: 1, approvals: [] },
]

const workflows = [{ id: 'expense-approvals', steps }]

describe('approval inbox', () => {
  it('shows only requests assigned to the signed-in user', () => {
    render(<ApprovalInbox reports={reports} workflows={workflows} user={{ id: 'jordan-lee', name: 'Jordan Lee' }} onDecision={vi.fn()} />)

    expect(screen.getByRole('button', { name: /Conference travel/ })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Software licenses/ })).toBeNull()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeTruthy()
  })

  it('records a decline reason for the selected request', async () => {
    const user = userEvent.setup()
    const onDecision = vi.fn()
    render(<ApprovalInbox reports={reports} workflows={workflows} user={{ id: 'jordan-lee', name: 'Jordan Lee' }} onDecision={onDecision} />)

    await user.click(screen.getByRole('button', { name: 'Decline' }))
    await user.type(screen.getByLabelText('Reason for declining'), 'Please attach a receipt.')
    await user.click(screen.getByRole('button', { name: 'Confirm decline' }))

    expect(onDecision).toHaveBeenCalledWith('EXP-1042', 'declined', 'Please attach a receipt.')
  })
})