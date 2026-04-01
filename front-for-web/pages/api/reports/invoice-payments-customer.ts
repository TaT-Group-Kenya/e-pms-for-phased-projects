import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    const url = new URL(`${base}/reports/invoice-payments-customer`);
    Object.entries(req.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, v));
      } else if (value) {
        url.searchParams.append(key, value);
      }
    });

    const resp = await fetch(url.toString(), {
      method: "GET",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace("Bearer ", "")}`,
      },
    });

    const data = await resp.json();
    return res.status(resp.status).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("invoice-payments-customer report proxy error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
