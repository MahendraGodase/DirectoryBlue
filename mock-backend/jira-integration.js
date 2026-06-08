const jiraService = require('./jira-service');
require('dotenv').config();

/**
 * Jira Integration Script for PROVINFO-2
 * This script provides utilities to interact with the PROVINFO-2 Jira issue
 */

class JiraIntegration {
  constructor() {
    this.currentIssue = process.env.JIRA_CURRENT_ISSUE || 'PROVINFO-2';
    this.projectKey = process.env.JIRA_PROJECT_KEY || 'PROVINFO';
  }

  /**
   * Fetch details of PROVINFO-2 issue
   */
  async fetchCurrentIssue() {
    console.log(`\n📋 Fetching Jira issue: ${this.currentIssue}...`);
    const result = await jiraService.getIssue(this.currentIssue);
    
    if (result.success) {
      console.log('\n✅ Issue Details:');
      console.log(`   Key: ${result.data.key}`);
      console.log(`   Summary: ${result.data.summary}`);
      console.log(`   Status: ${result.data.status}`);
      console.log(`   Assignee: ${result.data.assignee}`);
      console.log(`   Reporter: ${result.data.reporter}`);
      console.log(`   Created: ${result.data.created}`);
      console.log(`   Updated: ${result.data.updated}`);
      console.log(`   URL: ${result.data.url}`);
      console.log(`\n   Description:\n   ${result.data.description || 'No description'}`);
    } else {
      console.error(`\n❌ Failed to fetch issue: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Add a comment to PROVINFO-2
   */
  async addCommentToIssue(comment) {
    console.log(`\n💬 Adding comment to ${this.currentIssue}...`);
    const result = await jiraService.addComment(this.currentIssue, comment);
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
    } else {
      console.error(`❌ Failed to add comment: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Update status of PROVINFO-2
   */
  async updateIssueStatus(newStatus) {
    console.log(`\n🔄 Updating ${this.currentIssue} status to: ${newStatus}...`);
    const result = await jiraService.updateIssueStatus(this.currentIssue, newStatus);
    
    if (result.success) {
      console.log(`✅ ${result.message}`);
    } else {
      console.error(`❌ Failed to update status: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Get available transitions for PROVINFO-2
   */
  async getAvailableTransitions() {
    console.log(`\n🔀 Fetching available transitions for ${this.currentIssue}...`);
    const result = await jiraService.getTransitions(this.currentIssue);
    
    if (result.success) {
      console.log('\n✅ Available Transitions:');
      result.transitions.forEach(t => {
        console.log(`   - ${t.name} (ID: ${t.id})`);
      });
    } else {
      console.error(`❌ Failed to fetch transitions: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Search for all issues in PROVINFO project
   */
  async searchProjectIssues(maxResults = 20) {
    const jql = `project = ${this.projectKey} ORDER BY created DESC`;
    console.log(`\n🔍 Searching issues in ${this.projectKey} project...`);
    
    const result = await jiraService.searchIssues(jql, maxResults);
    
    if (result.success) {
      console.log(`\n✅ Found ${result.total} issues (showing ${result.data.length}):`);
      result.data.forEach((issue, index) => {
        console.log(`\n   ${index + 1}. ${issue.key}: ${issue.summary}`);
        console.log(`      Status: ${issue.status}`);
        console.log(`      Assignee: ${issue.assignee}`);
        console.log(`      URL: ${issue.url}`);
      });
    } else {
      console.error(`❌ Failed to search issues: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Link a provider task to PROVINFO-2
   */
  async linkTaskToIssue(taskData) {
    console.log(`\n🔗 Linking task ${taskData.taskId} to ${this.currentIssue}...`);
    
    const comment = `
*Task Linked from DirectoryBlue Application*

*Provider Information:*
- Provider Name: ${taskData.providerName}
- NPI: ${taskData.npi}
- Provider ID: ${taskData.providerId}

*Task Details:*
- Task ID: ${taskData.taskId}
- Task Status: ${taskData.taskStatus}
- Data Source: ${taskData.dataSource}
- Task Age: ${taskData.taskAge || 0} days

_Linked automatically via DirectoryBlue integration_
    `;
    
    return await this.addCommentToIssue(comment);
  }

  /**
   * Sync task status with PROVINFO-2
   */
  async syncTaskWithIssue(taskId) {
    console.log(`\n🔄 Syncing task ${taskId} with ${this.currentIssue}...`);
    const result = await jiraService.syncTaskWithJira(taskId, this.currentIssue);
    
    if (result.success) {
      console.log(`✅ Task synced successfully`);
      console.log(`   Task Status: ${result.taskStatus}`);
      console.log(`   Jira Status: ${result.jiraStatus}`);
      console.log(`   Jira URL: ${result.jiraUrl}`);
    } else {
      console.error(`❌ Failed to sync: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Test connection to Jira
   */
  async testConnection() {
    console.log('\n🔌 Testing Jira connection...');
    const result = await jiraService.testConnection();
    
    if (result.success) {
      console.log(`✅ Connected as: ${result.user} (${result.email})`);
    } else {
      console.error(`❌ Connection failed: ${result.message}`);
    }
    
    return result;
  }

  /**
   * Get comprehensive issue information
   */
  async getIssueReport() {
    console.log(`\n📊 Generating comprehensive report for ${this.currentIssue}...\n`);
    
    // Test connection
    await this.testConnection();
    
    // Fetch issue details
    const issueResult = await this.fetchCurrentIssue();
    
    if (issueResult.success) {
      // Get available transitions
      await this.getAvailableTransitions();
    }
    
    return issueResult;
  }
}

// Export the class
module.exports = JiraIntegration;

// CLI execution
if (require.main === module) {
  const integration = new JiraIntegration();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const command = args[0];
  
  (async () => {
    try {
      switch (command) {
        case 'test':
          await integration.testConnection();
          break;
          
        case 'fetch':
          await integration.fetchCurrentIssue();
          break;
          
        case 'report':
          await integration.getIssueReport();
          break;
          
        case 'transitions':
          await integration.getAvailableTransitions();
          break;
          
        case 'search':
          const maxResults = parseInt(args[1]) || 20;
          await integration.searchProjectIssues(maxResults);
          break;
          
        case 'comment':
          const comment = args.slice(1).join(' ');
          if (!comment) {
            console.error('❌ Please provide a comment text');
            process.exit(1);
          }
          await integration.addCommentToIssue(comment);
          break;
          
        case 'status':
          const newStatus = args.slice(1).join(' ');
          if (!newStatus) {
            console.error('❌ Please provide a status name');
            process.exit(1);
          }
          await integration.updateIssueStatus(newStatus);
          break;
          
        default:
          console.log(`
📋 Jira Integration CLI for PROVINFO-2

Usage: node jira-integration.js <command> [options]

Commands:
  test                    Test Jira connection
  fetch                   Fetch PROVINFO-2 issue details
  report                  Generate comprehensive issue report
  transitions             Get available status transitions
  search [maxResults]     Search all PROVINFO issues (default: 20)
  comment <text>          Add comment to PROVINFO-2
  status <status_name>    Update PROVINFO-2 status

Examples:
  node jira-integration.js test
  node jira-integration.js fetch
  node jira-integration.js report
  node jira-integration.js search 10
  node jira-integration.js comment "Working on this issue"
  node jira-integration.js status "In Progress"
          `);
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  })();
}

// Made with Bob
