import { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    let url = new URL(`${base}/reports/invoice-payments`);
    let fetchOptions: any = {
      headers: {
        ...JSON_HEADERS,
      },
      method: req.method,
    };

    // Pass Authorization header if present
    if (req.headers.authorization) {
      fetchOptions.headers["Authorization"] = req.headers.authorization;
    }

    if (req.method === "GET") {
      Object.entries(req.query).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => url.searchParams.append(key, v));
        } else if (value) {
          url.searchParams.append(key, value);
        }
      });
    } else if (req.method === "POST") {
      fetchOptions.body = JSON.stringify(req.body);
      fetchOptions.headers["Content-Type"] = "application/json";
    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const resp = await fetch(url.toString(), fetchOptions);
    const data = await resp.json();
    return res.status(resp.status).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("invoice-payments report proxy error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}


