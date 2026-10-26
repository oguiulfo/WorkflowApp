import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginScreen from './LoginScreen.jsx'
import { DEMO_USERS } from './demoAuth.js'

afterEach(cleanup)

describe('login screen', () => {
  it('requires a valid email and a password of at least eight characters', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()
    render(<LoginScreen onLogin={onLogin} />)

    const email = screen.getByLabelText('Work email')
    const password = screen.getByLabelText('Password')
    expect(email.required).toBe(true)
    expect(password.required).toBe(true)
    expect(password.minLength).toBe(8)

    await user.type(email, 'not-an-email')
    await user.type(password, 'short')
    expect(screen.getByRole('button', { name: 'Sign in' }).closest('form').checkValidity()).toBe(false)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(onLogin).not.toHaveBeenCalled()
  })

  it.each(DEMO_USERS)('accepts demo account for $name', async (demoUser) => {
    const user = userEvent.setup()
    const onLogin = vi.fn()
    render(<LoginScreen onLogin={onLogin} />)

    await user.type(screen.getByLabelText('Work email'), demoUser.email.toUpperCase())
    await user.type(screen.getByLabelText('Password'), demoUser.password)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onLogin).toHaveBeenCalledWith({
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      role: demoUser.role,
      initials: demoUser.initials,
    })
  })

  it('rejects credentials that are not a demo account', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()
    render(<LoginScreen onLogin={onLogin} />)

    await user.type(screen.getByLabelText('Work email'), DEMO_USERS[0].email)
    await user.type(screen.getByLabelText('Password'), 'wrong-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(onLogin).not.toHaveBeenCalled()
    expect(screen.getByRole('status').textContent).toMatch(/does not match/)
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    render(<LoginScreen onLogin={vi.fn()} />)
    const password = screen.getByLabelText('Password')

    expect(password.type).toBe('password')
    await user.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password.type).toBe('text')
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeTruthy()
  })

  it('shows feedback when password reset is requested', async () => {
    const user = userEvent.setup()
    render(<LoginScreen onLogin={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Forgot password?' }))

    expect(screen.getByRole('status').textContent).toMatch(/not configured/)
  })
})