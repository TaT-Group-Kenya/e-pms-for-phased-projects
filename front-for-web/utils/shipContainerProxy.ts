/**
 * Shared helpers for the ship-containers API proxies.
 * Kept outside pages/api to avoid being treated as an endpoint,
 * imported via a relative @ts-path from the route files.
 */
import type { NextApiRequest, NextApiResponse } from 'next'

import { JSON_HEADERS } from '../constants/headers'

export function assertConfigured(res: NextApiResponse): string | null {
  const base = process.env.EPMS_API_BASE
  if (!base) {
    res.status(500).json({ message: 'EPMS_API_BASE not configured' })
    return null
  }
  return base
}

export function proxiedHeaders(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  return { ...JSON_HEADERS, Authorization: `Bearer ${token}` }
}

export function methodNotAllowed(res: NextApiResponse) {
  return res.status(405).json({ message: 'Method not allowed' })
}