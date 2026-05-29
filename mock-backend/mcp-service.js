const axios = require('axios');

/**
 * MCP Context Studio Service
 * Integrates with IBM Context Studio via MCP Gateway
 */
class MCPService {
  constructor() {
    this.baseUrl = 'https://servicesessentials.ibm.com/mcp-gateway/service/gateway/servers/8ccdd203bdee4014b08e82eedb6046e2/mcp';
    // Updated credentials from user's MCP configuration
    this.apiKey = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbEFkZHJlc3MiOiJNYWhlbmRyYS5Hb2Rhc2VAaWJtLmNvbSIsInRlYW1JZCI6IjZhMGVlN2EwMGYzMDU3MTk1YzIwYzYzNSIsImNvbnRleHRJZCI6ImN0eF80YzBiYmVkOTIzMDAiLCJpYXQiOjE3ODAwMzYzNjcsImV4cCI6MTc4MjYyODM2NywiaXNzIjoiY29udGV4dC1icm9rZXIiLCJ0b2tlbl9pZCI6ImRiOTlmOGVlLWNkZjUtNGEzNi1hY2EzLWEyMWEwNmJiMTMwNCJ9.lL6wnELtQ5iig57sBJdsl-zE5mNlzcP2qpv0hrTDZyFYfqIivj_bAN_LZkbWqxHzPAtRsxAGfwsxNA9BOxNxQg';
    this.authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb250ZXh0LXN0dWRpby11c2VyQGV4YW1wbGUuY29tIiwianRpIjoiZmQ3Y2M5YjAtM2ExZC00YTkwLWEzNDAtYzBiM2Q2YzU5M2Y2IiwidG9rZW5fdXNlIjoiYXBpIiwiaWF0IjoxNzgwMDM2MzY3LCJpc3MiOiJtY3BnYXRld2F5IiwiYXVkIjoibWNwZ2F0ZXdheS1hcGkiLCJ1c2VyIjp7ImVtYWlsIjoiY29udGV4dC1zdHVkaW8tdXNlckBleGFtcGxlLmNvbSIsImZ1bGxfbmFtZSI6IkFQSSBUb2tlbiBVc2VyIiwiaXNfYWRtaW4iOmZhbHNlLCJhdXRoX3Byb3ZpZGVyIjoiYXBpX3Rva2VuIn0sInRlYW1zIjpbIjVhYTNiZDhkNDUxMDRlNzVhZDdhMzBjYTAzOTEyYzIwIl0sInNjb3BlcyI6eyJzZXJ2ZXJfaWQiOiI4Y2NkZDIwM2JkZWU0MDE0YjA4ZTgyZWVkYjYwNDZlMiIsInBlcm1pc3Npb25zIjpbImdhdGV3YXlzLnJlYWQiLCJzZXJ2ZXJzLnJlYWQiLCJzZXJ2ZXJzLnVzZSIsInRvb2xzLnJlYWQiLCJ0b29scy5leGVjdXRlIiwidGVhbXMucmVhZCIsInJlc291cmNlcy5yZWFkIiwicHJvbXB0cy5yZWFkIl0sImlwX3Jlc3RyaWN0aW9ucyI6W10sInRpbWVfcmVzdHJpY3Rpb25zIjp7fX0sImV4cCI6MTc4MjYyODM2N30.tk0LqUlS1nE2sqJmfWTXqBk_kgCzTr_G06dpc1A-qSk';
    this.contextId = 'ctx_4c0bbed92300'; // From x-api-key JWT payload
    this.agentPersona = 'DirectoryBlueAgent';
  }

  /**
   * Get headers for MCP requests
   */
  getHeaders() {
    return {
      'Authorization': this.authToken,
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Query MCP Context Studio using vector search
   * @param {string} query - Search query
   * @param {number} topK - Number of results
   */
  async vectorQuery(query, topK = 10) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tools/context-broker-vector-query`,
        {
          context_id: this.contextId,
          AgentPersona: this.agentPersona,
          query: query,
          top_k: topK
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('MCP Vector Query Error:', error.message);
      return { results: [] };
    }
  }

  /**
   * Query MCP Context Studio using graph search
   * @param {string} query - Search query
   */
  async graphQuery(query) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tools/context-broker-graph-query`,
        {
          context_id: this.contextId,
          AgentPersona: this.agentPersona,
          query: query,
          max_depth: 1,
          limit: 5
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('MCP Graph Query Error:', error.message);
      return { results: [] };
    }
  }

  /**
   * Hybrid query combining vector and graph search
   * @param {string} query - Search query
   */
  async hybridQuery(query) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tools/context-broker-hybrid-query`,
        {
          context_id: this.contextId,
          AgentPersona: this.agentPersona,
          query: query,
          sources: ['vector', 'graph'],
          vector_params: { top_k: 5 },
          graph_params: { max_depth: 1, limit: 5 }
        },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('MCP Hybrid Query Error:', error.message);
      return { results: [] };
    }
  }

  /**
   * Get available contexts
   */
  async getContexts() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/tools/context-broker-get-contexts`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('MCP Get Contexts Error:', error.message);
      return { contexts: [] };
    }
  }

  /**
   * Transform MCP results to task format
   * @param {Array} results - MCP query results
   */
  transformToTasks(results) {
    if (!results || !Array.isArray(results)) {
      return [];
    }

    return results.map((result, index) => ({
      id: index + 1,
      dataSource: 'MCP Context Studio',
      taskId: `MCP-${String(index + 1).padStart(3, '0')}`,
      caseId: result.id || `CASE-${index + 1}`,
      npi: result.npi || 'N/A',
      providerId: result.provider_id || `PRV-${index + 1}`,
      providerName: result.provider_name || result.title || 'Unknown Provider',
      title: result.title || 'N/A',
      taskName: result.task_name || result.type || 'MCP Query Result',
      taskStatus: result.status || 'Retrieved',
      taskAge: result.age || 0,
      crd: result.date || new Date().toISOString().split('T')[0],
      workQueue: result.queue || 'MCP Queue',
      mcpScore: result.score || 0,
      mcpContent: result.content || result.text || ''
    }));
  }

  /**
   * Get mock MCP data (simulates Context Studio response)
   * This provides sample data until Context Studio is configured
   */
  getMockMCPData() {
    return [
      {
        '@id': 'mcp://context-studio/provider/1',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-001',
        caseId: 'MCP-CASE-001',
        npi: '1234567890',
        providerId: 'MCP-PRV-001',
        providerName: 'Dr. John Smith (MCP)',
        title: 'MD',
        taskName: 'Initial Credentialing',
        taskStatus: 'In Progress',
        taskAge: 12,
        crd: '2026-06-15',
        workQueue: 'MCP Queue A'
      },
      {
        '@id': 'mcp://context-studio/provider/2',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-002',
        caseId: 'MCP-CASE-002',
        npi: '0987654321',
        providerId: 'MCP-PRV-002',
        providerName: 'Dr. Jane Doe (MCP)',
        title: 'DO',
        taskName: 'Re-credentialing',
        taskStatus: 'Pending Review',
        taskAge: 8,
        crd: '2026-06-20',
        workQueue: 'MCP Queue B'
      },
      {
        '@id': 'mcp://context-studio/provider/3',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-003',
        caseId: 'MCP-CASE-003',
        npi: '1122334455',
        providerId: 'MCP-PRV-003',
        providerName: 'Dr. Robert Johnson (MCP)',
        title: 'MD',
        taskName: 'Data Verification',
        taskStatus: 'Completed',
        taskAge: 25,
        crd: '2026-05-10',
        workQueue: 'MCP Queue A'
      },
      {
        '@id': 'mcp://context-studio/provider/4',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-004',
        caseId: 'MCP-CASE-004',
        npi: '5566778899',
        providerId: 'MCP-PRV-004',
        providerName: 'Dr. Sarah Williams (MCP)',
        title: 'MD',
        taskName: 'License Verification',
        taskStatus: 'In Progress',
        taskAge: 5,
        crd: '2026-06-25',
        workQueue: 'MCP Queue C'
      },
      {
        '@id': 'mcp://context-studio/provider/5',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-005',
        caseId: 'MCP-CASE-005',
        npi: '9988776655',
        providerId: 'MCP-PRV-005',
        providerName: 'Dr. Michael Brown (MCP)',
        title: 'DO',
        taskName: 'Background Check',
        taskStatus: 'Pending',
        taskAge: 3,
        crd: '2026-06-30',
        workQueue: 'MCP Queue B'
      },
      {
        '@id': 'mcp://context-studio/provider/6',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-006',
        caseId: 'MCP-CASE-006',
        npi: '1357924680',
        providerId: 'MCP-PRV-006',
        providerName: 'Dr. Emily Davis (MCP)',
        title: 'MD',
        taskName: 'Specialty Verification',
        taskStatus: 'In Progress',
        taskAge: 18,
        crd: '2026-06-05',
        workQueue: 'MCP Queue A'
      },
      {
        '@id': 'mcp://context-studio/provider/7',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-007',
        caseId: 'MCP-CASE-007',
        npi: '2468013579',
        providerId: 'MCP-PRV-007',
        providerName: 'Dr. David Wilson (MCP)',
        title: 'DO',
        taskName: 'Insurance Verification',
        taskStatus: 'Completed',
        taskAge: 40,
        crd: '2026-04-20',
        workQueue: 'MCP Queue C'
      },
      {
        '@id': 'mcp://context-studio/provider/8',
        '@type': 'ProviderTask',
        dataSource: 'MCP Context Studio',
        taskId: 'MCP-TSK-008',
        caseId: 'MCP-CASE-008',
        npi: '3691472580',
        providerId: 'MCP-PRV-008',
        providerName: 'Dr. Lisa Anderson (MCP)',
        title: 'MD',
        taskName: 'Hospital Privileges',
        taskStatus: 'Pending Review',
        taskAge: 10,
        crd: '2026-06-18',
        workQueue: 'MCP Queue B'
      }
    ];
  }

  /**
   * Search tasks using MCP
   * @param {Object} searchParams - Search parameters
   */
  async searchTasks(searchParams) {
    try {
      console.log('🔌 Querying REAL MCP Context Studio API for Task nodes...');
      
      // Query specifically for Task nodes from the CSV
      const query = 'provider task NPI credentialing survey status';
      console.log('MCP Query:', query);

      // Use graph query to get Task nodes with all properties
      let mcpResults;
      try {
        const response = await axios.post(
          `${this.baseUrl}/tools/context-broker-graph-query`,
          {
            context_id: this.contextId,
            AgentPersona: this.agentPersona,
            query: query,
            max_depth: 1,
            limit: 50
          },
          { headers: this.getHeaders() }
        );
        mcpResults = response.data;
        console.log('✅ Graph query successful');
      } catch (error) {
        console.log('⚠️ Graph query failed, using mock data as fallback');
        const mockTasks = this.getMockMCPData();
        return {
          success: true,
          data: mockTasks,
          totalRecords: mockTasks.length,
          source: 'MCP Context Studio (Fallback)',
          message: `Using mock data - API unavailable. ${error.message}`
        };
      }
      
      // Transform MCP Task nodes to application format
      const tasks = this.transformMCPTaskNodes(mcpResults.items || [], searchParams);

      if (tasks.length > 0) {
        console.log(`✅ Retrieved ${tasks.length} tasks from REAL MCP Context Studio`);
        return {
          success: true,
          data: tasks,
          totalRecords: tasks.length,
          source: 'MCP Context Studio (Live - CSV Data)',
          message: `Retrieved ${tasks.length} tasks from Invetory.csv via MCP`
        };
      }

      // Fallback to mock data if no tasks found
      console.log('⚠️ No Task nodes found in MCP, using mock data');
      const mockTasks = this.getMockMCPData();
      return {
        success: true,
        data: mockTasks,
        totalRecords: mockTasks.length,
        source: 'MCP Context Studio (Fallback)',
        message: 'No tasks found in MCP - using mock data'
      };
    } catch (error) {
      console.error('MCP Search Error:', error.message);
      
      // Fallback to mock data
      console.log('⚠️ Using mock data as fallback');
      const mockTasks = this.getMockMCPData();
      
      return {
        success: true,
        data: mockTasks,
        totalRecords: mockTasks.length,
        source: 'MCP Context Studio (Fallback)',
        message: `Using mock data - ${error.message}`
      };
    }
  }

  /**
   * Transform MCP Task nodes to application format
   * @param {Array} mcpItems - MCP graph query items
   * @param {Object} searchParams - Search filters
   */
  transformMCPTaskNodes(mcpItems, searchParams = {}) {
    const tasks = [];
    
    for (const item of mcpItems) {
      // Only process Task nodes
      if (!item.metadata || !item.metadata.full_metadata ||
          item.metadata.full_metadata.node_type !== 'Task') {
        continue;
      }
      
      const props = item.metadata.full_metadata.properties || {};
      const nodeId = item.metadata.node_id || '';
      const content = item.content || '';
      
      // Extract provider name from content
      const providerMatch = content.match(/task for ([^:]+):/);
      const providerName = providerMatch ? providerMatch[1].trim() : 'Unknown Provider';
      
      // Build task object
      const task = {
        '@id': nodeId,
        '@type': 'Task',
        dataSource: props.data_source || 'Survey',
        taskId: props.task_id || 0,
        caseId: this.extractFromContent(content, /Case grouping tasks for ([^.]+)/, 1, '').replace(/\s+/g, '-'),
        npi: props.npi || '',
        providerId: props.provider_id || '',
        providerName: providerName,
        title: props.title_blank ? '' : (props.title || ''),
        taskName: props.task_name || '',
        taskStatus: props.task_status || 'Unknown',
        taskAge: props.task_age || 0,
        crd: props.crd_raw || '25-05-2026',
        workQueue: props.work_queue || 'Triage'
      };
      
      // Apply search filters
      if (this.matchesSearchParams(task, searchParams)) {
        tasks.push(task);
      }
    }
    
    return tasks;
  }

  /**
   * Extract value from content using regex
   */
  extractFromContent(content, regex, group, defaultValue) {
    const match = content.match(regex);
    return match ? match[group] : defaultValue;
  }

  /**
   * Check if task matches search parameters
   */
  matchesSearchParams(task, params) {
    if (!params || Object.keys(params).length === 0) {
      return true;
    }
    
    if (params.dataSource && task.dataSource !== params.dataSource) {
      return false;
    }
    if (params.taskStatus && task.taskStatus !== params.taskStatus) {
      return false;
    }
    if (params.workQueue && task.workQueue !== params.workQueue) {
      return false;
    }
    if (params.providerName && !task.providerName.toLowerCase().includes(params.providerName.toLowerCase())) {
      return false;
    }
    if (params.npi && task.npi !== params.npi) {
      return false;
    }
    if (params.taskId && task.taskId.toString() !== params.taskId.toString()) {
      return false;
    }
    
    return true;
  }
}

module.exports = new MCPService();

// Made with Bob
