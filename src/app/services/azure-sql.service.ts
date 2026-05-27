import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { SearchParams, SearchResponse, TaskData } from '../models/search-params.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AzureSqlService {
  // Use environment configuration for API endpoint
  private apiUrl = environment.azureSql.apiEndpoint;
  
  constructor(private http: HttpClient) { }

  /**
   * Search tasks from Azure SQL Database
   * @param searchParams Search parameters
   * @returns Observable of search response
   */
  searchTasks(searchParams: SearchParams): Observable<SearchResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Build query parameters
    let params = new HttpParams();
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key as keyof SearchParams];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    // Call Azure SQL API endpoint
    return this.http.get<SearchResponse>(`${this.apiUrl}/search-tasks`, { 
      headers, 
      params 
    }).pipe(
      map(response => {
        // Process response
        return {
          success: true,
          data: response.data || [],
          totalRecords: response.totalRecords || 0,
          message: response.message || 'Search completed successfully'
        };
      }),
      catchError(error => {
        console.error('Error searching tasks:', error);
        return of({
          success: false,
          data: [],
          message: error.message || 'An error occurred while searching tasks'
        });
      })
    );
  }

  /**
   * Get dropdown options from Azure SQL
   * @param optionType Type of dropdown (dataSource, surveyType, etc.)
   * @returns Observable of options array
   */
  getDropdownOptions(optionType: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dropdown-options/${optionType}`).pipe(
      catchError(error => {
        console.error(`Error fetching ${optionType} options:`, error);
        return of([]);
      })
    );
  }

  /**
   * Bulk update tasks
   * @param taskIds Array of task IDs to update
   * @param updateData Data to update
   * @returns Observable of update response
   */
  bulkUpdateTasks(taskIds: number[], updateData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/bulk-update`, {
      taskIds,
      updateData
    }, { headers }).pipe(
      catchError(error => {
        console.error('Error bulk updating tasks:', error);
        return of({
          success: false,
          message: error.message || 'An error occurred during bulk update'
        });
      })
    );
  }

  /**
   * Export tasks to Excel
   * @param searchParams Search parameters for export
   * @returns Observable of blob data
   */
  exportToExcel(searchParams: SearchParams): Observable<Blob> {
    let params = new HttpParams();
    Object.keys(searchParams).forEach(key => {
      const value = searchParams[key as keyof SearchParams];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get(`${this.apiUrl}/export-excel`, {
      params,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error('Error exporting to Excel:', error);
        return of(new Blob());
      })
    );
  }
}

// Made with Bob
