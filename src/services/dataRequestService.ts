
import { fetchAPI } from './api';

export type DataRequestFormData = {
  name: string;
  email: string;
  institution: string;
  description: string;
  attachments: File[];
};

export type DataRequestResponse = {
  success: boolean;
  message: string;
};

/**
 * Send data request form data to the backend
 */
export const submitDataRequestForm = async (formData: DataRequestFormData): Promise<DataRequestResponse> => {
  try {
    // Convert the form data to FormData to handle file uploads
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('institution', formData.institution);
    formDataToSend.append('description', formData.description);
    
    // Append each file to the FormData
    formData.attachments.forEach((file, index) => {
      formDataToSend.append(`attachments`, file);
    });
    
    // Use custom fetch instead of fetchAPI since we're sending FormData
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5173/api'}/data-request`, {
      method: 'POST',
      body: formDataToSend,
      // Don't set Content-Type header as it will be set automatically with boundary
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data as DataRequestResponse;
    
  } catch (error) {
    console.error('Data request form submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
