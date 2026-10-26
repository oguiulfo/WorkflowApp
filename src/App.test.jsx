import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App.jsx'
import { DEMO_USERS } from './demoAuth.js'

afterEach(cleanup)

describe('app sign-in entry', () => {
  it('opens the workflow library after valid demo sign-in', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy()
    await user.type(screen.getByLabelText('Work email'), DEMO_USERS[0].email)
    await user.type(screen.getByLabelText('Password'), DEMO_USERS[0].password)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(screen.getByRole('heading', { name: 'Workflows' })).toBeTruthy()
    expect(screen.getByText('Workspace admin')).toBeTruthy()
  })

  it('creates a workflow and updates its properties without losing its steps', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText('Work email'), DEMO_USERS[0].email)
    await user.type(screen.getByLabelText('Password'), DEMO_USERS[0].password)
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
    await user.click(screen.getByRole('button', { name: 'New workflow' }))
    await user.type(screen.getByLabelText('Workflow name'), 'Equipment requests')
    await user.type(screen.getByLabelText('Description'), 'Review hardware purchases')
    await user.click(screen.getByRole('button', { name: 'Create workflow' }))

    expect(screen.getByRole('heading', { name: 'Properties' })).toBeTruthy()
    await user.clear(screen.getByLabelText('Workflow name'))
    await user.type(screen.getByLabelText('Workflow name'), 'Device purchases')
    await user.click(screen.getByRole('tab', { name: 'Workflow' }))

    expect(screen.getByRole('heading', { name: 'Device purchases' })).toBeTruthy()
    expect(screen.getByRole('button', { name: /APPROVAL STEP 01\s*Manager review/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /APPROVAL STEP 03\s*Executive approval/ })).toBeTruthy()
  })
})
