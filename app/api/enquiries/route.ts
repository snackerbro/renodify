import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validators";
import { createEnquiry } from "@/lib/services/enquiries";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "Invalid request" },
      { status: 422 },
    );
  }

  try {
    const result = await createEnquiry(parsed.data);
    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("createEnquiry failed", e);
    return NextResponse.json(
      { error: "Could not submit enquiry. Please try again." },
      { status: 500 },
    );
  }
}
