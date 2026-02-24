import type { NextApiRequest, NextApiResponse } from "next";
import { JSON_HEADERS } from "../../../constants/headers";

type ResponseData = {
  success?: boolean;
  data?: any;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const authToken = req.headers.authorization?.replace("Bearer ", "");
  const base = process.env.EPMS_API_BASE;

  if (!authToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!base) {
    return res.status(500).json({ error: "EPMS_API_BASE not configured" });
  }

  try {
    const { project_id, phase_id } = req.body;

    if (req.method === "GET") {
      // Get phases for a project
      if (!project_id) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      const url = new URL(`${base}/project-phases`);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || "Failed to fetch phases",
        });
      }

      return res.status(200).json({ success: true, data });
    } else if (req.method === "POST") {
      // Create phase
      const {
        name,
        description,
        phase_order,
        status,
        start_date,
        end_date,
        progress_percentage,
        quote_item_id,
      } = req.body;

      if (!project_id) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      const payload = {
        project_id: parseInt(project_id),
        name,
        description: description || null,
        phase_order,
        status: status || "new",
        start_date: start_date || null,
        end_date: end_date || null,
        progress_percentage: progress_percentage?.toString() || "0",
        quote_item_id: quote_item_id || null,
      };

      const url = new URL(`${base}/project-phases`);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || "Failed to create phase",
        });
      }

      return res.status(201).json({
        success: true,
        data: data.data || data,
      });
    } else if (req.method === "PUT") {
      // Update phase
      const {
        name,
        description,
        phase_order,
        status,
        start_date,
        end_date,
        progress_percentage,
        quote_item_id,
      } = req.body;

      if (!phase_id) {
        return res.status(400).json({ error: "Phase ID is required" });
      }

      const payload = {
        name,
        description: description || null,
        phase_order,
        status: status || "new",
        start_date: start_date || null,
        end_date: end_date || null,
        progress_percentage: progress_percentage?.toString() || "0",
        quote_item_id: quote_item_id || null,
      };

      const url = new URL(`${base}/project-phases/${phase_id}`);

      const response = await fetch(url.toString(), {
        method: "PUT",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || "Failed to update phase",
        });
      }

      return res.status(200).json({
        success: true,
        data: data.data || data,
      });
    } else if (req.method === "DELETE") {
      // Delete phase
      if (!phase_id) {
        return res.status(400).json({ error: "Phase ID is required" });
      }

      const url = new URL(`${base}/project-phases/${phase_id}`);

      const response = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        return res.status(response.status).json({
          error: data.message || "Failed to delete phase",
        });
      }

      return res.status(204).end();
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error: any) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: error.message || "Internal server error",
    });
  }
}
