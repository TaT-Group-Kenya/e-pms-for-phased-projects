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
    if (req.method === "POST") {
      // Assign company to phase
      const { project_id, phase_id, company_id, is_complete } = req.body;

      if (!project_id || !phase_id || !company_id) {
        return res.status(400).json({
          error: "project_id, phase_id, and company_id are required",
        });
      }

      const url = new URL(`${base}/company-projects`);

      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          ...JSON_HEADERS,
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          project_id,
          phase_id,
          company_id,
          is_complete: is_complete || false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          error: data.message || "Failed to assign company to phase",
        });
      }

      return res.status(200).json({ success: true, data });
    } else if (req.method === "GET") {
      // Get company assignments with optional filters
      const { phase_id, project_id, company_id, is_complete, per_page, page } = req.query;

      const url = new URL(`${base}/company-projects`);
      if (phase_id) {
        url.searchParams.append("phase_id", String(phase_id));
      }
      if (project_id) {
        url.searchParams.append("project_id", String(project_id));
      }
      if (company_id) {
        url.searchParams.append("company_id", String(company_id));
      }
      if (typeof is_complete !== "undefined") {
        url.searchParams.append("is_complete", String(is_complete));
      }
      if (per_page) {
        url.searchParams.append("per_page", String(per_page));
      }
      if (page) {
        url.searchParams.append("page", String(page));
      }

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
          error: data.message || "Failed to fetch company assignments",
        });
      }

      return res.status(200).json({ success: true, data });
    } else if (req.method === "DELETE") {
      // Remove company assignment from phase
      const { company_project_id } = req.body;

      if (!company_project_id) {
        return res.status(400).json({
          error: "company_project_id is required",
        });
      }

      const url = new URL(`${base}/company-projects/${company_project_id}`);

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
          error: data.message || "Failed to remove company assignment",
        });
      }

      return res.status(200).json({ success: true });
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("Error handling company-projects:", err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}
