import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    const { company_id, project_phase_id, title, description, payment_terms, notes_to_customer } =
      (req.body || {}) as any;

    if (!company_id || !project_phase_id) {
      return res.status(400).json({ message: "company_id and project_phase_id are required" });
    }

    const url = `${base}/company-invoices/create-from-phase`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        company_id,
        project_phase_id,
        title,
        description,
        payment_terms,
        notes_to_customer,
      }),
    });

    const data = await resp.json().catch(() => null);

    if (!resp.ok) {
      return res
        .status(resp.status)
        .json(data || { message: "Failed to create company invoice from phase" });
    }

    return res.status(resp.status).json(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("create company invoice from phase api error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
