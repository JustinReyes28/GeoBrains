// This file contains utilities that are compatible with the Edge Runtime.
// It must NOT import anything that depends on Node.js APIs (like Prisma/pg).

export interface ClientContext {
    ip?: string;
    userAgent?: string;
}

// Configuration for trusted proxy handling
// Set TRUSTED_PROXY_COUNT environment variable to specify how many proxies to trust
// Set PREFER_PROVIDER_HEADERS=true to prefer provider-specific headers over X-Forwarded-For
interface TrustedProxyConfig {
    trustedProxyCount: number;
    preferProviderHeaders: boolean;
}

// Thread-safe request context using a WeakMap to avoid memory leaks
export const requestContextMap = new WeakMap<Request, ClientContext>();

/**
 * Validates if a string is a valid IPv4 or IPv6 address
 * This is a simplified validation that checks basic format
 */
function isValidIP(ip: string): boolean {
    if (!ip || typeof ip !== 'string') return false;
    
    // Handle IPv6 vs IPv4 with port differently
    const isIpv6 = ip.includes(':') && !ip.match(/^\d+\.\d+\.\d+\.\d+:/);
    
    let cleanIp = ip;
    if (!isIpv6 && ip.includes(':')) {
        // For IPv4 with port (e.g., "192.168.1.1:8080"), extract just the IP
        cleanIp = ip.split(':')[0];
    }
    
    // IPv4 validation (basic format check)
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipv4Pattern.test(cleanIp)) {
        const parts = cleanIp.split('.').map(part => parseInt(part, 10));
        return parts.every(part => part >= 0 && part <= 255);
    }
    
    // IPv6 validation (more comprehensive format check)
    // This handles compressed forms, mixed notation, etc.
    const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?::(([0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4})?$/;
    return ipv6Pattern.test(ip);
}

/**
 * Extracts client IP from request headers with trusted proxy awareness
 * 
 * Security considerations:
 * - Validates IP addresses to prevent injection attacks
 * - Uses trusted proxy count to select the correct IP from X-Forwarded-For
 * - Falls back to provider-specific headers when appropriate
 * - Returns "unknown" if no valid IP can be determined
 */
export function extractClientInfoFromRequest(request: Request): ClientContext {
    // Get configuration from environment variables
    const trustedProxyCount = parseInt(process.env.TRUSTED_PROXY_COUNT || '0', 10);
    const preferProviderHeaders = process.env.PREFER_PROVIDER_HEADERS === 'true';
    
    let ip: string = "unknown";
    
    // If configured to prefer provider-specific headers, try those first
    if (preferProviderHeaders) {
        ip = request.headers.get("cf-connecting-ip") ||
             request.headers.get("true-client-ip") ||
             request.headers.get("fly-client-ip") ||
             request.headers.get("x-real-ip") ||
             "unknown";
        
        // If we found a valid IP from provider headers, use it
        if (ip !== "unknown" && isValidIP(ip)) {
            // Extract user agent
            const userAgent = request.headers.get("user-agent") || "unknown";
            return { ip, userAgent };
        }
    }
    
    // Handle X-Forwarded-For header with trusted proxy awareness
    const xForwardedFor = request.headers.get("x-forwarded-for");
    
    if (xForwardedFor) {
        // Split on commas, trim whitespace, and filter out empty entries
        const ips = xForwardedFor.split(',').map(ip => ip.trim()).filter(ip => ip);
        
        // Validate all IPs and filter out invalid ones
        const validIPs = ips.filter(isValidIP);
        
        if (validIPs.length > 0) {
            // Calculate the index of the client IP based on trusted proxy count
            // Standard approach: client IP is at ips.length - trustedProxyCount - 1
            // This uses rightmost-first convention where higher trustedProxyCount values
            // select IPs further to the left in the X-Forwarded-For list
            // When trustedProxyCount=0: use rightmost IP (index ips.length - 1)
            // When trustedProxyCount=1: use second IP from right (index ips.length - 2)
            // When trustedProxyCount=2: use third IP from right (index ips.length - 3)
            // Clamp to valid bounds [0, validIPs.length - 1]
            const clientIpIndex = Math.max(0, Math.min(validIPs.length - 1, validIPs.length - trustedProxyCount - 1));
            ip = validIPs[clientIpIndex];
        }
    }
    
    // If we still don't have a valid IP, fall back to provider-specific headers
    if (!isValidIP(ip)) {
        ip = request.headers.get("cf-connecting-ip") ||
             request.headers.get("true-client-ip") ||
             request.headers.get("fly-client-ip") ||
             request.headers.get("x-real-ip") ||
             "unknown";
        
        // Validate the fallback IP
        if (!isValidIP(ip)) {
            ip = "unknown";
        }
    }

    // Extract user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    return { ip, userAgent };
}

export function setRequestContext(request: Request, context: ClientContext) {
    requestContextMap.set(request, context);
}

export function getRequestContext(request: Request): ClientContext | undefined {
    return requestContextMap.get(request);
}
