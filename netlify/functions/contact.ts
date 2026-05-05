import { Buffer } from 'node:buffer';
import { TLSSocket, connect } from 'node:tls';

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

type ContactPayload = {
  name: string;
  business: string;
  email: string;
  phone?: string;
  city?: string;
  message?: string;
  website?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildJsonResponse = (body: Record<string, string>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });

const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Variabile mancante: ${key}`);
  }
  return value;
};

const normalizePayload = (payload: unknown): ContactPayload | null => {
  if (!payload || typeof payload !== 'object') return null;

  const candidate = payload as Record<string, unknown>;
  const normalized: ContactPayload = {
    name: String(candidate.name ?? '').trim(),
    business: String(candidate.business ?? '').trim(),
    email: String(candidate.email ?? '').trim(),
    phone: String(candidate.phone ?? '').trim(),
    city: String(candidate.city ?? '').trim(),
    message: String(candidate.message ?? '').trim(),
    website: String(candidate.website ?? '').trim(),
  };

  if (!normalized.name || !normalized.business || !normalized.email) return null;
  if (!emailPattern.test(normalized.email)) return null;

  return normalized;
};

const encodeMimeHeader = (value: string) => `=?UTF-8?B?${Buffer.from(value, 'utf8').toString('base64')}?=`;

const wrapBase64 = (value: string) => value.match(/.{1,76}/g)?.join('\r\n') ?? '';

const escapeSmtpDataLine = (line: string) => (line.startsWith('.') ? `.${line}` : line);

const buildMessage = (payload: ContactPayload, from: string, to: string) => {
  const subject = encodeMimeHeader(`Nuova richiesta installazione PlugHub - ${payload.business}`);
  const fromHeader = encodeMimeHeader('PlugHub sito web');
  const textBody = [
    'Nuova richiesta dal sito PlugHub',
    '',
    `Nome e cognome: ${payload.name}`,
    `Attività: ${payload.business}`,
    `Email: ${payload.email}`,
    `Telefono: ${payload.phone || '-'}`,
    `Città: ${payload.city || '-'}`,
    '',
    'Messaggio:',
    payload.message || '-',
  ]
    .map(escapeSmtpDataLine)
    .join('\r\n');

  const encodedBody = wrapBase64(Buffer.from(textBody, 'utf8').toString('base64'));

  return [
    `From: ${fromHeader} <${from}>`,
    `To: <${to}>`,
    `Reply-To: <${payload.email}>`,
    `Subject: ${subject}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ].join('\r\n');
};

const readSmtpResponse = (socket: TLSSocket) =>
  new Promise<string>((resolve, reject) => {
    let buffer = '';

    const cleanup = () => {
      socket.off('data', onData);
      socket.off('error', onError);
      socket.off('close', onClose);
      socket.off('end', onClose);
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    const onClose = () => {
      cleanup();
      reject(new Error('Connessione SMTP chiusa inaspettatamente.'));
    };

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split('\r\n').filter(Boolean);
      const lastLine = lines[lines.length - 1];

      if (/^\d{3} /.test(lastLine)) {
        cleanup();
        resolve(buffer);
      }
    };

    socket.on('data', onData);
    socket.once('error', onError);
    socket.once('close', onClose);
    socket.once('end', onClose);
  });

const expectCode = async (
  socket: TLSSocket,
  command: string | null,
  expectedCode: number,
) => {
  if (command !== null) {
    socket.write(`${command}\r\n`);
  }

  const response = await readSmtpResponse(socket);
  const receivedCode = Number.parseInt(response.slice(0, 3), 10);

  if (receivedCode !== expectedCode) {
    throw new Error(`Risposta SMTP inattesa (${receivedCode}): ${response.trim()}`);
  }

  return response;
};

const sendSmtpMail = async (payload: ContactPayload) => {
  const host = getEnv('ARUBA_SMTP_HOST', 'smtps.aruba.it');
  const port = Number.parseInt(getEnv('ARUBA_SMTP_PORT', '465'), 10);
  const user = getEnv('ARUBA_SMTP_USER', 'info@plughub.it');
  const pass = getEnv('ARUBA_SMTP_PASS');
  const to = getEnv('CONTACT_TO', 'info@plughub.it');
  const from = getEnv('CONTACT_FROM', user);

  const message = buildMessage(payload, from, to);

  const socket = connect({
    host,
    port,
    servername: host,
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true,
  });


  await new Promise<void>((resolve, reject) => {
    socket.once('secureConnect', () => resolve());
    socket.once('error', reject);
  });

  try {
    await expectCode(socket, null, 220);
    await expectCode(socket, 'EHLO plughub.it', 250);
    await expectCode(socket, 'AUTH LOGIN', 334);
    await expectCode(socket, Buffer.from(user, 'utf8').toString('base64'), 334);
    await expectCode(socket, Buffer.from(pass, 'utf8').toString('base64'), 235);
    await expectCode(socket, `MAIL FROM:<${from}>`, 250);
    await expectCode(socket, `RCPT TO:<${to}>`, 250);
    await expectCode(socket, 'DATA', 354);
    await expectCode(socket, `${message}\r\n.`, 250);
    await expectCode(socket, 'QUIT', 221);
  } finally {
    socket.end();
    socket.destroy();
  }
};

export default async (request: Request) => {
  if (request.method !== 'POST') {
    return buildJsonResponse({ message: 'Metodo non consentito.' }, 405);
  }

  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return buildJsonResponse({ message: 'Payload JSON non valido.' }, 400);
  }

  const payload = normalizePayload(rawPayload);
  if (!payload) {
    return buildJsonResponse({ message: 'Dati del modulo non validi.' }, 400);
  }

  if (payload.website) {
    return buildJsonResponse({ message: 'Richiesta ricevuta.' });
  }

  try {
    await sendSmtpMail(payload);
    return buildJsonResponse({ message: 'Richiesta inviata con successo.' });
  } catch (error) {
    console.error('Errore invio contatto', error);
    return buildJsonResponse(
      {
        message:
          'Il server non è riuscito a inviare l\'email. Controlla le variabili SMTP Aruba e riprova.',
      },
      500,
    );
  }
};
