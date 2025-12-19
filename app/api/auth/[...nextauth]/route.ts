import { GET as authGET, POST as authPOST, setRequestContext, extractClientInfoFromRequest } from "@/src/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    // Set request context before calling the original GET handler
    const clientContext = extractClientInfoFromRequest(request);
    setRequestContext(request, clientContext);
    return authGET(request);
}

export async function POST(request: NextRequest) {
    // Set request context before calling the original POST handler
    const clientContext = extractClientInfoFromRequest(request);
    setRequestContext(request, clientContext);
    return authPOST(request);
}
