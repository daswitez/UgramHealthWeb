import { NextRequest, NextResponse } from "next/server";

// API_ORIGIN se lee en runtime — NO necesita NEXT_PUBLIC_
const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:8080";

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

async function proxyRequest(req: NextRequest, params: { path: string[] }) {
  const path   = params.path.join("/");
  const search = req.nextUrl.search ?? "";
  const target = `${API_ORIGIN}/api/v1/${path}${search}`;

  console.log(`[proxy] ${req.method} ${target}`);

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };
  const auth = req.headers.get("authorization");
  if (auth) headers["Authorization"] = auth;

  const init: RequestInit = { method: req.method, headers };

  if (req.method !== "GET" && req.method !== "DELETE") {
    init.body = await req.text();
  }

  try {
    const upstream = await fetch(target, init);
    const text     = await upstream.text();

    return new NextResponse(text, {
      status:  upstream.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[proxy] Target URL:", target);
    console.error("[proxy] API_ORIGIN env:", process.env.API_ORIGIN);
    console.error("[proxy] Error:", err?.message || err);

    return NextResponse.json(
      {
        success: false,
        message: "Error al conectar con el servidor backend",
        debug: {
          target,
          apiOrigin: process.env.API_ORIGIN || "(no seteada — usando fallback localhost)",
          error: err?.message || String(err),
        }
      },
      { status: 502 }
    );
  }
}
