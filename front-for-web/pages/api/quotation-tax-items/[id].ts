import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!["GET", "PUT", "DELETE"].includes(req.method || "")) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) return res.status(500).json({ message: "EPMS_API_BASE not configured" });

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Tax item ID is required" });
    }

    const url = `${base}/quotation-tax-items/${id}`;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (req.method === "GET") {
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        return res
          .status(resp.status)
          .json(data?.errors || data || { message: "Failed to load tax item" });
      }

      return res.status(resp.status).json(data);
    }

    if (req.method === "PUT") {
      const resp = await fetch(url, {
        method: "PUT",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(req.body),
      });

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        return res
          .status(resp.status)
          .json(data?.errors || data || { message: "Failed to update tax item" });
      }

      return res.status(resp.status).json(data);
    }

    if (req.method === "DELETE") {
      const resp = await fetch(url, {
        method: "DELETE",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 204) {
        return res.status(204).end();
      }

      const data = await resp.json().catch(() => null);

      if (!resp.ok) {
        return res
          .status(resp.status)
          .json(data || { message: "Failed to delete tax item" });
      }

      return res.status(resp.status).json(data || { message: "Tax item deleted successfully" });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("quotation tax item api error", err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
