const JiraClient = require('jira-client');
require('dotenv').config();

// Initialize Jira client for IBM Jira
const jira = new JiraClient({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_EMAIL,
  password: process.env.JIRA_API_TOKEN,
  apiVersion: '2',
  strictSSL: true
});

class JiraService {
  /**
   * Test Jira connection
   */
  async testConnection() {
    try {
      const user = await jira.getCurrentUser();
      console.log('✅ Jira connection successful!');
      console.log(`   User: ${user.displayName} (${user.emailAddress})`);
      return {
        success: true,
        user: user.displayName,
        email: user.emailAddress
      };
    } catch (error) {
      console.error('❌ Jira connection failed:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Create a Jira issue from a task
   */
  async createIssue(taskData) {
    try {
      const issue = {
        fields: {
          project: {
            key: process.env.JIRA_PROJECT_KEY
          },
          summary: `${taskData.taskName} - ${taskData.providerName}`,
          description: `
*Provider Information:*
- Provider Name: ${taskData.providerName}
- NPI: ${taskData.npi}
- Provider ID: ${taskData.providerId}
- Title: ${taskData.title || 'N/A'}

*Task Details:*
- Task ID: ${taskData.taskId}
- Case ID: ${taskData.caseId || 'N/A'}
- Task Status: ${taskData.taskStatus}
- Data Source: ${taskData.dataSource}
- Work Queue: ${taskData.workQueue || 'N/A'}
- Task Age: ${taskData.taskAge || 0} days
- CRD: ${taskData.crd || 'N/A'}
          `,
          issuetype: {
            name: process.env.JIRA_ISSUE_TYPE || 'Task'
          }
        }
      };

      const result = await jira.addNewIssue(issue);
      console.log(`✅ Jira issue created: ${result.key}`);
      
      return {
        success: true,
        jiraKey: result.key,
        jiraId: result.id,
        jiraUrl: `https://${process.env.JIRA_HOST}/browse/${result.key}`,
        message: `Jira issue ${result.key} created successfully`
      };
    } catch (error) {
      console.error('❌ Error creating Jira issue:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get available transitions for an issue
   */
  async getTransitions(jiraKey) {
    try {
      const transitions = await jira.listTransitions(jiraKey);
      return {
        success: true,
        transitions: transitions.transitions.map(t => ({
          id: t.id,
          name: t.name
        }))
      };
    } catch (error) {
      console.error('❌ Error getting transitions:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Update Jira issue status
   */
  async updateIssueStatus(jiraKey, transitionName) {
    try {
      // Get available transitions
      const transitions = await jira.listTransitions(jiraKey);
      const transition = transitions.transitions.find(
        t => t.name.toLowerCase() === transitionName.toLowerCase()
      );

      if (!transition) {
        throw new Error(`Transition "${transitionName}" not found for issue ${jiraKey}`);
      }

      await jira.transitionIssue(jiraKey, {
        transition: {
          id: transition.id
        }
      });

      console.log(`✅ Issue ${jiraKey} transitioned to ${transitionName}`);
      
      return {
        success: true,
        message: `Issue ${jiraKey} transitioned to ${transitionName}`
      };
    } catch (error) {
      console.error('❌ Error updating Jira issue:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Add comment to Jira issue
   */
  async addComment(jiraKey, comment) {
    try {
      await jira.addComment(jiraKey, comment);
      console.log(`✅ Comment added to ${jiraKey}`);
      
      return {
        success: true,
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('❌ Error adding comment:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get Jira issue details
   */
  async getIssue(jiraKey) {
    try {
      const issue = await jira.findIssue(jiraKey);
      return {
        success: true,
        data: {
          key: issue.key,
          summary: issue.fields.summary,
          description: issue.fields.description,
          status: issue.fields.status.name,
          assignee: issue.fields.assignee?.displayName || 'Unassigned',
          reporter: issue.fields.reporter?.displayName,
          created: issue.fields.created,
          updated: issue.fields.updated,
          url: `https://${process.env.JIRA_HOST}/browse/${issue.key}`
        }
      };
    } catch (error) {
      console.error('❌ Error fetching Jira issue:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Search Jira issues by JQL
   */
  async searchIssues(jql, maxResults = 50) {
    try {
      const result = await jira.searchJira(jql, {
        maxResults: maxResults,
        fields: ['summary', 'status', 'assignee', 'created', 'updated']
      });

      return {
        success: true,
        data: result.issues.map(issue => ({
          key: issue.key,
          summary: issue.fields.summary,
          status: issue.fields.status.name,
          assignee: issue.fields.assignee?.displayName || 'Unassigned',
          created: issue.fields.created,
          url: `https://${process.env.JIRA_HOST}/browse/${issue.key}`
        })),
        total: result.total
      };
    } catch (error) {
      console.error('❌ Error searching Jira:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Get all projects
   */
  async getProjects() {
    try {
      const projects = await jira.listProjects();
      return {
        success: true,
        data: projects.map(p => ({
          key: p.key,
          name: p.name,
          id: p.id
        }))
      };
    } catch (error) {
      console.error('❌ Error fetching projects:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Sync task status with Jira
   */
  async syncTaskWithJira(taskId, jiraKey) {
    try {
      // Get Jira issue status
      const jiraIssue = await this.getIssue(jiraKey);
      
      if (!jiraIssue.success) {
        return jiraIssue;
      }

      // Map Jira status to task status
      const statusMap = {
        'To Do': 'Pending',
        'In Progress': 'In Progress',
        'Done': 'Completed',
        'Closed': 'Completed',
        'Cancelled': 'Cancelled',
        'Open': 'Pending'
      };

      const taskStatus = statusMap[jiraIssue.data.status] || 'Pending';

      console.log(`✅ Synced task ${taskId} with Jira ${jiraKey}`);
      
      return {
        success: true,
        taskStatus: taskStatus,
        jiraStatus: jiraIssue.data.status,
        jiraUrl: jiraIssue.data.url
      };
    } catch (error) {
      console.error('❌ Error syncing with Jira:', error.message);
      return {
        success: false,
        message: error.message
      };
    }
  }
}

module.exports = new JiraService();

// Made with Bob
