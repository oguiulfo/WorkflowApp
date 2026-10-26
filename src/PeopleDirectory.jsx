import { useState } from 'react'
import { Mail, Plus, Search, Trash2, UserPlus, Users, X } from 'lucide-react'

const roles = ['Employee', 'Manager', 'Finance', 'Department head', 'Admin']

export default function PeopleDirectory({ people, onAddPerson, onRemovePerson, notify }) {
  const [query, setQuery] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [personToRemove, setPersonToRemove] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'Employee' })
  const [formError, setFormError] = useState('')
  const filteredPeople = people.filter((person) => `${person.name} ${person.email} ${person.role}`.toLowerCase().includes(query.toLowerCase()))

  function submitPerson(event) {
    event.preventDefault()
    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (people.some((person) => person.email.toLowerCase() === email)) {
      setFormError('A person with this email is already in the workspace.')
      return
    }

    const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()
    const tones = ['mint', 'peach', 'blue', 'lavender']
    onAddPerson({
      id: `person-${Date.now()}`,
      name,
      email,
      role: form.role,
      initials,
      tone: tones[people.length % tones.length],
    })
    setForm({ name: '', email: '', role: 'Employee' })
    setFormError('')
    setAddOpen(false)
  }

  function confirmRemoval() {
    onRemovePerson(personToRemove.id)
    setPersonToRemove(null)
  }

  function closeAddDialog() {
    setAddOpen(false)
    setFormError('')
  }

  return <>
    <div className="page-heading people-page-heading">
      <div><div className="eyebrow"><span /> WORKSPACE <b>/</b> PEOPLE</div><h1>People</h1><p className="subtitle">Manage the people who keep work moving.</p></div>
      <button className="button button-primary" type="button" onClick={() => setAddOpen(true)}><UserPlus size={16} /> Add person</button>
    </div>

    <section className="people-panel" aria-label="Workspace people">
      <div className="people-toolbar"><div className="people-total"><Users size={16} /><strong>Team members</strong><span>{people.length}</span></div><label className="people-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search people" aria-label="Search people" /></label></div>
      <div className="people-table-scroll"><table className="people-table"><thead><tr><th scope="col">Person</th><th scope="col">Role</th><th scope="col">Access</th><th scope="col"><span className="visually-hidden">Actions</span></th></tr></thead>
        <tbody>{filteredPeople.map((person) => <tr key={person.id}><td><div className="person-cell"><span className={`person-avatar ${person.tone}`}>{person.initials}</span><span><strong>{person.name}</strong><small>{person.email}</small></span></div></td><td><span className="person-role">{person.role}</span></td><td><span className="person-access"><i /> Active</span></td><td className="person-actions"><button className="remove-person-button" type="button" aria-label={`Remove ${person.name}`} title={`Remove ${person.name}`} onClick={() => setPersonToRemove(person)}><Trash2 size={15} /></button></td></tr>)}
          {filteredPeople.length === 0 && <tr><td colSpan="4"><div className="people-empty"><Users size={20} /><strong>{people.length ? 'No people found' : 'No people yet'}</strong><span>{people.length ? 'Try a different name, email, or role.' : 'Add a person to get your workspace started.'}</span></div></td></tr>}
        </tbody></table></div>
      <div className="people-panel-footer"><span>Showing {filteredPeople.length} of {people.length} people</span><span><Mail size={13} /> Workspace access is managed here</span></div>
    </section>

    {addOpen && <div className="dialog-backdrop"><section className="people-dialog" role="dialog" aria-modal="true" aria-labelledby="add-person-title"><div className="dialog-heading"><div><span className="dialog-icon"><UserPlus size={17} /></span><div><h2 id="add-person-title">Add a person</h2><p>Invite someone to Northstar Studio.</p></div></div><button className="icon-button" type="button" aria-label="Close add person dialog" onClick={closeAddDialog}><X size={17} /></button></div>
      <form onSubmit={submitPerson}><label className="dialog-field">Full name<input autoFocus required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="e.g. Casey Rivera" /></label><label className="dialog-field">Work email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="casey@company.com" /></label><label className="dialog-field">Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>{roles.map((role) => <option key={role}>{role}</option>)}</select></label>{formError && <p className="form-error" role="alert">{formError}</p>}<div className="dialog-actions"><button className="button button-secondary" type="button" onClick={closeAddDialog}>Cancel</button><button className="button button-primary" type="submit"><UserPlus size={15} /> Add person</button></div></form>
    </section></div>}

    {personToRemove && <div className="dialog-backdrop"><section className="people-dialog confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="remove-person-title" aria-describedby="remove-person-description"><div className="dialog-heading"><div><span className="dialog-icon warning-icon"><Trash2 size={17} /></span><div><h2 id="remove-person-title">Remove {personToRemove.name}?</h2><p id="remove-person-description">They will lose access to the Northstar Studio workspace.</p></div></div><button className="icon-button" type="button" aria-label="Close confirmation" onClick={() => setPersonToRemove(null)}><X size={17} /></button></div><div className="dialog-actions"><button className="button button-secondary" type="button" onClick={() => setPersonToRemove(null)}>Keep person</button><button className="button button-danger" type="button" onClick={confirmRemoval}><Trash2 size={15} /> Remove person</button></div></section></div>}
  </>
}