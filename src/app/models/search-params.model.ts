export interface SearchParams {
  npi?: string;
  dataSource?: string;
  taskId?: string;
  outboundFileFromDate?: string;
  outboundFileToDate?: string;
  searchBy?: string;
  surveyType?: string;
  providerId?: string;
  corporateReceiptFromDate?: string;
  corporateReceiptToDate?: string;
  taskName?: string;
  taskStatus?: string;
  assignedTo?: string;
  workQueue?: string;
}

export interface TaskData {
  id: number;
  dataSource: string;
  taskId: string;
  caseId: string;
  npi: string;
  providerId: string;
  providerName: string;
  title: string;
  taskName: string;
  taskStatus: string;
  taskAge: number;
  crd: string;
  workQueue: string;
  selected?: boolean;
}

export interface SearchResponse {
  success: boolean;
  data: TaskData[];
  message?: string;
  totalRecords?: number;
}

// Made with Bob
