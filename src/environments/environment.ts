export const environment = {
  production: false,
  azureSql: {
    // Local mock backend server
    apiEndpoint: 'http://localhost:3000/api',
    apiKey: '', // Not needed for local mock server
  },
  // For production, replace with actual Azure SQL configuration:
  // apiEndpoint: 'https://your-azure-function.azurewebsites.net/api',
  azureSqlConfig: {
    server: 'localhost',
    database: 'mock-database',
    // Authentication is handled by backend API
  }
};

// Made with Bob
