# Azure SQL Database Integration Guide

This document provides instructions for setting up and integrating Azure SQL Database with the Angular web application.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Azure SQL Database Setup](#azure-sql-database-setup)
3. [Backend API Setup (Azure Functions)](#backend-api-setup-azure-functions)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Configuration](#frontend-configuration)
7. [Testing](#testing)

## Prerequisites

- Azure Subscription
- Azure SQL Database instance
- Node.js and npm installed
- Azure Functions Core Tools (for local development)
- SQL Server Management Studio (SSMS) or Azure Data Studio

## Azure SQL Database Setup

### 1. Create Azure SQL Database

```bash
# Using Azure CLI
az sql server create \
  --name your-sql-server \
  --resource-group your-resource-group \
  --location eastus \
  --admin-user sqladmin \
  --admin-password YourPassword123!

az sql db create \
  --resource-group your-resource-group \
  --server your-sql-server \
  --name TaskInventoryDB \
  --service-objective S0
```

### 2. Configure Firewall Rules

```bash
# Allow Azure services
az sql server firewall-rule create \
  --resource-group your-resource-group \
  --server your-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP
az sql server firewall-rule create \
  --resource-group your-resource-group \
  --server your-sql-server \
  --name AllowMyIP \
  --start-ip-address YOUR_IP \
  --end-ip-address YOUR_IP
```

## Database Schema

### Tasks Table

```sql
CREATE TABLE Tasks (
    Id INT PRIMARY KEY IDENTITY(1,1),
    DataSource NVARCHAR(100),
    TaskId NVARCHAR(50) UNIQUE NOT NULL,
    CaseId NVARCHAR(50),
    NPI NVARCHAR(20),
    ProviderId NVARCHAR(50),
    ProviderName NVARCHAR(200),
    Title NVARCHAR(100),
    TaskName NVARCHAR(100),
    TaskStatus NVARCHAR(50),
    TaskAge INT,
    CRD NVARCHAR(50),
    WorkQueue NVARCHAR(100),
    OutboundFileDate DATE,
    CorporateReceiptDate DATE,
    CreatedDate DATETIME DEFAULT GETDATE(),
    ModifiedDate DATETIME DEFAULT GETDATE()
);

CREATE INDEX IX_Tasks_TaskId ON Tasks(TaskId);
CREATE INDEX IX_Tasks_NPI ON Tasks(NPI);
CREATE INDEX IX_Tasks_ProviderId ON Tasks(ProviderId);
CREATE INDEX IX_Tasks_TaskStatus ON Tasks(TaskStatus);
```

### Dropdown Options Tables

```sql
-- Data Source Options
CREATE TABLE DataSourceOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(100) NOT NULL,
    Label NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1
);

-- Survey Type Options
CREATE TABLE SurveyTypeOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(100) NOT NULL,
    Label NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1
);

-- Task Name Options
CREATE TABLE TaskNameOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(100) NOT NULL,
    Label NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1
);

-- Task Status Options
CREATE TABLE TaskStatusOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(50) NOT NULL,
    Label NVARCHAR(50) NOT NULL,
    IsActive BIT DEFAULT 1
);

-- Assigned To Options (Users)
CREATE TABLE AssignedToOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(100) NOT NULL,
    Label NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1
);

-- Work Queue Options
CREATE TABLE WorkQueueOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(100) NOT NULL,
    Label NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1
);
```

### Sample Data

```sql
-- Insert sample data
INSERT INTO Tasks (DataSource, TaskId, CaseId, NPI, ProviderId, ProviderName, Title, TaskName, TaskStatus, TaskAge, CRD, WorkQueue, OutboundFileDate, CorporateReceiptDate)
VALUES 
('CAQH', 'TSK001', 'CASE001', '1234567890', 'PRV001', 'Dr. John Smith', 'MD', 'Initial Survey', 'In Progress', 15, '2026-05-30', 'Queue A', '2026-04-12', '2026-04-15'),
('Survey', 'TSK002', 'CASE002', '0987654321', 'PRV002', 'Dr. Jane Doe', 'DO', 'Re-credentialing', 'Pending', 5, '2026-06-15', 'Queue B', '2026-05-01', '2026-05-05');

-- Insert dropdown options
INSERT INTO DataSourceOptions (Value, Label) VALUES ('CAQH', 'CAQH'), ('Survey', 'Survey'), ('Manual', 'Manual Entry');
INSERT INTO SurveyTypeOptions (Value, Label) VALUES ('Initial', 'Initial Survey'), ('Recred', 'Re-credentialing'), ('Update', 'Update Survey');
INSERT INTO TaskNameOptions (Value, Label) VALUES ('InitialSurvey', 'Initial Survey'), ('Recredentialing', 'Re-credentialing'), ('DataUpdate', 'Data Update');
INSERT INTO TaskStatusOptions (Value, Label) VALUES ('Pending', 'Pending'), ('InProgress', 'In Progress'), ('Completed', 'Completed'), ('Cancelled', 'Cancelled');
INSERT INTO AssignedToOptions (Value, Label) VALUES ('user1', 'John Doe'), ('user2', 'Jane Smith'), ('user3', 'Bob Johnson');
INSERT INTO WorkQueueOptions (Value, Label) VALUES ('QueueA', 'Queue A'), ('QueueB', 'Queue B'), ('QueueC', 'Queue C');
```

## Backend API Setup (Azure Functions)

### 1. Create Azure Function App

```bash
# Create Function App
az functionapp create \
  --resource-group your-resource-group \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 18 \
  --functions-version 4 \
  --name your-function-app \
  --storage-account yourstorageaccount
```

### 2. Azure Function Code (Node.js)

Create a new Azure Functions project:

```bash
func init TaskInventoryAPI --typescript
cd TaskInventoryAPI
func new --name SearchTasks --template "HTTP trigger"
```

#### package.json

```json
{
  "name": "task-inventory-api",
  "version": "1.0.0",
  "dependencies": {
    "@azure/functions": "^4.0.0",
    "mssql": "^10.0.0"
  }
}
```

#### SearchTasks/index.ts

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as sql from 'mssql';

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

export async function searchTasks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const params = request.query;
        
        let pool = await sql.connect(config);
        let query = 'SELECT * FROM Tasks WHERE 1=1';
        
        // Build dynamic query based on parameters
        if (params.get('npi')) {
            query += ` AND NPI IN (${params.get('npi').split(',').map(n => `'${n.trim()}'`).join(',')})`;
        }
        if (params.get('dataSource')) {
            query += ` AND DataSource = '${params.get('dataSource')}'`;
        }
        if (params.get('taskId')) {
            query += ` AND TaskId IN (${params.get('taskId').split(',').map(t => `'${t.trim()}'`).join(',')})`;
        }
        if (params.get('providerId')) {
            query += ` AND ProviderId IN (${params.get('providerId').split(',').map(p => `'${p.trim()}'`).join(',')})`;
        }
        if (params.get('taskStatus')) {
            query += ` AND TaskStatus = '${params.get('taskStatus')}'`;
        }
        if (params.get('taskName')) {
            query += ` AND TaskName = '${params.get('taskName')}'`;
        }
        if (params.get('assignedTo')) {
            query += ` AND AssignedTo = '${params.get('assignedTo')}'`;
        }
        if (params.get('workQueue')) {
            query += ` AND WorkQueue = '${params.get('workQueue')}'`;
        }
        if (params.get('outboundFileFromDate')) {
            query += ` AND OutboundFileDate >= '${params.get('outboundFileFromDate')}'`;
        }
        if (params.get('outboundFileToDate')) {
            query += ` AND OutboundFileDate <= '${params.get('outboundFileToDate')}'`;
        }
        
        query += ' ORDER BY CreatedDate DESC';
        
        const result = await pool.request().query(query);
        
        return {
            status: 200,
            jsonBody: {
                success: true,
                data: result.recordset,
                totalRecords: result.recordset.length
            }
        };
    } catch (error) {
        context.error('Error searching tasks:', error);
        return {
            status: 500,
            jsonBody: {
                success: false,
                message: error.message
            }
        };
    }
}

app.http('search-tasks', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: searchTasks
});
```

#### GetDropdownOptions/index.ts

```typescript
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as sql from 'mssql';

const config = {
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    server: process.env.SQL_SERVER,
    database: process.env.SQL_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

export async function getDropdownOptions(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const optionType = request.params.optionType;
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
            return {
                status: 400,
                jsonBody: { success: false, message: 'Invalid option type' }
            };
        }
        
        let pool = await sql.connect(config);
        const result = await pool.request()
            .query(`SELECT Value as value, Label as label FROM ${tableName} WHERE IsActive = 1`);
        
        return {
            status: 200,
            jsonBody: result.recordset
        };
    } catch (error) {
        context.error('Error fetching dropdown options:', error);
        return {
            status: 500,
            jsonBody: []
        };
    }
}

app.http('dropdown-options', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'dropdown-options/{optionType}',
    handler: getDropdownOptions
});
```

### 3. Deploy Azure Functions

```bash
# Deploy to Azure
func azure functionapp publish your-function-app
```

### 4. Configure Application Settings

```bash
az functionapp config appsettings set \
  --name your-function-app \
  --resource-group your-resource-group \
  --settings \
    SQL_USER=sqladmin \
    SQL_PASSWORD=YourPassword123! \
    SQL_SERVER=your-sql-server.database.windows.net \
    SQL_DATABASE=TaskInventoryDB
```

## API Endpoints

Once deployed, your API endpoints will be:

- **Search Tasks**: `https://your-function-app.azurewebsites.net/api/search-tasks`
- **Get Dropdown Options**: `https://your-function-app.azurewebsites.net/api/dropdown-options/{optionType}`
- **Bulk Update**: `https://your-function-app.azurewebsites.net/api/bulk-update`
- **Export Excel**: `https://your-function-app.azurewebsites.net/api/export-excel`

## Frontend Configuration

Update the environment files with your Azure Function URL:

### src/environments/environment.ts

```typescript
export const environment = {
  production: false,
  azureSql: {
    apiEndpoint: 'https://your-function-app.azurewebsites.net/api',
  }
};
```

### src/environments/environment.prod.ts

```typescript
export const environment = {
  production: true,
  azureSql: {
    apiEndpoint: 'https://your-production-function-app.azurewebsites.net/api',
  }
};
```

## Testing

### 1. Test Database Connection

```sql
-- Run in SSMS or Azure Data Studio
SELECT TOP 10 * FROM Tasks;
```

### 2. Test API Endpoints

```bash
# Test search endpoint
curl "https://your-function-app.azurewebsites.net/api/search-tasks?taskStatus=Pending"

# Test dropdown options
curl "https://your-function-app.azurewebsites.net/api/dropdown-options/dataSource"
```

### 3. Test Frontend

```bash
# Run Angular app
cd DirectoryBlue
npm install
npm start
```

Navigate to `http://localhost:4200` and test the search functionality.

## Security Considerations

1. **Enable CORS** on Azure Functions for your Angular app domain
2. **Use Azure AD Authentication** for production
3. **Implement API Key authentication** as a minimum
4. **Use Azure Key Vault** for storing connection strings
5. **Enable SQL Database auditing**
6. **Implement rate limiting** on API endpoints

## Troubleshooting

### Common Issues

1. **Connection timeout**: Check firewall rules
2. **Authentication failed**: Verify SQL credentials
3. **CORS errors**: Configure CORS in Azure Functions
4. **No data returned**: Check database has sample data

### Logs

View Azure Function logs:
```bash
func azure functionapp logstream your-function-app
```

## Additional Resources

- [Azure SQL Database Documentation](https://docs.microsoft.com/azure/sql-database/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Angular HttpClient Guide](https://angular.io/guide/http)

---

**Created by Bob - Your AI Software Engineer**