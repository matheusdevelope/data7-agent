import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { ValidateJWT } from '../app/handlers/jwt';

async function Middleware(socket: Socket, next: (err?: ExtendedError | undefined) => void) {
  function Send401(message: string) {
    const err = new Error(message);
    return next(err);
  }

  const authHeader = socket.handshake.auth.token;

  if (!authHeader) return Send401('No Token Provided');

  const parts = authHeader.split(' ');

  if (!(parts.length === 2)) return Send401('Token Error');

  const [scheme, token] = parts;
  if (!/Bearer/i.test(scheme)) return Send401('Token malformatted');

  if (!ValidateJWT(token)) return Send401('Invalid Token');
  return next();
}

export { Middleware };
