import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Build redirect back to home
  const response = NextResponse.redirect(new URL("/", request.url));

  // SERVER-SIDE: Expire all cookies received in the request
  request.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, "", {
      path: "/",            // Match original cookie path
      expires: new Date(0), // Expire instantly
    });
  });

  // CLIENT-SIDE fallback script to wipe any leftovers
  response.headers.set(
    "Content-Type",
    "text/html; charset=utf-8"
  );
  response.headers.set(
    "Refresh",
    "0; url=/" // redirect immediately after JS runs
  );

  // Small HTML snippet that kills all cookies in the browser
  const cookieNames = request.cookies.getAll().map(c => c.name);
  const clientScript = `
    <script>
      ${cookieNames
        .map(
          name =>
            `document.cookie = "${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";`
        )
        .join("\n")}
    </script>
  `;

  return new NextResponse(clientScript, {
    status: 200,
    headers: response.headers,
  });
}
