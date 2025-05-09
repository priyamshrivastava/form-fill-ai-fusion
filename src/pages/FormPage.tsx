
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Eye, Download, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock form field type
interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "date" | "number";
  value: string;
  placeholder?: string;
  required?: boolean;
}

export default function FormPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  
  // Mock fetching the form data
  useEffect(() => {
    // Simulate API call to get form details
    setTimeout(() => {
      // Different forms based on the ID
      if (id === "1") {
        setFileName("KYC Form");
        setFormFields([
          { id: "name", label: "Full Name", type: "text", value: "John Doe", required: true },
          { id: "dob", label: "Date of Birth", type: "date", value: "1990-01-01", required: true },
          { id: "email", label: "Email Address", type: "email", value: "john.doe@example.com", required: true },
          { id: "phone", label: "Phone Number", type: "text", value: "+1 555-123-4567", required: true },
          { id: "address", label: "Home Address", type: "text", value: "123 Main St, Anytown, USA", required: true },
          { id: "id_number", label: "ID Number", type: "text", value: "AB123456789", required: true },
          { id: "nationality", label: "Nationality", type: "text", value: "United States", required: true },
        ]);
      } else if (id === "2") {
        setFileName("Visa Application");
        setFormFields([
          { id: "name", label: "Full Name", type: "text", value: "", required: true },
          { id: "passport", label: "Passport Number", type: "text", value: "", required: true },
          { id: "nationality", label: "Nationality", type: "text", value: "", required: true },
          { id: "travel_date", label: "Travel Date", type: "date", value: "", required: true },
          { id: "destination", label: "Destination Country", type: "text", value: "India", required: true },
          { id: "stay_duration", label: "Duration of Stay (days)", type: "number", value: "", required: true },
          { id: "visit_purpose", label: "Purpose of Visit", type: "text", value: "", required: true },
        ]);
      } else {
        setFileName("Tax Declaration");
        setFormFields([
          { id: "name", label: "Taxpayer Name", type: "text", value: "", required: true },
          { id: "tax_id", label: "Tax ID Number", type: "text", value: "", required: true },
          { id: "financial_year", label: "Financial Year", type: "text", value: "2024-2025", required: true },
          { id: "income", label: "Annual Income", type: "number", value: "", required: true },
          { id: "deductions", label: "Total Deductions", type: "number", value: "", required: true },
        ]);
      }
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const handleInputChange = (id: string, value: string) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving data
    setTimeout(() => {
      toast({
        title: "Form Saved",
        description: "Your form data has been saved successfully.",
      });
      setIsSaving(false);
      navigate("/dashboard");
    }, 1000);
  };

  const handleGeneratePDF = () => {
    toast({
      title: "PDF Generated",
      description: "Your filled PDF is ready for download.",
    });
  };

  const handleAutoFill = () => {
    // Simulate AI auto-filling the form
    toast({
      title: "AI Processing",
      description: "Using AI to fill your form automatically...",
    });
    
    setTimeout(() => {
      // Mock AI-filled data
      const aiFilledData = formFields.map(field => {
        if (field.value) return field; // Don't overwrite existing values
        
        // Generate mock values based on field ID
        let aiValue = "";
        switch(field.id) {
          case "name":
          case "taxpayer_name":
            aiValue = "Alex Johnson";
            break;
          case "passport":
            aiValue = "P123456789";
            break;
          case "nationality":
            aiValue = "United States";
            break;
          case "travel_date":
            aiValue = "2025-07-15";
            break;
          case "stay_duration":
            aiValue = "14";
            break;
          case "visit_purpose":
            aiValue = "Tourism";
            break;
          case "tax_id":
            aiValue = "TIN9876543210";
            break;
          case "income":
            aiValue = "85000";
            break;
          case "deductions":
            aiValue = "12500";
            break;
          default:
            aiValue = "";
        }
        
        return {
          ...field,
          value: aiValue
        };
      });
      
      setFormFields(aiFilledData);
      
      toast({
        title: "Auto-Fill Complete",
        description: "AI has filled the form based on available data. Please review and edit as needed.",
      });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-primary/5">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold ml-4">{fileName}</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save & Complete"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="form">Form Details</TabsTrigger>
            <TabsTrigger value="ocr">OCR Results</TabsTrigger>
          </TabsList>
          <TabsContent value="form">
            <div className="flex justify-end mb-4">
              <Button variant="secondary" onClick={handleAutoFill}>
                <Send className="h-4 w-4 mr-2" />
                Auto-fill with AI
              </Button>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {formFields.map((field) => (
                    <div key={field.id}>
                      <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</Label>
                      <Input
                        id={field.id}
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="mt-1"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="ocr">
            <Card>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  <div className="p-4 bg-muted rounded-md">
                    <h3 className="font-medium mb-2">OCR Detected Fields</h3>
                    <div className="text-sm text-muted-foreground mb-4">
                      Our OCR has detected the following fields from your uploaded PDF form.
                    </div>
                    {formFields.map((field) => (
                      <div key={field.id} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="font-medium">{field.label}:</span>
                        <div className="bg-primary/5 px-3 py-1 rounded text-sm">
                          {field.id.includes("name") ? "Field: Full Name" : 
                           field.id.includes("date") ? "Field: Date" : 
                           field.id.includes("email") ? "Field: Email" : 
                           field.id.includes("phone") ? "Field: Phone Number" : 
                           field.id.includes("address") ? "Field: Address" : 
                           "Field: " + field.label}
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <Button size="sm" onClick={() => setActiveTab("form")}>
                        Edit Form Fields
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Preview Sheet */}
      <Sheet open={showPreview} onOpenChange={setShowPreview}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Form Preview</SheetTitle>
          </SheetHeader>
          
          <div className="bg-white p-8 border rounded-md mt-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">{fileName}</h2>
              <p className="text-muted-foreground">Preview of filled form</p>
            </div>

            <div className="space-y-4">
              {formFields.map((field) => (
                <div key={field.id} className="border-b pb-2">
                  <p className="text-sm text-muted-foreground">{field.label}</p>
                  <p className="font-medium">{field.value || "Not provided"}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button onClick={handleGeneratePDF}>
                <Download className="h-4 w-4 mr-2" />
                Download Filled PDF
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
