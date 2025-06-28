const API_BASE_URL = 'http://localhost:5000';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Document {
  id: string;
  filename: string;
  upload_time: string;
  size: number;
  chunk_count?: number;
}

export interface ChatMessage {
  id: string;
  user_message: string;
  ai_response: string;
  timestamp: string;
}

export interface UploadResponse {
  document_id: string;
  filename: string;
  upload_time: string;
  chunk_count: number;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; openai_configured: boolean }>> {
    return this.makeRequest('/health');
  }

  async uploadDocument(file: File): Promise<ApiResponse<UploadResponse>> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async sendMessage(documentId: string, message: string): Promise<ApiResponse<ChatResponse>> {
    return this.makeRequest(`/chat/${documentId}`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getChatHistory(documentId: string): Promise<ApiResponse<{ document_id: string; chat_history: ChatMessage[] }>> {
    return this.makeRequest(`/chat/${documentId}/history`);
  }

  async listDocuments(): Promise<ApiResponse<{ documents: Document[]; total: number }>> {
    return this.makeRequest('/documents');
  }

  async deleteDocument(documentId: string): Promise<ApiResponse<{ message: string }>> {
    return this.makeRequest(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();