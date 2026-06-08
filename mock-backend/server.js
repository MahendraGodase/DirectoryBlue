const express = require('express');
const cors = require('cors');
const JiraIntegration = require('./jira-integration');
const jiraService = require('./jira-service');
const mcpService = require('./mcp-service');
const app = express();
const PORT = 3000;

// Configuration: Toggle between Mock and MCP data source
const USE_MCP = process.env.USE_MCP === 'true' || false;

// Enable CORS for Angular app
app.use(cors());
app.use(express.json());

console.log(`🔧 Data Source: ${USE_MCP ? 'MCP Context Studio' : 'Mock Data'}`);

// Mock data
const mockTasks = [
  {
    id: 1,
    dataSource: 'CAQH',
    taskId: 'TSK001',
    caseId: 'CASE001',
    npi: '1234567890',
    providerId: 'PRV001',
    providerName: 'Dr. John Smith',
    title: 'MD',
    taskName: 'Initial Survey',
    taskStatus: 'In Progress',
    taskAge: 15,
    crd: '2026-05-30',
    workQueue: 'Queue A'
  },
  {
    id: 2,
    dataSource: 'Survey',
    taskId: 'TSK002',
    caseId: 'CASE002',
    npi: '0987654321',
    providerId: 'PRV002',
    providerName: 'Dr. Jane Doe',
    title: 'DO',
    taskName: 'Re-credentialing',
    taskStatus: 'Pending',
    taskAge: 5,
    crd: '2026-06-15',
    workQueue: 'Queue B'
  },
  {
    id: 3,
    dataSource: 'CAQH',
    taskId: 'TSK003',
    caseId: 'CASE003',
    npi: '1122334455',
    providerId: 'PRV003',
    providerName: 'Dr. Robert Johnson',
    title: 'MD',
    taskName: 'Data Update',
    taskStatus: 'Completed',
    taskAge: 30,
    crd: '2026-05-01',
    workQueue: 'Queue A'
  },
  {
    id: 4,
    dataSource: 'Manual',
    taskId: 'TSK004',
    caseId: 'CASE004',
    npi: '5566778899',
    providerId: 'PRV004',
    providerName: 'Dr. Sarah Williams',
    title: 'MD',
    taskName: 'Initial Survey',
    taskStatus: 'In Progress',
    taskAge: 8,
    crd: '2026-06-20',
    workQueue: 'Queue C'
  },
  {
    id: 5,
    dataSource: 'Survey',
    taskId: 'TSK005',
    caseId: 'CASE005',
    npi: '9988776655',
    providerId: 'PRV005',
    providerName: 'Dr. Michael Brown',
    title: 'DO',
    taskName: 'Re-credentialing',
    taskStatus: 'Cancelled',
    taskAge: 45,
    crd: '2026-04-15',
    workQueue: 'Queue B'
  }
];

const dropdownOptions = {
  dataSource: [
    { value: 'CAQH', label: 'CAQH' },
    { value: 'Survey', label: 'Survey' },
    { value: 'Manual', label: 'Manual Entry' }
  ],
  surveyType: [
    { value: 'Initial', label: 'Initial Survey' },
    { value: 'Recred', label: 'Re-credentialing' },
    { value: 'Update', label: 'Update Survey' }
  ],
  taskName: [
    { value: 'Initial Survey', label: 'Initial Survey' },
    { value: 'Re-credentialing', label: 'Re-credentialing' },
    { value: 'Data Update', label: 'Data Update' }
  ],
  taskStatus: [
    { value: 'Pending', label: 'Pending' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
  ],
  assignedTo: [
    { value: 'user1', label: 'John Doe' },
    { value: 'user2', label: 'Jane Smith' },
    { value: 'user3', label: 'Bob Johnson' }
  ],
  workQueue: [
    { value: 'Queue A', label: 'Queue A' },
    { value: 'Queue B', label: 'Queue B' },
    { value: 'Queue C', label: 'Queue C' }
  ]
};

// Search tasks endpoint
app.get('/api/search-tasks', async (req, res) => {
  console.log('Search request received:', req.query);
  
  try {
    if (USE_MCP) {
      // Use MCP Proxy Server as data source
      console.log('🔌 Fetching data from MCP Proxy Server...');
      try {
        const axios = require('axios');
        const mcpProxyUrl = 'http://localhost:3001/api/mcp/tasks';
        
        // Build query string from search params
        const queryParams = new URLSearchParams();
        if (req.query.dataSource) queryParams.append('dataSource', req.query.dataSource);
        if (req.query.taskStatus) queryParams.append('taskStatus', req.query.taskStatus);
        if (req.query.workQueue) queryParams.append('workQueue', req.query.workQueue);
        if (req.query.providerName) queryParams.append('providerName', req.query.providerName);
        if (req.query.npi) queryParams.append('npi', req.query.npi);
        if (req.query.taskId) queryParams.append('taskId', req.query.taskId);
        
        const url = queryParams.toString() ? `${mcpProxyUrl}?${queryParams}` : mcpProxyUrl;
        const response = await axios.get(url);
        
        if (response.data.success && response.data.data.length > 0) {
          console.log(`✅ Retrieved ${response.data.data.length} tasks from MCP Proxy`);
          return res.json(response.data);
        }
        
        console.log('⚠️ MCP Proxy returned no data, falling back to mock data');
      } catch (error) {
        console.log(`⚠️ MCP Proxy error: ${error.message}, falling back to mock data`);
      }
    }
    
    // Use mock data (fallback or when MCP is disabled)
    {
      // Use mock data
      let filteredTasks = [...mockTasks];
      
      // Filter by NPI
      if (req.query.npi) {
        const npis = req.query.npi.split(',').map(n => n.trim());
        filteredTasks = filteredTasks.filter(task => npis.includes(task.npi));
      }
      
      // Filter by Data Source
      if (req.query.dataSource) {
        filteredTasks = filteredTasks.filter(task => task.dataSource === req.query.dataSource);
      }
      
      // Filter by Task ID
      if (req.query.taskId) {
        const taskIds = req.query.taskId.split(',').map(t => t.trim());
        filteredTasks = filteredTasks.filter(task => taskIds.includes(task.taskId));
      }
      
      // Filter by Provider ID
      if (req.query.providerId) {
        const providerIds = req.query.providerId.split(',').map(p => p.trim());
        filteredTasks = filteredTasks.filter(task => providerIds.includes(task.providerId));
      }
      
      // Filter by Task Status
      if (req.query.taskStatus) {
        filteredTasks = filteredTasks.filter(task => task.taskStatus === req.query.taskStatus);
      }
      
      // Filter by Task Name
      if (req.query.taskName) {
        filteredTasks = filteredTasks.filter(task => task.taskName === req.query.taskName);
      }
      
      // Filter by Work Queue
      if (req.query.workQueue) {
        filteredTasks = filteredTasks.filter(task => task.workQueue === req.query.workQueue);
      }
      
      // Simulate delay
      setTimeout(() => {
        res.json({
          success: true,
          data: filteredTasks,
          totalRecords: filteredTasks.length,
          source: 'Mock Data',
          message: 'Search completed successfully'
        });
      }, 500);
    }
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      data: [],
      totalRecords: 0,
      message: `Error: ${error.message}`
    });
  }
});

// Get dropdown options endpoint
app.get('/api/dropdown-options/:optionType', (req, res) => {
  const optionType = req.params.optionType;
  console.log('Dropdown options requested:', optionType);
  
  const options = dropdownOptions[optionType] || [];
  
  res.json(options);
});

// Bulk update endpoint
app.post('/api/bulk-update', (req, res) => {
  console.log('Bulk update request:', req.body);
  
  const { taskIds, updateData } = req.body;
  
  // Simulate update
  setTimeout(() => {
    res.json({
      success: true,
      message: `Successfully updated ${taskIds.length} tasks`,
      updatedCount: taskIds.length

// ============================================
// JIRA INTEGRATION ENDPOINTS
// ============================================

// Initialize Jira Integration
const jiraIntegration = new JiraIntegration();

// Test Jira connection
app.get('/api/jira/test', async (req, res) => {
  try {
    console.log('🔌 Testing Jira connection...');
    const result = await jiraIntegration.testConnection();
    res.json(result);
  } catch (error) {
    console.error('❌ Jira connection test failed:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get PROVINFO-2 issue details
app.get('/api/jira/issue/:issueKey?', async (req, res) => {
  try {
    const issueKey = req.params.issueKey || process.env.JIRA_CURRENT_ISSUE;
    console.log(`📋 Fetching Jira issue: ${issueKey}...`);
    const result = await jiraService.getIssue(issueKey);
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching Jira issue:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get current issue (PROVINFO-2) details
app.get('/api/jira/current-issue', async (req, res) => {
  try {
    console.log('📋 Fetching current Jira issue...');
    const result = await jiraIntegration.fetchCurrentIssue();
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching current issue:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get comprehensive issue report
app.get('/api/jira/report', async (req, res) => {
  try {
    console.log('📊 Generating Jira issue report...');
    const result = await jiraIntegration.getIssueReport();
    res.json(result);
  } catch (error) {
    console.error('❌ Error generating report:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get available transitions for an issue
app.get('/api/jira/transitions/:issueKey?', async (req, res) => {
  try {
    const issueKey = req.params.issueKey || process.env.JIRA_CURRENT_ISSUE;
    console.log(`🔀 Fetching transitions for ${issueKey}...`);
    const result = await jiraService.getTransitions(issueKey);
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching transitions:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add comment to Jira issue
app.post('/api/jira/comment/:issueKey?', async (req, res) => {
  try {
    const issueKey = req.params.issueKey || process.env.JIRA_CURRENT_ISSUE;
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    console.log(`💬 Adding comment to ${issueKey}...`);
    const result = await jiraService.addComment(issueKey, comment);
    res.json(result);
  } catch (error) {
    console.error('❌ Error adding comment:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update Jira issue status
app.post('/api/jira/status/:issueKey?', async (req, res) => {
  try {
    const issueKey = req.params.issueKey || process.env.JIRA_CURRENT_ISSUE;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    console.log(`🔄 Updating ${issueKey} status to: ${status}...`);
    const result = await jiraService.updateIssueStatus(issueKey, status);
    res.json(result);
  } catch (error) {
    console.error('❌ Error updating status:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Search PROVINFO project issues
app.get('/api/jira/search', async (req, res) => {
  try {
    const maxResults = parseInt(req.query.maxResults) || 20;
    console.log(`🔍 Searching PROVINFO issues (max: ${maxResults})...`);
    const result = await jiraIntegration.searchProjectIssues(maxResults);
    res.json(result);
  } catch (error) {
    console.error('❌ Error searching issues:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Link a task to Jira issue
app.post('/api/jira/link-task', async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task data with taskId is required'
      });
    }
    
    console.log(`🔗 Linking task ${taskData.taskId} to Jira...`);
    const result = await jiraIntegration.linkTaskToIssue(taskData);
    res.json(result);
  } catch (error) {
    console.error('❌ Error linking task:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Sync task with Jira issue
app.post('/api/jira/sync-task/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    console.log(`🔄 Syncing task ${taskId} with Jira...`);
    const result = await jiraIntegration.syncTaskWithIssue(taskId);
    res.json(result);
  } catch (error) {
    console.error('❌ Error syncing task:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Create new Jira issue from task
app.post('/api/jira/create-issue', async (req, res) => {
  try {
    const taskData = req.body;
    
    if (!taskData.taskName || !taskData.providerName) {
      return res.status(400).json({
        success: false,
        message: 'Task name and provider name are required'
      });
    }
    
    console.log(`📝 Creating Jira issue for task: ${taskData.taskName}...`);
    const result = await jiraService.createIssue(taskData);
    res.json(result);
  } catch (error) {
    console.error('❌ Error creating Jira issue:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get all PROVINFO projects
app.get('/api/jira/projects', async (req, res) => {
  try {
    console.log('📁 Fetching Jira projects...');
    const result = await jiraService.getProjects();
    res.json(result);
  } catch (error) {
    console.error('❌ Error fetching projects:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

    });
  }, 800);
});

// Export to Excel endpoint
app.get('/api/export-excel', (req, res) => {
  console.log('Export request received');
  
  // For demo purposes, just return success
  // In real implementation, this would generate an Excel file
  res.json({
    success: true,
    message: 'Export functionality requires actual Excel generation library'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Mock backend server is running',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 Mock Backend Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Search endpoint: http://localhost:${PORT}/api/search-tasks`);
  console.log(`📋 Dropdown options: http://localhost:${PORT}/api/dropdown-options/{type}`);
  console.log('='.repeat(60));
  console.log('✅ Ready to accept requests from Angular app');
  console.log('='.repeat(60));
});

// Made with Bob
