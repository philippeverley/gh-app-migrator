
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { DatabaseIcon, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Captcha from './Captcha';
import { submitContactForm } from '@/services/contactService';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  institution: z.string().min(2, {
    message: 'Institution must be at least 2 characters.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }),
  captchaToken: z.string().min(1, {
    message: 'Please complete the captcha verification.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const DataInquiryForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      institution: '',
      description: '',
      captchaToken: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Format the message to include institution and description
      const formattedMessage = `
Institution: ${values.institution}

Data Request Description:
${values.description}
      `;
      
      // Use contactService but with formatted message and custom subject
      const response = await submitContactForm({
        name: values.name,
        email: values.email,
        message: formattedMessage,
        captchaToken: values.captchaToken,
      });
      
      if (response && response.success === true) {
        toast.success('Data inquiry submitted successfully!');
        form.reset();
      } else {
        toast.error(response?.message || 'Failed to submit inquiry.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred while submitting your inquiry. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    form.setValue('captchaToken', token);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2 mb-6">
        <DatabaseIcon className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Data Inquiry</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Institution</FormLabel>
                <FormControl>
                  <Input placeholder="Your organization or institution" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the data you're inquiring about..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="captchaToken"
            render={() => (
              <FormItem>
                <FormLabel>Verification</FormLabel>
                <FormControl>
                  <Captcha onVerify={handleCaptchaVerify} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DataInquiryForm;
