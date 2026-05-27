# Setup Guide for providerinfo Database

## 🎯 Database Connection Details

```
Server: serproviderinfo.database.windows.net
Database: providerinfo
Port: 1433
User: mahi
Password: Omsairam@2114
Authentication: SQL Server Authentication
```

## ✅ Configuration Complete

The following files have been configured with your database credentials:

1. **`.env`** - Environment variables
2. **`azure-server.js`** - Backend server with SQL authentication
3. **`setup-database.sql`** - Database setup script
4. **`start-azure-app.bat`** - Application launcher

## 🚀 Quick Start (3 Steps)

### Step 1: Enable PowerShell Scripts

Open PowerShell **as Administrator** and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 2: Install Dependencies

```bash
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm install
```

This will install:
- `mssql` - SQL Server driver
- `@azure/identity` - Azure authentication library
- `dotenv` - Environment variables
- `express` and `cors` - Web server

### Step 3: Create Database Tables

You need to run the SQL script to create the required tables.

#### Option A: Using Azure Data Studio (Recommended)

1. Download Azure Data Studio: https://docs.microsoft.com/sql/azure-data-studio/download

2. Connect to database:
   - Server: `serproviderinfo.database.windows.net`
   - Authentication: `SQL Login`
   - User: `mahi`
   - Password: `Omsairam@2114`
   - Database: `providerinfo`

3. Open file: `DirectoryBlue/mock-backend/setup-database.sql`

4. Click **Run** (F5)

#### Option B: Using Azure Portal Query Editor

1. Go to: https://portal.azure.com
2. Navigate to your SQL Database: `providerinfo`
3. Click "Query editor" in the left menu
4. Login with:
   - Login: `mahi`
   - Password: `Omsairam@2114`
5. Copy and paste the contents of `setup-database.sql`
6. Click **Run**

#### Option C: Using sqlcmd

```bash
sqlcmd -S serproviderinfo.database.windows.net -d providerinfo -U mahi -P Omsairam@2114 -i "c:\BOB Directory\DirectoryBlue\mock-backend\setup-database.sql"
```

## 🎮 Running the Application

### Option 1: Use the Batch File (Easiest)

Double-click: `DirectoryBlue/start-azure-app.bat`

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm run start-azure
```

**Terminal 2 - Frontend:**
```bash
cd "c:\BOB Directory\DirectoryBlue"
npm start
```

**Browser:**
```
http://localhost:4200
```

## ✅ Verification

### 1. Test Backend Connection

After starting the backend, open:
```
http://localhost:3000/api/health
```

Should see:
```json
{
  "status": "OK",
  "message": "Azure SQL backend server is running",
  "database": "Connected to Azure SQL Database",
  "server": "serproviderinfo.database.windows.net"
}
```

### 2. Test Frontend

1. Open: http://localhost:4200
2. Click "Submit" button
3. Should see 5 sample tasks from the database

## 📊 Database Tables Created

The `setup-database.sql` script creates:

1. **Tasks** - Main task data table
2. **DataSourceOptions** - Data source dropdown values
3. **SurveyTypeOptions** - Survey type dropdown values
4. **TaskNameOptions** - Task name dropdown values
5. **TaskStatusOptions** - Task status dropdown values
6. **AssignedToOptions** - User assignment dropdown values
7. **WorkQueueOptions** - Work queue dropdown values

## 📝 Sample Data

The script inserts 5 sample tasks:

| Task ID | Provider Name | NPI | Status | Data Source |
|---------|---------------|-----|--------|-------------|
| TSK001 | Dr. John Smith | 1234567890 | In Progress | CAQH |
| TSK002 | Dr. Jane Doe | 0987654321 | Pending | Survey |
| TSK003 | Dr. Robert Johnson | 1122334455 | Completed | CAQH |
| TSK004 | Dr. Sarah Williams | 5566778899 | In Progress | Manual |
| TSK005 | Dr. Michael Brown | 9988776655 | Cancelled | Survey |

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"

**Check 1: Firewall Rules**
1. Go to Azure Portal
2. Navigate to SQL Server: `serproviderinfo`
3. Click "Networking" or "Firewalls and virtual networks"
4. Add your client IP address
5. Click "Save"

**Check 2: Credentials**
- Verify username: `mahi`
- Verify password: `Omsairam@2114`
- Check `.env` file has correct values

### Issue: "Login failed for user"

**Solution:**
1. Verify credentials in Azure Portal
2. Check if user has access to the database
3. Ensure firewall allows your IP

### Issue: "Cannot find module 'mssql'"

**Solution:**
```bash
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm install
```

### Issue: "Tables do not exist"

**Solution:**
Run the `setup-database.sql` script in Azure Data Studio or Azure Portal Query Editor.

## 🔐 Security Notes

- ✅ Credentials stored in `.env` file (not in source code)
- ✅ `.env` should be added to `.gitignore` (don't commit passwords)
- ✅ Encrypted connection to Azure SQL
- ✅ Parameterized queries prevent SQL injection
- ⚠️ For production, use Azure Key Vault for secrets

## 📈 Next Steps

1. **Verify Connection**: Test the health endpoint
2. **Test Search**: Search for the 5 sample tasks
3. **Add Your Data**: Insert your own tasks into the database
4. **Customize**: Modify tables and fields as needed
5. **Deploy**: Follow production deployment guide

## 🎉 Success Checklist

- [ ] PowerShell execution policy enabled
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database tables created (run `setup-database.sql`)
- [ ] Backend connects successfully
- [ ] Health endpoint returns "OK"
- [ ] Frontend loads at http://localhost:4200
- [ ] Can search and view tasks from database
- [ ] Dropdown options populate

## 💡 Quick Commands

```bash
# Install backend dependencies
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm install

# Start Azure SQL backend
npm run start-azure

# Start frontend (in another terminal)
cd "c:\BOB Directory\DirectoryBlue"
npm start

# Test backend health
start http://localhost:3000/api/health

# Open application
start http://localhost:4200
```

## 📞 Connection String Reference

```
Server=tcp:serproviderinfo.database.windows.net,1433;
Initial Catalog=providerinfo;
Persist Security Info=False;
User ID=mahi;
Password=Omsairam@2114;
MultipleActiveResultSets=False;
Encrypt=True;
TrustServerCertificate=False;
Connection Timeout=30;
```

---

**Server**: serproviderinfo.database.windows.net  
**Database**: providerinfo  
**User**: mahi  
**Authentication**: SQL Server Authentication  
**Status**: ✅ Configured and Ready

**Created by**: Bob - AI Software Engineer  
**Date**: May 20, 2026