export function defineWorkflow({ id, name, steps, amountThreshold }) {
  if (!id || !name?.trim()) {
    throw new Error('A workflow needs an id and a name.')
  }

  if (!Array.isArray(steps) || steps.length === 0) {
    throw new Error('A workflow needs at least one approval step.')
  }

  const normalizedSteps = steps.map((step, index) => {
    const stepId = step.id ?? `${id}-step-${index + 1}`
    const title = step.title?.trim()
    const approver = step.approver?.trim()

    if (!title || !approver) {
      throw new Error('Every approval step needs a title and an approver.')
    }

    return { id: stepId, title, approver }
  })

  if (new Set(normalizedSteps.map((step) => step.id)).size !== normalizedSteps.length) {
    throw new Error('Approval step ids must be unique.')
  }

  if (amountThreshold !== undefined && (!Number.isFinite(amountThreshold) || amountThreshold < 0)) {
    throw new Error('The amount threshold must be a non-negative number.')
  }

  return {
    id,
    name: name.trim(),
    steps: normalizedSteps,
    amountThreshold,
  }
}

export function submitExpenseReport({ id, description, amount, requester }, workflow) {
  if (!workflow?.steps?.length) {
    throw new Error('An expense report needs a workflow with approval steps.')
  }

  if (!id || !description?.trim() || !requester?.trim() || !Number.isFinite(amount) || amount < 0) {
    throw new Error('An expense report needs valid details and a non-negative amount.')
  }

  return {
    id,
    description: description.trim(),
    amount,
    requester: requester.trim(),
    workflowId: workflow.id,
    status: 'pending',
    currentStepIndex: 0,
    approvals: [],
  }
}

export function approveExpenseReport(report, workflow, approver) {
  if (report.status !== 'pending') {
    throw new Error('Only pending expense reports can be approved.')
  }

  const step = workflow.steps[report.currentStepIndex]
  if (!step || step.approver !== approver) {
    throw new Error('Only the current step approver can approve this report.')
  }

  const approvals = [...report.approvals, { stepId: step.id, approver }]
  const nextStepIndex = report.currentStepIndex + 1
  const complete = nextStepIndex === workflow.steps.length

  return {
    ...report,
    status: complete ? 'approved' : 'pending',
    currentStepIndex: complete ? null : nextStepIndex,
    approvals,
  }
}

export function decideExpenseReport(report, steps, actor, decision, reason = '') {
  if (report.status !== 'pending') {
    throw new Error('Only pending expense reports can receive a decision.')
  }

  if (decision !== 'approved' && decision !== 'declined') {
    throw new Error('Decision must be approved or declined.')
  }

  if (decision === 'declined' && !reason.trim()) {
    throw new Error('A reason is required when declining an expense report.')
  }

  const step = steps[report.currentStepIndex]
  if (!step || step.assigneeId !== actor.id) {
    throw new Error('Only the assigned approver can decide this expense report.')
  }

  const approvals = [...report.approvals, {
    stepId: step.id,
    approverId: actor.id,
    approverName: actor.name,
    decision,
    reason: reason.trim(),
    decidedAt: new Date().toISOString(),
  }]

  if (decision === 'declined') {
    return { ...report, status: 'declined', currentStepIndex: null, approvals }
  }

  const nextStepIndex = report.currentStepIndex + 1
  const complete = nextStepIndex >= steps.length
  return {
    ...report,
    status: complete ? 'approved' : 'pending',
    currentStepIndex: complete ? null : nextStepIndex,
    approvals,
  }
}