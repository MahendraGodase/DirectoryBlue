# DirectoryBlue Application - Complete Guide with MCP Integration

## Slide 1: Title Slide
**DirectoryBlue**
*Angular Application with Azure SQL & MCP Integration*

- Modern Provider Information Management System
- Built with Angular 20.3.0
- Integrated with IBM Context Studio via MCP
- Presented by: Bob - AI Software Engineer

---

## Slide 2: Project Overview
**What is DirectoryBlue?**

- 🎯 **Purpose**: Provider information and outreach details management
- 💻 **Technology**: Angular 20.3.0 with TypeScript 5.9.2
- 🗄️ **Backend**: Azure SQL Database + Mock Server
- 🔌 **Integration**: IBM Context Studio via MCP (Model Context Protocol)
- 📱 **Design**: Responsive, modern UI with routing

---

## Slide 3: Key Features
**Application Capabilities**

1. **Search Inventory Management**
   - Search by NPI, Task ID, Data Source
   - Filter by Task Status, Survey Type
   - Date range filtering

2. **Import File Management**
   - File upload and processing
   - Bulk data import

3. **Inventory Views**
   - My Inventory
   - Survey Unassigned Inventory
   - CAQH Unassigned Inventory

4. **Bulk Operations**
   - Multi-select tasks
   - Bulk updates
   - Export to Excel

---

## Slide 4: Technology Stack
**Built with Modern Technologies**

**Frontend:**
- Angular 20.3.0 (Standalone Components)
- TypeScript 5.9.2
- RxJS 7.8.0
- Angular Router

**Backend:**
- Node.js 24.11.1
- Express.js
- Azure SQL Database
- Mock Backend Server (Development)

**Integration:**
- IBM Context Studio
- MCP (Model Context Protocol)
- JIRA Integration

---

## Slide 5: Architecture Overview
**System Architecture**

```
┌─────────────────────────────────────────┐
│         Angular Frontend                │
│         (Port 4200)                     │
│  - Home, Admin, Reports, Timekeeper    │
│  - Search & Inventory Management       │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               ▼
┌─────────────────────────────────────────┐
│      Backend Server (Port 3000)         │
│  - Express.js REST API                  │
│  - Mock Data / Azure SQL                │
└──────────────┬──────────────────────────┘
               │
               ├──────────────┬─────────────┐
               ▼              ▼             ▼
        ┌──────────┐   ┌──────────┐  ┌──────────┐
        │ Azure SQL│   │   JIRA   │  │   MCP    │
        │ Database │   │ Service  │  │ Gateway  │
        └──────────┘   └──────────┘  └──────────┘
```

---

## Slide 6: MCP Integration - What is MCP?
**Model Context Protocol (MCP)**

**Definition:**
- Standardized protocol for AI tools to connect with external services
- Enables seamless integration between Cline and IBM Context Studio

**Benefits:**
- 🔗 Unified interface for external tools
- 🔐 Secure authentication
- 📊 Access to IBM Context Studio resources
- 🛠️ Execute Context Studio tools directly

**Use Cases:**
- Query IBM services
- Access Context Studio data
- Execute automated workflows
- Integrate AI capabilities

---

## Slide 7: MCP Configuration - Step 1
**Setting Up MCP in Cline**

**Method 1: Through Cline Settings (Recommended)**

1. Open VS Code
2. Click Cline icon in sidebar
3. Click Settings (⚙️) button
4. Navigate to "MCP Servers" section
5. Click "Edit MCP Settings" or "Add MCP Server"

**Server Details:**
- **Name**: context-studio
- **Type**: streamable-http
- **URL**: IBM Context Studio MCP Gateway
- **Authentication**: Bearer Token + API Key

---

## Slide 8: MCP Configuration - Step 2
**Configuration JSON**

```json
{
  "mcpServers": {
    "context-studio": {
      "type": "streamable-http",
      "url": "https://servicesessentials.ibm.com/mcp-gateway/...",
      "headers": {
        "Authorization": "Bearer [JWT_TOKEN]",
        "x-api-key": "ctx_b7893df16d01"
      },
      "disabled": false
    }
  }
}
```

**Key Components:**
- JWT Token for authentication
- API Key: `ctx_b7893df16d01`
- Enabled status

---

## Slide 9: MCP Permissions
**Available Permissions**

Your MCP token provides access to:

✅ `gateways.read` - Read gateway information
✅ `servers.read` - Read server configurations
✅ `servers.use` - Use MCP servers
✅ `tools.read` - Read available tools
✅ `tools.execute` - Execute tools
✅ `teams.read` - Read team information
✅ `resources.read` - Access resources
✅ `prompts.read` - Read prompts

**Token Validity:**
- Issued: January 23, 2025
- Expires: June 20, 2026

---

## Slide 10: Prerequisites
**Before You Start**

**Required Software:**
- ✅ Node.js v18.19 or higher
- ✅ npm v9.0 or higher
- ✅ Angular CLI v20.3.10
- ✅ VS Code with Cline extension
- ✅ PowerShell (Windows)

**Verification Commands:**
```bash
node --version    # Should show v18+
npm --version     # Should show v9+
ng version        # Should show Angular CLI
```

---

## Slide 11: Installation - Step 1
**Install Dependencies**

**Backend Dependencies:**
```bash
cd DirectoryBlue/mock-backend
npm install
```

**Installs:**
- express (REST API framework)
- cors (Cross-Origin Resource Sharing)
- mssql (Azure SQL driver)
- dotenv (Environment variables)
- jira-client (JIRA integration)

---

## Slide 12: Installation - Step 2
**Frontend Dependencies**

```bash
cd DirectoryBlue
npm install
```

**Installs:**
- @angular/core, @angular/common
- @angular/router (Routing)
- @angular/forms (Form handling)
- rxjs (Reactive programming)
- TypeScript compiler
- Angular CLI tools

---

## Slide 13: Starting the Application - Backend
**Step 1: Start Backend Server**

**Command:**
```bash
cd DirectoryBlue/mock-backend
npm start
```

**Expected Output:**
```
🚀 Mock Backend Server Started Successfully!
📡 Server running at: http://localhost:3000
✅ Ready to accept requests from Angular app
```

**Keep this terminal running!**

**Health Check:**
Visit: `http://localhost:3000/api/health`

---

## Slide 14: Starting the Application - Frontend
**Step 2: Start Angular Application**

**Command:**
```bash
cd DirectoryBlue
npm start
```

**Expected Output:**
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully.
```

**Access Application:**
Open browser: `http://localhost:4200`

**Features:**
- Hot reload enabled
- Auto-refresh on code changes
- Source maps for debugging

---

## Slide 15: Application Interface
**Main Dashboard**

**Navigation Bar:**
- 🏠 Home
- 👤 Admin
- 📊 Reports
- ⏰ Timekeeper
- 📋 Associate RE Dashboard

**Welcome Message:**
"Hello, [User Name]!"

**Tabs:**
1. Search Inventory
2. Import File Management
3. My Inventory
4. Survey Unassigned Inventory
5. CAQH Unassigned Inventory

---

## Slide 16: Search Functionality
**Search Parameters**

**Available Filters:**
- 📝 **NPI**: National Provider Identifier
- 🆔 **Task ID**: Specific task identifier
- 📊 **Data Source**: CAQH, Survey, Manual
- 📅 **Outbound File Dates**: From/To date range
- 🔍 **Search By**: Task or Provider
- 📋 **Survey Type**: Various survey types
- 👤 **Provider ID**: Provider identifier
- 💼 **Corporate Receipt Dates**: Date filtering

**Actions:**
- Submit Search
- Clear Filter
- Export Results

---

## Slide 17: Mock Data Available
**Sample Test Data**

| Task ID | NPI | Provider Name | Status | Data Source |
|---------|-----|---------------|--------|-------------|
| TSK001 | 1234567890 | Dr. John Smith | In Progress | CAQH |
| TSK002 | 0987654321 | Dr. Jane Doe | Pending | Survey |
| TSK003 | 1122334455 | Dr. Robert Johnson | Completed | CAQH |
| TSK004 | 5566778899 | Dr. Sarah Williams | In Progress | Manual |
| TSK005 | 9988776655 | Dr. Michael Brown | Cancelled | Survey |

**Test Scenarios:**
- Search all tasks (empty search)
- Search by specific NPI
- Filter by data source
- Filter by task status

---

## Slide 18: Testing the Application
**Test Cases**

**1. Search All Tasks:**
- Click "Submit" without criteria
- Should display 5 mock tasks

**2. Search by NPI:**
- Enter: `1234567890`
- Should display: Dr. John Smith

**3. Filter by Data Source:**
- Select: "CAQH"
- Should display: 2 tasks

**4. Filter by Status:**
- Select: "In Progress"
- Should display: 2 tasks

**5. Clear Filter:**
- Click "Clear Filter"
- All fields reset

---

## Slide 19: Bulk Operations
**Multi-Task Management**

**Selection:**
- ☑️ Individual task checkboxes
- ☑️ Header checkbox (select all)

**Operations:**
- 🔄 **Bulk Update**: Update multiple tasks
- 📤 **Export to Excel**: Export selected data
- 🗑️ **Bulk Delete**: Remove multiple tasks

**Workflow:**
1. Select tasks using checkboxes
2. Choose operation from toolbar
3. Confirm action
4. View success message

---

## Slide 20: Project Structure
**File Organization**

```
DirectoryBlue/
├── src/
│   ├── app/
│   │   ├── home/          # Home component
│   │   ├── about/         # About component
│   │   ├── contact/       # Contact component
│   │   ├── models/        # Data models
│   │   ├── services/      # API services
│   │   └── app.routes.ts  # Routing config
│   ├── environments/      # Environment configs
│   └── styles.css         # Global styles
├── mock-backend/
│   ├── server.js          # Mock server
│   ├── azure-server.js    # Azure SQL server
│   └── jira-service.js    # JIRA integration
└── .bob/
    └── mcp.json           # MCP configuration
```

---

## Slide 21: Routing Configuration
**Angular Routes**

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect | → `/home` |
| `/home` | HomeComponent | Landing page |
| `/about` | AboutComponent | About page |
| `/contact` | ContactComponent | Contact page |
| `**` | Redirect | 404 handler → `/home` |

**Features:**
- Client-side routing
- Active route highlighting
- Lazy loading ready
- Route guards support

---

## Slide 22: Environment Configuration
**Development vs Production**

**Development (`environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiEndpoint: 'http://localhost:3000/api'
};
```

**Production (`environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiEndpoint: 'https://your-azure-function.azurewebsites.net/api'
};
```

**Usage:**
- Automatic environment switching
- Build-time configuration
- Secure API endpoints

---

## Slide 23: Azure SQL Integration
**Database Setup**

**Connection Configuration:**
- Server: Azure SQL Server
- Database: ProviderInfo
- Authentication: Azure AD / SQL Auth
- Connection pooling enabled

**Tables:**
- `OutreachDetails`: Provider outreach data
- `Tasks`: Task management
- `Providers`: Provider information
- `AuditLog`: Activity tracking

**Features:**
- Secure connections
- Connection retry logic
- Query optimization
- Transaction support

---

## Slide 24: JIRA Integration
**Issue Tracking Integration**

**Capabilities:**
- 📝 Create JIRA issues from tasks
- 🔄 Sync task status with JIRA
- 📊 Track progress in JIRA
- 🔗 Link tasks to JIRA tickets

**Configuration:**
```javascript
{
  host: 'your-domain.atlassian.net',
  username: 'email@example.com',
  apiToken: 'your-api-token',
  protocol: 'https'
}
```

**Workflow:**
1. Task created in DirectoryBlue
2. Automatically creates JIRA issue
3. Status syncs bidirectionally
4. Comments and updates tracked

---

## Slide 25: API Endpoints
**Backend REST API**

**Search & Retrieve:**
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks/search` - Search with filters

**CRUD Operations:**
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

**Bulk Operations:**
- `POST /api/tasks/bulk-update` - Update multiple
- `POST /api/tasks/export` - Export data

**Health Check:**
- `GET /api/health` - Server status

---

## Slide 26: Security Features
**Application Security**

**Authentication:**
- 🔐 Azure AD integration ready
- 🎫 JWT token support
- 👤 User session management

**Authorization:**
- 🛡️ Role-based access control
- 📋 Permission management
- 🔒 Route guards

**Data Security:**
- 🔒 HTTPS enforcement
- 🔑 API key validation
- 🛡️ SQL injection prevention
- 🚫 CORS configuration

**Best Practices:**
- Environment variables for secrets
- Token rotation
- Audit logging

---

## Slide 27: Troubleshooting - Common Issues
**Problem Resolution**

**Issue 1: Port Already in Use**
```bash
# Error: EADDRINUSE :::3000
# Solution: Kill process or use different port
netstat -ano | findstr :3000
taskkill /PID [process_id] /F
```

**Issue 2: Module Not Found**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue 3: CORS Errors**
- Verify backend is running
- Check CORS configuration
- Restart both servers

---

## Slide 28: Troubleshooting - MCP Issues
**MCP Connection Problems**

**Server Not Showing:**
- ✅ Verify JSON syntax
- ✅ Check URL accessibility
- ✅ Validate token
- ✅ Restart VS Code

**Authentication Errors:**
- **401 Unauthorized**: Token expired
- **403 Forbidden**: Invalid API key
- **Network Error**: Check VPN/network

**Token Refresh:**
1. Get new token from IBM Context Studio
2. Update Authorization header
3. Restart Cline

---

## Slide 29: Development Workflow
**Best Practices**

**1. Start Development:**
```bash
# Terminal 1: Backend
cd mock-backend && npm start

# Terminal 2: Frontend
cd DirectoryBlue && npm start
```

**2. Make Changes:**
- Edit TypeScript/HTML/CSS files
- Auto-reload in browser
- Check console for errors

**3. Test Changes:**
- Use browser DevTools
- Check network requests
- Verify API responses

**4. Commit Code:**
```bash
git add .
git commit -m "Description"
git push
```

---

## Slide 30: Building for Production
**Production Deployment**

**Build Command:**
```bash
npm run build
```

**Output:**
- Location: `dist/directory-blue/`
- Optimized bundles
- Minified code
- Source maps (optional)

**Deployment Options:**
1. **Azure Static Web Apps**
2. **Azure App Service**
3. **AWS S3 + CloudFront**
4. **Netlify / Vercel**

**Post-Build:**
- Update environment.prod.ts
- Configure Azure SQL connection
- Set up CI/CD pipeline

---

## Slide 31: Performance Optimization
**Speed & Efficiency**

**Frontend Optimization:**
- 🚀 Lazy loading modules
- 📦 Code splitting
- 🗜️ Bundle size optimization
- 💾 Caching strategies

**Backend Optimization:**
- 🔄 Connection pooling
- 📊 Query optimization
- 💨 Response compression
- 🎯 API rate limiting

**Monitoring:**
- Application Insights
- Performance metrics
- Error tracking
- User analytics

---

## Slide 32: Future Enhancements
**Roadmap**

**Phase 1: Core Features**
- ✅ Search functionality
- ✅ Bulk operations
- ✅ Export capabilities
- 🔄 Advanced filtering

**Phase 2: Integration**
- 🔄 Full Azure SQL integration
- 🔄 JIRA automation
- 🔄 Email notifications
- 🔄 Document management

**Phase 3: Advanced Features**
- 📱 Mobile app
- 🤖 AI-powered insights
- 📊 Advanced analytics
- 🔔 Real-time notifications

---

## Slide 33: Testing Strategy
**Quality Assurance**

**Unit Tests:**
```bash
npm test
```
- Component testing
- Service testing
- Pipe testing

**E2E Tests:**
```bash
ng e2e
```
- User flow testing
- Integration testing

**Manual Testing:**
- Browser compatibility
- Responsive design
- Accessibility (WCAG)
- Performance testing

**Tools:**
- Jasmine, Karma
- Protractor
- Lighthouse
- BrowserStack

---

## Slide 34: Documentation Resources
**Learning & Support**

**Official Documentation:**
- 📚 Angular Docs: https://angular.dev
- 📘 TypeScript: https://typescriptlang.org
- 🔷 Azure: https://docs.microsoft.com/azure

**Project Documentation:**
- `README.md` - Quick start guide
- `PROJECT_DOCUMENTATION.md` - Detailed docs
- `START_APPLICATION.md` - Setup guide
- `MCP_CONFIGURATION_GUIDE.md` - MCP setup

**Community:**
- Stack Overflow
- Angular Discord
- GitHub Issues

---

## Slide 35: Best Practices
**Development Standards**

**Code Quality:**
- ✅ TypeScript strict mode
- ✅ ESLint configuration
- ✅ Prettier formatting
- ✅ Code reviews

**Git Workflow:**
- Feature branches
- Pull requests
- Semantic commits
- Version tagging

**Security:**
- No secrets in code
- Environment variables
- Regular dependency updates
- Security audits

**Documentation:**
- Code comments
- API documentation
- README updates
- Change logs

---

## Slide 36: Team Collaboration
**Working Together**

**Version Control:**
- Git repository
- Branch protection
- Code reviews
- Merge strategies

**Communication:**
- Daily standups
- Sprint planning
- Retrospectives
- Documentation

**Tools:**
- VS Code + Cline
- Git + GitHub
- JIRA for tracking
- Slack/Teams for chat

**Knowledge Sharing:**
- Code documentation
- Wiki pages
- Tech talks
- Pair programming

---

## Slide 37: Monitoring & Maintenance
**Production Support**

**Monitoring:**
- 📊 Application Insights
- 🔍 Error tracking (Sentry)
- 📈 Performance metrics
- 👥 User analytics

**Maintenance:**
- Regular updates
- Security patches
- Dependency updates
- Database optimization

**Backup Strategy:**
- Daily database backups
- Code repository backups
- Configuration backups
- Disaster recovery plan

---

## Slide 38: Cost Optimization
**Azure Resources**

**Current Costs:**
- Azure SQL Database: ~$5-50/month
- Azure App Service: ~$10-100/month
- Storage: ~$1-10/month

**Optimization Tips:**
- Use appropriate tier
- Auto-scaling
- Reserved instances
- Monitor usage

**Free Tier Options:**
- Azure Free Account
- Development/Test pricing
- Student benefits

---

## Slide 39: Quick Reference
**Essential Commands**

**Start Application:**
```bash
# Backend
cd mock-backend && npm start

# Frontend
npm start
```

**Build:**
```bash
npm run build
```

**Test:**
```bash
npm test
```

**Access:**
- Frontend: http://localhost:4200
- Backend: http://localhost:3000
- Health: http://localhost:3000/api/health

---

## Slide 40: Summary & Next Steps
**Key Takeaways**

**What We Covered:**
✅ DirectoryBlue application overview
✅ MCP integration with IBM Context Studio
✅ Complete setup and installation
✅ Running and testing the application
✅ Architecture and features
✅ Troubleshooting and best practices

**Next Steps:**
1. ✅ Application is running
2. 🔄 Test all features
3. 🔄 Configure Azure SQL (production)
4. 🔄 Set up CI/CD pipeline
5. 🔄 Deploy to production

**Questions?**
Contact: Bob - Your AI Software Engineer

---

## Slide 41: Thank You!
**DirectoryBlue - Ready for Production**

🎉 **Application Status:** Running Successfully
🚀 **Frontend:** http://localhost:4200
📡 **Backend:** http://localhost:3000
🔌 **MCP:** Connected to IBM Context Studio

**Resources:**
- Documentation: See project docs
- Support: Check troubleshooting guide
- Updates: Follow project repository

**Happy Coding! 💻**

---

*Presentation created by Bob - AI Software Engineer*
*Last Updated: May 29, 2026*