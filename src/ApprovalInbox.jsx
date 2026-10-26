import { useState } from 'react'
import { ArrowRight, CalendarClock, Check, CheckCircle2, Clock3, FileText, UserRound, X, XCircle } from 'lucide-react'

export default function ApprovalInbox({ reports, workflows, user, onDecision }) {
  const [view, setView] = useState('pending')
  const [selectedId, setSelectedId] = useState(null)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  function stepsFor(report) {
    return workflows.find((workflow) => workflow.id === report.workflowId)?.steps ?? []
  }

  const pendingCount = reports.filter((report) => report.status === 'pending' && stepsFor(report)[report.currentStepIndex]?.assigneeId === user.id).length
  const visibleReports = reports.filter((report) => {
    if (view === 'pending') {
      return report.status === 'pending' && stepsFor(report)[report.currentStepIndex]?.assigneeId === user.id
    }
    return report.approvals.some((approval) => approval.approverId === user.id)
  })
  const selectedReport = visibleReports.find((report) => report.id === selectedId) ?? visibleReports[0] ?? null
  const selectedSteps = selectedReport ? stepsFor(selectedReport) : []
  const activeStep = selectedReport?.status === 'pending' ? selectedSteps[selectedReport.currentStepIndex] : null
  const canDecide = activeStep?.assigneeId === user.id

  function decide(decision, decisionReason = '') {
    onDecision(selectedReport.id, decision, decisionReason)
    setDeclineOpen(false)
    setReason('')
    setReasonError('')
  }

  function submitDecline(event) {
    event.preventDefault()
    if (!reason.trim()) {
      setReasonError('Add a reason so the requester knows what to fix.')
      return
    }
    decide('declined', reason)
  }

  return <div className="approval-screen">
    <div className="page-heading approval-page-heading">
      <div><div className="eyebrow"><span /> WORKSPACE <b>/</b> APPROVALS</div><h1>Approvals</h1><p className="subtitle">Review requests assigned to you and record a decision.</p></div>
    </div>

    <div className="approval-summary"><span className="approval-summary-icon"><Clock3 size={16} /></span><span><strong>{pendingCount} requests need your review</strong><small>Only steps assigned to {user.name} can be approved or declined here.</small></span></div>

    <div className="approval-layout">
      <section className="approval-queue" aria-label="Approval requests">
        <div className="approval-queue-heading"><div><h2>Your queue</h2><p>Expense requests routed to your role.</p></div></div>
        <div className="approval-filter" role="tablist" aria-label="Approval views">
          <button type="button" role="tab" aria-selected={view === 'pending'} className={view === 'pending' ? 'selected' : ''} onClick={() => { setView('pending'); setSelectedId(null) }}>Needs review <span>{pendingCount}</span></button>
          <button type="button" role="tab" aria-selected={view === 'history'} className={view === 'history' ? 'selected' : ''} onClick={() => { setView('history'); setSelectedId(null) }}>My decisions</button>
        </div>
        <div className="approval-request-list">
          {visibleReports.map((report) => {
            const reportSteps = stepsFor(report)
            const step = report.status === 'pending' ? reportSteps[report.currentStepIndex] : null
            const selected = selectedReport?.id === report.id
            return <button key={report.id} type="button" className={`approval-request${selected ? ' selected' : ''}`} onClick={() => setSelectedId(report.id)} aria-current={selected ? 'true' : undefined}>
              <span className={`request-status-mark ${report.status}`}>{report.status === 'pending' ? <Clock3 size={15} /> : report.status === 'approved' ? <CheckCircle2 size={15} /> : <XCircle size={15} />}</span>
              <span className="request-row-copy"><strong>{report.description}</strong><small>{report.id} <b>·</b> {report.requester}</small><span>{step ? `${step.title} · ${step.name}` : report.status === 'approved' ? 'Approved' : 'Declined'}</span></span>
              <span className="request-row-amount">${report.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </button>
          })}
          {visibleReports.length === 0 && <div className="approval-queue-empty"><CheckCircle2 size={19} /><strong>{view === 'pending' ? 'You’re all caught up' : 'No decisions yet'}</strong><span>{view === 'pending' ? 'New requests assigned to you will appear here.' : 'Your completed decisions will appear here.'}</span></div>}
        </div>
      </section>

      <section className="approval-detail" aria-label="Selected expense request">
        {selectedReport ? <>
          <div className="approval-detail-heading"><div><span className="detail-id">{selectedReport.id}</span><h2>{selectedReport.description}</h2><p>Submitted by {selectedReport.requester}</p></div><strong className="detail-amount">${selectedReport.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong></div>
          <div className="detail-metadata"><span><CalendarClock size={14} /> Submitted {selectedReport.submittedAt}</span><span><FileText size={14} /> Expense report</span></div>
          <div className="detail-purpose"><span>PURPOSE</span><p>{selectedReport.purpose}</p></div>

          <div className="approval-progress-heading"><h3>Approval progress</h3><span>{selectedReport.status === 'pending' ? `Step ${selectedReport.currentStepIndex + 1} of ${selectedSteps.length}` : selectedReport.status === 'approved' ? 'Complete' : 'Closed'}</span></div>
          <div className="approval-progress">{selectedSteps.map((step, index) => {
            const decision = selectedReport.approvals.find((approval) => approval.stepId === step.id)
            const current = selectedReport.status === 'pending' && index === selectedReport.currentStepIndex
            const future = selectedReport.status === 'pending' && index > selectedReport.currentStepIndex
            return <div className={`progress-step${decision ? ' decided' : ''}${current ? ' current' : ''}${future ? ' future' : ''}`} key={step.id}><span className="progress-icon">{decision?.decision === 'approved' ? <Check size={14} /> : decision?.decision === 'declined' ? <X size={14} /> : <UserRound size={14} />}</span><span className="progress-copy"><strong>{step.title}</strong><small>{decision ? `${decision.approverName} · ${decision.decision}` : current ? `${step.name} · Awaiting decision` : `${step.name} · ${future ? 'Up next' : 'Not reached'}`}</small>{decision?.reason && <em>{decision.reason}</em>}</span>{current && <span className="current-step-label">YOUR TURN</span>}</div>
          })}</div>

          {canDecide ? <div className="approval-actions"><span>Reviewing as <strong>{user.name}</strong></span><div><button className="button button-secondary reject-button" type="button" onClick={() => setDeclineOpen(true)}><X size={15} /> Decline</button><button className="button button-primary approve-button" type="button" onClick={() => decide('approved')}><Check size={15} /> Approve</button></div></div> : <div className="approval-readonly"><CheckCircle2 size={15} /><span>{selectedReport.status === 'pending' ? `Waiting for ${activeStep?.name ?? 'the next approver'}` : `This request was ${selectedReport.status}.`}</span></div>}
        </> : <div className="approval-detail-empty"><span><FileText size={20} /></span><strong>{view === 'pending' ? 'Select a request to review' : 'Select a decision to view'}</strong><small>Request details and approval progress will appear here.</small></div>}
      </section>
    </div>

    {declineOpen && selectedReport && <div className="dialog-backdrop"><section className="people-dialog decline-dialog" role="dialog" aria-modal="true" aria-labelledby="decline-title"><div className="dialog-heading"><div><span className="dialog-icon warning-icon"><XCircle size={17} /></span><div><h2 id="decline-title">Decline request?</h2><p>{selectedReport.description} · ${selectedReport.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p></div></div><button className="icon-button" type="button" aria-label="Close decline dialog" onClick={() => setDeclineOpen(false)}><X size={17} /></button></div><form onSubmit={submitDecline}><label className="dialog-field">Reason for declining<textarea autoFocus rows="4" value={reason} onChange={(event) => { setReason(event.target.value); setReasonError('') }} placeholder="Let the requester know what needs to change." required /></label>{reasonError && <p className="form-error" role="alert">{reasonError}</p>}<div className="dialog-actions"><button className="button button-secondary" type="button" onClick={() => setDeclineOpen(false)}>Cancel</button><button className="button button-danger" type="submit"><X size={15} /> Confirm decline</button></div></form></section></div>}
  </div>
}