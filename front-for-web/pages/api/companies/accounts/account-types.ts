import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  data?: Array<{ id: string; name: string }>;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    // Return available account types
    const accountTypes = [
      { id: "Bank", name: "Bank" },
      { id: "MPESA", name: "M-Pesa" },
    ];
    return res.status(200).json({ data: accountTypes });
  }

  res.status(405).json({ message: "Method not allowed" });
}
