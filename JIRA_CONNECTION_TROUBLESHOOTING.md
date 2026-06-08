# Jira Connection Troubleshooting Guide

## Issue: 401 Unauthorized Error

When testing the Jira connection, you may encounter a "401 - Unauthorized" error with the message "Basic Authentication Failure - Reason: AUTHENTICATED_FAILED".

## Root Causes

1. **Expired API Token**: The API token in the `.env` file may have expired
2. **Incorrect Credentials**: Email or API token may be incorrect
3. **Authentication Method**: IBM Jira may require different authentication

## Solutions

### 1. Generate a New API Token

1. Log in to IBM Jira: https://jsw.ibm.com
2. Go to your profile settings
3. Navigate to Security → API Tokens
4. Generate a new API token
5. Update the `JIRA_API_TOKEN` in [`mock-backend/.env`](mock-backend/.env:17)

### 2. Verify Credentials

Ensure the following in [`mock-backend/.env`](mock-backend/.env:14):
```env
JIRA_HOST=jsw.ibm.com
JIRA_EMAIL=Mahendra.godase@ibm.com
JIRA_API_TOKEN=<your-new-token>
```

### 3. Test Connection

After updating credentials, test the connection:

```bash
cd mock-backend
node jira-integration.js test
```

### 4. Alternative: Use Personal Access Token (PAT)

If API tokens don't work, IBM Jira might require Personal Access Tokens:

1. Go to https://jsw.ibm.com
2. Navigate to Profile → Personal Access Tokens
3. Create a new token with appropriate scopes
4. Update the authentication in [`mock-backend/jira-service.js`](mock-backend/jira-service.js:5):

```javascript
const jira = new JiraClient({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  bearer: process.env.JIRA_PAT, // Use PAT instead
  apiVersion: '2',
  strictSSL: true
});
```

And update `.env`:
```env
JIRA_PAT=your-personal-access-token
```

### 5. Check Network Access

Ensure you can access IBM Jira from your network:
```bash
curl -I https://jsw.ibm.com
```

If you're behind a corporate proxy, you may need to configure proxy settings.

### 6. Verify Project Access

Ensure your account has access to the PROVINFO project:
1. Log in to https://jsw.ibm.com
2. Navigate to Projects → PROVINFO
3. Verify you can view PROVINFO-2: https://jsw.ibm.com/projects/PROVINFO/issues/PROVINFO-2

## Next Steps After Fixing Authentication

Once authentication is working:

1. **Test the connection**:
   ```bash
   node jira-integration.js test
   ```

2. **Fetch PROVINFO-2**:
   ```bash
   node jira-integration.js fetch
   ```

3. **Generate a report**:
   ```bash
   node jira-integration.js report
   ```

4. **Start the backend server**:
   ```bash
   npm start
   ```

5. **Test API endpoints**:
   ```bash
   curl http://localhost:3000/api/jira/test
   curl http://localhost:3000/api/jira/current-issue
   ```

## Common Error Messages

### "AUTHENTICATED_FAILED"
- **Cause**: Invalid credentials or expired token
- **Solution**: Generate new API token or PAT

### "403 Forbidden"
- **Cause**: Insufficient permissions
- **Solution**: Verify project access and user permissions

### "404 Not Found"
- **Cause**: Issue doesn't exist or no access
- **Solution**: Verify issue key and project access

### Network/Timeout Errors
- **Cause**: Network connectivity or proxy issues
- **Solution**: Check network access and proxy configuration

## Support Resources

- [Atlassian API Token Documentation](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v2/)
- IBM Jira Support: Contact your IBM Jira administrator

## Integration Status

✅ **Completed**:
- Jira configuration updated for PROVINFO project
- Integration script created ([`jira-integration.js`](mock-backend/jira-integration.js:1))
- API endpoints added to server ([`server.js`](mock-backend/server.js:254))
- Comprehensive documentation created

⚠️ **Pending**:
- Authentication credentials need to be updated
- Connection test needs to pass
- PROVINFO-2 issue needs to be fetched successfully

Once authentication is fixed, all integration features will be fully functional.