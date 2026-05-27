# Azure SQL Database Connection Guide

## 🎯 Overview

This guide will help you connect your web application to the actual Azure SQL Database at `directoryblue.database.windows.net`.

## ✅ Prerequisites

1. **Azure CLI** installed and configured
2. **Node.js** installed (v18 or higher)
3. **Access to Azure SQL Database**: directoryblue.database.windows.net
4. **Azure Active Directory** authentication configured

## 📋 Step-by-Step Setup

### Step 1: Install Azure CLI (if not already installed)

Download and install from: https://docs.microsoft.com/cli/azure/install-azure-cli

Verify installation:
```bash
az --version
```

### Step 2: Login to Azure

Open PowerShell or Command Prompt and run:

```bash
az login
```

This will open a browser window for authentication. Login with your Azure credentials.

Verify you're logged in:
```bash
az account show
```

### Step 3: Set Up Database Tables

You need to create the required tables in your Azure SQL Database.

#### Option A: Using Azure Data Studio (Recommended)

1. Download Azure Data Studio: https://docs.microsoft.com/sql/azure-data-studio/download
2. Connect to your database:
   - Server: `directoryblue.database.windows.net`
   - Database: `directoryblue`
   - Authentication: `Azure Active Directory - Universal with MFA`
3. Open the file: `DirectoryBlue/mock-backend/setup-database.sql`
4. Execute the script (F5 or click Run)

#### Option B: Using Azure Portal Query Editor

1. Go to Azure Portal: https://portal.azure.com
2. Navigate to your SQL Database: `directoryblue`
3. Click on "Query editor" in the left menu
4. Login with Azure AD authentication
5. Copy and paste the contents of `setup-database.sql`
6. Click "Run"

#### Option C: Using sqlcmd

```bash
sqlcmd -S directoryblue.database.windows.net -d directoryblue -G -i mock-backend/setup-database.sql
```

### Step 4: Install Backend Dependencies

```bash
cd DirectoryBlue/mock-backend
npm install
```

This will install:
- `mssql` - SQL Server driver for Node.js
- `@azure/identity` - Azure authentication
- `dotenv` - Environment variable management
- `express` - Web server
- `cors` - Cross-origin resource sharing

### Step 5: Verify Configuration

Check the `.env` file in `mock-backend` folder:

```env
AZURE_SQL_SERVER=directoryblue.database.windows.net
AZURE_SQL_DATABASE=directoryblue
AZURE_SQL_PORT=1433
AZURE_SQL_AUTHENTICATION=ActiveDirectoryDefault
PORT=3000
```

### Step 6: Test Database Connection

Run the Azure SQL backend server:

```bash
cd DirectoryBlue/mock-backend
npm run start-azure
```

You should see:
```
🔄 Connecting to Azure SQL Database...
   Server: directoryblue.database.windows.net
   Database: directoryblue
   Authentication: Active Directory Default
✅ Successfully connected to Azure SQL Database!
📊 Database version: Microsoft SQL Server...
🚀 Azure SQL Backend Server Started Successfully!
```

If you see connection errors, check:
1. You're logged in with `az login`
2. Your Azure account has access to the database
3. Firewall rules allow your IP address

### Step 7: Start the Full Application

#### Option A: Use the Batch File (Easiest)

Double-click: `DirectoryBlue/start-azure-app.bat`

#### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd DirectoryBlue/mock-backend
npm run start-azure
```

**Terminal 2 - Frontend:**
```bash
cd DirectoryBlue
npm start
```

### Step 8: Open the Application

Open your browser to: **http://localhost:4200**

## 🧪 Testing with Real Data

### Test 1: Verify Database Connection

1. Open: http://localhost:3000/api/health
2. Should see:
```json
{
  "status": "OK",
  "message": "Azure SQL backend server is running",
  "database": "Connected to Azure SQL Database",
  "server": "directoryblue.database.windows.net"
}
```

### Test 2: Search All Tasks

1. Go to http://localhost:4200
2. Click "Submit" button (without entering any criteria)
3. Should see 5 sample tasks from the database

### Test 3: Search by NPI

1. Enter `1234567890` in NPI field
2. Click "Submit"
3. Should see 1 task (Dr. John Smith)

### Test 4: Add Your Own Data

Connect to the database and insert your own tasks:

```sql
INSERT INTO Tasks (DataSource, TaskId, CaseId, NPI, ProviderId, ProviderName, Title, TaskName, TaskStatus, TaskAge, CRD, WorkQueue, AssignedTo, OutboundFileDate, CorporateReceiptDate)
VALUES 
('CAQH', 'TSK006', 'CASE006', '1111222233', 'PRV006', 'Dr. Your Name', 'MD', 'Initial Survey', 'Pending', 3, '2026-06-30', 'Queue A', 'user1', '2026-05-15', '2026-05-16');
```

Then search for it in the web app!

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**Solution 1: Check Azure Login**
```bash
az account show
```
If not logged in:
```bash
az login
```

**Solution 2: Check Firewall Rules**
1. Go to Azure Portal
2. Navigate to your SQL Server: `directoryblue`
3. Click "Networking" or "Firewalls and virtual networks"
4. Add your client IP address
5. Click "Save"

**Solution 3: Check Database Access**
Verify you have permissions:
```bash
az sql db show --name directoryblue --server directoryblue --resource-group <your-resource-group>
```

### Error: "Login failed for user"

This means Active Directory authentication isn't working.

**Solution:**
1. Ensure you're logged in: `az login`
2. Check you have the correct Azure subscription selected:
```bash
az account list
az account set --subscription <subscription-id>
```

### Error: "Cannot find module 'mssql'"

**Solution:**
```bash
cd DirectoryBlue/mock-backend
npm install
```

### Backend Starts But No Data

**Check 1: Tables Exist**
Run this query in Azure Data Studio:
```sql
SELECT name FROM sys.tables;
```

Should see: Tasks, DataSourceOptions, SurveyTypeOptions, etc.

**Check 2: Tables Have Data**
```sql
SELECT COUNT(*) FROM Tasks;
```

Should return 5 (or more if you added data).

If no data, run the `setup-database.sql` script again.

### Frontend Shows "Failed to connect to server"

**Check 1: Backend is Running**
- Look for the backend terminal window
- Should show "Azure SQL Backend Server Started Successfully"

**Check 2: Backend Health**
Open: http://localhost:3000/api/health

**Check 3: CORS**
Check backend terminal for CORS errors. The backend already has CORS enabled for all origins.

## 📊 Database Schema

### Tables Created

1. **Tasks** - Main task data
2. **DataSourceOptions** - Data source dropdown values
3. **SurveyTypeOptions** - Survey type dropdown values
4. **TaskNameOptions** - Task name dropdown values
5. **TaskStatusOptions** - Task status dropdown values
6. **AssignedToOptions** - User assignment dropdown values
7. **WorkQueueOptions** - Work queue dropdown values

### Sample Data

The setup script inserts 5 sample tasks and dropdown options for testing.

## 🔐 Security Best Practices

### For Development
- ✅ Using Active Directory Default authentication
- ✅ No passwords in code
- ✅ Environment variables for configuration
- ✅ Firewall rules configured

### For Production
- [ ] Use Azure Key Vault for secrets
- [ ] Implement API authentication
- [ ] Enable SQL Database auditing
- [ ] Use managed identities
- [ ] Implement rate limiting
- [ ] Enable SSL/TLS only

## 📈 Performance Tips

1. **Indexes**: The setup script creates indexes on frequently searched columns
2. **Connection Pooling**: The backend uses connection pooling automatically
3. **Query Optimization**: Use parameterized queries (already implemented)
4. **Caching**: Consider caching dropdown options

## 🚀 Next Steps

Once everything is working:

1. **Add More Data**: Insert your actual task data
2. **Customize Fields**: Modify tables to match your needs
3. **Add Features**: Implement pagination, sorting, filtering
4. **Deploy to Production**: Follow Azure deployment guide
5. **Add Authentication**: Implement user authentication
6. **Add Monitoring**: Set up Application Insights

## 📝 Quick Reference

### Start Application with Azure SQL
```bash
cd DirectoryBlue
.\start-azure-app.bat
```

### Start Backend Only
```bash
cd DirectoryBlue/mock-backend
npm run start-azure
```

### Check Azure Login
```bash
az account show
```

### Test Database Connection
```bash
curl http://localhost:3000/api/health
```

### View Backend Logs
Check the terminal window running the backend server.

## ✅ Success Checklist

- [ ] Azure CLI installed and logged in
- [ ] Database tables created
- [ ] Sample data inserted
- [ ] Backend dependencies installed
- [ ] Backend connects to Azure SQL successfully
- [ ] Frontend starts without errors
- [ ] Can search and view tasks
- [ ] Dropdown options populate
- [ ] Bulk operations work

## 🎉 Congratulations!

If all checks pass, you now have a fully functional web application connected to Azure SQL Database!

---

**Server**: directoryblue.database.windows.net  
**Database**: directoryblue  
**Authentication**: Active Directory Default  
**Backend**: http://localhost:3000  
**Frontend**: http://localhost:4200  

**Created by**: Bob - AI Software Engineer