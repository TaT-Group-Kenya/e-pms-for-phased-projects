import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    // Forward all query params except reportType as filters
    const url = new URL(`${base}/reports/export-pdf`);
    const reportType = req.query.reportType || 'orders-summary';
    Object.entries(req.query).forEach(([key, value]) => {
      if (key === 'reportType') return;
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else if (value && typeof value === 'string') {
        url.searchParams.append(key, value);
      }
    });
    url.searchParams.append('reportType', String(reportType));

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace("Bearer ", "")}`,
      },
    });

    if (!resp.ok) {
      const error = await resp.json();
      return res.status(resp.status).json(error);
    }

    // PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="orders-summary.pdf"');
    const buffer = await resp.arrayBuffer();
    res.status(200).send(Buffer.from(buffer));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("export-pdf proxy error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
