# Web App Features - Task Inventory Management System

## Overview

This Angular web application integrates with Azure SQL Database to provide a comprehensive task inventory management system with advanced search capabilities.

## Key Features

### 1. Search Functionality
- **Multi-parameter Search**: Search by NPI, Task ID, Provider ID, Data Source, and more
- **Date Range Filtering**: Filter by Outbound File Date and Corporate Receipt Date
- **Dynamic Dropdowns**: Populated from Azure SQL Database
- **Real-time Search**: Click Submit button to search data from Azure SQL
- **Clear Filters**: Reset all search parameters with one click

### 2. Data Display
- **Responsive Data Table**: Displays search results in a sortable table
- **Column Headers**: Data Source, Task ID, Case ID, NPI, Provider ID, Provider Name, Title, Task Name, Task Status, Task Age, CRD, Work Queue
- **Status Badges**: Color-coded status indicators
- **Row Selection**: Select individual or all rows for bulk operations

### 3. Bulk Operations
- **Bulk Update**: Update multiple tasks simultaneously
- **Export to Excel**: Export search results to Excel file
- **Selection Counter**: Shows number of selected tasks

### 4. User Interface
- **Welcome Banner**: Personalized greeting
- **Tab Navigation**: Multiple inventory views (Search, Import, My Inventory, etc.)
- **Loading Indicators**: Visual feedback during data operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Technical Implementation

### Frontend (Angular)
- **Component**: `Home` component handles all search functionality
- **Service**: `AzureSqlService` manages API communication
- **Models**: TypeScript interfaces for type safety
- **Forms**: Two-way data binding with ngModel
- **HTTP Client**: Angular HttpClient for API calls

### Backend (Azure Functions)
- **Search API**: GET endpoint for searching tasks
- **Dropdown API**: GET endpoint for dropdown options
- **Bulk Update API**: POST endpoint for updating multiple tasks
- **Export API**: GET endpoint for Excel export

### Database (Azure SQL)
- **Tasks Table**: Main table storing task data
- **Dropdown Tables**: Separate tables for each dropdown option
- **Indexes**: Optimized for fast searching
- **Sample Data**: Pre-populated for testing

## How to Use

### 1. Search for Tasks

1. Enter search criteria in any of the fields:
   - **NPI**: Enter one or more NPI numbers (comma-separated)
   - **Data Source**: Select from dropdown
   - **Task ID**: Enter one or more Task IDs
   - **Provider ID**: Enter one or more Provider IDs
   - **Date Ranges**: Select from and to dates
   - **Task Status**: Select from dropdown
   - **Task Name**: Select from dropdown
   - **Assigned To**: Select from dropdown
   - **Work Queue**: Select from dropdown

2. Click the **Submit** button to search

3. Results will appear in the table below

### 2. Clear Filters

Click the **Clear Filter** button to reset all search parameters to default values.

### 3. Select Tasks

- Click individual checkboxes to select specific tasks
- Click the header checkbox to select/deselect all tasks
- Selected count is displayed in the bulk update section

### 4. Bulk Update

1. Select one or more tasks using checkboxes
2. Click the **Bulk Update** button
3. Update dialog will appear (to be implemented)
4. Confirm changes

### 5. Export to Excel

1. Perform a search to get results
2. Click the **Export To Excel** button
3. Excel file will download automatically

## API Integration

### Search Endpoint

```
GET /api/search-tasks
```

**Query Parameters:**
- `npi`: NPI number(s)
- `dataSource`: Data source filter
- `taskId`: Task ID(s)
- `providerId`: Provider ID(s)
- `outboundFileFromDate`: Start date
- `outboundFileToDate`: End date
- `taskStatus`: Task status filter
- `taskName`: Task name filter
- `assignedTo`: Assigned user filter
- `workQueue`: Work queue filter

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "dataSource": "CAQH",
      "taskId": "TSK001",
      "caseId": "CASE001",
      "npi": "1234567890",
      "providerId": "PRV001",
      "providerName": "Dr. John Smith",
      "title": "MD",
      "taskName": "Initial Survey",
      "taskStatus": "In Progress",
      "taskAge": 15,
      "crd": "2026-05-30",
      "workQueue": "Queue A"
    }
  ],
  "totalRecords": 1
}
```

### Dropdown Options Endpoint

```
GET /api/dropdown-options/{optionType}
```

**Option Types:**
- `dataSource`
- `surveyType`
- `taskName`
- `taskStatus`
- `assignedTo`
- `workQueue`

**Response:**
```json
[
  {
    "value": "CAQH",
    "label": "CAQH"
  },
  {
    "value": "Survey",
    "label": "Survey"
  }
]
```

## Configuration

### Environment Variables

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  azureSql: {
    apiEndpoint: 'https://your-function-app.azurewebsites.net/api',
  }
};
```

### Azure SQL Connection

Configure in Azure Functions application settings:
- `SQL_USER`: Database username
- `SQL_PASSWORD`: Database password
- `SQL_SERVER`: Server name
- `SQL_DATABASE`: Database name

## Development

### Install Dependencies

```bash
cd DirectoryBlue
npm install
```

### Run Development Server

```bash
npm start
```

Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

## Testing

### Unit Tests

```bash
npm test
```

### End-to-End Tests

```bash
npm run e2e
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Lazy Loading**: Components loaded on demand
- **Optimized Queries**: Database indexes for fast searches
- **Caching**: Dropdown options cached in memory
- **Pagination**: Large result sets paginated (to be implemented)

## Security

- **HTTPS Only**: All API calls use HTTPS
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Restricted to allowed origins
- **Authentication**: Azure AD integration (recommended for production)

## Future Enhancements

1. **Advanced Search**: Additional search criteria
2. **Sorting**: Click column headers to sort
3. **Pagination**: Navigate through large result sets
4. **Filtering**: Client-side filtering of results
5. **Task Details**: Click row to view full task details
6. **Inline Editing**: Edit tasks directly in the table
7. **Notifications**: Real-time updates via SignalR
8. **Reports**: Generate custom reports
9. **Dashboard**: Visual analytics and charts
10. **User Management**: Role-based access control

## Troubleshooting

### No Data Displayed

1. Check browser console for errors
2. Verify API endpoint in environment.ts
3. Ensure Azure Functions are running
4. Check database has sample data
5. Verify firewall rules allow connection

### Search Not Working

1. Check network tab in browser DevTools
2. Verify API response format
3. Check for CORS errors
4. Ensure all required fields are valid

### Slow Performance

1. Check database indexes
2. Optimize queries
3. Implement pagination
4. Enable caching
5. Use CDN for static assets

## Support

For issues or questions:
1. Check the documentation
2. Review Azure SQL Setup Guide
3. Check application logs
4. Contact system administrator

---

**Version**: 1.0.0  
**Last Updated**: May 14, 2026  
**Created by**: Bob - AI Software Engineer