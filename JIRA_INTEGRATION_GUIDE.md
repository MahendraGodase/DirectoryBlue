# Jira Integration Guide - PROVINFO-2

This guide explains how to connect and interact with the PROVINFO-2 Jira issue from your DirectoryBlue application.

## Overview

The DirectoryBlue application is now integrated with IBM Jira (jsw.ibm.com) to work with the PROVINFO project, specifically issue PROVINFO-2.

## Configuration

### Environment Variables

The Jira configuration is stored in [`mock-backend/.env`](mock-backend/.env:14):

```env
JIRA_HOST=jsw.ibm.com
JIRA_EMAIL=Mahendra.godase@ibm.com
JIRA_API_TOKEN=<your-api-token>
JIRA_PROJECT_KEY=PROVINFO
JIRA_ISSUE_TYPE=Task
JIRA_CURRENT_ISSUE=PROVINFO-2
```

### Required Dependencies

The integration uses the `jira-client` npm package, already installed in [`mock-backend/package.json`](mock-backend/package.json:27).

## Components

### 1. Jira Service ([`mock-backend/jira-service.js`](mock-backend/jira-service.js:1))

Core service providing low-level Jira API operations:
- Test connection
- Create issues
- Get issue details
- Update issue status
- Add comments
- Search issues
- Sync tasks with Jira

### 2. Jira Integration ([`mock-backend/jira-integration.js`](mock-backend/jira-integration.js:1))

High-level integration specifically for PROVINFO-2:
- Fetch current issue details
- Add comments to PROVINFO-2
- Update PROVINFO-2 status
- Link provider tasks to PROVINFO-2
- Sync task status with PROVINFO-2
- Generate comprehensive reports

### 3. API Endpoints ([`mock-backend/server.js`](mock-backend/server.js:254))

RESTful API endpoints for frontend integration.

## API Endpoints

### Test Connection
```http
GET /api/jira/test
```
Tests the Jira connection and returns current user information.

**Response:**
```json
{
  "success": true,
  "user": "Mahendra Godase",
  "email": "Mahendra.godase@ibm.com"
}
```

### Get Current Issue (PROVINFO-2)
```http
GET /api/jira/current-issue
```
Fetches details of the PROVINFO-2 issue.

**Response:**
```json
{
  "success": true,
  "data": {
    "key": "PROVINFO-2",
    "summary": "Issue summary",
    "description": "Issue description",
    "status": "In Progress",
    "assignee": "John Doe",
    "reporter": "Jane Smith",
    "created": "2026-06-01T10:00:00.000Z",
    "updated": "2026-06-08T12:00:00.000Z",
    "url": "https://jsw.ibm.com/browse/PROVINFO-2"
  }
}
```

### Get Any Issue
```http
GET /api/jira/issue/:issueKey
```
Fetches details of any Jira issue by key.

**Example:**
```http
GET /api/jira/issue/PROVINFO-3
```

### Get Issue Report
```http
GET /api/jira/report
```
Generates a comprehensive report including issue details and available transitions.

### Get Available Transitions
```http
GET /api/jira/transitions/:issueKey?
```
Gets available status transitions for an issue (defaults to PROVINFO-2).

**Response:**
```json
{
  "success": true,
  "transitions": [
    { "id": "11", "name": "To Do" },
    { "id": "21", "name": "In Progress" },
    { "id": "31", "name": "Done" }
  ]
}
```

### Add Comment
```http
POST /api/jira/comment/:issueKey?
Content-Type: application/json

{
  "comment": "Your comment text here"
}
```
Adds a comment to the issue (defaults to PROVINFO-2).

### Update Status
```http
POST /api/jira/status/:issueKey?
Content-Type: application/json

{
  "status": "In Progress"
}
```
Updates the issue status (defaults to PROVINFO-2).

### Search PROVINFO Issues
```http
GET /api/jira/search?maxResults=20
```
Searches all issues in the PROVINFO project.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "key": "PROVINFO-2",
      "summary": "Issue summary",
      "status": "In Progress",
      "assignee": "John Doe",
      "created": "2026-06-01T10:00:00.000Z",
      "url": "https://jsw.ibm.com/browse/PROVINFO-2"
    }
  ],
  "total": 15
}
```

### Link Task to Jira
```http
POST /api/jira/link-task
Content-Type: application/json

{
  "taskId": "TSK001",
  "providerName": "Dr. John Smith",
  "npi": "1234567890",
  "providerId": "PRV001",
  "taskStatus": "In Progress",
  "dataSource": "CAQH",
  "taskAge": 15
}
```
Links a provider task to PROVINFO-2 by adding a comment with task details.

### Sync Task with Jira
```http
POST /api/jira/sync-task/:taskId
```
Syncs a task's status with the Jira issue status.

**Example:**
```http
POST /api/jira/sync-task/TSK001
```

**Response:**
```json
{
  "success": true,
  "taskStatus": "In Progress",
  "jiraStatus": "In Progress",
  "jiraUrl": "https://jsw.ibm.com/browse/PROVINFO-2"
}
```

### Create New Issue
```http
POST /api/jira/create-issue
Content-Type: application/json

{
  "taskName": "Initial Survey",
  "providerName": "Dr. John Smith",
  "npi": "1234567890",
  "providerId": "PRV001",
  "taskId": "TSK001",
  "taskStatus": "Pending",
  "dataSource": "CAQH"
}
```
Creates a new Jira issue in the PROVINFO project.

### Get Projects
```http
GET /api/jira/projects
```
Lists all available Jira projects.

## Command Line Interface

The integration script can be run directly from the command line:

```bash
cd mock-backend

# Test connection
node jira-integration.js test

# Fetch PROVINFO-2 details
node jira-integration.js fetch

# Generate comprehensive report
node jira-integration.js report

# Get available transitions
node jira-integration.js transitions

# Search PROVINFO issues
node jira-integration.js search 10

# Add comment
node jira-integration.js comment "Working on this issue"

# Update status
node jira-integration.js status "In Progress"
```

## Usage Examples

### Frontend Integration (Angular)

#### 1. Create a Jira Service

```typescript
// src/app/services/jira.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JiraService {
  private apiUrl = 'http://localhost:3000/api/jira';

  constructor(private http: HttpClient) {}

  testConnection(): Observable<any> {
    return this.http.get(`${this.apiUrl}/test`);
  }

  getCurrentIssue(): Observable<any> {
    return this.http.get(`${this.apiUrl}/current-issue`);
  }

  addComment(comment: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/comment`, { comment });
  }

  updateStatus(status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/status`, { status });
  }

  linkTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/link-task`, taskData);
  }

  syncTask(taskId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sync-task/${taskId}`, {});
  }
}
```

#### 2. Use in Component

```typescript
// src/app/home/home.ts
import { JiraService } from '../services/jira.service';

export class HomeComponent {
  constructor(private jiraService: JiraService) {}

  linkTaskToJira(task: any) {
    this.jiraService.linkTask(task).subscribe(
      response => {
        if (response.success) {
          console.log('Task linked to Jira successfully');
        }
      },
      error => console.error('Error linking task:', error)
    );
  }

  viewJiraIssue() {
    this.jiraService.getCurrentIssue().subscribe(
      response => {
        if (response.success) {
          window.open(response.data.url, '_blank');
        }
      }
    );
  }
}
```

### Backend Usage

```javascript
const JiraIntegration = require('./jira-integration');
const jiraIntegration = new JiraIntegration();

// Fetch issue details
const issue = await jiraIntegration.fetchCurrentIssue();

// Add comment
await jiraIntegration.addCommentToIssue('Task completed');

// Update status
await jiraIntegration.updateIssueStatus('Done');

// Link task
await jiraIntegration.linkTaskToIssue({
  taskId: 'TSK001',
  providerName: 'Dr. John Smith',
  npi: '1234567890',
  taskStatus: 'Completed'
});
```

## Testing the Integration

### 1. Start the Backend Server

```bash
cd mock-backend
npm start
```

### 2. Test Connection

```bash
curl http://localhost:3000/api/jira/test
```

### 3. Fetch PROVINFO-2

```bash
curl http://localhost:3000/api/jira/current-issue
```

### 4. Add Comment

```bash
curl -X POST http://localhost:3000/api/jira/comment \
  -H "Content-Type: application/json" \
  -d '{"comment": "Testing integration"}'
```

## Status Mapping

The integration automatically maps Jira statuses to task statuses:

| Jira Status | Task Status |
|-------------|-------------|
| To Do       | Pending     |
| Open        | Pending     |
| In Progress | In Progress |
| Done        | Completed   |
| Closed      | Completed   |
| Cancelled   | Cancelled   |

## Troubleshooting

### Connection Issues

1. **Verify credentials** in [`mock-backend/.env`](mock-backend/.env:14)
2. **Check API token** - Generate a new one if expired
3. **Test connection**: `node jira-integration.js test`

### Permission Issues

Ensure your Jira account has:
- Read access to PROVINFO project
- Write access to add comments
- Permission to transition issues

### Network Issues

- Verify you can access `https://jsw.ibm.com` from your network
- Check if corporate proxy settings are required
- Ensure firewall allows HTTPS connections

## Security Notes

- **Never commit** the `.env` file with real credentials
- **Use environment variables** in production
- **Rotate API tokens** regularly
- **Limit token permissions** to only what's needed

## Next Steps

1. **Test the connection** using the CLI or API endpoints
2. **Integrate with frontend** using the Angular service example
3. **Add UI components** to display Jira issue information
4. **Implement task linking** from the provider task list
5. **Set up status synchronization** for automated updates

## Support

For issues or questions:
- Check the [Jira API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v2/)
- Review the [`jira-service.js`](mock-backend/jira-service.js:1) implementation
- Test using the CLI tool: `node jira-integration.js`

---

**Direct Link to PROVINFO-2**: https://jsw.ibm.com/projects/PROVINFO/issues/PROVINFO-2