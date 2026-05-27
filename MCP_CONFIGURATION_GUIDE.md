# MCP (Model Context Protocol) Configuration Guide

## What is MCP?

MCP (Model Context Protocol) allows Cline to connect to external services and tools through a standardized protocol. In your case, you want to connect to IBM Context Studio.

## How to Configure MCP in Cline

### Method 1: Through Cline Settings (Recommended)

1. **Open Cline Settings:**
   - Click on the Cline icon in VS Code sidebar
   - Click the gear icon (⚙️) or "Settings" button
   - Look for "MCP Servers" section

2. **Add MCP Server Configuration:**
   - Click "Edit MCP Settings" or "Add MCP Server"
   - Paste the following configuration:

```json
{
  "mcpServers": {
    "context-studio": {
      "type": "streamable-http",
      "url": "https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp",
      "headers": {
        "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb250ZXh0LXN0dWRpby11c2VyQGV4YW1wbGUuY29tIiwianRpIjoiMDM1MDU4YzQtOWZhNS00MjFkLTliZDktZDA4MmU4Mzc3MzlkIiwidG9rZW5fdXNlIjoiYXBpIiwiaWF0IjoxNzc5Nzk1OTU1LCJpc3MiOiJtY3BnYXRld2F5IiwiYXVkIjoibWNwZ2F0ZXdheS1hcGkiLCJ1c2VyIjp7ImVtYWlsIjoiY29udGV4dC1zdHVkaW8tdXNlckBleGFtcGxlLmNvbSIsImZ1bGxfbmFtZSI6IkFQSSBUb2tlbiBVc2VyIiwiaXNfYWRtaW4iOmZhbHNlLCJhdXRoX3Byb3ZpZGVyIjoiYXBpX3Rva2VuIn0sInRlYW1zIjpbIjVhYTNiZDhkNDUxMDRlNzVhZDdhMzBjYTAzOTEyYzIwIl0sInNjb3BlcyI6eyJzZXJ2ZXJfaWQiOiI4Y2NkZDIwM2JkZWU0MDE0YjA4ZTgyZWVkYjYwNDZlMiIsInBlcm1pc3Npb25zIjpbImdhdGV3YXlzLnJlYWQiLCJzZXJ2ZXJzLnJlYWQiLCJzZXJ2ZXJzLnVzZSIsInRvb2xzLnJlYWQiLCJ0b29scy5leGVjdXRlIiwidGVhbXMucmVhZCIsInJlc291cmNlcy5yZWFkIiwicHJvbXB0cy5yZWFkIl0sImlwX3Jlc3RyaWN0aW9ucyI6W10sInRpbWVfcmVzdHJpY3Rpb25zIjp7fX0sImV4cCI6MTc4MjM4Nzk1NX0.8piXN8ABnlGfjBaNtKIj63nwakqU0Wx7zbWzOn3xNJY",
        "x-api-key": "ctx_b7893df16d01"
      },
      "disabled": false
    }
  }
}
```

3. **Save the Configuration**
4. **Restart Cline** (if needed)

### Method 2: Direct Settings File Edit

1. **Locate Cline Settings File:**
   - Windows: `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`
   - Mac: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`
   - Linux: `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

2. **Edit the file** and add the MCP server configuration above

3. **Restart VS Code**

## What This Configuration Does

- **Server Name:** `context-studio`
- **Type:** `streamable-http` (HTTP-based MCP server)
- **URL:** IBM Context Studio MCP Gateway endpoint
- **Authentication:** 
  - Bearer token in Authorization header
  - API key: `ctx_b7893df16d01`
- **Status:** Enabled

## Verifying the Configuration

After configuration:

1. Open Cline
2. Look for "MCP" or "Tools" section
3. You should see "context-studio" listed as an available MCP server
4. Check if it shows as "Connected" or "Active"

## Using IBM Context Studio Tools

Once connected, you can:

1. **Access IBM Context Studio resources**
2. **Use Context Studio tools** through Cline
3. **Query IBM services** via the MCP gateway

## Troubleshooting

### MCP Server Not Showing Up

- Verify the JSON syntax is correct
- Check that the URL is accessible
- Ensure the authorization token is valid
- Restart VS Code completely

### Connection Errors

- **401 Unauthorized:** Token may be expired
- **403 Forbidden:** Check API key and permissions
- **Network errors:** Verify IBM VPN/network access

### Token Expiration

The JWT token in the configuration has an expiration date:
- **Issued:** 2025-01-23
- **Expires:** 2026-06-20

If expired, you'll need to:
1. Get a new token from IBM Context Studio
2. Update the Authorization header
3. Restart Cline

## IBM Context Studio Permissions

Your token has the following permissions:
- `gateways.read`
- `servers.read`
- `servers.use`
- `tools.read`
- `tools.execute`
- `teams.read`
- `resources.read`
- `prompts.read`

## Security Notes

⚠️ **Important:**
- Keep your API token secure
- Don't commit tokens to version control
- Rotate tokens regularly
- Use environment-specific tokens

## Additional Resources

- IBM Context Studio Documentation
- MCP Protocol Specification
- Cline MCP Integration Guide

---

**Note:** This configuration is for Cline's MCP integration, not for your Angular application. If you need to integrate IBM Context Studio into your Angular app, that would require a different approach using HTTP clients and API calls.
