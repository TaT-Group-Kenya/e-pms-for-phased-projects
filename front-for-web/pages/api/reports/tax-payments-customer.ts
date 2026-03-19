import { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) {
    return res.status(500).json({ message: "EPMS_API_BASE not configured" });
  }

  try {
    // Build query string from req.query
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(req.query)) {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v));
      } else if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    }
    const url = `${base}/reports/tax-payments-customer${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const resp = await fetch(url, {
      method: "GET",
      headers: {
        ...JSON_HEADERS,
        Authorization: req.headers.authorization ? req.headers.authorization : "",
      },
    });

    const contentType = resp.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await resp.json();
    } else {
      data = await resp.text();
    }
    return res.status(resp.status).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("tax-payments-customer report proxy error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
