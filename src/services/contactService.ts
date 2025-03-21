
import { fetchAPI } from './api';

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
  captchaToken: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

/**
 * Send contact form data to the backend
 */
export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  return fetchAPI<ContactResponse>('/contact', {
    method: 'POST',
    body: formData
  });
};
