import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!["PUT", "DELETE"].includes(req.method || "")) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const base = process.env.EPMS_API_BASE;
  if (!base) {
    return res.status(500).json({ message: "EPMS_API_BASE not configured" });
  }

  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${req.headers.authorization?.replace("Bearer ", "")}`,
      Accept: "application/json",
    };

    if (req.headers["content-type"]) {
      headers["Content-Type"] = req.headers["content-type"];
    }

    const url = `${base}/company-banks/${id}`;

    const resp = await fetch(url, {
      method: req.method,
      headers,
      body: req.method !== "DELETE" ? (req as any) : undefined,
      duplex: "half",
    } as any);

    if (req.method === "PUT") {
      const contentType = resp.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await resp.text();
        console.error("Non-JSON response from backend:", text.substring(0, 200));
        return res.status(500).json({ message: "Invalid response from server" });
      }

      const data = await resp.json();

      if (!resp.ok) {
        return res.status(resp.status).json(data.errors || data);
      }

      return res.status(resp.status).json(data);
    } else if (req.method === "DELETE") {
      if (resp.ok) {
        return res.status(200).json({ message: "Bank account deleted successfully" });
      } else {
        return res.status(resp.status).json({ message: "Failed to delete bank account" });
      }
    }
  } catch (err) {
    console.error(`bank account ${req.method?.toLowerCase()} error`, err);
    return res.status(500).json({ message: "Proxy error" });
  }
}
