import type { NextApiRequest, NextApiResponse } from 'next'
import { JSON_HEADERS } from '../../../constants/headers'

// Disable automatic body parsing for FormData handling
export const config = {
  api: {
    bodyParser: false,
  },
}

async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!['GET', 'PUT', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ message: 'Company ID is required' })
    }

    const url = `${base}/companies/${id}`
    const token = req.headers.authorization?.replace('Bearer ', '')

    // Handle GET request
    if (req.method === 'GET') {
      const resp = await fetch(url, {
        method: 'GET',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle PUT request (Update)
    if (req.method === 'PUT') {
      const contentType = req.headers['content-type']
      const isFormData = contentType?.includes('multipart/form-data')
      
      const headers: HeadersInit = {
        Authorization: `Bearer ${token}`,
      }

      let body: any

      if (isFormData) {
        // Read raw body for FormData
        const rawBody = await getRawBody(req)
        body = rawBody
        // Keep the content-type header so backend knows it's multipart
        headers['content-type'] = contentType as string
      } else {
        // For JSON requests, parse the body
        Object.assign(headers, JSON_HEADERS)
        body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      }

      const resp = await fetch(url, {
        method: 'PUT',
        headers,
        body,
      })
      
      console.log("resp: ", await resp.text());

      const data = { errors: ""} //await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle DELETE request
    if (req.method === 'DELETE') {
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      })

      if (!resp.ok) {
        const data = await resp.json()
        return res.status(resp.status).json(data.errors || data || { message: 'Failed to delete company' })
      }

      return res.status(resp.status).json({ message: 'Company deleted successfully' })
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('company api error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
