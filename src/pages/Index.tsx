
import ContactForm from "@/components/ContactForm";
import DataRequestForm from "@/components/DataRequestForm";
import DataInquiryForm from "@/components/DataInquiryForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            Contact us or request data using the forms below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ContactForm />
          <DataRequestForm />
          <DataInquiryForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
