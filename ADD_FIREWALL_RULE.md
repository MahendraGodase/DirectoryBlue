# Add Your IP Address to Azure SQL Firewall

Your current IP address **223.233.85.183** needs to be added to the Azure SQL firewall to allow connections.

## Option 1: Using Azure Portal (Recommended - Easiest)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to your SQL Server**:
   - Search for "SQL servers" in the top search bar
   - Click on your server: **serproviderinfo**
3. **Add Firewall Rule**:
   - In the left menu, click on **"Networking"** or **"Firewalls and virtual networks"**
   - Click **"Add client IP"** button (this will automatically add your current IP)
   - Or manually add a rule:
     - Rule name: `MyCurrentIP` or `Office`
     - Start IP: `223.233.85.183`
     - End IP: `223.233.85.183`
   - Click **"Save"** at the top
4. **Wait 1-2 minutes** for the changes to take effect

## Option 2: Using Azure CLI (If you install it)

### Install Azure CLI:
Download from: https://aka.ms/installazurecliwindows

### After installation, run these commands:

```bash
# Login to Azure
az login

# Add firewall rule
az sql server firewall-rule create \
  --resource-group <your-resource-group> \
  --server serproviderinfo \
  --name AllowMyIP \
  --start-ip-address 223.233.85.183 \
  --end-ip-address 223.233.85.183
```

## Option 3: Using SQL Server Management Studio (SSMS)

1. Open SSMS
2. Try to connect to: `serproviderinfo.database.windows.net`
3. When connection fails, SSMS will show a dialog with option to add your IP
4. Click **"Sign in"** and it will automatically add your IP to the firewall

## After Adding Firewall Rule

Once you've added your IP address to the firewall:

1. **Stop the current mock server** (close Terminal 2 or press Ctrl+C)
2. **Start the Azure SQL server**:
   ```bash
   cd mock-backend
   npm run start-azure
   ```
3. The application will now connect to the real Azure SQL Database
4. Dropdown values will be loaded from the database tables

## Verify Connection

After starting the Azure SQL server, check:
- Health endpoint: http://localhost:3000/api/health
- Should show: "Connected to Azure SQL Database"

## Troubleshooting

If you still can't connect after adding the firewall rule:
1. Wait 2-3 minutes for Azure to apply the changes
2. Verify your IP hasn't changed (check: https://whatismyipaddress.com/)
3. Check that the credentials in `.env` file are correct
4. Ensure the database `providerinfo` exists on the server

---

**Your Current Configuration:**
- Server: serproviderinfo.database.windows.net
- Database: providerinfo
- User: mahi
- Your IP: 223.233.85.183
