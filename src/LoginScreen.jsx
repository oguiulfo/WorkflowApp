import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, GitBranch } from 'lucide-react'
import { authenticateDemoUser } from './demoAuth.js'

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')

  function submit(event) {
    event.preventDefault()
    const user = authenticateDemoUser(email, password)
    if (!user) {
      setNotice('Email or password does not match a demo account.')
      return
    }

    setNotice('')
    onLogin(user)
  }

  return <main className="login-screen">
    <section className="login-panel" aria-labelledby="login-title">
      <a className="login-brand" href="#home" aria-label="Flowstate"><span><GitBranch size={18} /></span> flowstate</a>
      <div className="login-content">
        <span className="login-workspace">NORTHSTAR STUDIO</span>
        <h1 id="login-title">Welcome back</h1>
        <p className="login-intro">Sign in to continue to your workspace.</p>

        <form className="login-form" onSubmit={submit}>
          <label className="login-field" htmlFor="login-email">Work email
            <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label className="login-field" htmlFor="login-password">Password
            <span className="password-control"><input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
          </label>
          <div className="login-options"><label className="remember-option"><input type="checkbox" /> <span>Keep me signed in</span></label><button type="button" className="reset-link" onClick={() => setNotice('Password reset is not configured for this demo.')}>Forgot password?</button></div>
          <button className="login-submit" type="submit">Sign in <ArrowRight size={16} /></button>
          {notice && <p className="login-notice" role="status">{notice}</p>}
        </form>

        <p className="login-access-note">Need access? Contact your workspace administrator.</p>
        <p className="login-demo-note">Demo sign-in only. Connect an identity provider before using real accounts.</p>
      </div>
      <footer className="login-footer"><span>© 2026 Flowstate</span><a href="mailto:support@flowstate.example">Get help</a></footer>
    </section>

    <aside className="login-aside" aria-label="Expense workflow preview">
      <div className="aside-grain" />
      <div className="aside-topline"><span className="live-indicator" /> NORTHSTAR STUDIO <span className="aside-topline-right">FINANCE</span></div>
      <div className="preview-copy"><span>EXPENSE APPROVALS</span><h2>Every decision,<br />in the right hands.</h2><p>A live look at a request moving through the team.</p></div>
      <div className="expense-preview">
        <div className="expense-preview-heading"><span className="receipt-icon">R</span><span><strong>Conference travel</strong><small>Submitted by Riley Chen</small></span><b>$842.60</b></div>
        <div className="preview-divider" />
        <div className="preview-route-label">APPROVAL ROUTE <span>2 OF 3</span></div>
        <div className="preview-route">
          <div className="route-item route-complete"><span className="route-avatar">JL</span><span><strong>Manager review</strong><small>Jordan Lee</small></span><i>Approved</i></div>
          <div className="route-stem" />
          <div className="route-item route-current"><span className="route-avatar">TK</span><span><strong>Finance review</strong><small>Taylor Kim</small></span><i>In review</i></div>
          <div className="route-stem" />
          <div className="route-item route-upcoming"><span className="route-avatar">AM</span><span><strong>Executive approval</strong><small>Department head</small></span></div>
        </div>
      </div>
      <div className="aside-footnote"><span>WORKFLOW 04</span><span>Updated just now</span></div>
    </aside>
  </main>
}