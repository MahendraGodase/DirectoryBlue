const express = require('express');
const cors = require('cors');

/**
 * MCP Proxy Server
 * This server acts as a bridge between the Angular app and Bob's MCP tools.
 * It exposes endpoints that Bob can call to fetch data from MCP Context Studio.
 */

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Store for MCP query results (in-memory cache)
let mcpDataCache = {
  tasks: [],
  lastUpdated: null,
  status: 'pending'
};

/**
 * Endpoint for Bob to push MCP data
 * Bob will call this endpoint after querying MCP Context Studio
 */
app.post('/api/mcp/push-data', (req, res) => {
  try {
    const { tasks, source } = req.body;
    
    mcpDataCache = {
      tasks: tasks || [],
      lastUpdated: new Date().toISOString(),
      status: 'ready',
      source: source || 'MCP Context Studio'
    };
    
    console.log(`✅ Received ${tasks.length} tasks from MCP via Bob`);
    
    res.json({
      success: true,
      message: `Stored ${tasks.length} tasks`,
      timestamp: mcpDataCache.lastUpdated
    });
  } catch (error) {
    console.error('Error storing MCP data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Endpoint for Angular app to fetch MCP data
 */
app.get('/api/mcp/tasks', (req, res) => {
  try {
    // Apply search filters if provided
    const { dataSource, taskStatus, workQueue, providerName, npi, taskId } = req.query;
    
    let filteredTasks = mcpDataCache.tasks;
    
    if (dataSource) {
      filteredTasks = filteredTasks.filter(t => t.dataSource === dataSource);
    }
    if (taskStatus) {
      filteredTasks = filteredTasks.filter(t => t.taskStatus === taskStatus);
    }
    if (workQueue) {
      filteredTasks = filteredTasks.filter(t => t.workQueue === workQueue);
    }
    if (providerName) {
      filteredTasks = filteredTasks.filter(t => 
        t.providerName.toLowerCase().includes(providerName.toLowerCase())
      );
    }
    if (npi) {
      filteredTasks = filteredTasks.filter(t => t.npi === npi);
    }
    if (taskId) {
      filteredTasks = filteredTasks.filter(t => t.taskId.toString() === taskId.toString());
    }
    
    res.json({
      success: true,
      data: filteredTasks,
      totalRecords: filteredTasks.length,
      source: mcpDataCache.source || 'Cache',
      lastUpdated: mcpDataCache.lastUpdated,
      status: mcpDataCache.status
    });
  } catch (error) {
    console.error('Error fetching MCP data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * Endpoint to request Bob to fetch fresh data from MCP
 */
app.post('/api/mcp/request-refresh', (req, res) => {
  mcpDataCache.status = 'refreshing';
  
  res.json({
    success: true,
    message: 'Refresh requested. Bob will fetch fresh data from MCP Context Studio.',
    instructions: 'Bob should now use the use_mcp_tool to query context-studio and push results to /api/mcp/push-data'
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'MCP Proxy Server',
    port: PORT,
    mcpDataStatus: mcpDataCache.status,
    tasksCount: mcpDataCache.tasks.length,
    lastUpdated: mcpDataCache.lastUpdated
  });
});

// Start server
app.listen(PORT, () => {
  console.log('============================================================');
  console.log('🚀 MCP Proxy Server Started!');
  console.log('============================================================');
  console.log(`📡 Server running at: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Get tasks: http://localhost:${PORT}/api/mcp/tasks`);
  console.log(`📥 Push data (Bob): http://localhost:${PORT}/api/mcp/push-data`);
  console.log(`🔄 Request refresh: http://localhost:${PORT}/api/mcp/request-refresh`);
  console.log('============================================================');
  console.log('✅ Waiting for Bob to push MCP data...');
  console.log('============================================================');
});

module.exports = app;

// Made with Bob
