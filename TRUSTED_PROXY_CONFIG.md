# Trusted Proxy Configuration for GeoBrains

## Overview

GeoBrains now includes trusted-proxy-aware IP extraction to prevent IP spoofing attacks through the `X-Forwarded-For` header. This security enhancement ensures that client IP addresses are properly validated and extracted from the correct position in proxy chains.

## Security Issue Addressed

The original implementation unsafely took the leftmost value from the `X-Forwarded-For` header, which can be spoofed by malicious clients. The new implementation:

1. **Validates IP addresses** - Ensures each IP in the header is properly formatted
2. **Uses trusted proxy count** - Selects the correct IP based on the number of trusted proxies
3. **Falls back gracefully** - Uses provider-specific headers when appropriate
4. **Returns "unknown" for invalid IPs** - Prevents injection of malicious values

## Configuration Variables

### `TRUSTED_PROXY_COUNT`

**Type:** Integer (>= 0)
**Default:** `0`
**Environment Variable:** `TRUSTED_PROXY_COUNT`

Specifies the number of trusted proxies between the client and your server. This determines which IP address to extract from the `X-Forwarded-For` header.

**How it works:**
- When `X-Forwarded-For: client-ip, proxy1-ip, proxy2-ip` is received
- The client IP is selected using the formula: `ips.length - trustedProxyCount - 1`
- This means:
  - `TRUSTED_PROXY_COUNT=0`: Use the rightmost IP (most conservative, assumes no trusted proxies)
  - `TRUSTED_PROXY_COUNT=1`: Use the second IP from the right (trust 1 proxy)
  - `TRUSTED_PROXY_COUNT=2`: Use the third IP from the right (trust 2 proxies)
- This accounts for the trusted proxies that append their IPs to the header

**Examples:**

```env
# No trusted proxies (default) - use leftmost IP
TRUSTED_PROXY_COUNT=0

# 1 trusted proxy (e.g., load balancer)
TRUSTED_PROXY_COUNT=1

# 2 trusted proxies (e.g., CDN + load balancer)
TRUSTED_PROXY_COUNT=2
```

### `PREFER_PROVIDER_HEADERS`

**Type:** Boolean
**Default:** `false`
**Environment Variable:** `PREFER_PROVIDER_HEADERS`

When set to `true`, the system will prefer provider-specific headers over `X-Forwarded-For`. This is useful when running on platforms that provide their own client IP headers.

**Supported provider headers (in priority order):**
- `cf-connecting-ip` (Cloudflare)
- `true-client-ip` (Cloudflare, other providers)
- `fly-client-ip` (Fly.io)
- `x-real-ip` (NGINX, other proxies)

**Example:**

```env
# Prefer provider headers on Cloudflare
PREFER_PROVIDER_HEADERS=true
```

## Configuration Scenarios

### 1. Direct Deployment (No Proxies)

```env
TRUSTED_PROXY_COUNT=0
PREFER_PROVIDER_HEADERS=false
```

### 2. Behind a Single Load Balancer

```env
TRUSTED_PROXY_COUNT=1
PREFER_PROVIDER_HEADERS=false
```

### 3. Behind CDN + Load Balancer

```env
TRUSTED_PROXY_COUNT=2
PREFER_PROVIDER_HEADERS=false
```

### 4. Cloudflare Deployment

```env
TRUSTED_PROXY_COUNT=0
PREFER_PROVIDER_HEADERS=true
```

### 5. Fly.io Deployment

```env
TRUSTED_PROXY_COUNT=0
PREFER_PROVIDER_HEADERS=true
```

## IP Validation

The system validates IP addresses using the following rules:

**IPv4:**
- Format: `xxx.xxx.xxx.xxx` where each xxx is 0-255
- Example: `192.168.1.1`

**IPv6:**
- Format: Eight groups of four hexadecimal digits, separated by colons
- Example: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

**Port handling:**
- IPs with ports (e.g., `192.168.1.1:8080`) are validated by extracting the IP portion

## Fallback Behavior

1. **Primary:** `X-Forwarded-For` with trusted proxy logic
2. **Fallback:** Provider-specific headers (`cf-connecting-ip`, `true-client-ip`, etc.)
3. **Final:** Returns `"unknown"` if no valid IP can be determined

## Implementation Details

The IP extraction logic follows this algorithm:

1. **Check configuration:** Read `TRUSTED_PROXY_COUNT` and `PREFER_PROVIDER_HEADERS`
2. **Provider headers first (if configured):** Try provider-specific headers if `PREFER_PROVIDER_HEADERS=true`
3. **Process X-Forwarded-For:**
   - Split on commas, trim whitespace
   - Filter out empty entries
   - Validate each IP address
   - Select IP at index: `validIPs.length - trustedProxyCount - 1` (clamped to bounds)
4. **Fallback to provider headers:** If no valid IP from X-Forwarded-For
5. **Return "unknown":** If all methods fail

## Security Best Practices

1. **Set the correct proxy count:** Ensure `TRUSTED_PROXY_COUNT` matches your infrastructure
2. **Use provider headers on managed platforms:** Set `PREFER_PROVIDER_HEADERS=true` on Cloudflare, Fly.io, etc.
3. **Validate your configuration:** Test IP extraction in different deployment scenarios
4. **Monitor for "unknown" IPs:** This may indicate misconfiguration or attacks

## Testing

To test your configuration, you can:

1. **Check logs:** Look for IP addresses in audit logs
2. **Use curl:** Test with different headers:
   ```bash
   curl -H "X-Forwarded-For: 192.168.1.1, 10.0.0.1" your-endpoint
   ```
3. **Verify behavior:** Ensure the correct IP is extracted based on your proxy count

## Migration Guide

If you're upgrading from a previous version:

1. **Review your infrastructure:** Count the number of trusted proxies
2. **Set `TRUSTED_PROXY_COUNT`:** Match your proxy chain length
3. **Consider `PREFER_PROVIDER_HEADERS`:** If using Cloudflare, Fly.io, etc.
4. **Test thoroughly:** Verify IP extraction works as expected

## Troubleshooting

**Issue:** All IPs show as "unknown"
- **Cause:** Invalid IP format in headers or misconfiguration
- **Solution:** Check header formats and validate `TRUSTED_PROXY_COUNT`

**Issue:** Wrong IP extracted
- **Cause:** Incorrect `TRUSTED_PROXY_COUNT` setting
- **Solution:** Adjust the count to match your proxy chain

**Issue:** Provider headers not working
- **Cause:** `PREFER_PROVIDER_HEADERS` not set or headers not present
- **Solution:** Set to `true` and verify provider sends the expected headers