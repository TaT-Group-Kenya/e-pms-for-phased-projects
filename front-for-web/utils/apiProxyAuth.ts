import { NextApiRequest } from 'next';

// Extracts the session token from cookies or headers for API proxying
export function getSessionToken(req: NextApiRequest): string | null {
  // Try Authorization header first
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }
  // Try cookie (e.g., laravel_token, XSRF-TOKEN, etc.)
  if (req.cookies && req.cookies['laravel_token']) {
    return req.cookies['laravel_token'];
  }
  // Add more logic as needed for your auth setup
  return null;
}
