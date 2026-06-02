import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Document ID is required" });
    }

    const url = `${base}/company-invoice-documents/${id}/download`;
    const token = req.headers.authorization?.replace("Bearer ", "");

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => null);
      return res
        .status(resp.status)
        .json(data?.errors || data || { message: "Failed to download document" });
    }

    const disposition = resp.headers.get("content-disposition") || "attachment";
    const contentType = resp.headers.get("content-type") || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", disposition);

    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return res.status(200).send(buffer);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("company invoice document download api error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
