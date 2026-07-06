import type { NextApiRequest, NextApiResponse } from "next";

// Disable the default body parser so we can stream
// both JSON and multipart/form-data bodies directly to Laravel.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    const targetUrl = `${base}/office-expense-documents`;

    // Preserve important headers from the original request
    const contentType = req.headers["content-type"];
    const authorization = req.headers["authorization"];

    const headers: Record<string, string> = {};
    if (typeof contentType === "string") {
      headers["Content-Type"] = contentType;
    }
    if (typeof authorization === "string") {
      headers["Authorization"] = authorization;
    }

    const resp = await fetch(targetUrl, {
      method: "POST",
      // Stream the incoming body (JSON or multipart) directly to Laravel
      body: req as any,
      headers,
      // Required by Node.js fetch when sending a streamed body
      // from a server environment.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      duplex: "half",
    } as any);

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return res
        .status(resp.status)
        .json(data?.errors || data || { message: "Failed to create document" });
    }

    return res.status(resp.status).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("office expense document api error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
