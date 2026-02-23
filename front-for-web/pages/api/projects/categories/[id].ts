import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../../constants/headers";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Category ID is required" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) {
    return res.status(500).json({ error: "EPMS_API_BASE not configured" });
  }

  try {
    const response = await fetch(`${base}/project-categories/${id}`, {
      method: req.method,
      headers: {
        ...JSON_HEADERS,
        Authorization: `Bearer ${req.headers.authorization?.replace("Bearer ", "")}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ message: "Failed to process request"});
    }

    return res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
