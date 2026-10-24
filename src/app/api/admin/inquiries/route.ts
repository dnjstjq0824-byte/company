import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedAdmin, logAdminActivity } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");

  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { created_at: "desc" },
  });

  if (format === "csv") {
    await logAdminActivity(
      admin.id,
      "EXPORT_INQUIRIES_CSV",
      `Exported ${inquiries.length} contact inquiries to CSV`
    );

    const escapeCsv = (val: unknown) => {
      const str = String(val ?? "").replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Company",
      "Inquiry Type",
      "Subject",
      "Message",
      "Status",
      "Admin Notes",
      "Submitted At",
      "Updated At",
    ];

    const rows = inquiries.map((inq) =>
      [
        inq.id,
        inq.full_name,
        inq.email,
        inq.company || "",
        inq.inquiry_type,
        inq.subject,
        inq.message,
        inq.status,
        inq.admin_notes || "",
        inq.created_at.toISOString(),
        inq.updated_at.toISOString(),
      ]
        .map(escapeCsv)
        .join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="booking-network-inquiries-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json({ inquiries });
}

