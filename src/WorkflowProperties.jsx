export default function WorkflowProperties({ workflow, onChange }) {
  function update(field, value) {
    onChange({ [field]: value })
  }

  return <section className="workflow-properties-panel" aria-labelledby="workflow-properties-title">
    <div className="workflow-properties-heading"><div><span className="eyebrow"><span /> WORKFLOW CONFIGURATION</span><h2 id="workflow-properties-title">Properties</h2><p>Set the details and routing behavior for this workflow.</p></div><span className="properties-autosave"><i /> Changes save automatically</span></div>
    <div className="workflow-properties-form">
      <label className="property-field">Workflow name<input value={workflow.name} onChange={(event) => update('name', event.target.value)} aria-label="Workflow name" required /></label>
      <label className="property-field">Description<textarea value={workflow.description} onChange={(event) => update('description', event.target.value)} aria-label="Workflow description" rows="3" placeholder="Describe when this workflow should be used." /></label>
      <div className="properties-grid"><label className="property-field">Category<select value={workflow.category} onChange={(event) => update('category', event.target.value)} aria-label="Workflow category"><option>Finance</option><option>People</option><option>Operations</option><option>IT</option></select></label><label className="property-field">Status<select value={workflow.status} onChange={(event) => update('status', event.target.value)} aria-label="Workflow status"><option>Draft</option><option>Active</option><option>Paused</option></select></label><label className="property-field">Amount threshold (USD)<input type="number" min="0" step="1" value={workflow.amountThreshold} onChange={(event) => update('amountThreshold', Number(event.target.value))} aria-label="Amount threshold" /></label></div>
      <div className="properties-note"><strong>Approval sequence</strong><span>{workflow.steps.length} steps configured. Edit approvers and step order in the Workflow tab.</span></div>
    </div>
  </section>
}