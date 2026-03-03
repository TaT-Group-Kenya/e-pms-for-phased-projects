import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, from, to } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Account ID is required" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) {
    return res.status(500).json({ message: "EPMS_API_BASE not configured" });
  }

  try {
    const url = new URL(`${base}/accounts/${id}/statement-pdf`);
    if (from) url.searchParams.append("from", String(from));
    if (to) url.searchParams.append("to", String(to));

    const token = req.headers.authorization?.replace("Bearer ", "");

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
    });

    if (!resp.ok) {
      try {
        const errorBody = await resp.json();
        const message =
          errorBody?.message ||
          `Failed to download account statement PDF (status ${resp.status})`;
        return res.status(resp.status).json({ message, details: errorBody });
      } catch {
        let text = "";
        try {
          text = await resp.text();
        } catch {
          // ignore
        }
        const message =
          text || `Failed to download account statement PDF (status ${resp.status})`;
        return res.status(resp.status).json({ message });
      }
    }

    const arrayBuffer = await resp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType = resp.headers.get("content-type") || "application/pdf";
    const contentDisposition =
      resp.headers.get("content-disposition") ||
      `attachment; filename="account-statement-${id}.pdf"`;

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);

    return res.end(buffer);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("download account statement pdf error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
