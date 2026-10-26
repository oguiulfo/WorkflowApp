export const DEMO_USERS = [
  {
    id: 'sam-carter',
    name: 'Sam Carter',
    email: 'sam.carter@northstar.studio',
    password: 'NorthstarAdmin1!',
    role: 'Workspace admin',
    initials: 'SC',
  },
  {
    id: 'jordan-lee',
    name: 'Jordan Lee',
    email: 'jordan.lee@northstar.studio',
    password: 'NorthstarManager1!',
    role: 'Manager',
    initials: 'JL',
  },
  {
    id: 'taylor-kim',
    name: 'Taylor Kim',
    email: 'taylor.kim@northstar.studio',
    password: 'NorthstarFinance1!',
    role: 'Finance',
    initials: 'TK',
  },
]

export function authenticateDemoUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase()
  const account = DEMO_USERS.find((user) => user.email === normalizedEmail && user.password === password)

  if (!account) return null

  const { password: demoPassword, ...user } = account
  return user
}