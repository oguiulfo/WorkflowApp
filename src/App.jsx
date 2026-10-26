import { useState } from 'react'
import LoginScreen from './LoginScreen.jsx'
import ApprovalInbox from './ApprovalInbox.jsx'
import PeopleDirectory from './PeopleDirectory.jsx'
import WorkflowOverview from './WorkflowOverview.jsx'
import WorkflowLibrary from './WorkflowLibrary.jsx'
import WorkflowProperties from './WorkflowProperties.jsx'
import { decideExpenseReport } from './workflow.js'
import {
  Activity, ArrowDown, ArrowRight, Bell, Building2, Check, CheckCircle2, ClipboardCheck,
  ChevronDown, CircleHelp, Clock3, Copy, Ellipsis, FileText, GitBranch,
  Layers2, Plus, Search, Settings2, ShieldCheck, SlidersHorizontal, Sparkles,
  Users, X,
} from 'lucide-react'

const initialPeople = [
  { id: 'jordan-lee', name: 'Jordan Lee', email: 'jordan.lee@northstar.studio', role: 'Manager', initials: 'JL', tone: 'mint' },
  { id: 'sam-carter', name: 'Sam Carter', email: 'sam.carter@northstar.studio', role: 'Admin', initials: 'SC', tone: 'peach' },
  { id: 'taylor-kim', name: 'Taylor Kim', email: 'taylor.kim@northstar.studio', role: 'Finance', initials: 'TK', tone: 'blue' },
  { id: 'alex-morgan', name: 'Alex Morgan', email: 'alex.morgan@northstar.studio', role: 'Department head', initials: 'AM', tone: 'lavender' },
  { id: 'riley-chen', name: 'Riley Chen', email: 'riley.chen@northstar.studio', role: 'Employee', initials: 'RC', tone: 'mint' },
]

const initialSteps = [
  { id: 1, title: 'Manager review', role: 'Direct manager', assigneeId: 'jordan-lee', name: 'Jordan Lee', initials: 'JL', tone: 'mint', icon: Users },
  { id: 2, title: 'Finance review', role: 'Finance team', assigneeId: 'taylor-kim', name: 'Taylor Kim', initials: 'TK', tone: 'blue', icon: Building2 },
  { id: 3, title: 'Executive approval', role: 'Department head', assigneeId: 'alex-morgan', name: 'Alex Morgan', initials: 'AM', tone: 'lavender', icon: ShieldCheck },
]

const initialWorkflow = {
  id: 'expense-approvals',
  name: 'Expense approvals',
  description: 'The right eyes on every expense, in the right order.',
  category: 'Finance',
  amountThreshold: 500,
  status: 'Active',
  steps: initialSteps,
}

const initialReports = [
  { id: 'EXP-1042', workflowId: 'expense-approvals', description: 'Conference travel', amount: 842.6, requester: 'Riley Chen', purpose: 'Attend the annual product leadership conference in Seattle.', submittedAt: 'Today, 9:18 AM', status: 'pending', currentStepIndex: 0, approvals: [] },
  { id: 'EXP-1047', workflowId: 'expense-approvals', description: 'Software licenses', amount: 1240, requester: 'Morgan Reed', purpose: 'Annual design and prototyping licenses for the product team.', submittedAt: 'Yesterday, 2:06 PM', status: 'pending', currentStepIndex: 1, approvals: [{ stepId: 1, approverId: 'jordan-lee', approverName: 'Jordan Lee', decision: 'approved', reason: '', decidedAt: 'Yesterday, 3:12 PM' }] },
  { id: 'EXP-1038', workflowId: 'expense-approvals', description: 'Laptop replacement', amount: 1899, requester: 'Casey Nguyen', purpose: 'Replace a damaged development laptop.', submittedAt: 'Oct 24, 2026', status: 'approved', currentStepIndex: null, approvals: [{ stepId: 1, approverId: 'jordan-lee', approverName: 'Jordan Lee', decision: 'approved', reason: '', decidedAt: 'Oct 24, 2026' }, { stepId: 2, approverId: 'taylor-kim', approverName: 'Taylor Kim', decision: 'approved', reason: '', decidedAt: 'Oct 24, 2026' }, { stepId: 3, approverId: 'alex-morgan', approverName: 'Alex Morgan', decision: 'approved', reason: '', decidedAt: 'Oct 24, 2026' }] },
  { id: 'EXP-1031', workflowId: 'expense-approvals', description: 'Client dinner', amount: 284.5, requester: 'Avery Patel', purpose: 'Dinner with prospective customer representatives.', submittedAt: 'Oct 23, 2026', status: 'declined', currentStepIndex: null, approvals: [{ stepId: 1, approverId: 'jordan-lee', approverName: 'Jordan Lee', decision: 'declined', reason: 'Please attach an itemized receipt.', decidedAt: 'Oct 23, 2026' }] },
]

const navItems = [
  { label: 'Overview', icon: Layers2 }, { label: 'Approvals', icon: ClipboardCheck }, { label: 'Workflows', icon: GitBranch, active: true },
  { label: 'Activity', icon: Activity }, { label: 'People', icon: Users },
]

export default function App() {
  const [signedInUser, setSignedInUser] = useState(null)

  if (!signedInUser) return <LoginScreen onLogin={setSignedInUser} />
  return <WorkflowApp signedInUser={signedInUser} />
}

function WorkflowApp({ signedInUser }) {
  const [page, setPage] = useState('Workflows')
  const [workflowView, setWorkflowView] = useState('library')
  const [workflows, setWorkflows] = useState([initialWorkflow])
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(initialWorkflow.id)
  const [people, setPeople] = useState(initialPeople)
  const [reports, setReports] = useState(initialReports)
  const [selected, setSelected] = useState(1)
  const [tab, setTab] = useState('Workflow')
  const [delegate, setDelegate] = useState('Taylor Kim')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const currentWorkflow = workflows.find((workflow) => workflow.id === selectedWorkflowId)
  const steps = currentWorkflow?.steps ?? []
  const amount = String(currentWorkflow.amountThreshold)
  const enabled = currentWorkflow?.status === 'Active'
  const current = steps.find((step) => step.id === selected)

  function updateCurrentWorkflow(update) {
    setWorkflows((list) => list.map((workflow) => workflow.id === selectedWorkflowId
      ? { ...workflow, ...(typeof update === 'function' ? update(workflow) : update) }
      : workflow))
  }

  function createWorkflow(properties) {
    const id = `workflow-${Date.now()}`
    const newSteps = initialSteps.map((step, index) => ({ ...step, id: `${id}-step-${index + 1}` }))
    const workflow = { ...properties, id, status: 'Draft', steps: newSteps }
    setWorkflows((list) => [...list, workflow])
    setSelectedWorkflowId(id)
    setSelected(newSteps[0].id)
    setWorkflowView('editor')
    setPage('Workflows')
    setTab('Properties')
    notify('Workflow created')
  }

  function openWorkflow(workflowId) {
    const workflow = workflows.find((item) => item.id === workflowId)
    if (!workflow) return
    setSelectedWorkflowId(workflow.id)
    setSelected(workflow.steps[0].id)
    setWorkflowView('editor')
    setPage('Workflows')
    setTab('Workflow')
  }

  function decideReport(reportId, decision, reason) {
    const report = reports.find((item) => item.id === reportId)
    if (!report) return

    try {
      const workflow = workflows.find((item) => item.id === report.workflowId)
      if (!workflow) throw new Error('This request’s workflow is no longer available.')
      const updatedReport = decideExpenseReport(report, workflow.steps, signedInUser, decision, reason)
      setReports((list) => list.map((item) => item.id === reportId ? updatedReport : item))
      notify(decision === 'approved' ? 'Approval recorded' : 'Request declined')
    } catch (error) {
      notify(error.message)
    }
  }

  function notify(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }

  function assignApprover(personId) {
    const person = people.find((item) => item.id === personId)
    updateCurrentWorkflow((workflow) => ({
      steps: workflow.steps.map((step) => step.id === selected ? {
        ...step,
        assigneeId: person?.id ?? '',
        name: person?.name ?? 'Unassigned',
        initials: person?.initials ?? '+',
        tone: person?.tone ?? 'lavender',
        role: person ? step.role : 'Choose an approver',
      } : step),
    }))
  }

  function addPerson(person) {
    setPeople((list) => [...list, person])
    notify(`${person.name} added to the workspace`)
  }

  function removePerson(personId) {
    const person = people.find((item) => item.id === personId)
    setPeople((list) => list.filter((item) => item.id !== personId))
    setWorkflows((list) => list.map((workflow) => ({
      ...workflow,
      steps: workflow.steps.map((step) => step.assigneeId === personId ? {
        ...step,
        assigneeId: '',
        name: 'Unassigned',
        initials: '+',
        tone: 'lavender',
        role: 'Choose an approver',
      } : step),
    })))
    if (person) notify(`${person.name} removed from the workspace`)
  }

  function addStep() {
    const id = `${currentWorkflow.id}-step-${Date.now()}`
    updateCurrentWorkflow((workflow) => ({ steps: [...workflow.steps, { id, title: 'New approval step', role: 'Choose an approver', assigneeId: '', name: 'Unassigned', initials: '+', tone: 'lavender', icon: Users }] }))
    setSelected(id)
  }

  function moveStep(direction) {
    const index = steps.findIndex((step) => step.id === selected)
    const next = index + direction
    if (next < 0 || next >= steps.length) return
    const updated = [...steps]
    ;[updated[index], updated[next]] = [updated[next], updated[index]]
    updateCurrentWorkflow({ steps: updated })
    setMenuOpen(false)
  }

  function duplicateStep() {
    const id = `${currentWorkflow.id}-step-${Date.now()}`
    const index = steps.findIndex((step) => step.id === selected)
    const updated = [...steps]
    updated.splice(index + 1, 0, { ...current, id, title: `${current.title} copy` })
    updateCurrentWorkflow({ steps: updated })
    setSelected(id)
    setMenuOpen(false)
    notify('Step duplicated')
  }

  function removeStep() {
    if (steps.length < 2) return notify('A workflow needs at least one approval step')
    const index = steps.findIndex((step) => step.id === selected)
    const updated = steps.filter((step) => step.id !== selected)
    updateCurrentWorkflow({ steps: updated })
    setSelected(updated[Math.max(0, index - 1)].id)
    setMenuOpen(false)
    notify('Step removed')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#home"><span className="brand-mark"><GitBranch size={18} /></span><span>flowstate</span></a>
        <button className="workspace-switcher" type="button"><span className="workspace-icon">N</span><span className="workspace-copy"><strong>Northstar Studio</strong><small>Workspace</small></span><ChevronDown size={15} /></button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="primary-nav" aria-label="Workspace navigation">
          {navItems.map(({ label, icon: Icon }) => <button className={`nav-item${page === label ? ' active' : ''}`} key={label} type="button" onClick={() => { if (label === 'Workflows') { setPage(label); setWorkflowView('library') } else if (label === 'Overview' || label === 'Approvals' || label === 'People') setPage(label); else notify(`${label} view coming soon`) }}><Icon size={17} /><span>{label}</span>{label === 'Approvals' && <i>{reports.filter((report) => report.status === 'pending' && workflows.find((workflow) => workflow.id === report.workflowId)?.steps[report.currentStepIndex]?.assigneeId === signedInUser.id).length}</i>}{label === 'Activity' && <i>3</i>}</button>)}
        </nav>
        <div className="nav-label manage-label">MANAGE</div>
        <nav className="primary-nav" aria-label="Management navigation">
          <button className="nav-item" type="button" onClick={() => notify('Settings coming soon')}><Settings2 size={17} /><span>Settings</span></button>
          <button className="nav-item" type="button" onClick={() => notify('Help center coming soon')}><CircleHelp size={17} /><span>Help center</span></button>
        </nav>
        <div className="sidebar-bottom">
          <div className="plan-card"><div className="plan-card-top"><Sparkles size={14} /> TEAM PLAN</div><strong>Make room for better work.</strong><button type="button" onClick={() => notify('Plan details opened')}>Explore plan <ArrowRight size={13} /></button></div>
          <button className="profile-button" type="button" onClick={() => notify('Profile menu opened')}><span className="profile-avatar">{signedInUser.initials}</span><span className="profile-copy"><strong>{signedInUser.name}</strong><small>{signedInUser.role}</small></span><Ellipsis size={18} /></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>{page}</span><b>/</b><strong>{page === 'People' ? 'Directory' : page === 'Overview' ? 'Workspace activity' : page === 'Approvals' ? 'My requests' : workflowView === 'library' ? 'Library' : currentWorkflow.name}</strong></div>
          <div className="topbar-actions"><button className="icon-button" type="button" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search size={17} /></button><button className="icon-button notification" type="button" aria-label="Notifications" onClick={() => notify('You’re all caught up')}><Bell size={17} /><i /></button><span className="top-divider" /><span className="top-avatar">{signedInUser.initials}</span></div>
          {searchOpen && <div className="search-popover"><Search size={16} /><input autoFocus placeholder="Search workflows..." aria-label="Search workflows" onKeyDown={(event) => event.key === 'Escape' && setSearchOpen(false)} /><kbd>ESC</kbd></div>}
        </header>

        <section className="page-content">
          <div hidden={page !== 'Approvals'}><ApprovalInbox reports={reports} workflows={workflows} user={signedInUser} onDecision={decideReport} /></div>
          <div hidden={page !== 'Overview'}><WorkflowOverview onOpenWorkflows={() => setPage('Workflows')} /></div>
          <div hidden={page !== 'People'}><PeopleDirectory people={people} onAddPerson={addPerson} onRemovePerson={removePerson} notify={notify} /></div>
          <div hidden={page !== 'Workflows' || workflowView !== 'library'}><WorkflowLibrary workflows={workflows} onCreate={createWorkflow} onOpen={openWorkflow} /></div>
          <div hidden={page !== 'Workflows' || workflowView !== 'editor'}>
          <div className="page-heading"><div><div className="eyebrow"><span /> {currentWorkflow.category.toUpperCase()} <b>/</b> WORKFLOW</div><h1>{currentWorkflow.name}</h1><p className="subtitle">{currentWorkflow.description || 'Configure the steps and properties for this approval workflow.'}</p></div><div className="heading-actions"><button className="button button-secondary" type="button" onClick={() => setWorkflowView('library')}><GitBranch size={15} /> All workflows</button><button className="button button-secondary" type="button" onClick={() => notify('Workflow link copied')}><Copy size={15} /> Copy link</button><button className="button button-primary" type="button" onClick={() => notify('Changes saved')}><Check size={16} /> Save changes</button></div></div>

          <div className="status-row"><div className="status-meta"><span className={`status-pill${enabled ? '' : ' paused'}`}><i />{currentWorkflow.status}</span><span className="updated">Last updated Oct 26, 2026 <b>·</b> by {signedInUser.name}</span></div><button className="status-action" type="button" onClick={() => updateCurrentWorkflow({ status: enabled ? 'Paused' : 'Active' })}>{enabled ? 'Pause workflow' : 'Activate workflow'} <ArrowRight size={14} /></button></div>

          <div className="tabs" role="tablist" aria-label="Workflow sections">{['Workflow', 'Properties', 'Rules', 'History'].map((name) => <button className={`tab${tab === name ? ' selected' : ''}`} role="tab" aria-selected={tab === name} key={name} type="button" onClick={() => setTab(name)}>{name}{name === 'History' && <i>12</i>}</button>)}<button className="tab-settings" type="button" onClick={() => setTab('Properties')}><SlidersHorizontal size={15} /> Workflow settings</button></div>

          {tab === 'Properties' ? <WorkflowProperties workflow={currentWorkflow} onChange={updateCurrentWorkflow} /> : tab === 'Workflow' ? <div className="editor-layout">
            <section className="canvas-panel"><div className="section-heading"><div><h2>Approval sequence</h2><p>Requests move through each step in order.</p></div><button className="icon-button more" type="button" aria-label="Workflow options" onClick={() => notify('Workflow options opened')}><Ellipsis size={19} /></button></div>
              <div className="trigger-card"><span className="trigger-icon"><FileText size={18} /></span><div className="trigger-copy"><small>WHEN THIS HAPPENS</small><strong>An expense is submitted</strong><span>For all employees <b>·</b> Any amount</span></div><button type="button" onClick={() => setTab('Rules')}>Edit trigger <ArrowRight size={13} /></button></div>
              <div className="flow-connector"><span><ArrowDown size={13} /></span></div>
              <div className="step-list">{steps.map((step, index) => { const Icon = step.icon; return <div className="step-row" key={step.id}><div className="step-rail"><span className={`step-number${selected === step.id ? ' active' : ''}`}>{String(index + 1).padStart(2, '0')}</span>{index < steps.length - 1 && <i />}</div><button className={`approval-card${selected === step.id ? ' selected' : ''}`} type="button" onClick={() => setSelected(step.id)}><span className={`step-icon ${step.tone}`}><Icon size={17} /></span><span className="approval-copy"><small>APPROVAL STEP {String(index + 1).padStart(2, '0')}</small><strong>{step.title}</strong><span>{step.role}</span></span><span className={`assignee ${step.tone}`}>{step.initials}</span><span className="assignee-name">{step.name}</span><ArrowRight className="card-arrow" size={15} /></button></div>})}</div>
              <div className="add-step-row"><i /><button type="button" onClick={addStep}><Plus size={15} /> Add approval step</button><i /></div>
              <div className="end-card"><span><CheckCircle2 size={18} /></span><div><small>ALL STEPS COMPLETE</small><strong>Expense is approved</strong></div><em>Then notify requester</em></div>
              <div className="canvas-footnote"><span><Clock3 size={14} /> Median approval time: <strong>1.4 days</strong></span><span>Based on the last 30 days</span></div>
            </section>

            <aside className="inspector"><div className="inspector-heading"><div><small>WORKFLOW SETTINGS</small><h2>When to approve</h2></div><button className="icon-button more" type="button" aria-label="Selected step options" onClick={() => setMenuOpen(true)}><Ellipsis size={18} /></button></div>
              <div className="inspector-body"><div className="field-group approver-field"><label htmlFor="approver-select">Assigned approver</label><p>Select a workspace member for this step.</p><select id="approver-select" className="approver-select" value={current?.assigneeId ?? ''} onChange={(event) => assignApprover(event.target.value)}><option value="">Unassigned</option>{people.map((person) => <option key={person.id} value={person.id}>{person.name} · {person.role}</option>)}</select></div><div className="field-group"><label htmlFor="amount">Amount threshold</label><p>Route expenses based on their total.</p><div className="amount-input"><span>$</span><input id="amount" value={amount} inputMode="numeric" onChange={(event) => updateCurrentWorkflow({ amountThreshold: Number(event.target.value.replace(/[^0-9]/g, '')) })} /><span className="currency">USD</span></div><div className="field-hint"><i /> Expenses over <strong>${Number(amount || 0).toLocaleString()}</strong> require all approvals</div></div>
                <div className="field-group delegate-group"><div className="field-label-row"><div><label>Out-of-office delegate</label><p>Keep requests moving when someone’s away.</p></div><label className="toggle-wrap"><input type="checkbox" defaultChecked aria-label="Enable out-of-office delegate" /><span className="toggle" /></label></div><button className="delegate-select" type="button" onClick={() => setDelegate(delegate === 'Taylor Kim' ? 'Morgan Reed' : 'Taylor Kim')}><span className="delegate-avatar">{delegate === 'Taylor Kim' ? 'TK' : 'MR'}</span><span><strong>{delegate}</strong><small>Finance team</small></span><ChevronDown size={15} /></button></div>
                <div className="field-group response-group"><label>Response time</label><p>Remind approvers if a request is waiting.</p><button className="response-select" type="button" onClick={() => notify('Reminder interval set to 2 business days')}><Clock3 size={15} /><span>After 2 business days</span><ChevronDown size={15} /></button></div>
                <div className="inspector-note"><Sparkles size={15} /><span><strong>Looking good.</strong> Your approval path covers every expense amount.</span></div>
              </div><div className="inspector-footer"><span><i /> Changes save automatically</span><button type="button" onClick={() => notify('Advanced settings opened')}>Advanced <ArrowRight size={13} /></button></div>
            </aside>
          </div> : tab === 'Rules' ? <section className="tab-content-panel"><div className="tab-content-title"><span><GitBranch size={18} /></span><div><h2>Routing rules</h2><p>Choose who needs to approve based on the expense.</p></div></div><div className="rule-row"><div><small>IF</small><strong>Expense amount</strong><span>is greater than</span><strong>${Number(amount || 0).toLocaleString()} USD</strong></div><i>Require all approvals</i><button className="icon-button more" aria-label="Rule options" type="button" onClick={() => notify('Rule options opened')}><Ellipsis size={18} /></button></div><button className="button button-secondary add-rule" type="button" onClick={() => notify('New routing rule added')}><Plus size={15} /> Add condition</button></section> : <section className="tab-content-panel history-panel"><div className="tab-content-title"><span><Activity size={18} /></span><div><h2>Recent changes</h2><p>A clear record of updates to this workflow.</p></div></div>{[['Today, 10:42 AM', 'Sam Carter', 'Updated the expense amount threshold', 'SC'], ['Oct 22, 2026', 'Sam Carter', 'Activated this workflow', 'SC'], ['Oct 18, 2026', 'Jordan Lee', 'Added the executive approval step', 'JL']].map(([date, person, description, initials]) => <div className="history-row" key={description}><span>{initials}</span><div><strong>{description}</strong><small>{person} <b>·</b> {date}</small></div><CheckCircle2 size={16} /></div>)}</section>}
          <footer className="page-footer"><span>Made for the way your team works.</span><span><button type="button" onClick={() => notify('Documentation opened')}>Documentation</button><b>·</b><button type="button" onClick={() => notify('Contact support opened')}>Contact support</button></span></footer>
          </div>
        </section>
      </main>

      {menuOpen && <div className="menu-scrim" onClick={() => setMenuOpen(false)}><div className="step-menu" onClick={(event) => event.stopPropagation()}><strong>{current?.title}</strong><button type="button" onClick={duplicateStep}><Copy size={14} /> Duplicate step</button><button type="button" onClick={() => moveStep(-1)}><ArrowDown className="move-up" size={14} /> Move earlier</button><button type="button" onClick={() => moveStep(1)}><ArrowDown size={14} /> Move later</button><button className="danger" type="button" onClick={removeStep}><X size={14} /> Remove step</button></div></div>}
      {toast && <div className="toast"><CheckCircle2 size={16} />{toast}</div>}
    </div>
  )
}