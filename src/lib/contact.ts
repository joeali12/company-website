const INBOX = 'youssefaly541@gmail.com'
const ENDPOINT = `https://sendm8.com/f/${encodeURIComponent(INBOX)}`

export type ContactDraft = {
  name: string
  email: string
  message: string
  company: string
}

export type ContactErrors = {
  name?: string
  email?: string
  message?: string
}

export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {}
  const name = draft.name.trim()
  const email = draft.email.trim()
  const message = draft.message.trim()

  if (name.length < 2) errors.name = 'Enter your name.'
  else if (name.length > 80) errors.name = 'Use 80 characters or fewer.'

  if (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (message.length < 10) errors.message = 'Add a short note, at least a sentence.'
  else if (message.length > 4000) errors.message = 'Keep the message under 4000 characters.'

  return errors
}

export function contactHasErrors(errors: ContactErrors) {
  return Boolean(errors.name || errors.email || errors.message)
}

export async function sendContactMessage(draft: ContactDraft) {
  if (draft.company.trim()) return

  const name = draft.name.trim()
  const email = draft.email.trim()
  const message = draft.message.trim()
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      Name: name,
      Email: email,
      Message: message,
      Website: 'VOLT IQ website',
      _subject: `VOLT IQ website — new message from ${name}`,
      _replyto: email,
    }),
  })

  const data = (await response.json().catch(() => null)) as {
    ok?: unknown
    pending?: unknown
  } | null
  const delivered = data?.ok === true && !data.pending
  if (!response.ok || !delivered) {
    throw new Error('The message was not delivered.')
  }
}
