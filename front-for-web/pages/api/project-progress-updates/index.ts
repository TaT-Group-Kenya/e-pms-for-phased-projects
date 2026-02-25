import type { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE
  if (!base) return res.status(500).json({ message: 'EPMS_API_BASE not configured' })

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${req.headers.authorization?.replace('Bearer ', '')}`,
      Accept: 'application/json',
    }

    if (req.headers['content-type']) {
      headers['Content-Type'] = req.headers['content-type']
    }

    let url = `${base}/project-progress-updates`

    // Handle GET requests
    if (req.method === 'GET') {
      const queryParams = new URLSearchParams()
      
      if (req.query.project_id) {
        queryParams.append('project_id', String(req.query.project_id))
      }
      if (req.query.project_phase_id) {
        queryParams.append('project_phase_id', String(req.query.project_phase_id))
      }
      if (req.query.per_page) {
        queryParams.append('per_page', String(req.query.per_page))
      } else {
        queryParams.append('per_page', '50')
      }
      
      const query = queryParams.toString()
      if (query) {
        url += `?${query}`
      }

      const resp = await fetch(url, {
        method: 'GET',
        headers,
      })

      const contentType = resp.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await resp.text()
        console.error('Non-JSON response from backend:', text.substring(0, 200))
        return res.status(500).json({ message: 'Invalid response from server' })
      }

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    // Handle POST requests
    if (req.method === 'POST') {
      const resp = await fetch(url, {
        method: 'POST',
        headers,
        body: req as any,
        duplex: 'half',
      } as any)

      const contentType = resp.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        const text = await resp.text()
        console.error('Non-JSON response from backend:', text.substring(0, 200))
        return res.status(500).json({ message: 'Invalid response from server' })
      }

      const data = await resp.json()

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data)
      }

      return res.status(resp.status).json(data)
    }

    return res.status(405).json({ message: 'Method not allowed' })
  } catch (err) {
    console.error('project progress update error', err)
    return res.status(500).json({ message: 'Proxy error' })
  }
}
