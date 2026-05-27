# Dropdown Data Binding Guide

## 🎯 Overview

The application is already configured to bind dropdown data from Azure SQL Database tables. The Data Source dropdown (and all other dropdowns) will automatically populate once you create the database tables.

## ✅ How It Works

### 1. **Backend API (Already Implemented)**

The `azure-server.js` file has an endpoint that fetches dropdown options:

```javascript
// Get dropdown options endpoint
app.get('/api/dropdown-options/:optionType', async (req, res) => {
    const optionType = req.params.optionType;
    
    const tableMap = {
        'dataSource': 'DataSourceOptions',
        'surveyType': 'SurveyTypeOptions',
        'taskName': 'TaskNameOptions',
        'taskStatus': 'TaskStatusOptions',
        'assignedTo': 'AssignedToOptions',
        'workQueue': 'WorkQueueOptions'
    };
    
    const tableName = tableMap[optionType];
    const result = await pool.request()
        .query(`SELECT Value as value, Label as label FROM ${tableName} WHERE IsActive = 1`);
    
    res.json(result.recordset);
});
```

### 2. **Frontend Service (Already Implemented)**

The `azure-sql.service.ts` calls this API:

```typescript
getDropdownOptions(optionType: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/dropdown-options/${optionType}`);
}
```

### 3. **Component (Already Implemented)**

The `home.ts` component loads dropdown options on initialization:

```typescript
ngOnInit(): void {
  this.loadDropdownOptions();
}

loadDropdownOptions(): void {
  // Load data source options
  this.azureSqlService.getDropdownOptions('dataSource').subscribe(
    options => this.dataSourceOptions = options
  );
  
  // Load other dropdowns...
}
```

### 4. **Template (Already Implemented)**

The `home.html` template binds the data:

```html
<select id="dataSource" [(ngModel)]="searchParams.dataSource">
  <option value="">--select--</option>
  <option *ngFor="let option of dataSourceOptions" [value]="option.value">
    {{ option.label }}
  </option>
</select>
```

## 📊 Database Tables Required

The dropdowns will populate from these tables:

### DataSourceOptions Table
```sql
CREATE TABLE DataSourceOptions (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Value NVARCHAR(100) NOT NULL,
    Label NVARCHAR(100) NOT NULL,
    IsActive BIT DEFAULT 1
);

INSERT INTO DataSourceOptions (Value, Label) VALUES 
('CAQH', 'CAQH'),
('Survey', 'Survey'),
('Manual', 'Manual Entry');
```

### Other Dropdown Tables
- **SurveyTypeOptions** - Survey types
- **TaskNameOptions** - Task names
- **TaskStatusOptions** - Task statuses
- **AssignedToOptions** - Users
- **WorkQueueOptions** - Work queues

## 🚀 How to Make Dropdowns Work

### Step 1: Create Database Tables

Run the SQL script to create all tables:

**File:** `DirectoryBlue/mock-backend/setup-database.sql`

**Using Azure Data Studio:**
1. Connect to: `serproviderinfo.database.windows.net`
2. Login: `mahi` / `Omsairam@2114`
3. Database: `providerinfo`
4. Open `setup-database.sql`
5. Click Run (F5)

**Using Azure Portal:**
1. Go to: https://portal.azure.com
2. Find database: `providerinfo`
3. Click "Query editor"
4. Login with credentials
5. Paste SQL script
6. Click Run

### Step 2: Verify Tables Created

Run this query to check:

```sql
SELECT name FROM sys.tables 
WHERE name IN ('DataSourceOptions', 'SurveyTypeOptions', 'TaskNameOptions', 
               'TaskStatusOptions', 'AssignedToOptions', 'WorkQueueOptions');
```

Should return 6 tables.

### Step 3: Verify Data Inserted

```sql
SELECT * FROM DataSourceOptions;
```

Should return:
| Id | Value | Label | IsActive |
|----|-------|-------|----------|
| 1 | CAQH | CAQH | 1 |
| 2 | Survey | Survey | 1 |
| 3 | Manual | Manual Entry | 1 |

### Step 4: Test the API

Open in browser:
```
http://localhost:3000/api/dropdown-options/dataSource
```

Should return:
```json
[
  {"value": "CAQH", "label": "CAQH"},
  {"value": "Survey", "label": "Survey"},
  {"value": "Manual", "label": "Manual Entry"}
]
```

### Step 5: Test in Application

1. Open: http://localhost:4200
2. Look at the "Data Source" dropdown
3. Should see: CAQH, Survey, Manual Entry

## 🧪 Testing All Dropdowns

### Test Each Dropdown API:

```bash
# Data Source
http://localhost:3000/api/dropdown-options/dataSource

# Survey Type
http://localhost:3000/api/dropdown-options/surveyType

# Task Name
http://localhost:3000/api/dropdown-options/taskName

# Task Status
http://localhost:3000/api/dropdown-options/taskStatus

# Assigned To
http://localhost:3000/api/dropdown-options/assignedTo

# Work Queue
http://localhost:3000/api/dropdown-options/workQueue
```

## 🔧 Troubleshooting

### Dropdown Shows Only "--select--"

**Cause:** Database tables not created or no data

**Solution:**
1. Run `setup-database.sql` script
2. Check browser console (F12) for errors
3. Verify backend is running: http://localhost:3000/api/health
4. Test API directly: http://localhost:3000/api/dropdown-options/dataSource

### API Returns Empty Array []

**Cause:** Table exists but no data

**Solution:**
Run the INSERT statements from `setup-database.sql`:

```sql
INSERT INTO DataSourceOptions (Value, Label) VALUES 
('CAQH', 'CAQH'),
('Survey', 'Survey'),
('Manual', 'Manual Entry');
```

### Error: "Cannot find table DataSourceOptions"

**Cause:** Table not created

**Solution:**
Run the CREATE TABLE statements from `setup-database.sql`

### CORS Error in Browser Console

**Cause:** Backend not running or CORS not enabled

**Solution:**
1. Ensure backend is running on port 3000
2. CORS is already enabled in `azure-server.js`
3. Restart backend server

## 📝 Adding More Options

To add more options to any dropdown:

```sql
-- Add new data source
INSERT INTO DataSourceOptions (Value, Label, IsActive) 
VALUES ('NewSource', 'New Source Name', 1);

-- Add new task status
INSERT INTO TaskStatusOptions (Value, Label, IsActive) 
VALUES ('OnHold', 'On Hold', 1);
```

The dropdown will automatically show the new options (may need to refresh page).

## 🎯 Current Implementation Status

✅ **Backend API** - Fully implemented in `azure-server.js`
✅ **Frontend Service** - Fully implemented in `azure-sql.service.ts`
✅ **Component Logic** - Fully implemented in `home.ts`
✅ **Template Binding** - Fully implemented in `home.html`
✅ **Database Schema** - Ready in `setup-database.sql`

**What's Missing:** Database tables need to be created by running the SQL script!

## 🚀 Quick Start

1. **Run SQL Script:**
   ```
   Open Azure Data Studio → Connect to database → Run setup-database.sql
   ```

2. **Verify Backend:**
   ```
   http://localhost:3000/api/dropdown-options/dataSource
   ```

3. **Check Frontend:**
   ```
   http://localhost:4200 → Data Source dropdown should have options
   ```

## ✨ Summary

The dropdown binding is **already fully implemented**! 

All you need to do is:
1. ✅ Run `setup-database.sql` to create tables
2. ✅ Tables will be populated with sample data
3. ✅ Dropdowns will automatically load data from database
4. ✅ No code changes needed!

**The application is ready - just create the database tables!** 🎉

---

**Created by**: Bob - AI Software Engineer  
**Date**: May 20, 2026  
**Status**: ✅ Implementation Complete - Waiting for Database Setup