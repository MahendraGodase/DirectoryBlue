# 🚀 Final Setup Instructions - Azure SQL Database Connection

## 📋 What Has Been Created

### ✅ Azure SQL Backend Server
- **File**: `mock-backend/azure-server.js`
- **Purpose**: Connects to your Azure SQL Database using Active Directory authentication
- **Connection String**: `directoryblue.database.windows.net`
- **Database**: `directoryblue`

### ✅ Database Setup Script
- **File**: `mock-backend/setup-database.sql`
- **Purpose**: Creates all required tables and inserts sample data
- **Tables**: Tasks, DataSourceOptions, SurveyTypeOptions, TaskNameOptions, TaskStatusOptions, AssignedToOptions, WorkQueueOptions

### ✅ Configuration Files
- **File**: `mock-backend/.env`
- **Purpose**: Environment variables for Azure SQL connection
- **File**: `start-azure-app.bat`
- **Purpose**: One-click launcher for Azure SQL version

### ✅ Documentation
- **File**: `AZURE_SQL_CONNECTION_GUIDE.md`
- **Purpose**: Complete step-by-step guide for Azure SQL setup

## 🎯 Quick Start (3 Steps)

### Step 1: Enable PowerShell Scripts

Open PowerShell **as Administrator** and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Type `Y` and press Enter.

### Step 2: Install Dependencies

Open a regular PowerShell or Command Prompt:

```bash
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm install
```

This will install:
- `mssql` - Azure SQL driver
- `@azure/identity` - Azure authentication
- `dotenv` - Environment variables
- `express` and `cors` - Web server

### Step 3: Set Up Database Tables

You need to run the SQL script to create tables. Choose one method:

#### Method A: Azure Data Studio (Recommended)

1. Download: https://docs.microsoft.com/sql/azure-data-studio/download
2. Connect to: `directoryblue.database.windows.net`
3. Database: `directoryblue`
4. Authentication: `Azure Active Directory - Universal with MFA`
5. Open file: `DirectoryBlue/mock-backend/setup-database.sql`
6. Click Run (F5)

#### Method B: Azure Portal

1. Go to: https://portal.azure.com
2. Find your database: `directoryblue`
3. Click "Query editor"
4. Login with Azure AD
5. Copy/paste contents of `setup-database.sql`
6. Click Run

#### Method C: sqlcmd Command Line

```bash
sqlcmd -S directoryblue.database.windows.net -d directoryblue -G -i "c:\BOB Directory\DirectoryBlue\mock-backend\setup-database.sql"
```

## 🚀 Running the Application

### Option 1: Use the Batch File (Easiest)

1. Make sure you're logged into Azure:
   ```bash
   az login
   ```

2. Double-click: `DirectoryBlue/start-azure-app.bat`

3. Wait for both servers to start

4. Open browser to: http://localhost:4200

### Option 2: Manual Start

**Terminal 1 - Azure SQL Backend:**
```bash
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm run start-azure
```

**Terminal 2 - Angular Frontend:**
```bash
cd "c:\BOB Directory\DirectoryBlue"
npm start
```

**Browser:**
```
http://localhost:4200
```

## ✅ Verification Steps

### 1. Check Azure Login

```bash
az account show
```

If not logged in:
```bash
az login
```

### 2. Test Backend Connection

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
  "server": "directoryblue.database.windows.net"
}
```

### 3. Test Frontend

Open: http://localhost:4200

Click "Submit" button → Should see tasks from your Azure SQL Database

## 🔧 Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Check Azure login: `az account show`
2. If not logged in: `az login`
3. Check firewall rules in Azure Portal
4. Verify you have access to the database

### Issue: "npm: cannot be loaded"

**Solution:**
Run PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue: "Cannot find module 'mssql'"

**Solution:**
```bash
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm install
```

### Issue: "Tables do not exist"

**Solution:**
Run the `setup-database.sql` script in Azure Data Studio or Azure Portal Query Editor.

### Issue: Backend starts but shows "Database connection not established"

**Solution:**
1. Ensure you're logged in: `az login`
2. Check you have the correct Azure subscription:
   ```bash
   az account list
   az account set --subscription <subscription-id>
   ```
3. Verify firewall rules allow your IP

## 📊 What's Different from Mock Backend

| Feature | Mock Backend | Azure SQL Backend |
|---------|--------------|-------------------|
| Data Source | In-memory array | Azure SQL Database |
| Data Persistence | No (resets on restart) | Yes (permanent) |
| Authentication | None | Azure Active Directory |
| Connection | N/A | Active Directory Default |
| Scalability | Limited | Enterprise-grade |
| File | `server.js` | `azure-server.js` |
| Start Command | `npm start` | `npm run start-azure` |

## 🎯 Key Files

```
DirectoryBlue/
├── mock-backend/
│   ├── server.js              ← Mock backend (in-memory data)
│   ├── azure-server.js        ← Azure SQL backend (real database) ✨
│   ├── setup-database.sql     ← Database setup script ✨
│   ├── .env                   ← Azure SQL configuration ✨
│   └── package.json           ← Updated with Azure dependencies ✨
├── start-app.bat              ← Starts mock backend
├── start-azure-app.bat        ← Starts Azure SQL backend ✨
└── AZURE_SQL_CONNECTION_GUIDE.md  ← Detailed guide ✨
```

## 📝 Connection Details

```
Server: directoryblue.database.windows.net
Database: directoryblue
Port: 1433
Authentication: Active Directory Default
Encryption: True
Trust Server Certificate: False
Connection Timeout: 30 seconds
```

## 🔐 Security Notes

- ✅ Using Azure Active Directory authentication (no passwords in code)
- ✅ Connection string uses environment variables
- ✅ Encrypted connection to Azure SQL
- ✅ No credentials stored in source code
- ✅ Firewall rules protect the database

## 📈 Next Steps After Setup

1. **Verify Connection**: Test the health endpoint
2. **Test Search**: Search for the 5 sample tasks
3. **Add Your Data**: Insert your own tasks into the database
4. **Customize**: Modify tables and fields as needed
5. **Deploy**: Follow production deployment guide

## 🎉 Success Criteria

- [ ] PowerShell execution policy enabled
- [ ] Azure CLI installed and logged in (`az login`)
- [ ] Backend dependencies installed (`npm install`)
- [ ] Database tables created (run `setup-database.sql`)
- [ ] Backend connects to Azure SQL successfully
- [ ] Health endpoint returns "OK"
- [ ] Frontend loads at http://localhost:4200
- [ ] Can search and view tasks from Azure SQL Database
- [ ] Dropdown options populate from database

## 💡 Tips

1. **Keep Azure CLI logged in**: Run `az login` if you get authentication errors
2. **Check firewall**: Add your IP in Azure Portal if connection fails
3. **Use Azure Data Studio**: Best tool for managing Azure SQL
4. **Monitor logs**: Watch the backend terminal for connection status
5. **Test incrementally**: Verify each step before moving to the next

## 📞 Quick Commands Reference

```bash
# Login to Azure
az login

# Check login status
az account show

# Install backend dependencies
cd "c:\BOB Directory\DirectoryBlue\mock-backend"
npm install

# Start Azure SQL backend
npm run start-azure

# Start frontend (in another terminal)
cd "c:\BOB Directory\DirectoryBlue"
npm start

# Test backend health
curl http://localhost:3000/api/health

# Or open in browser
start http://localhost:3000/api/health
```

## 🆚 Choosing Between Mock and Azure SQL

### Use Mock Backend (`start-app.bat`) When:
- Testing frontend features
- No internet connection
- Quick development
- Don't need data persistence

### Use Azure SQL Backend (`start-azure-app.bat`) When:
- Need real database
- Want data persistence
- Testing with production-like data
- Preparing for deployment
- Need to share data across team

## 📚 Additional Resources

- **Azure SQL Documentation**: https://docs.microsoft.com/azure/sql-database/
- **Azure CLI Guide**: https://docs.microsoft.com/cli/azure/
- **Azure Data Studio**: https://docs.microsoft.com/sql/azure-data-studio/
- **Node.js mssql Package**: https://www.npmjs.com/package/mssql

---

## ✨ Summary

You now have **TWO backend options**:

1. **Mock Backend** (`server.js`) - For quick testing with in-memory data
2. **Azure SQL Backend** (`azure-server.js`) - For real database connection

Both work with the same Angular frontend!

**To use Azure SQL:**
1. Enable PowerShell scripts
2. Run `az login`
3. Install dependencies: `npm install` in mock-backend folder
4. Create database tables: Run `setup-database.sql`
5. Start with: `start-azure-app.bat`

**Created by**: Bob - AI Software Engineer  
**Date**: May 16, 2026  
**Status**: ✅ Ready to Use