
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Paperclip, X, File } from "lucide-react";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string;
}

const FileUpload = ({
  onFilesChange,
  maxFiles = 5,
  maxSizeInMB = 10,
  acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
}: FileUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files?.length) return;
    
    const selectedFiles = Array.from(e.target.files);
    
    // Check if adding new files exceeds the maximum limit
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`You can upload a maximum of ${maxFiles} files.`);
      return;
    }
    
    // Validate file sizes
    const invalidFiles = selectedFiles.filter(file => file.size > maxSizeInBytes);
    if (invalidFiles.length > 0) {
      setError(`Some files exceed the maximum size of ${maxSizeInMB}MB.`);
      return;
    }
    
    // Add new files
    const updatedFiles = [...files, ...selectedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    
    // Reset the input value to allow re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={acceptedTypes}
        />
        
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <Paperclip className="h-8 w-8 text-muted-foreground" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Drag files here or click to upload</p>
            <p className="text-xs text-muted-foreground">
              Upload up to {maxFiles} files (max {maxSizeInMB}MB each)
            </p>
          </div>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            Select Files
          </Button>
        </div>
      </div>
      
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li 
              key={`${file.name}-${index}`} 
              className="flex items-center justify-between bg-muted/40 p-2 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
