
import { fetchAPI } from './api';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
  captchaToken: string;
  subject?: string; // Optional subject field
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

/**
 * Send contact form data to the backend
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  try {
    const response = await fetchAPI<ContactResponse>('/contact', {
      method: 'POST',
      body: formData
    });
    
    return response;
  } catch (error) {
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
