import { describe, expect, it } from 'vitest'
import { approveExpenseReport, decideExpenseReport, defineWorkflow, submitExpenseReport } from './workflow.js'

describe('expense approval workflows', () => {
  it('lets an admin define an ordered workflow', () => {
    const workflow = defineWorkflow({
      id: 'expense-approvals',
      name: 'Expense approvals',
      amountThreshold: 500,
      steps: [
        { id: 'manager', title: 'Manager review', approver: 'Jordan Lee' },
        { id: 'finance', title: 'Finance review', approver: 'Finance team' },
      ],
    })

    expect(workflow).toEqual({
      id: 'expense-approvals',
      name: 'Expense approvals',
      amountThreshold: 500,
      steps: [
        { id: 'manager', title: 'Manager review', approver: 'Jordan Lee' },
        { id: 'finance', title: 'Finance review', approver: 'Finance team' },
      ],
    })
  })

  it('assigns a user to a workflow step and accepts their approval', () => {
    const workflow = defineWorkflow({
      id: 'single-approver',
      name: 'Equipment approval',
      steps: [{ id: 'manager', title: 'Manager review', approver: 'Jordan Lee' }],
    })
    const report = submitExpenseReport({
      id: 'expense-2048',
      description: 'Monitor',
      amount: 320,
      requester: 'Riley Chen',
    }, workflow)

    expect(workflow.steps[0].approver).toBe('Jordan Lee')

    const approvedReport = approveExpenseReport(report, workflow, 'Jordan Lee')

    expect(approvedReport.status).toBe('approved')
    expect(approvedReport.approvals).toEqual([{ stepId: 'manager', approver: 'Jordan Lee' }])
  })

  it('moves a sample expense report through each approval step', () => {
    const workflow = defineWorkflow({
      id: 'expense-approvals',
      name: 'Expense approvals',
      steps: [
        { id: 'manager', title: 'Manager review', approver: 'Jordan Lee' },
        { id: 'finance', title: 'Finance review', approver: 'Finance team' },
      ],
    })
    const sampleReport = submitExpenseReport({
      id: 'expense-1042',
      description: 'Conference travel',
      amount: 820,
      requester: 'Riley Chen',
    }, workflow)

    expect(sampleReport.status).toBe('pending')
    expect(sampleReport.currentStepIndex).toBe(0)
    expect(() => approveExpenseReport(sampleReport, workflow, 'Finance team')).toThrow(/current step approver/)

    const managerApproved = approveExpenseReport(sampleReport, workflow, 'Jordan Lee')
    expect(managerApproved.status).toBe('pending')
    expect(managerApproved.currentStepIndex).toBe(1)
    expect(managerApproved.approvals).toEqual([{ stepId: 'manager', approver: 'Jordan Lee' }])

    const financeApproved = approveExpenseReport(managerApproved, workflow, 'Finance team')
    expect(financeApproved.status).toBe('approved')
    expect(financeApproved.currentStepIndex).toBeNull()
    expect(financeApproved.approvals).toEqual([
      { stepId: 'manager', approver: 'Jordan Lee' },
      { stepId: 'finance', approver: 'Finance team' },
    ])
  })

  it('advances a report only when its assigned user approves', () => {
    const steps = [
      { id: 'manager', assigneeId: 'jordan-lee' },
      { id: 'finance', assigneeId: 'taylor-kim' },
    ]
    const report = { id: 'EXP-1042', status: 'pending', currentStepIndex: 0, approvals: [] }

    expect(() => decideExpenseReport(report, steps, { id: 'taylor-kim', name: 'Taylor Kim' }, 'approved')).toThrow(/assigned approver/)

    const updated = decideExpenseReport(report, steps, { id: 'jordan-lee', name: 'Jordan Lee' }, 'approved')
    expect(updated.status).toBe('pending')
    expect(updated.currentStepIndex).toBe(1)
    expect(updated.approvals[0]).toMatchObject({ stepId: 'manager', approverId: 'jordan-lee', decision: 'approved' })
  })

  it('declines a report with a recorded reason', () => {
    const report = { id: 'EXP-1042', status: 'pending', currentStepIndex: 0, approvals: [] }
    const steps = [{ id: 'manager', assigneeId: 'jordan-lee' }]
    const updated = decideExpenseReport(report, steps, { id: 'jordan-lee', name: 'Jordan Lee' }, 'declined', 'Missing receipt')

    expect(updated.status).toBe('declined')
    expect(updated.currentStepIndex).toBeNull()
    expect(updated.approvals[0]).toMatchObject({ decision: 'declined', reason: 'Missing receipt' })
    expect(() => decideExpenseReport(report, steps, { id: 'jordan-lee', name: 'Jordan Lee' }, 'declined')).toThrow(/reason is required/)
  })
})