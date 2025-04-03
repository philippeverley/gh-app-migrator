
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
import FileUpload from './FileUpload';
import { submitDataRequestForm } from '@/services/dataRequestService';

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
  // Files will be handled separately since they're not easily validated with zod
});

type FormValues = z.infer<typeof formSchema>;

const DataRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  
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
      const response = await submitDataRequestForm({
        ...values,
        attachments: attachments
      });
      
      if (response && response.success === true) {
        toast.success('Data request submitted successfully!');
        form.reset();
        setAttachments([]);
      } else {
        toast.error(response?.message || 'Failed to submit data request.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('An error occurred while submitting your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaptchaVerify = (token: string) => {
    form.setValue('captchaToken', token);
  };

  const handleFilesChange = (files: File[]) => {
    setAttachments(files);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-card rounded-lg shadow-sm border">
      <div className="flex items-center space-x-2 mb-6">
        <DatabaseIcon className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight">Request Data</h2>
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
                    placeholder="Describe the data you're requesting..." 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <FormLabel>Attachments</FormLabel>
            <FileUpload onFilesChange={handleFilesChange} />
          </div>
          
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
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DataRequestForm;
