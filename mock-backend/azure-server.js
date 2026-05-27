require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const jiraService = require('./jira-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Angular app
app.use(cors());
app.use(express.json());

// Azure SQL Configuration using SQL Server Authentication
const config = {
    server: process.env.AZURE_SQL_SERVER,
    database: process.env.AZURE_SQL_DATABASE,
    port: parseInt(process.env.AZURE_SQL_PORT || '1433'),
    user: process.env.AZURE_SQL_USER,
    password: process.env.AZURE_SQL_PASSWORD,
    options: {
        encrypt: true,
        trustServerCertificate: false,
        connectTimeout: 30000,
        requestTimeout: 30000,
        enableArithAbort: true
    }
};

// Global connection pool
let pool = null;

// Initialize database connection
async function initializeDatabase() {
    try {
        console.log('🔄 Connecting to Azure SQL Database...');
        console.log(`   Server: ${config.server}`);
        console.log(`   Database: ${config.database}`);
        console.log(`   User: ${config.user}`);
        console.log(`   Authentication: SQL Server Authentication`);
        
        pool = await sql.connect(config);
        console.log('✅ Successfully connected to Azure SQL Database!');
        
        // Test query
        const result = await pool.request().query('SELECT @@VERSION as version');
        console.log('📊 Database version:', result.recordset[0].version.substring(0, 50) + '...');
        
        return true;
    } catch (error) {
        console.error('❌ Error connecting to Azure SQL Database:', error.message);
        console.error('   Please check your credentials and network connection');
        return false;
    }
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        if (!pool || !pool.connected) {
            return res.status(503).json({
                status: 'ERROR',
                message: 'Database connection not established',
                timestamp: new Date().toISOString()
            });
        }
        
        // Test database connection
        await pool.request().query('SELECT 1');
        
        res.json({
            status: 'OK',
            message: 'Azure SQL backend server is running',
            database: 'Connected to Azure SQL Database',
            server: config.server,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Search tasks endpoint
app.get('/api/search-tasks', async (req, res) => {
    try {
        console.log('🔍 Search request received:', req.query);
        
        if (!pool || !pool.connected) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available',
                data: []
            });
        }
        
        // Build dynamic query
        let query = 'SELECT * FROM Tasks WHERE 1=1';
        const request = pool.request();
        
        // Add filters based on query parameters
        if (req.query.npi) {
            const npis = req.query.npi.split(',').map(n => n.trim());
            query += ` AND NPI IN (${npis.map((_, i) => `@npi${i}`).join(',')})`;
            npis.forEach((npi, i) => request.input(`npi${i}`, sql.NVarChar, npi));
        }
        
        if (req.query.dataSource) {
            query += ' AND DataSource = @dataSource';
            request.input('dataSource', sql.NVarChar, req.query.dataSource);
        }
        
        if (req.query.taskId) {
            const taskIds = req.query.taskId.split(',').map(t => t.trim());
            query += ` AND TaskId IN (${taskIds.map((_, i) => `@taskId${i}`).join(',')})`;
            taskIds.forEach((taskId, i) => request.input(`taskId${i}`, sql.NVarChar, taskId));
        }
        
        if (req.query.providerId) {
            const providerIds = req.query.providerId.split(',').map(p => p.trim());
            query += ` AND ProviderId IN (${providerIds.map((_, i) => `@providerId${i}`).join(',')})`;
            providerIds.forEach((providerId, i) => request.input(`providerId${i}`, sql.NVarChar, providerId));
        }
        
        if (req.query.taskStatus) {
            query += ' AND TaskStatus = @taskStatus';
            request.input('taskStatus', sql.NVarChar, req.query.taskStatus);
        }
        
        if (req.query.taskName) {
            query += ' AND TaskName = @taskName';
            request.input('taskName', sql.NVarChar, req.query.taskName);
        }
        
        if (req.query.assignedTo) {
            query += ' AND AssignedTo = @assignedTo';
            request.input('assignedTo', sql.NVarChar, req.query.assignedTo);
        }
        
        if (req.query.workQueue) {
            query += ' AND WorkQueue = @workQueue';
            request.input('workQueue', sql.NVarChar, req.query.workQueue);
        }
        
        if (req.query.outboundFileFromDate) {
            query += ' AND OutboundFileDate >= @outboundFrom';
            request.input('outboundFrom', sql.Date, req.query.outboundFileFromDate);
        }
        
        if (req.query.outboundFileToDate) {
            query += ' AND OutboundFileDate <= @outboundTo';
            request.input('outboundTo', sql.Date, req.query.outboundFileToDate);
        }
        
        if (req.query.corporateReceiptFromDate) {
            query += ' AND CorporateReceiptDate >= @corpFrom';
            request.input('corpFrom', sql.Date, req.query.corporateReceiptFromDate);
        }
        
        if (req.query.corporateReceiptToDate) {
            query += ' AND CorporateReceiptDate <= @corpTo';
            request.input('corpTo', sql.Date, req.query.corporateReceiptToDate);
        }
        
        query += ' ORDER BY CreatedDate DESC';
        
        console.log('📝 Executing query:', query);
        const result = await request.query(query);
        
        console.log(`✅ Found ${result.recordset.length} tasks`);
        
        res.json({
            success: true,
            data: result.recordset.map(row => ({
                id: row.Id,
                dataSource: row.DataSource,
                taskId: row.TaskId,
                caseId: row.CaseId,
                npi: row.NPI,
                providerId: row.ProviderId,
                providerName: row.ProviderName,
                title: row.Title,
                taskName: row.TaskName,
                taskStatus: row.TaskStatus,
                taskAge: row.TaskAge,
                crd: row.CRD,
                workQueue: row.WorkQueue
            })),
            totalRecords: result.recordset.length,
            message: 'Search completed successfully'
        });
    } catch (error) {
        console.error('❌ Error searching tasks:', error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        });
    }
});

// Get dropdown options endpoint
app.get('/api/dropdown-options/:optionType', async (req, res) => {
    try {
        const optionType = req.params.optionType;
        console.log('📋 Dropdown options requested:', optionType);
        
        if (!pool || !pool.connected) {
            return res.json([]);
        }
        
        const tableMap = {
            'dataSource': 'DataSourceOptions',
            'surveyType': 'SurveyTypeOptions',
            'taskName': 'TaskNameOptions',
            'taskStatus': 'TaskStatusOptions',
            'assignedTo': 'AssignedToOptions',
            'workQueue': 'WorkQueueOptions'
        };
        
        const tableName = tableMap[optionType];
        if (!tableName) {
            return res.status(400).json([]);
        }
        
        const result = await pool.request()
            .query(`SELECT Value as value, Label as label FROM ${tableName} WHERE IsActive = 1`);
        
        res.json(result.recordset);
    } catch (error) {
        console.error('❌ Error fetching dropdown options:', error.message);
        res.json([]);
    }
});

// Bulk update endpoint
app.post('/api/bulk-update', async (req, res) => {
    try {
        console.log('🔄 Bulk update request:', req.body);
        
        if (!pool || !pool.connected) {
            return res.status(503).json({
                success: false,
                message: 'Database connection not available'
            });
        }
        
        const { taskIds, updateData } = req.body;
        
        if (!taskIds || taskIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No task IDs provided'
            });
        }
        
        // Build update query
        const request = pool.request();
        let updateFields = [];
        
        if (updateData.taskStatus) {
            updateFields.push('TaskStatus = @taskStatus');
            request.input('taskStatus', sql.NVarChar, updateData.taskStatus);
        }
        
        if (updateData.assignedTo) {
            updateFields.push('AssignedTo = @assignedTo');
            request.input('assignedTo', sql.NVarChar, updateData.assignedTo);
        }
        
        if (updateData.workQueue) {
            updateFields.push('WorkQueue = @workQueue');
            request.input('workQueue', sql.NVarChar, updateData.workQueue);
        }
        
        updateFields.push('ModifiedDate = GETDATE()');
        
        const query = `
            UPDATE Tasks 
            SET ${updateFields.join(', ')}
            WHERE Id IN (${taskIds.map((_, i) => `@id${i}`).join(',')})
        `;
        
        taskIds.forEach((id, i) => request.input(`id${i}`, sql.Int, id));
        
        const result = await request.query(query);
        
        console.log(`✅ Updated ${result.rowsAffected[0]} tasks`);
        
        res.json({
            success: true,
            message: `Successfully updated ${result.rowsAffected[0]} tasks`,
            updatedCount: result.rowsAffected[0]
        });
    } catch (error) {
        console.error('❌ Error bulk updating tasks:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Export to Excel endpoint (placeholder)
app.get('/api/export-excel', async (req, res) => {
    console.log('📤 Export request received');
    res.json({
        success: true,
        message: 'Export functionality requires Excel generation library'
    });
});

// ============================================================
// JIRA INTEGRATION ENDPOINTS
// ============================================================

// Test Jira connection
app.get('/api/jira/test-connection', async (req, res) => {
    try {
        const result = await jiraService.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get Jira projects
app.get('/api/jira/projects', async (req, res) => {
    try {
        const result = await jiraService.getProjects();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Create Jira issue from task
app.post('/api/jira/create-issue', async (req, res) => {
    try {
        console.log('📝 Creating Jira issue for task:', req.body.taskData?.taskId);
        const { taskData } = req.body;
        const result = await jiraService.createIssue(taskData);
        res.json(result);
    } catch (error) {
        console.error('❌ Error in create-issue endpoint:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get Jira issue details
app.get('/api/jira/issue/:jiraKey', async (req, res) => {
    try {
        console.log('🔍 Fetching Jira issue:', req.params.jiraKey);
        const result = await jiraService.getIssue(req.params.jiraKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get available transitions for an issue
app.get('/api/jira/transitions/:jiraKey', async (req, res) => {
    try {
        const result = await jiraService.getTransitions(req.params.jiraKey);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Update Jira issue status
app.post('/api/jira/update-status', async (req, res) => {
    try {
        console.log('🔄 Updating Jira issue status:', req.body);
        const { jiraKey, status } = req.body;
        const result = await jiraService.updateIssueStatus(jiraKey, status);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Add comment to Jira issue
app.post('/api/jira/add-comment', async (req, res) => {
    try {
        console.log('💬 Adding comment to Jira issue:', req.body.jiraKey);
        const { jiraKey, comment } = req.body;
        const result = await jiraService.addComment(jiraKey, comment);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Search Jira issues
app.post('/api/jira/search', async (req, res) => {
    try {
        console.log('🔎 Searching Jira issues:', req.body.jql);
        const { jql, maxResults } = req.body;
        const result = await jiraService.searchIssues(jql, maxResults);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Sync task with Jira
app.post('/api/jira/sync', async (req, res) => {
    try {
        console.log('🔄 Syncing task with Jira:', req.body);
        const { taskId, jiraKey } = req.body;
        const result = await jiraService.syncTaskWithJira(taskId, jiraKey);
        
        // If sync successful, update database
        if (result.success && pool && pool.connected) {
            try {
                await pool.request()
                    .input('taskId', sql.Int, taskId)
                    .input('taskStatus', sql.NVarChar, result.taskStatus)
                    .input('jiraKey', sql.NVarChar, jiraKey)
                    .query(`
                        UPDATE Tasks 
                        SET TaskStatus = @taskStatus,
                            JiraKey = @jiraKey,
                            JiraLastSyncDate = GETDATE(),
                            ModifiedDate = GETDATE()
                        WHERE Id = @taskId
                    `);
                console.log(`✅ Task ${taskId} updated in database`);
            } catch (dbError) {
                console.error('⚠️  Database update failed:', dbError.message);
            }
        }
        
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Bulk create Jira issues
app.post('/api/jira/bulk-create', async (req, res) => {
    try {
        console.log('📝 Bulk creating Jira issues for', req.body.tasks?.length, 'tasks');
        const { tasks } = req.body;
        
        const results = [];
        for (const task of tasks) {
            const result = await jiraService.createIssue(task);
            results.push({
                taskId: task.taskId,
                ...result
            });
            
            // Update database with Jira key if successful
            if (result.success && pool && pool.connected) {
                try {
                    await pool.request()
                        .input('taskId', sql.Int, task.id)
                        .input('jiraKey', sql.NVarChar, result.jiraKey)
                        .input('jiraUrl', sql.NVarChar, result.jiraUrl)
                        .query(`
                            UPDATE Tasks 
                            SET JiraKey = @jiraKey,
                                JiraUrl = @jiraUrl,
                                JiraCreatedDate = GETDATE(),
                                ModifiedDate = GETDATE()
                            WHERE Id = @taskId
                        `);
                } catch (dbError) {
                    console.error('⚠️  Database update failed for task', task.id);
                }
            }
        }
        
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;
        
        res.json({
            success: true,
            results: results,
            summary: {
                total: tasks.length,
                success: successCount,
                failed: failCount
            },
            message: `Created ${successCount} Jira issues. ${failCount} failed.`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Start server
async function startServer() {
    // Initialize database connection
    const dbConnected = await initializeDatabase();
    
    if (!dbConnected) {
        console.log('⚠️  Server starting without database connection');
        console.log('   Please ensure you are logged in with Azure CLI: az login');
    }
    
    app.listen(PORT, () => {
        console.log('='.repeat(70));
        console.log('🚀 Azure SQL Backend Server Started Successfully!');
        console.log('='.repeat(70));
        console.log(`📡 Server running at: http://localhost:${PORT}`);
        console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
        console.log(`📊 Search endpoint: http://localhost:${PORT}/api/search-tasks`);
        console.log(`📋 Dropdown options: http://localhost:${PORT}/api/dropdown-options/{type}`);
        console.log('='.repeat(70));
        console.log(`🗄️  Database: ${config.database}`);
        console.log(`🔐 Authentication: Active Directory Default`);
        console.log('='.repeat(70));
        if (dbConnected) {
            console.log('✅ Ready to accept requests from Angular app');
        } else {
            console.log('⚠️  Database connection failed - check Azure credentials');
        }
        console.log('='.repeat(70));
    });
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    if (pool) {
        await pool.close();
        console.log('✅ Database connection closed');
    }
    process.exit(0);
});

// Start the server
startServer();

// Made with Bob
