# Flowstate

An expense approval workflow editor built with React, Vite, VS Code, and GitHub Copilot

Started at 10/26/2026 10:20 AM and last dev prompt was at 11:44 AM EST

Quick note: I had to restart VS Code in Admin mode after giving the first build prompt, which was basically a cut and paste of the requirements from the Project Brief docx file. Here is the initial response which did not show up in the chat log for some reason:

"That’s a clear product shape: an admin-facing workflow builder for ordered expense approvals, including amount bands and out-of-office delegates. I’ll scaffold a React + Vite project named WorkflowApp, then make the first screen an interactive workflow editor rather than generic starter content."

 I figured this was the quickest approach and I would clarify any additional features to Copilot as I tested the app after each prompt.

I took a bit longer than an hour per the log but that was because I spent around 15 minutes prompting my way through environment setup, as this was a fresh install of VS Code and npm on my personal laptop. Literally started from scratch, right after the VS Code install.

I did spent a solid hour prompting through core requirements and testing, as shown in the README.CHAT.md log.

## Requirements

- Node.js 18 or newer
- npm

## Run locally

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Demo users

Use any of these accounts on the sign-in screen:

| Role | Email | Password |
| --- | --- | --- |
| Workspace admin | `sam.carter@northstar.studio` | `NorthstarAdmin1!` |
| Manager | `jordan.lee@northstar.studio` | `NorthstarManager1!` |
| Finance | `taylor.kim@northstar.studio` | `NorthstarFinance1!` |

These credentials are for local demonstration only. Authentication is checked in client-side code and does not protect real accounts or data. Connect a trusted identity provider before production use.