
import { useState, useRef } from "react";
import { FileUp, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (fileName: string) => void;
}

export default function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Triggers when file is selected via file input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Handle file selection
  const handleFile = (file: File) => {
    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
  };

  // Handle file upload button click
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      onUpload(selectedFile.name);
      setIsUploading(false);
      setSelectedFile(null);
      onClose();
    }, 1500);
  };

  // Handle clicking the upload area to open file dialog
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Form</DialogTitle>
          <DialogDescription>
            Upload a PDF form that you want to fill automatically.
          </DialogDescription>
        </DialogHeader>
        
        <div 
          className={`
            flex flex-col items-center justify-center w-full h-52 
            border-2 border-dashed rounded-md p-6 relative 
            ${dragActive ? "border-primary bg-primary/5" : "border-gray-300"}
            ${selectedFile ? "border-green-500 bg-green-50/50" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleChange}
            className="hidden"
          />
          
          {selectedFile ? (
            <>
              <FileUp className="h-10 w-10 text-green-500 mb-2" />
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFile(null);
                }}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-center text-sm font-medium">
                Drag & drop your PDF here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                Supports PDF files up to 10MB
              </p>
            </>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between flex-row">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
