import { useState } from 'react'
import { ArrowRight, CheckCircle2, Clock3, FileText, GitBranch, XCircle } from 'lucide-react'

const workflowRuns = [
  { id: 'EXP-1042', title: 'Conference travel', requester: 'Riley Chen', amount: '$842.60', status: 'pending', step: 'Manager review', approver: 'Jordan Lee', updated: 'Today, 10:42 AM', progress: 'Step 1 of 3' },
  { id: 'EXP-1047', title: 'Software licenses', requester: 'Morgan Reed', amount: '$1,240.00', status: 'pending', step: 'Finance review', approver: 'Taylor Kim', updated: 'Yesterday', progress: 'Step 2 of 3' },
  { id: 'EXP-1038', title: 'Laptop replacement', requester: 'Casey Nguyen', amount: '$1,899.00', status: 'approved', step: 'Approved', approver: 'Alex Morgan', updated: 'Oct 24, 2026', progress: 'Completed in 1.2 days' },
  { id: 'EXP-1031', title: 'Client dinner', requester: 'Avery Patel', amount: '$284.50', status: 'declined', step: 'Declined', approver: 'Jordan Lee', updated: 'Oct 23, 2026', progress: 'Completed in 3 hours' },
]

export default function WorkflowOverview({ onOpenWorkflows }) {
  const [view, setView] = useState('pending')
  const runs = workflowRuns.filter((run) => view === 'pending' ? run.status === 'pending' : run.status !== 'pending')

  return <div className="overview-screen">
    <div className="page-heading overview-heading">
      <div><div className="eyebrow"><span /> NORTHSTAR STUDIO <b>/</b> WORKSPACE</div><h1>Overview</h1><p className="subtitle">A clear view of requests in motion and decisions made.</p></div>
      <button className="button button-secondary" type="button" onClick={onOpenWorkflows}><GitBranch size={15} /> Open workflow editor</button>
    </div>

    <section className="overview-metrics" aria-label="Workflow summary">
      <div className="overview-metric"><span>Pending requests</span><strong>{workflowRuns.filter((run) => run.status === 'pending').length}</strong><small><Clock3 size={13} /> Waiting for review</small></div>
      <div className="overview-metric"><span>Completed this month</span><strong>{workflowRuns.filter((run) => run.status !== 'pending').length}</strong><small><CheckCircle2 size={13} /> Approved or declined</small></div>
      <div className="overview-metric"><span>Active workflows</span><strong>4</strong><small><GitBranch size={13} /> Across the workspace</small></div>
      <div className="overview-metric"><span>Median approval time</span><strong>1.4 <em>days</em></strong><small><FileText size={13} /> Based on the last 30 days</small></div>
    </section>

    <section className="overview-runs" aria-label="Workflow requests">
      <div className="overview-runs-heading"><div><h2>Recent workflow runs</h2><p>Track each request from submission to decision.</p></div><div className="overview-tabs" role="tablist" aria-label="Workflow run status">
        <button className={view === 'pending' ? 'selected' : ''} role="tab" aria-selected={view === 'pending'} type="button" onClick={() => setView('pending')}>Pending <span>{workflowRuns.filter((run) => run.status === 'pending').length}</span></button>
        <button className={view === 'completed' ? 'selected' : ''} role="tab" aria-selected={view === 'completed'} type="button" onClick={() => setView('completed')}>Completed <span>{workflowRuns.filter((run) => run.status !== 'pending').length}</span></button>
      </div></div>
      <div className="overview-table-scroll"><table className="overview-table"><thead><tr><th scope="col">Request</th><th scope="col">Submitted by</th><th scope="col">Amount</th><th scope="col">{view === 'pending' ? 'Current step' : 'Decision'}</th><th scope="col">Updated</th><th scope="col"><span className="visually-hidden">Open workflow</span></th></tr></thead>
        <tbody>{runs.map((run) => <tr key={run.id}><td><div className="run-name"><strong>{run.title}</strong><small>{run.id} <span>·</span> {run.progress}</small></div></td><td>{run.requester}</td><td className="run-amount">{run.amount}</td><td><span className={`run-status ${run.status}`}>{run.status === 'pending' ? <Clock3 size={13} /> : run.status === 'approved' ? <CheckCircle2 size={13} /> : <XCircle size={13} />}{run.status === 'pending' ? <span><strong>{run.step}</strong><small>{run.approver}</small></span> : <span><strong>{run.step}</strong><small>{run.approver}</small></span>}</span></td><td className="run-updated">{run.updated}</td><td><button className="run-open" type="button" aria-label={`Open ${run.title}`} onClick={onOpenWorkflows}><ArrowRight size={15} /></button></td></tr>)}
          {runs.length === 0 && <tr><td colSpan="6"><div className="overview-empty"><CheckCircle2 size={19} /><strong>Nothing to show</strong><span>There are no {view} workflow runs.</span></div></td></tr>}
        </tbody></table></div>
      <div className="overview-table-footer"><span>Showing {runs.length} recent {view} requests</span><button type="button" onClick={onOpenWorkflows}>View workflow setup <ArrowRight size={13} /></button></div>
    </section>
    <footer className="page-footer"><span>Workflow activity for Northstar Studio.</span><span>Sample workspace data</span></footer>
  </div>
}