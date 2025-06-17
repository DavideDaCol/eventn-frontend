export function extractErrorMessages(data) {
  if (!data || typeof data !== 'object') {
    return 'Si è verificato un errore. Riprova più tardi.';
  }

  const messages = [];

  // 1) campo `message`
  if (typeof data.message === 'string') {
    messages.push(data.message);
  }

  // 2) express-validator => data.errors: Array<{ msg }>
  if (Array.isArray(data.errors)) {
    messages.push(...data.errors.map(e => e.msg));
  }

  // 3) varianti `error`: array o object-like
  if (Array.isArray(data.error)) {
    messages.push(...data.error);
  } else if (data.error && typeof data.error === 'object') {
    messages.push(...Object.values(data.error));
  }

  // fallback
  if (messages.length === 0) {
    messages.push('Si è verificato un errore. Riprova più tardi.');
  }

  // unisci in un unico stringone
  return messages.join('\n');
}