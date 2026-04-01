import { NextRequest, NextResponse } from "next/server";

const API = process.env.API_URL;
const ADMIN_KEY = process.env.ADMIN_API_KEY;

const ALLOWED_GET = ["tenants","audit","cache/stats","audit/cost-summary","health"];
const ALLOWED_POST = ["tenants"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "";
  if (!ALLOWED_GET.includes(endpoint)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const res = await fetch(`${API}/${endpoint}`, {
    headers: { "X-Admin-Key": ADMIN_KEY || "" },
    cache: "no-store"
  });
  return NextResponse.json(await res.json());
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get("endpoint") || "";
  if (!ALLOWED_POST.includes(endpoint)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }
  const body = await request.json();
  const res = await fetch(`${API}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": ADMIN_KEY || "" },
    body: JSON.stringify(body)
  });
  return NextResponse.json(await res.json());
}