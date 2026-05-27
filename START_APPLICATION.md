# How to Start the Application

This guide will help you run the web application with the mock backend server.

## Prerequisites

- Node.js installed (v18 or higher)
- npm installed
- PowerShell execution policy enabled

## Step 1: Enable PowerShell Scripts (One-time setup)

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Step 2: Install Backend Dependencies

Open a terminal and navigate to the mock-backend directory:

```bash
cd DirectoryBlue/mock-backend
npm install
```

## Step 3: Install Frontend Dependencies

Open another terminal and navigate to the DirectoryBlue directory:

```bash
cd DirectoryBlue
npm install
```

## Step 4: Start the Backend Server

In the first terminal (mock-backend directory):

```bash
npm start
```

You should see:
```
🚀 Mock Backend Server Started Successfully!
📡 Server running at: http://localhost:3000
✅ Ready to accept requests from Angular app
```

**Keep this terminal running!**

## Step 5: Start the Angular Application

In the second terminal (DirectoryBlue directory):

```bash
npm start
```

Wait for the compilation to complete. You should see:
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

## Step 6: Open the Application

Open your browser and navigate to:

```
http://localhost:4200
```

## Testing the Application

### 1. Test Search Functionality

1. **Search All Tasks**: Click the "Submit" button without entering any criteria
   - Should display 5 mock tasks

2. **Search by NPI**: 
   - Enter `1234567890` in the NPI field
   - Click "Submit"
   - Should display 1 task (Dr. John Smith)

3. **Search by Data Source**:
   - Select "CAQH" from Data Source dropdown
   - Click "Submit"
   - Should display 2 tasks

4. **Search by Task Status**:
   - Select "In Progress" from Task Status dropdown
   - Click "Submit"
   - Should display 2 tasks

5. **Clear Filter**:
   - Click "Clear Filter" button
   - All fields should reset to default values

### 2. Test Bulk Operations

1. **Select Tasks**:
   - Click checkboxes to select individual tasks
   - Or click the header checkbox to select all

2. **Bulk Update**:
   - Select one or more tasks
   - Click "Bulk Update" button
   - Should show success message

### 3. Test Export

1. Perform a search to get results
2. Click "Export To Excel" button
3. Should show export message (actual Excel generation not implemented in mock)

## Mock Data Available

The mock backend has 5 sample tasks:

| Task ID | NPI | Provider Name | Status | Data Source |
|---------|-----|---------------|--------|-------------|
| TSK001 | 1234567890 | Dr. John Smith | In Progress | CAQH |
| TSK002 | 0987654321 | Dr. Jane Doe | Pending | Survey |
| TSK003 | 1122334455 | Dr. Robert Johnson | Completed | CAQH |
| TSK004 | 5566778899 | Dr. Sarah Williams | In Progress | Manual |
| TSK005 | 9988776655 | Dr. Michael Brown | Cancelled | Survey |

## Troubleshooting

### Backend Server Won't Start

**Error**: `npm: command not found`
- **Solution**: Install Node.js from https://nodejs.org/

**Error**: `Cannot find module 'express'`
- **Solution**: Run `npm install` in the mock-backend directory

**Error**: `Port 3000 is already in use`
- **Solution**: Stop any other application using port 3000, or change the port in `mock-backend/server.js`

### Frontend Won't Start

**Error**: `ng: command not found`
- **Solution**: Run `npm install` in the DirectoryBlue directory

**Error**: `Port 4200 is already in use`
- **Solution**: Stop any other Angular app, or use `ng serve --port 4201`

**Error**: `Cannot find module '@angular/core'`
- **Solution**: Delete `node_modules` folder and run `npm install` again

### Application Loads But No Data

**Check 1**: Is the backend server running?
- Open http://localhost:3000/api/health in your browser
- Should see: `{"status":"OK","message":"Mock backend server is running"}`

**Check 2**: Check browser console for errors
- Press F12 to open Developer Tools
- Look for CORS or network errors

**Check 3**: Verify environment configuration
- Check `src/environments/environment.ts`
- Should have: `apiEndpoint: 'http://localhost:3000/api'`

### CORS Errors

If you see CORS errors in the browser console:
1. Make sure the backend server is running
2. The mock backend already has CORS enabled
3. Try restarting both servers

## Stopping the Application

### Stop Frontend (Angular)
In the terminal running Angular, press: `Ctrl + C`

### Stop Backend (Mock Server)
In the terminal running the backend, press: `Ctrl + C`

## Quick Start Commands

### Terminal 1 (Backend):
```bash
cd DirectoryBlue/mock-backend
npm install
npm start
```

### Terminal 2 (Frontend):
```bash
cd DirectoryBlue
npm install
npm start
```

### Browser:
```
http://localhost:4200
```

## Development Mode

Both servers support hot-reload:
- **Frontend**: Changes to TypeScript/HTML/CSS files will auto-reload
- **Backend**: Install nodemon for auto-restart: `npm install -g nodemon`, then use `npm run dev`

## Production Build

To build for production:

```bash
cd DirectoryBlue
npm run build
```

Output will be in `DirectoryBlue/dist/` directory.

## Next Steps

Once you've tested the application with the mock backend:

1. **Deploy to Azure**: Follow `AZURE_SQL_SETUP.md` to set up real Azure SQL Database
2. **Update Environment**: Change `environment.prod.ts` to point to Azure Functions
3. **Add Authentication**: Implement Azure AD authentication
4. **Add More Features**: See `WEB_APP_FEATURES.md` for enhancement ideas

## Support

If you encounter any issues:
1. Check this troubleshooting guide
2. Review the browser console for errors
3. Check the backend terminal for error messages
4. Verify all dependencies are installed

---

**Happy Testing! 🚀**

Created by Bob - Your AI Software Engineer