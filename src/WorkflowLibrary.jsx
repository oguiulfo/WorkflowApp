import { useState } from 'react'
import { ArrowRight, GitBranch, Plus } from 'lucide-react'

export default function WorkflowLibrary({ workflows, onCreate, onOpen }) {
  const [createOpen, setCreateOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', category: 'Finance', amountThreshold: '500' })
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const name = form.name.trim()
    if (workflows.some((workflow) => workflow.name.toLowerCase() === name.toLowerCase())) {
      setError('A workflow with this name already exists.')
      return
    }

    onCreate({ ...form, name, description: form.description.trim(), amountThreshold: Number(form.amountThreshold) })
    setForm({ name: '', description: '', category: 'Finance', amountThreshold: '500' })
    setError('')
    setCreateOpen(false)
  }

  return <div className="workflow-library">
    <div className="page-heading library-heading"><div><div className="eyebrow"><span /> WORKSPACE <b>/</b> WORKFLOWS</div><h1>Workflows</h1><p className="subtitle">Create and manage the approval paths your team relies on.</p></div><button className="button button-primary" type="button" onClick={() => setCreateOpen(true)}><Plus size={16} /> New workflow</button></div>
    <section className="library-panel" aria-label="Workflow library">
      <div className="library-panel-heading"><div><h2>All workflows</h2><p>{workflows.length} workflow{workflows.length === 1 ? '' : 's'} in this workspace</p></div></div>
      <div className="workflow-list">{workflows.map((workflow) => <article className="workflow-list-item" key={workflow.id}><span className="workflow-list-icon"><GitBranch size={17} /></span><div className="workflow-list-copy"><strong>{workflow.name}</strong><small>{workflow.description || 'No description'}</small><span>{workflow.category} <b>·</b> {workflow.steps.length} approval steps <b>·</b> Over ${Number(workflow.amountThreshold).toLocaleString()}</span></div><span className={`workflow-list-status ${workflow.status.toLowerCase()}`}>{workflow.status}</span><button className="workflow-open-button" type="button" aria-label={`Edit ${workflow.name}`} onClick={() => onOpen(workflow.id)}><ArrowRight size={16} /></button></article>)}
        {workflows.length === 0 && <div className="workflow-library-empty"><GitBranch size={20} /><strong>No workflows yet</strong><span>Create an approval path for your workspace.</span><button className="button button-secondary" type="button" onClick={() => setCreateOpen(true)}><Plus size={14} /> Create workflow</button></div>}
      </div>
    </section>

    {createOpen && <div className="dialog-backdrop"><section className="people-dialog create-workflow-dialog" role="dialog" aria-modal="true" aria-labelledby="create-workflow-title"><div className="dialog-heading"><div><span className="dialog-icon"><GitBranch size={17} /></span><div><h2 id="create-workflow-title">Create workflow</h2><p>Set up the basics. You can refine the steps next.</p></div></div><button className="icon-button" type="button" aria-label="Close create workflow dialog" onClick={() => { setCreateOpen(false); setError('') }}>×</button></div>
      <form onSubmit={submit}><label className="dialog-field">Workflow name<input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Equipment requests" /></label><label className="dialog-field">Description<textarea rows="2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="What does this workflow approve?" /></label><div className="workflow-form-row"><label className="dialog-field">Category<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Finance</option><option>People</option><option>Operations</option><option>IT</option></select></label><label className="dialog-field">Amount threshold<input type="number" min="0" step="1" value={form.amountThreshold} onChange={(event) => setForm({ ...form, amountThreshold: event.target.value })} required /></label></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="dialog-actions"><button className="button button-secondary" type="button" onClick={() => { setCreateOpen(false); setError('') }}>Cancel</button><button className="button button-primary" type="submit"><Plus size={15} /> Create workflow</button></div></form>
    </section></div>}
  </div>
}