/**
 * Generic API Response Type
 */
export interface ApiResponse<T> {
  success: boolean; // Indicates if the operation was successful
  data?: T; // Payload of the response (e.g., user details, list of items)
  message?: string; // Descriptive message for the response
  error?: string; // Error message, if applicable
}

/**
 * Paginated Response Type for APIs that return paginated results
 */
export interface PaginatedResponse<T> {
  success: boolean; // Indicates if the operation was successful
  data: {
    items: T[]; // Array of items in the current page
    totalItems: number; // Total number of items
    totalPages: number; // Total number of pages
    currentPage: number; // Current page number
  };
  message?: string; // Descriptive message for the response
  error?: string; // Error message, if applicable
}
