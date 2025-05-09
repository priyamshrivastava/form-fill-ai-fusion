
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Plus, FileText, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import UploadModal from "@/components/UploadModal";

interface FormDocument {
  id: string;
  name: string;
  createdAt: Date;
  status: "completed" | "in-progress" | "not-started";
}

export default function Dashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Mock data for documents
  const [documents, setDocuments] = useState<FormDocument[]>([
    {
      id: "1",
      name: "KYC Form",
      createdAt: new Date(),
      status: "completed",
    },
    {
      id: "2",
      name: "Visa Application",
      createdAt: new Date(Date.now() - 86400000), // Yesterday
      status: "in-progress",
    },
    {
      id: "3", 
      name: "Tax Declaration",
      createdAt: new Date(Date.now() - 172800000), // Day before yesterday
      status: "not-started",
    },
  ]);

  const handleUpload = (fileName: string) => {
    const newDocument: FormDocument = {
      id: Math.random().toString(36).substr(2, 9),
      name: fileName,
      createdAt: new Date(),
      status: "not-started",
    };

    setDocuments([newDocument, ...documents]);
    setIsUploadModalOpen(false);
    toast({
      title: "Document Uploaded",
      description: "Your document has been added to your dashboard.",
    });
  };

  const handleDocumentClick = (document: FormDocument) => {
    navigate(`/form/${document.id}`);
  };

  const handleLogout = () => {
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary/5">
        <div className="container flex h-16 items-center justify-between py-4">
          <h1 className="text-2xl font-bold">FormFiller AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">HackIndia 2025 Project</span>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Your Forms</h2>
            <p className="text-muted-foreground mt-1">Upload and manage your PDF forms for AI-powered filling</p>
          </div>
          <Button onClick={() => setIsUploadModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Upload New Form
          </Button>
        </div>

        {/* Document Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <Card 
              key={doc.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleDocumentClick(doc)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{doc.name}</CardTitle>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      doc.status === "completed"
                        ? "bg-green-500"
                        : doc.status === "in-progress"
                        ? "bg-yellow-500"
                        : "bg-gray-500"
                    }`}
                  />
                </div>
                <CardDescription>
                  {doc.createdAt.toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center py-6 border-2 border-dashed rounded-md">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  <div className="text-sm font-medium flex justify-between items-center">
                    <span>
                      Status:{" "}
                      <span
                        className={
                          doc.status === "completed"
                            ? "text-green-500"
                            : doc.status === "in-progress"
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }
                      >
                        {doc.status.replace("-", " ")}
                      </span>
                    </span>
                    <Button size="sm" variant="outline">
                      Open
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Empty state */}
        {documents.length === 0 && (
          <Card className="w-full p-8 flex flex-col items-center justify-center">
            <FileUp className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No forms yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mt-2 mb-4">
              Upload your first form to get started. Our AI will help you fill it automatically.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload a Form
            </Button>
          </Card>
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUpload={handleUpload} 
      />
    </div>
  );
}
