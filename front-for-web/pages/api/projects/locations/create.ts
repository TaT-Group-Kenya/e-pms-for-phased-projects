import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) {
    return res.status(500).json({ error: "EPMS_API_BASE not configured" });
  }

  try {
    const response = await fetch(`${base}/project-locations`, {
      method: "POST",
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace("Bearer ", "")}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(201).json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
