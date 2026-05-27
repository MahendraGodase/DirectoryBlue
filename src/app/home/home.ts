import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AzureSqlService } from '../services/azure-sql.service';
import { SearchParams, TaskData } from '../models/search-params.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Search form model
  searchParams: SearchParams = {
    npi: '',
    dataSource: '',
    taskId: '',
    outboundFileFromDate: this.getDefaultFromDate(),
    outboundFileToDate: this.getDefaultToDate(),
    searchBy: 'task',
    surveyType: '',
    providerId: '',
    corporateReceiptFromDate: this.getDefaultFromDate(),
    corporateReceiptToDate: this.getDefaultToDate(),
    taskName: '',
    taskStatus: '',
    assignedTo: '',
    workQueue: ''
  };

  // Data table
  taskData: TaskData[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  noDataMessage: string = 'No data available. Please submit a search to view results.';
  
  // Dropdown options
  dataSourceOptions: any[] = [];
  surveyTypeOptions: any[] = [];
  taskNameOptions: any[] = [];
  taskStatusOptions: any[] = [];
  assignedToOptions: any[] = [];
  workQueueOptions: any[] = [];

  // Selection
  selectAll: boolean = false;
  selectedTasks: TaskData[] = [];

  constructor(private azureSqlService: AzureSqlService) {}

  ngOnInit(): void {
    // Load dropdown options on component initialization
    this.loadDropdownOptions();
  }

  /**
   * Get default from date (1 year ago)
   */
  private getDefaultFromDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return date.toISOString().split('T')[0];
  }

  /**
   * Get default to date (today)
   */
  private getDefaultToDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  /**
   * Load dropdown options from Azure SQL
   */
  loadDropdownOptions(): void {
    // Load data source options
    this.azureSqlService.getDropdownOptions('dataSource').subscribe(
      options => this.dataSourceOptions = options
    );

    // Load survey type options
    this.azureSqlService.getDropdownOptions('surveyType').subscribe(
      options => this.surveyTypeOptions = options
    );

    // Load task name options
    this.azureSqlService.getDropdownOptions('taskName').subscribe(
      options => this.taskNameOptions = options
    );

    // Load task status options
    this.azureSqlService.getDropdownOptions('taskStatus').subscribe(
      options => this.taskStatusOptions = options
    );

    // Load assigned to options
    this.azureSqlService.getDropdownOptions('assignedTo').subscribe(
      options => this.assignedToOptions = options
    );

    // Load work queue options
    this.azureSqlService.getDropdownOptions('workQueue').subscribe(
      options => this.workQueueOptions = options
    );
  }

  /**
   * Submit search form
   */
  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.noDataMessage = '';

    // Call Azure SQL service to search tasks
    this.azureSqlService.searchTasks(this.searchParams).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.taskData = response.data;
          if (this.taskData.length === 0) {
            this.noDataMessage = 'No results found for the given search criteria.';
          }
        } else {
          this.errorMessage = response.message || 'An error occurred while searching.';
          this.taskData = [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Failed to connect to the server. Please try again later.';
        this.taskData = [];
        console.error('Search error:', error);
      }
    });
  }

  /**
   * Clear all search filters
   */
  clearFilter(): void {
    this.searchParams = {
      npi: '',
      dataSource: '',
      taskId: '',
      outboundFileFromDate: this.getDefaultFromDate(),
      outboundFileToDate: this.getDefaultToDate(),
      searchBy: 'task',
      surveyType: '',
      providerId: '',
      corporateReceiptFromDate: this.getDefaultFromDate(),
      corporateReceiptToDate: this.getDefaultToDate(),
      taskName: '',
      taskStatus: '',
      assignedTo: '',
      workQueue: ''
    };
    this.taskData = [];
    this.errorMessage = '';
    this.noDataMessage = 'No data available. Please submit a search to view results.';
  }

  /**
   * Toggle select all checkboxes
   */
  toggleSelectAll(): void {
    this.taskData.forEach(task => task.selected = this.selectAll);
    this.updateSelectedTasks();
  }

  /**
   * Update selected tasks array
   */
  updateSelectedTasks(): void {
    this.selectedTasks = this.taskData.filter(task => task.selected);
  }

  /**
   * Bulk update selected tasks
   */
  bulkUpdate(): void {
    if (this.selectedTasks.length === 0) {
      alert('Please select at least one task to update.');
      return;
    }

    const taskIds = this.selectedTasks.map(task => task.id);
    // You can add a modal or form to get update data
    const updateData = {
      // Add your update fields here
      taskStatus: 'Updated'
    };

    this.azureSqlService.bulkUpdateTasks(taskIds, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Tasks updated successfully!');
          this.onSubmit(); // Refresh the data
        } else {
          alert('Failed to update tasks: ' + response.message);
        }
      },
      error: (error) => {
        alert('An error occurred during bulk update.');
        console.error('Bulk update error:', error);
      }
    });
  }

  /**
   * Export data to Excel
   */
  exportToExcel(): void {
    if (this.taskData.length === 0) {
      alert('No data to export. Please perform a search first.');
      return;
    }

    this.azureSqlService.exportToExcel(this.searchParams).subscribe({
      next: (blob) => {
        if (blob.size > 0) {
          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `task_export_${new Date().getTime()}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        } else {
          alert('Failed to export data.');
        }
      },
      error: (error) => {
        alert('An error occurred during export.');
        console.error('Export error:', error);
      }
    });
  }

  /**
   * Toggle advanced search
   */
  toggleAdvancedSearch(): void {
    // Implement advanced search toggle logic
    alert('Advanced search feature coming soon!');
  }
}
