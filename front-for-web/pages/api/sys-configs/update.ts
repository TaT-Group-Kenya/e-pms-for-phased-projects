import type { NextApiRequest, NextApiResponse } from 'next'
import type { IncomingMessage } from 'http'

export const config = {
  api: {
    bodyParser: false,
  },
}

const getRawBody = async (req: IncomingMessage): Promise<Buffer> => {
  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT' && req.method !== 'PATCH' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query
    if (!id) return res.status(400).json({ message: 'SysConfig ID is required' })

    const url = new URL(`${base}/sys-configs/${id}`)
    const rawBody = await getRawBody(req)
    const headers: Record<string, string> = {}

    const contentType = req.headers['content-type'] ?? req.headers['Content-Type']
    if (contentType) {
      headers['Content-Type'] = Array.isArray(contentType) ? contentType[0] : contentType
    }

    const acceptHeader = req.headers.accept
    if (acceptHeader) {
      headers['Accept'] = Array.isArray(acceptHeader) ? acceptHeader[0] : acceptHeader
    }

    const authorization = req.headers.authorization?.replace('Bearer ', '')
    if (authorization) {
      headers['Authorization'] = `Bearer ${authorization}`
    }

    const resp = await fetch(url.toString(), {
      method: req.method === 'POST' ? 'PUT' : req.method,
      headers,
      body: rawBody.length ? rawBody : undefined,
    })

    const data = await resp.json().catch(() => ({}))
    return res.status(resp.status).json(data)
  } catch (err) {
    console.error('update sys-config error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
