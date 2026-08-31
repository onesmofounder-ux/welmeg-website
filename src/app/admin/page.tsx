"use client";
import Sidebar from "@/components/Sidebar";
import NotificationCenter from "@/components/NotificationCenter";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";

function ProjectRequestDeepLink({
  projectRequests,
  onSelectProject,
  onClearParams,
}: {
  projectRequests: any[];
  onSelectProject: (p: any) => void;
  onClearParams: () => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const rid = searchParams?.get?.("requestId");
      if (!rid) return;
      if (projectRequests.length === 0) return;
      const found = projectRequests.find(
        (p) => String(p.id) === String(rid)
      );
      if (found) {
        onSelectProject(found);
        onClearParams();
      }
    } catch (err) {
      console.error(err);
    }
  }, [projectRequests, searchParams, onSelectProject, onClearParams]);

  return null;
}

export default function AdminDashboard() {
const router = useRouter();
const [projectRequests, setProjectRequests] = useState([] as any[]);
  const [jobApplications, setJobApplications] = useState([] as any[]);
  const [viewingCvId, setViewingCvId] = useState<string | null>(null);
  const [viewCvError, setViewCvError] = useState("");
  const [skilledWorkers, setSkilledWorkers] = useState([] as any[]);
const [projectsList, setProjectsList] = useState([] as any[]);

  // Add Project form state
  const [showAddForm, setShowAddForm] = useState(false);
const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
const [savingProject, setSavingProject] = useState(false);
const [saveMessage, setSaveMessage] = useState({type: "", text: ""} as {type: "success" | "error" | "", text: string});  const [newProject, setNewProject] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    status: "published",
    image_url: "",
  });

  // Image upload state
const [selectedFile, setSelectedFile] = useState(null as File | null);
  const [uploading, setUploading] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  // Gallery images state
const [galleryFiles, setGalleryFiles] = useState([] as File[]);
const [galleryPreviews, setGalleryPreviews] = useState([] as {url:string, name:string, size:number}[]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

const [selectedProject, setSelectedProject] = useState(null as any);
const [checkingAuth, setCheckingAuth] = useState(true);


  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [clientsSearch, setClientsSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [settingsTab, setSettingsTab] = useState("profile");

  const [settingsDefaultStatus, setSettingsDefaultStatus] = useState("Pending");
  const [settingsDefaultCategory, setSettingsDefaultCategory] = useState("Residential Building");
  const [settingsNotifyRequests, setSettingsNotifyRequests] = useState(true);
  const [settingsNotifyApplications, setSettingsNotifyApplications] = useState(true);
  const [settingsNotifyClients, setSettingsNotifyClients] = useState(true);
  const [settingsNotifyStatusEmails, setSettingsNotifyStatusEmails] = useState(true);
  const [settingsLanguage, setSettingsLanguage] = useState("en");
  const [settingsTimezone, setSettingsTimezone] = useState("Africa/Dar_es_Salaam");
  const [settingsDateFormat, setSettingsDateFormat] = useState("MM/DD/YYYY");
  const [settingsTheme, setSettingsTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    try {
      return localStorage.getItem("admin-theme") || "light";
    } catch {
      return "light";
    }
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  type CompanyProfile = {
    name: string;
    motto: string;
    description: string;
    email: string;
    phone: string;
    whatsapp: string;
    website: string;
    address: string;
    city: string;
    country: string;
    businessType: string;
    services: string[];
    registrationNumber: string;
    tin: string;
    businessLicense: string;
    vatNumber: string;
    yearEstablished: string;
    logoUrl: string;
  };

  const defaultCompanyProfile: CompanyProfile = {
    name: "WELMEG Solution Company Limited",
    motto: "Building New Vision, Building New World",
    description: "We provide professional construction, project management, property development and consultancy solutions.",
    email: "welmegsolution@gmail.com",
    phone: "+255 22 123 4567",
    whatsapp: "",
    website: "",
    address: "P.O. Box 123",
    city: "Dar es Salaam",
    country: "Tanzania",
    businessType: "Construction & Project Management",
    services: ["Construction", "Project Management", "Property Development", "Consultancy"],
    registrationNumber: "",
    tin: "",
    businessLicense: "",
    vatNumber: "",
    yearEstablished: "",
    logoUrl: ""
  };

  const [companyProfile, setCompanyProfile] = useState<CompanyProfile>(defaultCompanyProfile);
  const [companyProfileSaved, setCompanyProfileSaved] = useState(true);
  const [companyProfileStatus, setCompanyProfileStatus] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });
  const [companyLogoModalOpen, setCompanyLogoModalOpen] = useState(false);
  const [customServiceInput, setCustomServiceInput] = useState("");

  const loadCompanyProfile = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("welmeg_company_profile");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCompanyProfile({ ...defaultCompanyProfile, ...parsed });
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadCompanyProfile();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("welmeg_company_profile", JSON.stringify(companyProfile));
    } catch {
      // ignore
    }
  }, [companyProfile]);

  const updateCompanyField = <K extends keyof CompanyProfile>(field: K, value: CompanyProfile[K]) => {
    setCompanyProfile(prev => ({ ...prev, [field]: value }));
    setCompanyProfileSaved(false);
  };

  const handleSaveCompanyProfile = () => {
    setCompanyProfileStatus({ type: "", text: "" });
    if (!companyProfile.name.trim()) {
      setCompanyProfileStatus({ type: "error", text: "Company name is required." });
      return;
    }
    if (companyProfile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(companyProfile.email)) {
      setCompanyProfileStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }
    if (companyProfile.website && !/^https?:\/\/.+/.test(companyProfile.website)) {
      setCompanyProfileStatus({ type: "error", text: "Website must start with http:// or https://" });
      return;
    }
    if (companyProfile.yearEstablished && !/^\d{4}$/.test(companyProfile.yearEstablished)) {
      setCompanyProfileStatus({ type: "error", text: "Year established must be a 4-digit year." });
      return;
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("welmeg_company_profile", JSON.stringify(companyProfile));
      } catch {
        setCompanyProfileStatus({ type: "error", text: "Failed to save. Storage may be unavailable." });
        return;
      }
    }
    setCompanyProfileSaved(true);
    setCompanyProfileStatus({ type: "success", text: "Company profile saved successfully." });
    setTimeout(() => setCompanyProfileStatus({ type: "", text: "" }), 3000);
  };

  const handleResetCompanyProfile = () => {
    setCompanyProfile(defaultCompanyProfile);
    setCompanyProfileSaved(false);
    setCompanyProfileStatus({ type: "success", text: "Company profile restored to default." });
    setTimeout(() => setCompanyProfileStatus({ type: "", text: "" }), 3000);
  };

  const handleAddService = () => {
    const value = customServiceInput.trim();
    if (!value) return;
    if (companyProfile.services.some(s => s.toLowerCase() === value.toLowerCase())) {
      setCompanyProfileStatus({ type: "error", text: "This service already exists." });
      return;
    }
    setCompanyProfile(prev => ({ ...prev, services: [...prev.services, value] }));
    setCustomServiceInput("");
    setCompanyProfileSaved(false);
    setCompanyProfileStatus({ type: "", text: "" });
  };

  const handleRemoveService = (service: string) => {
    setCompanyProfile(prev => ({ ...prev, services: prev.services.filter(s => s !== service) }));
    setCompanyProfileSaved(false);
  };

  const companyProfileCompletion = useMemo(() => {
    const fields: (keyof CompanyProfile)[] = ["name", "motto", "description", "email", "phone", "address", "city", "country", "businessType"];
    const filled = fields.filter(f => String(companyProfile[f]).trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }, [companyProfile]);

  const getCompanyPlaceholderValue = (key: string): string => {
    const map: Record<string, string> = {
      "{{company_name}}": companyProfile.name || "WELMEG Solution Company Limited",
      "{{company_email}}": companyProfile.email || "info@welmeg.co.tz",
      "{{company_phone}}": companyProfile.phone || "+255 22 123 4567",
      "{{company_address}}": [companyProfile.address, companyProfile.city, companyProfile.country].filter(Boolean).join(", ") || "P.O. Box 123, Dar es Salaam, Tanzania",
      "{{company_motto}}": companyProfile.motto || "Building New Vision, Building New World"
    };
    return map[key] || "";
  };

  const getPreview = (content: string) => {
    const samples: Record<string, string> = {
      "{{client_name}}": "John Doe",
      "{{client_email}}": "john@example.com",
      "{{client_phone}}": "+255 123 456 789",
      "{{project_name}}": "Residential Building Project",
      "{{project_type}}": "Residential Building",
      "{{project_location}}": "Dar es Salaam, Tanzania",
      "{{project_status}}": "Approved",
      "{{date}}": new Date().toLocaleDateString(),
      "{{company_name}}": getCompanyPlaceholderValue("{{company_name}}"),
      "{{company_email}}": getCompanyPlaceholderValue("{{company_email}}"),
      "{{company_phone}}": getCompanyPlaceholderValue("{{company_phone}}"),
      "{{company_address}}": getCompanyPlaceholderValue("{{company_address}}"),
      "{{company_motto}}": getCompanyPlaceholderValue("{{company_motto}}")
    };
    return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return samples[`{{${key}}}`] || match;
    });
  };

  const openCompanyLogoModal = () => setCompanyLogoModalOpen(true);
  const closeCompanyLogoModal = () => setCompanyLogoModalOpen(false);

  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);
  const [companyLogoUploading, setCompanyLogoUploading] = useState(false);
  const [companyLogoError, setCompanyLogoError] = useState("");
  const companyLogoInputRef = useRef<HTMLInputElement>(null);
  const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_LOGO_SIZE = 2 * 1024 * 1024;

  const handleCompanyLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setCompanyLogoError("Invalid file type. Allowed: PNG, JPG, WEBP.");
      return;
    }
    if (file.size > MAX_LOGO_SIZE) {
      setCompanyLogoError("File is too large. Maximum size is 2MB.");
      return;
    }
    setCompanyLogoError("");
    if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
    setCompanyLogoPreview(URL.createObjectURL(file));
  };

  const handleCompanyLogoUpload = async () => {
    const file = companyLogoInputRef.current?.files?.[0];
    if (!file) {
      setCompanyLogoError("Please select an image first.");
      return;
    }
    setCompanyLogoUploading(true);
    setCompanyLogoError("");
    try {
      const fileExt = file.name.split(".").pop() || "png";
      const filePath = `company-logos/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("company-logos")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("company-logos").getPublicUrl(filePath);
      updateCompanyField("logoUrl", data.publicUrl);
      setCompanyLogoPreview(null);
      closeCompanyLogoModal();
      setCompanyProfileStatus({ type: "success", text: "Company logo updated successfully." });
      setTimeout(() => setCompanyProfileStatus({ type: "", text: "" }), 3000);
    } catch (err) {
      setCompanyLogoError("Failed to upload logo. Please try again.");
    } finally {
      setCompanyLogoUploading(false);
      if (companyLogoInputRef.current) companyLogoInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (companyLogoPreview) URL.revokeObjectURL(companyLogoPreview);
    };
  }, [companyLogoPreview]);

  useEffect(() => {
    if (!companyLogoModalOpen) {
      setCompanyLogoPreview(null);
      setCompanyLogoError("");
      if (companyLogoInputRef.current) companyLogoInputRef.current.value = "";
    }
  }, [companyLogoModalOpen]);

  type Template = {
    id: string;
    name: string;
    description: string;
    content: string;
  };

  const defaultTemplates: Template[] = [
    {
      id: "quotation",
      name: "Quotation",
      description: "Template for preparing project quotations and cost estimates.",
      content:
        "QUOTATION\n\n" +
        "Dear {{client_name}},\n\n" +
        "Thank you for your interest in our services. We are pleased to provide you with the following quotation for {{project_name}}.\n\n" +
        "Project Type: {{project_type}}\n" +
        "Location: {{project_location}}\n\n" +
        "Date: {{date}}\n\n" +
        "We look forward to discussing this further.\n\n" +
        "Best regards,\n" +
        "{{company_name}}\n" +
        "{{company_email}} | {{company_phone}}\n" +
        "{{company_address}}"
    },
    {
      id: "invoice",
      name: "Invoice",
      description: "Template for billing clients for completed or approved work.",
      content:
        "INVOICE\n\n" +
        "Bill To: {{client_name}}\n" +
        "Email: {{client_email}}\n\n" +
        "Project: {{project_name}}\n" +
        "Status: {{project_status}}\n\n" +
        "Date: {{date}}\n\n" +
        "Amount: [Amount details here]\n\n" +
        "Payment due upon receipt.\n\n" +
        "{{company_name}}\n" +
        "{{company_address}}"
    },
    {
      id: "project-report",
      name: "Project Report",
      description: "Template for reporting project progress, activities, challenges, and outcomes.",
      content:
        "PROJECT REPORT\n\n" +
        "Project: {{project_name}}\n" +
        "Type: {{project_type}}\n" +
        "Location: {{project_location}}\n" +
        "Status: {{project_status}}\n" +
        "Date: {{date}}\n\n" +
        "Prepared for: {{client_name}}\n\n" +
        "Executive Summary:\n" +
        "[Project summary here]\n\n" +
        "Activities:\n" +
        "[Details here]\n\n" +
        "Challenges:\n" +
        "[Details here]\n\n" +
        "Outcomes:\n" +
        "[Details here]\n\n" +
        "{{company_name}}\n" +
        "{{company_motto}}"
    },
    {
      id: "contract",
      name: "Contract",
      description: "Template for basic construction or project service agreements.",
      content:
        "CONTRACT AGREEMENT\n\n" +
        "This agreement is entered into between:\n\n" +
        "{{company_name}}\n" +
        "{{company_address}}\n\n" +
        "And:\n\n" +
        "{{client_name}}\n" +
        "{{client_email}} | {{client_phone}}\n\n" +
        "Project: {{project_name}}\n" +
        "Type: {{project_type}}\n" +
        "Location: {{project_location}}\n\n" +
        "Date: {{date}}\n\n" +
        "Terms:\n" +
        "1. Scope of work...\n" +
        "2. Payment terms...\n" +
        "3. Timeline...\n\n" +
        "Signed:\n" +
        "_________________________\n" +
        "{{company_name}}\n\n" +
        "_________________________\n" +
        "{{client_name}}"
    },
    {
      id: "official-letter",
      name: "Official Letter",
      description: "Template for official WELMEG business correspondence.",
      content:
        "{{company_name}}\n" +
        "{{company_address}}\n" +
        "{{company_email}} | {{company_phone}}\n\n" +
        "{{date}}\n\n" +
        "To: {{client_name}}\n" +
        "Email: {{client_email}}\n\n" +
        "Subject: Official Correspondence Regarding {{project_name}}\n\n" +
        "Dear {{client_name}},\n\n" +
        "[Letter body here]\n\n" +
        "Thank you for your attention.\n\n" +
        "Sincerely,\n" +
        "{{company_name}}\n" +
        "{{company_motto}}"
    }
  ];

  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templateStatus, setTemplateStatus] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const savedTemplate = templates.find(t => t.id === selectedTemplateId);
  const isDirty =
    !!selectedTemplateId &&
    !!savedTemplate &&
    (templateName !== savedTemplate.name ||
      templateDescription !== savedTemplate.description ||
      templateContent !== savedTemplate.content);

   const placeholders = [
     "{{client_name}}", "{{client_email}}", "{{client_phone}}",
     "{{project_name}}", "{{project_type}}", "{{project_location}}",
     "{{project_status}}", "{{date}}", "{{company_name}}",
     "{{company_email}}", "{{company_phone}}", "{{company_address}}",
     "{{company_motto}}"
   ];

   const handleSelectTemplate = (template: Template) => {
    setSelectedTemplateId(template.id);
    setTemplateName(template.name);
    setTemplateDescription(template.description);
    setTemplateContent(template.content);
    setTemplateStatus({ type: "", text: "" });
  };

  const handleInsertPlaceholder = (placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = templateContent.substring(0, start) + placeholder + templateContent.substring(end);
    setTemplateContent(newContent);
    setTimeout(() => {
      textarea.focus();
      const newPos = start + placeholder.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const handleSaveTemplate = () => {
    if (!selectedTemplateId || !templateName.trim()) {
      setTemplateStatus({ type: "error", text: "Template name is required." });
      return;
    }
    setTemplates(prev => prev.map(t =>
      t.id === selectedTemplateId
        ? { ...t, name: templateName.trim(), description: templateDescription.trim(), content: templateContent }
        : t
    ));
    setTemplateStatus({ type: "success", text: "Template saved successfully." });
    setTimeout(() => setTemplateStatus({ type: "", text: "" }), 2500);
  };

  const handleResetTemplate = () => {
    if (!selectedTemplateId) return;
    const defaultTemplate = defaultTemplates.find(t => t.id === selectedTemplateId);
    if (defaultTemplate) {
      setTemplateName(defaultTemplate.name);
      setTemplateDescription(defaultTemplate.description);
      setTemplateContent(defaultTemplate.content);
      setTemplates(prev => prev.map(t =>
        t.id === selectedTemplateId
          ? { ...defaultTemplate }
          : t
      ));
      setTemplateStatus({ type: "success", text: "Template restored to default." });
      setTimeout(() => setTemplateStatus({ type: "", text: "" }), 2500);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("admin-templates");
      if (stored) {
        setTemplates(JSON.parse(stored));
      } else {
        setTemplates(defaultTemplates);
      }
    } catch {
      setTemplates(defaultTemplates);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || templates.length === 0) return;
    try {
      localStorage.setItem("admin-templates", JSON.stringify(templates));
    } catch {
      // ignore
    }
  }, [templates]);

  type Integration = {
    id: string;
    name: string;
    description: string;
    category: string;
    status: "connected" | "not_connected";
    icon: string;
  };

  const integrations: Integration[] = [
    {
      id: "supabase",
      name: "Supabase",
      description: "Database and authentication platform used by WELMEG.",
      category: "Database",
      status: "connected",
      icon: "database"
    },
    {
      id: "resend",
      name: "Resend",
      description: "Email delivery service used for WELMEG notifications and project status emails.",
      category: "Email",
      status: "connected",
      icon: "mail"
    },
    {
      id: "google-maps",
      name: "Google Maps",
      description: "Location and map services for projects and properties.",
      category: "Maps & Location",
      status: "not_connected",
      icon: "map"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Client communication and business messaging.",
      category: "Communication",
      status: "not_connected",
      icon: "message"
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Document storage and business file management.",
      category: "Storage",
      status: "not_connected",
      icon: "storage"
    },
    {
      id: "google-calendar",
      name: "Google Calendar",
      description: "Project meetings, appointments, and scheduling.",
      category: "Calendar",
      status: "not_connected",
      icon: "calendar"
    },
    {
      id: "slack",
      name: "Slack",
      description: "Internal team notifications and communication.",
      category: "Internal Tools",
      status: "not_connected",
      icon: "team"
    }
  ];

  const integrationCategories = [
    "All",
    "Communication",
    "Email",
    "Maps & Location",
    "Storage",
    "Calendar",
    "Internal Tools",
    "Database"
  ];

  const [integrationSearch, setIntegrationSearch] = useState("");
  const [integrationCategory, setIntegrationCategory] = useState("All");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [integrationModalOpen, setIntegrationModalOpen] = useState(false);

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesSearch =
      integration.name.toLowerCase().includes(integrationSearch.toLowerCase()) ||
      integration.description.toLowerCase().includes(integrationSearch.toLowerCase());
    const matchesCategory =
      integrationCategory === "All" || integration.category === integrationCategory;
    return matchesSearch && matchesCategory;
  });

  const connectedCount = integrations.filter((i) => i.status === "connected").length;
  const notConnectedCount = integrations.filter((i) => i.status === "not_connected").length;

  const handleOpenIntegration = (integration: Integration) => {
    setSelectedIntegration(integration);
    setIntegrationModalOpen(true);
  };

  const handleCloseIntegration = () => {
    setIntegrationModalOpen(false);
    setSelectedIntegration(null);
  };

  const handleConnectIntegration = () => {
    setIntegrationModalOpen(false);
  };

  const getIntegrationIcon = (icon: string) => {
    switch (icon) {
      case "database":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          </svg>
        );
      case "mail":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4l-10 8L2 4" />
          </svg>
        );
      case "map":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
        );
      case "message":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        );
      case "storage":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16v12H4z" />
            <path d="M4 6l8 6 8-6" />
          </svg>
        );
      case "calendar":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        );
      case "team":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        );
    }
  };

  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendStatus, setResendStatus] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{type: "success" | "error" | "", text: string}>({ type: "", text: "" });

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [billingModal, setBillingModal] = useState<"manage" | "payment" | "upgrade" | "sales" | "invoices" | null>(null);
  const [profilePictureModalOpen, setProfilePictureModalOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const [manageUsersModalOpen, setManageUsersModalOpen] = useState(false);

  const openBillingModal = (modal: "manage" | "payment" | "upgrade" | "sales" | "invoices") => setBillingModal(modal);
  const closeBillingModal = () => setBillingModal(null);

  const handleResetAllSettings = () => {
    setSettingsDefaultStatus("Pending");
    setSettingsDefaultCategory("Residential Building");
    setSettingsNotifyRequests(true);
    setSettingsNotifyApplications(true);
    setSettingsNotifyClients(true);
    setSettingsNotifyStatusEmails(true);
    setSettingsLanguage("en");
    setSettingsTimezone("Africa/Nairobi");
    setSettingsDateFormat("MM/DD/YYYY");
    setSettingsTheme("light");
    setSettingsSaved(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("admin-settings-project-defaults");
        localStorage.removeItem("admin-settings-notifications");
        localStorage.removeItem("admin-settings-language");
      } catch {
        // ignore
      }
    }
  };

  const openProfilePictureModal = () => setProfilePictureModalOpen(true);
  const closeProfilePictureModal = () => setProfilePictureModalOpen(false);

  const openTwoFactorModal = () => setTwoFactorModalOpen(true);
  const closeTwoFactorModal = () => setTwoFactorModalOpen(false);

  const openManageUsersModal = () => setManageUsersModalOpen(true);
  const closeManageUsersModal = () => setManageUsersModalOpen(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (billingModal) closeBillingModal();
        if (profilePictureModalOpen) closeProfilePictureModal();
        if (twoFactorModalOpen) closeTwoFactorModal();
        if (manageUsersModalOpen) closeManageUsersModal();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [billingModal, profilePictureModalOpen, twoFactorModalOpen, manageUsersModalOpen, companyLogoModalOpen]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setMobileSidebarOpen(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("admin-theme");
    const preferred = stored || settingsTheme || "light";

    if (preferred === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        setSettingsTheme(e.matches ? "dark" : "light");
      };
      media.addEventListener("change", handler);
      return () => media.removeEventListener("change", handler);
    }
  }, [settingsTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("admin-theme", settingsTheme);
  }, [settingsTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("admin-settings-project-defaults");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.status) setSettingsDefaultStatus(parsed.status);
        if (parsed.category) setSettingsDefaultCategory(parsed.category);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("admin-settings-project-defaults", JSON.stringify({
        status: settingsDefaultStatus,
        category: settingsDefaultCategory
      }));
    } catch {
      // ignore
    }
  }, [settingsDefaultStatus, settingsDefaultCategory]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("admin-settings-notifications");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.requests === "boolean") setSettingsNotifyRequests(parsed.requests);
        if (typeof parsed.applications === "boolean") setSettingsNotifyApplications(parsed.applications);
        if (typeof parsed.clients === "boolean") setSettingsNotifyClients(parsed.clients);
        if (typeof parsed.statusEmails === "boolean") setSettingsNotifyStatusEmails(parsed.statusEmails);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("admin-settings-notifications", JSON.stringify({
        requests: settingsNotifyRequests,
        applications: settingsNotifyApplications,
        clients: settingsNotifyClients,
        statusEmails: settingsNotifyStatusEmails
      }));
    } catch {
      // ignore
    }
  }, [settingsNotifyRequests, settingsNotifyApplications, settingsNotifyClients, settingsNotifyStatusEmails]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("admin-settings-language");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.language) setSettingsLanguage(parsed.language);
        if (parsed.timezone) setSettingsTimezone(parsed.timezone);
        if (parsed.dateFormat) setSettingsDateFormat(parsed.dateFormat);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("admin-settings-language", JSON.stringify({
        language: settingsLanguage,
        timezone: settingsTimezone,
        dateFormat: settingsDateFormat
      }));
    } catch {
      // ignore
    }
  }, [settingsLanguage, settingsTimezone, settingsDateFormat]);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.user_metadata?.full_name || "");
      setProfilePhone(currentUser.user_metadata?.phone || "");
    }
  }, [currentUser]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus({ type: "", text: "" });

    if (!profileName.trim()) {
      setProfileStatus({ type: "error", text: "Full name cannot be empty." });
      return;
    }

    setProfileSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profileName.trim(), phone: profilePhone.trim() }
      });

      if (error) {
        setProfileStatus({ type: "error", text: error.message || "Failed to update profile." });
      } else {
        setProfileStatus({ type: "success", text: "Profile updated successfully." });
        if (currentUser) {
          setCurrentUser({
            ...currentUser,
            user_metadata: {
              ...currentUser.user_metadata,
              full_name: profileName.trim(),
              phone: profilePhone.trim()
            }
          });
        }
      }
    } catch (err) {
      setProfileStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleResetProfile = () => {
    if (currentUser) {
      setProfileName(currentUser.user_metadata?.full_name || "");
      setProfilePhone(currentUser.user_metadata?.phone || "");
    }
    setProfileStatus({ type: "", text: "" });
  };

  const requestStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (projectRequests as any[]).forEach((r: any) => {
      const s = String(r.status || "").trim();
      if (!s) return;
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [projectRequests]);

  const projectStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (projectsList as any[]).forEach((p: any) => {
      const s = String(p.status || "").trim();
      if (!s) return;
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [projectsList]);

  const applicationStatusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (jobApplications as any[]).forEach((a: any) => {
      const s = String(a.status || "").trim();
      if (!s) return;
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [jobApplications]);

  const workerAvailabilityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    (skilledWorkers as any[]).forEach((w: any) => {
      const s = String(w.availability || "").trim();
      if (!s) return;
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [skilledWorkers]);

  const monthlyRequestCounts = useMemo(() => {
    const requests = (projectRequests as any[]) || [];
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    let thisMonthCount = 0;
    let lastMonthCount = 0;

    requests.forEach((r: any) => {
      if (!r.created_at) return;
      const d = new Date(r.created_at);
      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
        thisMonthCount += 1;
      } else if (d.getFullYear() === lastMonthYear && d.getMonth() === lastMonth) {
        lastMonthCount += 1;
      }
    });

    return { thisMonthCount, lastMonthCount };
  }, [projectRequests]);

  const timezoneOptions = useMemo(() => {
    const zones: string[] = [];
    try {
      if (typeof Intl !== 'undefined' && Intl.supportedValuesOf) {
        const supported = Intl.supportedValuesOf('timeZone');
        if (Array.isArray(supported) && supported.length > 0) {
          zones.push(...supported);
        }
      }
    } catch {
      // ignore
    }

    if (zones.length === 0) {
      zones.push(
        'Africa/Dar_es_Salaam','Africa/Nairobi','Africa/Johannesburg','Africa/Cairo','Africa/Lagos',
        'America/New_York','America/Los_Angeles','America/Chicago','America/Toronto','America/Sao_Paulo',
        'Antarctica/Casey','Antarctica/Davis','Antarctica/Mawson',
        'Arctic/Longyearbyen',
        'Asia/Dubai','Asia/Tokyo','Asia/Shanghai','Asia/Kolkata','Asia/Singapore','Asia/Hong_Kong',
        'Atlantic/Azores','Atlantic/South_Georgia',
        'Australia/Sydney','Australia/Melbourne','Australia/Perth',
        'Europe/London','Europe/Paris','Europe/Berlin','Europe/Moscow',
        'Indian/Maldives','Indian/Mauritius',
        'Pacific/Auckland','Pacific/Fiji','Pacific/Honolulu','Pacific/Guam'
      );
    }

    const groups: Record<string, string[]> = {};
    zones.forEach((tz: string) => {
      const region = tz.split('/')[0] || 'Other';
      if (!groups[region]) groups[region] = [];
      groups[region].push(tz);
    });

    const sortedGroups: Record<string, string[]> = {};
    Object.keys(groups).sort().forEach((region) => {
      sortedGroups[region] = groups[region].sort();
    });

    return sortedGroups;
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingRequests(true);
      setErrorRequests("");

      // Check auth
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/admin/login");
        return;
      }
      setCurrentUser(userData.user);
      setCheckingAuth(false);

      // project requests
      const { data: projects, error: projectsError } = await supabase
        .from("project_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (projectsError) {
        setErrorRequests("Unable to load project requests.");
        setProjectRequests([]);
      } else {
        setProjectRequests(projects || []);
      }

      // published projects
      const { data: published } = await supabase
        .from("projects")
        .select("id,title,category,location,status,created_at")
        .order("created_at", { ascending: false });

      setProjectsList(published || []);

      // job applications
      const { data: jobs } = await supabase
        .from("job_applications")
        .select("*")
        .order("created_at", { ascending: false });

      setJobApplications(jobs || []);

      // skilled workers
      const { data: workers } = await supabase
        .from("skilled_workers")
        .select("*")
        .order("created_at", { ascending: false });

      setSkilledWorkers(workers || []);
    };

    fetchDashboardData()
      .catch((err) => {
        console.error(err);
        setErrorRequests("Unable to load project requests.");
      })
      .finally(() => setLoadingRequests(false));

  }, []);





  const updateProjectStatus = async (
    id:string,
    newStatus:string
  ) => {
    const current = projectRequests.find((p) => p.id === id);
    const oldStatus = current?.status;
    if (oldStatus === newStatus) return;

    const { error } = await supabase
      .from("project_requests")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Failed to update project status", error);
      return;
    }

    setProjectRequests(
      projectRequests.map((project) =>
        project.id === id ? { ...project, status: newStatus } : project
      )
    );

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        console.error("Failed to send status email: no valid admin session.");
        return;
      }

      const response = await fetch("/api/project-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          client_name: current?.client_name,
          email: current?.email,
          project_type: current?.project_type,
          new_status: newStatus,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 401) {
          console.error("Failed to send status email: admin session is invalid or expired.");
        } else if (response.status === 403) {
          console.error("Failed to send status email: current account is not authorized as an admin.");
        } else {
          console.error("Failed to send status email:", response.status, text);
        }
      }
    } catch (e) {
      console.error("Failed to send status email", e);
    }
  };








  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ type: "", text: "" });
    if (!passwordCurrent || !passwordNew || !passwordConfirm) {
      setPasswordStatus({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (passwordNew.length < 8) {
      setPasswordStatus({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (passwordNew !== passwordConfirm) {
      setPasswordStatus({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordNew });
      if (error) {
        setPasswordStatus({ type: "error", text: error.message || "Failed to update password." });
      } else {
        setPasswordStatus({ type: "success", text: "Password updated successfully." });
        setPasswordCurrent("");
        setPasswordNew("");
        setPasswordConfirm("");
      }
    } catch (err) {
      setPasswordStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!currentUser?.email) return;
    setResendStatus({ type: "", text: "" });
    setResendLoading(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: currentUser.email });
      if (error) {
        setResendStatus({ type: "error", text: error.message || "Failed to resend verification email." });
      } else {
        setResendStatus({ type: "success", text: "Verification email sent." });
      }
    } catch (err) {
      setResendStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setResendLoading(false);
    }
  };

  const deleteProject = async (
    id:string
  ) => {
    // open confirmation modal instead of immediate confirm
    setPendingDeleteId(id);
  };

  const confirmDelete = async () => {
    if(!pendingDeleteId) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    await supabase
      .from("project_requests")
      .delete()
      .eq("id",id);

    setProjectRequests(
      projectRequests.filter(
        project=>project.id !== id
      )
    );
  };

  const cancelDelete = () => setPendingDeleteId(null);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage({ type: "", text: "" });

    if (!newProject.title || !newProject.category || !newProject.location || !newProject.description || !newProject.status) {
      setSaveMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    setSavingProject(true);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      console.log("WELMEG ADMIN SESSION:", {
        hasSession: !!sessionData.session,
        email: sessionData.session?.user?.email ?? null,
        userId: sessionData.session?.user?.id ?? null,
        role: sessionData.session?.user?.app_metadata?.role ?? null,
        sessionError: sessionError?.message ?? null,
      });

      if (!sessionData.session) {
        setSaveMessage({ type: "error", text: "Your admin session has expired. Please log in again." });
        setSavingProject(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            title: newProject.title,
            category: newProject.category,
            location: newProject.location,
            description: newProject.description,
            status: newProject.status,
            image_url: newProject.image_url || null,
          },
        ])
        .select()
        .single();

      if (error) {
        setSaveMessage({ type: "error", text: error.message || "Failed to save project." });
      } else {
        setProjectsList([data, ...projectsList]);
        setNewProject({
          title: "",
          category: "",
          description: "",
          location: "",
          status: "published",
          image_url: "",
        });
        setSelectedFile(null);
        setGalleryFiles([]);
        setGalleryPreviews([]);
        setShowAddForm(false);
        setSaveMessage({ type: "success", text: "Project added successfully!" });
      }
    } catch (err) {
      setSaveMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSavingProject(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewProject((prev) => ({ ...prev, [field]: value }));
  };

const logout = async () => {

  await supabase.auth.signOut();

  router.push("/admin/login");

};




  const updateJobStatus = async(
    id:string,
    newStatus:string
  ) => {


    await supabase
      .from("job_applications")
      .update({
        status:newStatus
      })
      .eq("id",id);



    setJobApplications(
      jobApplications.map((job)=>(
        job.id === id
        ?
        {
          ...job,
          status:newStatus
        }
        :
        job
      ))
    );


  };






  const deleteJobApplication = async(
    id:string
  ) => {


    const confirmDelete = window.confirm(
      "Delete this application?"
    );


    if(!confirmDelete) return;



    await supabase
      .from("job_applications")
      .delete()
      .eq("id",id);



    setJobApplications(
      jobApplications.filter(
        job=>job.id !== id
      )
    );


  };


  const handleViewCv = async (cvPath: string, jobId: string) => {
    if (viewingCvId) return;
    setViewingCvId(jobId);
    setViewCvError("");
    try {
      const { data, error } = await supabase.storage
        .from("cvs")
        .createSignedUrl(cvPath, 60);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank");
      } else {
        throw new Error("Could not generate signed URL.");
      }
    } catch {
      setViewCvError("Failed to open CV. Please try again.");
    } finally {
      setViewingCvId(null);
    }
  };



  const updateWorkerAvailability = async(
    id:string,
    availability:string
  ) => {


    await supabase
      .from("skilled_workers")
      .update({
        availability
      })
      .eq("id",id);



    setSkilledWorkers(
      skilledWorkers.map((worker)=>(
        worker.id === id
        ?
        {
          ...worker,
          availability
        }
        :
        worker
      ))
    );


  };





  const deleteWorker = async(
    id:string
  ) => {


    const confirmDelete = window.confirm(
      "Delete this worker?"
    );


    if(!confirmDelete) return;



    await supabase
      .from("skilled_workers")
      .delete()
      .eq("id",id);



    setSkilledWorkers(
      skilledWorkers.filter(
        worker=>worker.id !== id
      )
    );


  };
  const clearRequestId = useCallback(() => {
    router.replace("/admin");
  }, [router]);

  if (checkingAuth) {
  return null;
}
  return (

    <div className={`admin-page ${settingsTheme === "dark" ? "admin-dark" : settingsTheme === "system" ? "admin-system" : ""}`}>
      <Sidebar mobileOpen={mobileSidebarOpen} onSectionChange={handleSectionChange} />

      {/* overlay for mobile sidebar */}
      <div className={`sidebar-overlay ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)} />

       <main className="admin-main">
         <Suspense fallback={null}>
           <ProjectRequestDeepLink
             projectRequests={projectRequests}
             onSelectProject={setSelectedProject}
             onClearParams={clearRequestId}
           />
         </Suspense>

          <header className="admin-topbar">
           <div className="topbar-left">
             <button className="mobile-menu-toggle" aria-label="Toggle menu" onClick={() => setMobileSidebarOpen((open) => !open)}>☰</button>
               <div className="topbar-title" style={{ borderLeft: "3px solid #d4af37", paddingLeft: 12 }}>
                 <h1 className="page-title" style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.2px" }}>
                   {activeSection === "dashboard"
                     ? "Dashboard"
                     : activeSection === "projects"
                       ? "Projects"
                       : activeSection === "requests"
                         ? "Project Requests"
                         : activeSection === "workers"
                           ? "Skilled Workers"
                           : activeSection === "clients"
                             ? "Clients"
                             : activeSection === "applications"
                               ? "Job Applications"
                               : activeSection === "reports"
                                 ? "Reports"
                                 : activeSection === "settings"
                                   ? "Settings"
                                   : "Dashboard"}
                 </h1>
                 <p className="page-sub" style={{ marginTop: 2 }}>Welcome to WELMEG Admin Panel</p>
               </div>
           </div>

          <div className="topbar-right">
            {/* Notification center component (uses same visual bell but adds badge and dropdown) */}
            <NotificationCenter />
            <div className="topbar-user">
              <div className="user-avatar">W</div>
              <div className="user-name">Admin</div>
            </div>
          </div>
        </header>


        <div className="admin-main-content">
          {activeSection === "dashboard" && (
            <div className="overview">
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="8" height="8" rx="1" fill="#d4af37" />
                    <rect x="13" y="3" width="8" height="5" rx="1" fill="#07132a" opacity="0.06" />
                    <rect x="13" y="10" width="8" height="11" rx="1" fill="#07132a" opacity="0.04" />
                  </svg>
                </div>
                <div className="stat-body">
                  <div className="stat-title">Total Projects</div>
                  <div className="stat-value">{projectsList.length}</div>
                  <div className="stat-desc">All published projects</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 7h18v10H3z" fill="#07132a" opacity="0.04" />
                    <path d="M3 7l9 6 9-6" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="stat-body">
                  <div className="stat-title">Project Requests</div>
                  <div className="stat-value">{projectRequests.length}</div>
                  <div className="stat-desc">Requests awaiting review</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="9" cy="8" r="3" fill="#d4af37" />
                    <rect x="3" y="13" width="12" height="6" rx="2" fill="#07132a" opacity="0.04" />
                  </svg>
                </div>
                <div className="stat-body">
                  <div className="stat-title">Skilled Workers</div>
                  <div className="stat-value">{skilledWorkers.length}</div>
                  <div className="stat-desc">Registered workers</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="3" width="16" height="18" rx="2" fill="#07132a" opacity="0.03" />
                    <path d="M8 7h8M8 11h8" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="stat-body">
                  <div className="stat-title">Job Applications</div>
                  <div className="stat-value">{jobApplications.length}</div>
                  <div className="stat-desc">Recent applications</div>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <div className="quick-actions-card">
                <div className="qa-title">Quick Actions</div>
                <div className="qa-buttons">
                   <button className="btn-primary admin-add-project-btn" onClick={() => { setSaveMessage({type: "", text: ""}); setActiveSection("add"); }}>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#07132a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                      <span> {showAddForm ? 'Close' : 'Add Project'}</span>
                                    </button>
                                    <button className="btn-secondary" onClick={() => { /* view projects */ window.location.href = '/projects' }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round"/></svg>
                                      <span> View Projects</span>
                                    </button>
                                    <button className="btn-secondary" onClick={() => { /* view requests */ window.scrollTo({ top: 1000, behavior: 'smooth' }) }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7l9 6 9-6" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                      <span> Project Requests</span>
                                    </button>
                                    <button className="btn-secondary" onClick={() => { window.scrollTo({ top: 1600, behavior: 'smooth' }) }}>
                                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="3" width="16" height="18" rx="2" fill="#07132a" opacity="0.03"/><path d="M8 7h8M8 11h8" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round"/></svg>
                                      <span> Job Applications</span>
                                    </button>
               </div>
                </div>
                </div>
                </div>
                
           )}

             {activeSection === "add" && (
              <div className="card" style={{ marginTop: 12 }}>
                <div className="card-header">
                  <h3>Add New Project</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleAddProject} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Project Title *"
                        value={newProject.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Category *"
                        value={newProject.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input
                        type="text"
                        placeholder="Location *"
                        value={newProject.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        required
                      />
                      <select
                        value={newProject.status}
                        onChange={(e) => handleInputChange("status", e.target.value)}
                        required
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Project Description *"
                      rows={4}
                      value={newProject.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Image URL (optional, e.g. /images/optimized/my-project.webp)"
                      value={newProject.image_url}
                      onChange={(e) => handleInputChange("image_url", e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <button type="submit" className="btn-primary" disabled={savingProject}>
                        {savingProject ? "Saving..." : "Save Project"}
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => { setActiveSection("dashboard"); setSaveMessage({ type: "", text: "" }); }}>
                        Cancel
                      </button>
                                            {saveMessage.text && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 13,
                            color: saveMessage.type === "error" ? "#b91c1c" : "#047857",
                            background: saveMessage.type === "error" ? "#fef2f2" : "#ecfdf5",
                            padding: "6px 10px",
                            borderRadius: 6,
                          }}
                        >
                          {saveMessage.text}
                        </span>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

                    {activeSection === "requests" && (
            <div className="toolbar">
              <div className="search-filter">
                <input
                  type="text"
                  placeholder="Search project requests..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="filters">
                  {['All','Pending','Reviewing','Approved','Completed'].map(f => (
                    <button
                      key={f}
                      className={`filter-btn ${statusFilter===f ? 'active' : ''}`}
                      onClick={() => setStatusFilter(f)}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="content"></div>

             {(activeSection === "requests") && (
            <section className="card">
              <div className="card-header">
                <h3>Recent Project Requests</h3>
              </div>
                 <div className="card-body">
                   {loadingRequests ? (
                     <div className="loading-state">Loading project requests…</div>
                   ) : errorRequests ? (
                     <div className="error-state">
                       <p>{errorRequests}</p>
                       <button className="btn-primary" onClick={async ()=>{
                         setLoadingRequests(true);
                         setErrorRequests("");
                         try {
                           const { data: projects, error } = await supabase
                             .from("project_requests")
                             .select("*")
                             .order("created_at", { ascending: false });
                           if (error) throw error;
                           setProjectRequests(projects || []);
                         } catch (err) {
                           console.error(err);
                           setErrorRequests("Unable to load project requests.");
                         } finally {
                           setLoadingRequests(false);
                         }
                       }}>Retry</button>
                     </div>
                   ) : projectRequests.length === 0 ? (
                     <div className="empty-state">
                       <div className="empty-title">No Project Requests</div>
                       <div className="empty-sub">New client project requests will appear here.</div>
                     </div>
                   ) : (
                     <div className="table-responsive">
                       <table className="table">
                         <thead>
                           <tr>
                             <th>Client</th>
                             <th>Project Type</th>
                             <th>Location</th>
                             <th>Status</th>
                             <th>Date</th>
                             <th>Action</th>
                           </tr>
                         </thead>
                         <tbody>
                           {projectRequests
                             .filter((p:any)=> {
                               const q = search.trim().toLowerCase();
                               if (!q) return true;
                               return [p.client_name, p.email, p.project_type, p.location]
                                 .filter(Boolean)
                                 .some((v:any)=> String(v).toLowerCase().includes(q));
                             })
                             .filter((p:any)=> statusFilter === 'All' ? true : p.status === statusFilter)
                             .sort((a:any,b:any)=> new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                             .map((p:any)=> (
                               <tr key={p.id}>
                                 <td>{p.client_name || '—'}<br/><small className="muted">{p.email}</small></td>
                                 <td>{p.project_type || '—'}</td>
                                 <td>{p.location || '—'}</td>
                                 <td><span className={`badge req-${(p.status||'').toLowerCase()}`}>{p.status || 'Pending'}</span></td>
                                 <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</td>
                                 <td>
                                   <div className="table-actions">
                                     <button className="btn-small" onClick={()=> setSelectedProject(p)}>View</button>
                                      <select value={p.status || 'Pending'} onChange={(e)=> updateProjectStatus(p.id, e.target.value)}>
                                        <option>Pending</option>
                                        <option>Reviewing</option>
                                        <option>Approved</option>
                                        <option>Rejected</option>
                                        <option>Completed</option>
                                      </select>
                                     <button className="delete-btn" onClick={()=> deleteProject(p.id)}>Delete</button>
                                   </div>
                                 </td>
                               </tr>
                             ))}
                         </tbody>
                       </table>
                     </div>
                )}
              </div>
             </section>
            )}

             {activeSection === "projects" && (
            <section className="card">
              <div className="card-header">
                <h3>Published Projects</h3>
              </div>
              <div className="card-body">
                {projectsList.length === 0 ? (
                  <div className="empty-state">No published projects found.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Project</th>
                          <th>Category</th>
                          <th>Location</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectsList.map((p:any)=> (
                          <tr key={p.id}>
                            <td className="thumb-col"><img src={p.image_url || '/images/optimized/construction-1024.webp'} alt={p.title} width={80} height={60} style={{objectFit:'cover',borderRadius:6}}/></td>
                            <td>{p.title}</td>
                            <td>{p.category}</td>
                            <td>{p.location}</td>
                            <td><span className={`badge status-${p.status?.toLowerCase()}`}>{p.status}</span></td>
                            <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : ''}</td>
                            <td><button className="btn-small" onClick={()=> setSelectedProject(p)}>View</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
               </div>
            </section>
            )}
             {activeSection === "applications" && (
             <section className="card">
              <div className="card-header">
                <h3>Job Applications</h3>
              </div>
              <div className="card-body">
                {jobApplications.length === 0 ? (
                  <div className="empty-state">No job applications yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Applicant</th>
                          <th>Position</th>
                          <th>Email</th>
                          <th>Experience</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobApplications.map((job:any)=> (
                          <tr key={job.id}>
                            <td>{job.full_name}</td>
                            <td>{job.position}</td>
                            <td>{job.email}</td>
                            <td>{job.experience}</td>
                            <td>{job.status}</td>
                            <td>
                              <div className="table-actions">
                                {job.cv_url ? (
  <button
    className="cv-btn"
    type="button"
    onClick={() => handleViewCv(job.cv_url, job.id)}
    disabled={viewingCvId === job.id}
    title="View CV"
  >
    {viewingCvId === job.id ? "Opening..." : "View CV"}
  </button>
) : (
  <span className="muted">No CV</span>
)}
                                <select value={job.status} onChange={(e)=> updateJobStatus(job.id, e.target.value)}>
                                  <option>Pending</option>
                                  <option>Reviewing</option>
                                  <option>Approved</option>
                                  <option>Rejected</option>
                                </select>
                                <button className="delete-btn" onClick={()=> deleteJobApplication(job.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
             </section>
            )}

             {(activeSection === "workers") && (
            <section className="card">
              <div className="card-header">
                <h3>Skilled Workers</h3>
              </div>
              <div className="card-body">
                {skilledWorkers.length === 0 ? (
                  <div className="empty-state">No skilled workers registered yet.</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Skill</th>
                          <th>Phone</th>
                          <th>Location</th>
                          <th>Experience</th>
                          <th>Availability</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skilledWorkers.map((worker:any)=> (
                          <tr key={worker.id}>
                            <td>{worker.full_name}</td>
                            <td>{worker.skill_type}</td>
                            <td>{worker.phone}</td>
                            <td>{worker.location}</td>
                            <td>{worker.experience}</td>
                            <td>
                              <select value={worker.availability} onChange={(e)=> updateWorkerAvailability(worker.id, e.target.value)}>
                                <option value="Available">Available</option>
                                <option value="Busy">Busy</option>
                                <option value="Offline">Offline</option>
                              </select>
                            </td>
                            <td><button className="delete-btn" onClick={()=> deleteWorker(worker.id)}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
             </section>
            )}

             {(activeSection === "clients") && (
            <section className="card">
              <div className="card-header">
                <h3>Clients</h3>
              </div>
              <div className="card-body">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={clientsSearch}
                  onChange={(e) => setClientsSearch(e.target.value)}
                  style={{ marginBottom: 12, padding: 8, width: "100%", maxWidth: 400 }}
                />
                {(() => {
                  const uniqueClients = (() => {
                    const map = new Map<string, any>();
                    (projectRequests as any[]).forEach((req: any) => {
                      const email = req.email?.trim();
                      if (!email) return;
                      const existing = map.get(email);
                      if (!existing) {
                        map.set(email, {
                          client_name: req.client_name || "—",
                          email,
                          phone: req.phone || "—",
                          location: req.location || "—",
                          requestCount: 1,
                          lastRequest: req.created_at || "",
                          requests: [req],
                        });
                      } else {
                        existing.requestCount += 1;
                        if (req.created_at && new Date(req.created_at).getTime() > new Date(existing.lastRequest).getTime()) {
                          existing.lastRequest = req.created_at;
                        }
                        existing.requests.push(req);
                      }
                    });
                    return Array.from(map.values());
                  })();

                  const filteredClients = uniqueClients.filter((c: any) => {
                    const q = clientsSearch.trim().toLowerCase();
                    if (!q) return true;
                    return [c.client_name, c.email, c.phone, c.location]
                      .filter(Boolean)
                      .some((v: any) => String(v).toLowerCase().includes(q));
                  });

                  if (filteredClients.length === 0) {
                    return (
                      <div className="empty-state">
                        <div className="empty-title">No clients found yet.</div>
                        <div className="empty-sub">Clients will appear here after submitting project requests.</div>
                      </div>
                    );
                  }

                  return (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Location</th>
                            <th>Requests</th>
                            <th>Last Request</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClients.map((c: any) => (
                            <tr key={c.email}>
                              <td>{c.client_name}</td>
                              <td>{c.email}</td>
                              <td>{c.phone}</td>
                              <td>{c.location}</td>
                              <td>{c.requestCount}</td>
                              <td>{c.lastRequest ? new Date(c.lastRequest).toLocaleDateString() : ""}</td>
                              <td><button className="btn-small" onClick={() => setSelectedClient(c)}>View Details</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
             </section>
            )}

             {(activeSection === "reports") && (
            <section className="card">
              <div className="card-header">
                <h3>Reports</h3>
              </div>
              <div className="card-body">
                {(() => {
                  const totalRequests = (projectRequests as any[])?.length || 0;
                  const totalProjects = (projectsList as any[])?.length || 0;
                  const totalApplications = (jobApplications as any[])?.length || 0;
                  const totalWorkers = (skilledWorkers as any[])?.length || 0;

                  const renderBreakdown = (title: string, counts: Record<string, number>) => (
                    <div className="stat-card" style={{ flex: "1 1 200px" }}>
                      <div className="stat-body">
                        <div className="stat-title">{title}</div>
                        <div className="stat-value" style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>
                          {Object.keys(counts).length === 0 ? (
                            <span style={{ color: "#6b7280" }}>No data</span>
                          ) : (
                            Object.entries(counts).map(([key, value]) => (
                              <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
                                <span style={{ textTransform: "capitalize" }}>{key}</span>
                                <span className="badge" style={{ background: "#0b1f3a", color: "#d4af37" }}>{value}</span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  );

                  const { thisMonthCount, lastMonthCount } = monthlyRequestCounts;
                  const monthDiff = thisMonthCount - lastMonthCount;
                  const monthDiffText = monthDiff > 0
                    ? `+${monthDiff} compared with last month`
                    : monthDiff < 0
                      ? `${monthDiff} compared with last month`
                      : "No change from last month";

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                        <div className="stat-card">
                          <div className="stat-icon">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3 7h18v10H3z" fill="#07132a" opacity="0.04" />
                              <path d="M3 7l9 6 9-6" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="stat-body">
                            <div className="stat-title">Total Project Requests</div>
                            <div className="stat-value">{totalRequests}</div>
                            <div className="stat-desc">All time</div>
                          </div>
                        </div>

                        <div className="stat-card">
                          <div className="stat-icon">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="3" width="8" height="8" rx="1" fill="#d4af37" />
                              <rect x="13" y="3" width="8" height="5" rx="1" fill="#07132a" opacity="0.06" />
                              <rect x="13" y="10" width="8" height="11" rx="1" fill="#07132a" opacity="0.04" />
                            </svg>
                          </div>
                          <div className="stat-body">
                            <div className="stat-title">Total Projects</div>
                            <div className="stat-value">{totalProjects}</div>
                            <div className="stat-desc">Published projects</div>
                          </div>
                        </div>

                        <div className="stat-card">
                          <div className="stat-icon">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="4" y="3" width="16" height="18" rx="2" fill="#07132a" opacity="0.03" />
                              <path d="M8 7h8M8 11h8" stroke="#d4af37" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div className="stat-body">
                            <div className="stat-title">Total Job Applications</div>
                            <div className="stat-value">{totalApplications}</div>
                            <div className="stat-desc">All time</div>
                          </div>
                        </div>

                        <div className="stat-card">
                          <div className="stat-icon">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="9" cy="8" r="3" fill="#d4af37" />
                              <rect x="3" y="13" width="12" height="6" rx="2" fill="#07132a" opacity="0.04" />
                            </svg>
                          </div>
                          <div className="stat-body">
                            <div className="stat-title">Total Skilled Workers</div>
                            <div className="stat-value">{totalWorkers}</div>
                            <div className="stat-desc">Registered workers</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                        {renderBreakdown("Project Request Status", requestStatusCounts)}
                        {renderBreakdown("Project Status", projectStatusCounts)}
                        {renderBreakdown("Job Application Status", applicationStatusCounts)}
                        {renderBreakdown("Worker Availability", workerAvailabilityCounts)}
                      </div>

                      <div className="stat-card" style={{ maxWidth: 400 }}>
                        <div className="stat-body">
                          <div className="stat-title">Monthly Request Comparison</div>
                          <div className="stat-value" style={{ fontSize: 14, marginTop: 8 }}>
                            <div style={{ marginBottom: 4 }}>This month: <strong>{thisMonthCount}</strong></div>
                            <div style={{ marginBottom: 4 }}>Last month: <strong>{lastMonthCount}</strong></div>
                            <div style={{ color: monthDiff > 0 ? "#047857" : monthDiff < 0 ? "#b91c1c" : "#6b7280" }}>{monthDiffText}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              </section>
              )}

                {activeSection === "settings" && (
                <div className="settings-layout">
                  <aside className="settings-nav">
                    <div className="settings-nav-header">SETTINGS</div>
                    <nav>
                      <div className="settings-nav-section">ACCOUNT</div>
                      <button className={`settings-nav-item ${settingsTab === "profile" ? "active" : ""}`} onClick={() => setSettingsTab('profile')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Profile
                      </button>
                      <button className={`settings-nav-item ${settingsTab === "security" ? "active" : ""}`} onClick={() => setSettingsTab('security')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                        Security
                      </button>

                      <div className="settings-nav-section">COMPANY</div>
                      <button className={`settings-nav-item ${settingsTab === "company" ? "active" : ""}`} onClick={() => setSettingsTab('company')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                        Company Profile
                      </button>

                      <div className="settings-nav-section">PROJECTS</div>
                      <button className={`settings-nav-item ${settingsTab === "projects" ? "active" : ""}`} onClick={() => setSettingsTab('projects')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h18"/><rect x="3" y="9" width="6" height="10" rx="1"/><rect x="9" y="9" width="12" height="10" rx="1"/></svg>
                        Project Defaults
                      </button>

                      <div className="settings-nav-section">DOCUMENTS</div>
                      <button className={`settings-nav-item ${settingsTab === "documents" ? "active" : ""}`} onClick={() => setSettingsTab('documents')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round"/></svg>
                        Document Templates
                      </button>

                      <div className="settings-nav-section">NOTIFICATIONS</div>
                      <button className={`settings-nav-item ${settingsTab === "notifications" ? "active" : ""}`} onClick={() => setSettingsTab('notifications')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 003.4 0"/></svg>
                        Notifications
                      </button>

                      <div className="settings-nav-section">LANGUAGE & REGION</div>
                      <button className={`settings-nav-item ${settingsTab === "language" ? "active" : ""}`} onClick={() => setSettingsTab('language')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                        Language & Region
                      </button>

                      <div className="settings-nav-section">APPEARANCE</div>
                      <button className={`settings-nav-item ${settingsTab === "appearance" ? "active" : ""}`} onClick={() => setSettingsTab('appearance')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                        Theme & Appearance
                      </button>

                      <div className="settings-nav-section">INTEGRATIONS</div>
                      <button className={`settings-nav-item ${settingsTab === "integrations" ? "active" : ""}`} onClick={() => setSettingsTab('integrations')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 18a6 6 0 100-12 6 6 0 000 12z"/><circle cx="12" cy="12" r="2"/></svg>
                        Integrations
                      </button>

                      <div className="settings-nav-section">BILLING</div>
                      <button className={`settings-nav-item ${settingsTab === "billing" ? "active" : ""}`} onClick={() => setSettingsTab('billing')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20"/><path d="M9 21V9"/></svg>
                        Billing & Subscription
                      </button>

                      <div className="settings-nav-section">ADMINISTRATION</div>
                      <button className={`settings-nav-item ${settingsTab === "administration" ? "active" : ""}`} onClick={() => setSettingsTab('administration')}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                        Manage Users & Roles
                      </button>
                    </nav>
                  </aside>
                  <div className="settings-main">
                <section className="card">
                  <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: "#d4af37" }}>
                      <path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06A2 2 0 113.53 16.9l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82L4.2 3.53A2 2 0 116.9 3.53l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001.51 1V9a2 2 0 114 0V8.91a1.65 1.65 0 001-1.51h.09a2 2 0 110 4h-.09a1.65 1.65 0 00-1 1.51V15c.12.35.33.68.6.97z" fill="currentColor" opacity="0.18" />
                    </svg>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 16, color: "#07132a" }}>Settings</h3>
                      <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>Manage your administrator account, dashboard preferences, notifications, security, and system defaults.</p>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                       {/* Profile Settings */}
                       {settingsTab === "profile" && (
                       <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                         <div className="stat-body">
                           <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Profile Settings</div>

                          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                             <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#0b1f3a", color: "#d4af37", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, flexShrink: 0, border: "2px solid #d4af37", overflow: "hidden", cursor: "pointer" }} onClick={openProfilePictureModal}>
                               {currentUser?.user_metadata?.avatar_url ? (
                                 <img src={currentUser.user_metadata.avatar_url} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                               ) : (
                                 (profileName || currentUser?.email || "A").charAt(0).toUpperCase()
                               )}
                             </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, color: "#6b7280" }}>Administrator Account</div>
                              <div style={{ fontSize: 14, color: "#07132a", fontWeight: 600, marginTop: 2 }}>{currentUser?.app_metadata?.role || "admin"}</div>
                            </div>
                          </div>

                          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Full Name</label>
                              <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Enter your full name" style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, background: "#fff", color: "#07132a" }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Email</label>
                              <div style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, background: "#f9fafb", color: "#6b7280", display: "flex", alignItems: "center", gap: 8 }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0, opacity: 0.7 }}>
                                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
                                  <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {currentUser?.email || "—"}
                              </div>
                              <span style={{ fontSize: 12, color: "#6b7280" }}>Email cannot be changed from this page.</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Phone Number</label>
                              <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="Coming Soon" disabled style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, background: "#f9fafb", color: "#9ca3af" }} />
                              <span style={{ fontSize: 12, color: "#6b7280" }}>Phone storage requires a profiles table.</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Role</label>
                              <div style={{ padding: "8px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, background: "#f9fafb", display: "flex", alignItems: "center", gap: 8 }}>
                                <span className="badge" style={{ background: "#0b1f3a", color: "#d4af37" }}>{currentUser?.app_metadata?.role || "admin"}</span>
                                <span style={{ fontSize: 12, color: "#6b7280" }}>Read-only</span>
                              </div>
                            </div>

                                                        {profileStatus.text && (
                              <div style={{ fontSize: 13, color: profileStatus.type === "error" ? "#b91c1c" : "#065f46", padding: "8px 10px", borderRadius: 6, background: profileStatus.type === "error" ? "#fef2f2" : "#ecfdf5" }}>
                                {profileStatus.text}
                              </div>
                            )}

                            <div style={{ display: "flex", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
                              <button type="submit" className="btn-primary" disabled={profileSaving}>
                                {profileSaving ? "Saving..." : "Save Changes"}
                              </button>
                              <button type="button" className="btn-secondary" onClick={handleResetProfile}>Reset</button>
                            </div>
                          </form>
                        </div>
                       </div>
                       )}

                       {/* Security */}
                       {settingsTab === "security" && (
                       <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                        <div className="stat-body">
                          <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Security</div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, fontSize: 13, color: "#374151", marginBottom: 12 }}>
                            <div><strong>Last Sign In:</strong> {currentUser?.last_sign_in_at ? new Date(currentUser.last_sign_in_at).toLocaleString(settingsLanguage, { timeZone: settingsTimezone }) : "—"}</div>
                            <div><strong>Email Confirmed:</strong> {currentUser?.email_confirmed_at ? <span style={{ color: "#065f46" }}>Verified</span> : <span style={{ color: "#991b1b" }}>Not verified</span>}</div>
                            <div><strong>Session:</strong> <span style={{ color: "#065f46" }}>Active</span></div>
                          </div>

                          {!currentUser?.email_confirmed_at && (
                            <div style={{ marginBottom: 12 }}>
                              <button className="btn-secondary" disabled={resendLoading} onClick={handleResendVerification}>
                                {resendLoading ? "Sending..." : "Resend Verification Email"}
                              </button>
                              {resendStatus.text && (
                                <span style={{ marginLeft: 10, fontSize: 12, color: resendStatus.type === "error" ? "#b91c1c" : "#065f46" }}>{resendStatus.text}</span>
                              )}
                            </div>
                          )}

                          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, padding: 12, border: "1px solid #f1f5f9", borderRadius: 8, background: "#fafafa" }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#07132a" }}>Change Password</div>
                            <input type="password" placeholder="Current password" value={passwordCurrent} onChange={(e) => setPasswordCurrent(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }} />
                            <input type="password" placeholder="New password" value={passwordNew} onChange={(e) => setPasswordNew(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }} />
                            <input type="password" placeholder="Confirm new password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13 }} />
                            {passwordStatus.text && <span style={{ fontSize: 12, color: passwordStatus.type === "error" ? "#b91c1c" : "#065f46" }}>{passwordStatus.text}</span>}
                            <button type="submit" className="btn-primary" disabled={passwordLoading}>
                              {passwordLoading ? "Updating..." : "Update Password"}
                            </button>
                          </form>

                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                            <button className="btn-secondary" onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); }}>Sign Out</button>
                          </div>

                           <div style={{ marginTop: 10 }}>
                             <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 10, border: "1px solid #f1f5f9", borderRadius: 8, background: "#fafafa", cursor: "pointer" }} onClick={openTwoFactorModal}>
                               <div>
                                 <div style={{ fontSize: 13, fontWeight: 500, color: "#07132a" }}>Two-Factor Authentication</div>
                                 <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>Additional account protection will be available in a future security update.</div>
                               </div>
                               <span className="badge" style={{ background: "#fff7ed", color: "#7a4b00" }}>Coming Soon</span>
                             </div>
                           </div>

                          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                              <path d="M12 2L1 21h22L12 2z" stroke="#6b7280" strokeWidth="1.4" strokeLinejoin="round" />
                              <path d="M12 9v4" stroke="#6b7280" strokeWidth="1.4" strokeLinecap="round" />
                              <circle cx="12" cy="17" r="1" fill="#6b7280" />
                            </svg>
                            Never share your password, authentication codes, or security credentials with anyone.
                          </div>
                        </div>
                       </div>
                       )}

                       {/* Manage Users & Roles */}
                       {settingsTab === "administration" && (
                       <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 8, cursor: "pointer" }} onClick={openManageUsersModal}>
                        <div className="stat-body">
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <div className="stat-title" style={{ fontSize: 13 }}>Manage Users & Roles</div>
                            <span className="badge" style={{ background: "#fff7ed", color: "#7a4b00" }}>Coming Soon</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>
                            User and role management will be available when the administrator management system is connected.
                          </div>
                        </div>
                       </div>
                       )}

                      {/* Project Defaults */}
                      {settingsTab === "projects" && (
                      <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                       <div className="stat-body">
                         <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Project Defaults</div>
                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                           <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                             <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Default Project Status</label>
                             <select value={settingsDefaultStatus} onChange={(e) => setSettingsDefaultStatus(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, background: "#fff", color: "#07132a" }}>
                               <option>Pending</option>
                               <option>Reviewing</option>
                               <option>Approved</option>
                               <option>Rejected</option>
                               <option>Completed</option>
                             </select>
                             <span style={{ fontSize: 12, color: "#6b7280" }}>Used when creating new projects.</span>
                           </div>
                           <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                             <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Default Project Category</label>
                             <input type="text" value={settingsDefaultCategory} onChange={(e) => setSettingsDefaultCategory(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, background: "#fff", color: "#07132a" }} />
                             <span style={{ fontSize: 12, color: "#6b7280" }}>Pre-filled category for new project entries.</span>
                                         </div>
                           </div>
                         </div>
                       </div>
                       )}

                      {/* Notification Preferences */}
                      {settingsTab === "notifications" && (
                      <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                       <div className="stat-body">
                         <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Notification Preferences</div>
                         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                           {[
                             { label: "New Project Request Notifications", desc: "Show alerts when a client submits a new project request.", checked: settingsNotifyRequests, onChange: setSettingsNotifyRequests },
                             { label: "New Job Application Notifications", desc: "Show alerts when a new job application is submitted.", checked: settingsNotifyApplications, onChange: setSettingsNotifyApplications },
                             { label: "New Client / Request Notifications", desc: "Show alerts for new client registrations and requests.", checked: settingsNotifyClients, onChange: setSettingsNotifyClients },
                             { label: "Project Status Email Notifications", desc: "Send status update emails to clients when requests change.", checked: settingsNotifyStatusEmails, onChange: setSettingsNotifyStatusEmails },
                           ].map((item) => (
                             <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", border: "1px solid #f1f5f9", borderRadius: 8, background: "#fafafa" }}>
                               <div style={{ flex: 1, minWidth: 0 }}>
                                 <div style={{ fontSize: 13, color: "#07132a", fontWeight: 500 }}>{item.label}</div>
                                 <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{item.desc}</div>
                               </div>
                               <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
                                 <input type="checkbox" checked={item.checked} onChange={(e) => item.onChange(e.target.checked)} style={{ opacity: 0, width: 0, height: 0 }} />
                                 <span style={{ width: 38, height: 20, background: item.checked ? "#d4af37" : "#d1d5db", borderRadius: 999, position: "relative", transition: "background .2s" }}>
                                   <span style={{ width: 16, height: 16, background: "#fff", borderRadius: "50%", position: "absolute", top: 2, left: item.checked ? 20 : 2, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
                                 </span>
                               </label>
                             </div>
                           ))}
                         </div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Notification preferences are saved locally and persist across sessions.</div>
                       </div>
                      </div>
                      )}

                      {/* Language & Region */}
                      {settingsTab === "language" && (
                      <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                       <div className="stat-body">
                         <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Language & Region</div>
                         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                           <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                             <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Language</label>
                              <select value={settingsLanguage} onChange={(e) => setSettingsLanguage(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, background: "#fff", color: "#07132a" }}>
                                <option value="en">English</option>
                                <option value="sw">Kiswahili</option>
                                <option value="fr">Français</option>
                                <option value="es">Español</option>
                                <option value="de">Deutsch</option>
                                <option value="it">Italiano</option>
                                <option value="pt">Português</option>
                                <option value="ar">العربية</option>
                                <option value="zh">中文</option>
                                <option value="ja">日本語</option>
                              </select>
                           </div>
                           <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                             <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Time Zone</label>
                              <select value={settingsTimezone} onChange={(e) => setSettingsTimezone(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, background: "#fff", color: "#07132a" }}>
                                {Object.entries(timezoneOptions).map(([region, zones]) => (
                                  <optgroup key={region} label={region}>
                                    {zones.map((tz) => (
                                      <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>
                                    ))}
                                  </optgroup>
                                ))}
                              </select>
                           </div>
                           <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                             <label style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Date Format</label>
                             <select value={settingsDateFormat} onChange={(e) => setSettingsDateFormat(e.target.value)} style={{ padding: "8px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 13, background: "#fff", color: "#07132a" }}>
                               <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                               <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                               <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                             </select>
                           </div>
                         </div>
                          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>Regional settings are saved locally and persist across sessions.</div>
                       </div>
                      </div>
                      )}

                       {/* Theme & Appearance */}
                       {settingsTab === "appearance" && (
                       <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                        <div className="stat-body">
                          <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Theme & Appearance</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
                            {[
                              { value: "light", label: "Light", desc: "Clean and bright workspace", icon: "☀️" },
                              { value: "dark", label: "Dark", desc: "Best for low-light environments", icon: "🌙" },
                              { value: "system", label: "System Default", desc: "Automatically follow your device settings", icon: "💻" },
                            ].map((theme) => (
                              <button key={theme.value} onClick={() => setSettingsTheme(theme.value)} style={{ padding: 14, border: settingsTheme === theme.value ? "2px solid #d4af37" : "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)", cursor: "pointer", textAlign: "left", transition: "border-color .15s", color: "var(--admin-text)" }}>
                                <div style={{ fontSize: 20, marginBottom: 6 }}>{theme.icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{theme.label}</div>
                                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 4 }}>{theme.desc}</div>
                                {settingsTheme === theme.value && <span className="badge" style={{ marginTop: 8, background: "#0b1f3a", color: "#d4af37" }}>Active</span>}
                              </button>
                            ))}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 8 }}>Theme preference is saved locally and persists across sessions.</div>
                        </div>
                        </div>
                        )}

                       {/* Document Templates */}
                       {settingsTab === "documents" && (
                       <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                        <div className="stat-body">
                          <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Document Templates</div>

                          {selectedTemplateId ? (
                            <div className="template-workspace">
                              {/* Left: Template Library */}
                              <div className="template-library">
                                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--admin-text-secondary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Library</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                  {templates.map((template) => {
                                    const isSelected = selectedTemplateId === template.id;
                                    return (
                                      <button
                                        key={template.id}
                                        onClick={() => handleSelectTemplate(template)}
                                        style={{
                                          padding: 10,
                                          border: isSelected ? "2px solid #d4af37" : "1px solid var(--admin-border)",
                                          borderRadius: 8,
                                          background: isSelected ? "var(--admin-surface)" : "var(--admin-card-bg)",
                                          cursor: "pointer",
                                          textAlign: "left",
                                          transition: "all .15s",
                                          color: "var(--admin-text)",
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 10
                                        }}
                                      >
                                        <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--admin-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "var(--admin-text)" }}>
                                          {template.id === "quotation" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round"/></svg>
                                          )}
                                          {template.id === "invoice" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round"/></svg>
                                          )}
                                          {template.id === "project-report" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="10" width="7" height="11" rx="1"/><rect x="3" y="12" width="7" height="9" rx="1"/></svg>
                                          )}
                                          {template.id === "contract" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round"/><path d="M14 2v6h6" strokeLinejoin="round"/><path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round"/></svg>
                                          )}
                                          {template.id === "official-letter" && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6" strokeLinejoin="round"/></svg>
                                          )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text)" }}>{template.name}</div>
                                          <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{template.description}</div>
                                        </div>
                                        <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                                          {isSelected && isDirty && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#d97706", display: "inline-block" }} title="Unsaved changes" />}
                                          {isSelected && !isDirty && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#059669", display: "inline-block" }} title="Saved" />}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              {/* Center: Editor */}
                              <div className="template-editor">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                                  <div>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--admin-text)" }}>Edit Template</div>
                                    <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 2 }}>{savedTemplate?.name}</div>
                                  </div>
                                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <span className="badge" style={{ background: "var(--admin-surface)", color: "var(--admin-text-secondary)", border: "1px solid var(--admin-border)" }}>Plain Text Template</span>
                                    {isDirty && <span style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>Unsaved changes</span>}
                                    {!isDirty && <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Saved</span>}
                                  </div>
                                </div>

                                {/* Toolbar */}
                                <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)" }}>
                                  <span style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>Insert</span>
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleInsertPlaceholder(e.target.value);
                                        e.target.value = "";
                                      }
                                    }}
                                    style={{ padding: "4px 8px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 12, background: "var(--admin-input-bg)", color: "var(--admin-input-text)", flex: 1, maxWidth: 220 }}
                                  >
                                    <option value="">Placeholder...</option>
                                    {placeholders.map(p => <option key={p} value={p}>{p}</option>)}
                                  </select>
                                  <div style={{ width: 1, height: 16, background: "var(--admin-border)", margin: "0 4px" }} />
                                  <button className="btn-secondary" onClick={handleResetTemplate} style={{ padding: "4px 12px", fontSize: 12 }}>Reset</button>
                                  <button className="btn-primary" onClick={handleSaveTemplate} style={{ padding: "4px 12px", fontSize: 12 }}>Save</button>
                                </div>

                                {/* Editor fields */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Template Name</label>
                                    <input
                                      type="text"
                                      value={templateName}
                                      onChange={(e) => setTemplateName(e.target.value)}
                                      style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }}
                                    />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</label>
                                    <input
                                      type="text"
                                      value={templateDescription}
                                      onChange={(e) => setTemplateDescription(e.target.value)}
                                      style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }}
                                    />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Document Content</label>
                                    <textarea
                                      ref={textareaRef}
                                      value={templateContent}
                                      onChange={(e) => setTemplateContent(e.target.value)}
                                      rows={18}
                                      style={{ padding: "12px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)", resize: "vertical", minHeight: 260, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", lineHeight: 1.6 }}
                                    />
                                  </div>
                                </div>

                                {/* Available Placeholders */}
                                <div>
                                  <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Available Placeholders</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {placeholders.map((p) => (
                                      <button
                                        key={p}
                                        onClick={() => handleInsertPlaceholder(p)}
                                        style={{
                                          padding: "3px 10px",
                                          borderRadius: 999,
                                          border: "1px solid var(--admin-border)",
                                          background: "var(--admin-surface)",
                                          color: "var(--admin-text)",
                                          fontSize: 12,
                                          cursor: "pointer",
                                          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                                          transition: "all .15s"
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--admin-bg)"; e.currentTarget.style.borderColor = "#d4af37"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--admin-surface)"; e.currentTarget.style.borderColor = "var(--admin-border)"; }}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {templateStatus.text && (
                                  <div style={{ fontSize: 13, color: templateStatus.type === "error" ? "#b91c1c" : "#065f46", padding: "8px 10px", borderRadius: 6, background: templateStatus.type === "error" ? "#fef2f2" : "#ecfdf5", border: `1px solid ${templateStatus.type === "error" ? "#fecaca" : "#a7f3d0"}` }}>
                                    {templateStatus.text}
                                  </div>
                                )}
                              </div>

                              {/* Right: Preview */}
                              <div className="template-preview">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>Live Preview</div>
                                  <span style={{ fontSize: 11, color: "var(--admin-text-secondary)" }}>Updates as you type</span>
                                </div>
                                <div style={{ border: "1px solid var(--admin-border)", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 4px 12px rgba(11,19,34,0.06)" }}>
                                  <div style={{ padding: 28, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, lineHeight: 1.8, color: "#07132a", minHeight: 520 }}>
                                    {/* Document header */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: "2px solid #d4af37" }}>
                                       <img src="/images/welmeg_logo.png" alt="WELMEG" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #d4af37", overflow: "hidden", display: "block" }} />
                                      <div>
                                        <div style={{ fontSize: 17, fontWeight: 800, color: "#0b1f3a", letterSpacing: 0.5 }}>WELMEG Solution Company Limited</div>
                                        <div style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>Building New Vision, Building New World</div>
                                      </div>
                                    </div>

                                    {/* Contact bar */}
                                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7280", marginBottom: 20, padding: "8px 12px", background: "#f8fafc", borderRadius: 6, border: "1px solid #eef2f7", flexWrap: "wrap" }}>
                                      <span>info@welmegsolution.co.tz</span>
                                      <span>+255 22 123 4567</span>
                                      <span>P.O. Box 123, Dar es Salaam, Tanzania</span>
                                    </div>

                                    {/* Document title */}
                                    <div style={{ fontSize: 20, fontWeight: 800, color: "#0b1f3a", textAlign: "center", marginBottom: 24, textTransform: "uppercase", letterSpacing: 1.5 }}>
                                      {templateName || "Document"}
                                    </div>

                                    {/* Content */}
                                    <div style={{ whiteSpace: "pre-wrap", fontSize: 13, lineHeight: 1.9, color: "#07132a" }}>
                                      {getPreview(templateContent)}
                                    </div>

                                    {/* Footer */}
                                    <div style={{ marginTop: 32, paddingTop: 14, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#9aa0a6", textTransform: "uppercase", letterSpacing: 0.5, flexWrap: "wrap", gap: 8 }}>
                                      <span>WELMEG Solution Company Limited</span>
                                      <span>Building New Vision, Building New World</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", marginBottom: 12 }}>Select a template to begin editing, or choose one below.</div>
                              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
                                {templates.map((template) => (
                                  <button
                                    key={template.id}
                                    onClick={() => handleSelectTemplate(template)}
                                    style={{
                                      padding: 12,
                                      border: selectedTemplateId === template.id ? "2px solid #d4af37" : "1px solid var(--admin-border)",
                                      borderRadius: 8,
                                      background: "var(--admin-card-bg)",
                                      cursor: "pointer",
                                      textAlign: "left",
                                      transition: "border-color .15s",
                                      color: "var(--admin-text)",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 8
                                    }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                      <div style={{ width: 32, height: 32, borderRadius: 6, background: "var(--admin-surface)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text)", flexShrink: 0 }}>
                                        {template.id === "quotation" && (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round"/></svg>
                                        )}
                                        {template.id === "invoice" && (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h8M8 14h5" strokeLinecap="round"/></svg>
                                        )}
                                        {template.id === "project-report" && (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="4" rx="1"/><rect x="14" y="10" width="7" height="11" rx="1"/><rect x="3" y="12" width="7" height="9" rx="1"/></svg>
                                        )}
                                        {template.id === "contract" && (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinejoin="round"/><path d="M14 2v6h6" strokeLinejoin="round"/><path d="M16 13H8M16 17H8M10 9H8" strokeLinecap="round"/></svg>
                                        )}
                                        {template.id === "official-letter" && (
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6" strokeLinejoin="round"/></svg>
                                        )}
                                      </div>
                                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{template.name}</div>
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", lineHeight: 1.4 }}>{template.description}</div>
                                    {selectedTemplateId === template.id && <span className="badge" style={{ marginTop: 4, background: "#0b1f3a", color: "#d4af37" }}>Active</span>}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                       </div>
                       )}

                        {/* Integrations */}
                        {settingsTab === "integrations" && (
                        <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                        <div className="stat-body">
                          <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Integrations</div>

                          {/* Summary */}
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 16 }}>
                            <div style={{ padding: "10px 12px", border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)", textAlign: "center" }}>
                              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>{integrations.length}</div>
                              <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</div>
                            </div>
                            <div style={{ padding: "10px 12px", border: "1px solid #a7f3d0", borderRadius: 8, background: "#ecfdf5", textAlign: "center" }}>
                              <div style={{ fontSize: 20, fontWeight: 700, color: "#065f46" }}>{connectedCount}</div>
                              <div style={{ fontSize: 11, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.04em" }}>Connected</div>
                            </div>
                            <div style={{ padding: "10px 12px", border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)", textAlign: "center" }}>
                              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--admin-text)" }}>{notConnectedCount}</div>
                              <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Not Connected</div>
                            </div>
                          </div>

                          {/* Search and filters */}
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12, alignItems: "center" }}>
                            <input
                              type="text"
                              placeholder="Search integrations..."
                              value={integrationSearch}
                              onChange={(e) => setIntegrationSearch(e.target.value)}
                              style={{ flex: 1, minWidth: 180, padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }}
                            />
                            <select
                              value={integrationCategory}
                              onChange={(e) => setIntegrationCategory(e.target.value)}
                              style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }}
                            >
                              {integrationCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))}
                            </select>
                          </div>

                          {/* Integration grid */}
                          {filteredIntegrations.length === 0 ? (
                            <div style={{ padding: 24, textAlign: "center", color: "var(--admin-text-secondary)", border: "1px dashed var(--admin-border)", borderRadius: 8 }}>
                              No integrations found.
                            </div>
                          ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                              {filteredIntegrations.map((integration) => {
                                const isConnected = integration.status === "connected";
                                return (
                                  <div
                                    key={integration.id}
                                    style={{
                                      padding: 16,
                                      border: "1px solid var(--admin-border)",
                                      borderRadius: 10,
                                      background: "var(--admin-card-bg)",
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: 10,
                                      transition: "box-shadow .15s, transform .15s",
                                      cursor: "pointer"
                                    }}
                                    onClick={() => handleOpenIntegration(integration)}
                                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--admin-card-shadow)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
                                  >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--admin-surface)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text)", flexShrink: 0 }}>
                                        {getIntegrationIcon(integration.icon)}
                                      </div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{integration.name}</div>
                                        <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", marginTop: 2 }}>{integration.category}</div>
                                      </div>
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", lineHeight: 1.5 }}>{integration.description}</div>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 4 }}>
                                      <span className="badge" style={{ background: isConnected ? "#ecfdf5" : "var(--admin-surface)", color: isConnected ? "#065f46" : "var(--admin-text-secondary)", border: `1px solid ${isConnected ? "#a7f3d0" : "var(--admin-border)"}` }}>
                                        {isConnected ? "Connected" : "Not Connected"}
                                      </span>
                                      <button
                                        className={isConnected ? "btn-secondary" : "btn-primary"}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenIntegration(integration);
                                        }}
                                        style={{ padding: "4px 12px", fontSize: 12 }}
                                      >
                                        {isConnected ? "Configure" : "Connect"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Security notice */}
                          <div style={{ marginTop: 16, padding: 12, border: "1px solid #fef3c7", borderRadius: 8, background: "#fffbeb", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
                              <path d="M12 2L1 21h22L12 2z" strokeLinejoin="round" />
                              <path d="M12 9v4" strokeLinecap="round" />
                              <circle cx="12" cy="17" r="1" fill="#d97706" />
                            </svg>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 2 }}>Integration Security</div>
                              <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                                API keys and private credentials must never be stored in browser storage or exposed to client-side code.
                                Production integrations should be configured through secure server-side environment variables or protected backend APIs.
                              </div>
                            </div>
                           </div>
                         </div>
                        </div>
                        )}

                        {/* Billing & Subscription */}
                        {settingsTab === "billing" && (
                        <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                        <div className="stat-body">
                          <div className="stat-title" style={{ fontSize: 13, marginBottom: 8 }}>Billing & Subscription</div>

                          {/* Current Plan */}
                          <div style={{ padding: 16, border: "1px solid var(--admin-border)", borderRadius: 10, background: "var(--admin-card-bg)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--admin-surface)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text)", flexShrink: 0 }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <rect x="2" y="3" width="20" height="18" rx="2" />
                                  <path d="M2 9h20" />
                                  <path d="M9 21V9" />
                                </svg>
                              </div>
                              <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>WELMEG Starter</div>
                                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 2 }}>Monthly billing • Next billing: Not configured</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              <span className="badge" style={{ background: "#0b1f3a", color: "#d4af37" }}>Active</span>
                              <button className="btn-secondary" onClick={() => openBillingModal("manage")} style={{ padding: "6px 14px", fontSize: 12 }}>Manage Subscription</button>
                            </div>
                          </div>

                          {/* Usage Overview */}
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Usage Overview</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
                            {[
                              { label: "Projects", current: projectsList.length, limit: 10 },
                              { label: "Team Members", current: 1, limit: 5 },
                              { label: "Clients", current: 0, limit: 50 },
                              { label: "Document Templates", current: templates.length, limit: Infinity },
                            ].map((item) => {
                              const percentage = item.limit === Infinity ? 0 : Math.min((item.current / item.limit) * 100, 100);
                              const isUnlimited = item.limit === Infinity;
                              return (
                                <div key={item.label} style={{ padding: 12, border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)" }}>
                                  <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginBottom: 6 }}>{item.label}</div>
                                  <div style={{ fontSize: 18, fontWeight: 700, color: "var(--admin-text)" }}>
                                    {item.current} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--admin-text-secondary)" }}>/ {isUnlimited ? "Unlimited" : item.limit}</span>
                                  </div>
                                  {!isUnlimited && (
                                    <div style={{ marginTop: 8, height: 6, background: "var(--admin-bg)", borderRadius: 999, overflow: "hidden" }}>
                                      <div style={{ width: `${percentage}%`, height: "100%", background: "#d4af37", borderRadius: 999, transition: "width .3s" }} />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Available Plans */}
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Available Plans</div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 16 }}>
                            {[
                              {
                                name: "Starter",
                                desc: "For small teams starting their operations.",
                                features: ["Up to 10 projects", "Up to 5 team members", "Up to 50 clients", "Document templates", "Admin dashboard", "Basic reports"],
                                button: "Current Plan",
                                active: true
                              },
                              {
                                name: "Professional",
                                desc: "For growing construction and project-management teams.",
                                features: ["Up to 50 projects", "Up to 20 team members", "Up to 500 clients", "Advanced reports", "Document management", "Integrations", "Priority support"],
                                button: "Upgrade",
                                active: false
                              },
                              {
                                name: "Enterprise",
                                desc: "For larger organizations with advanced requirements.",
                                features: ["Unlimited projects", "Unlimited team members", "Unlimited clients", "Advanced integrations", "Custom workflows", "Dedicated support"],
                                button: "Contact Sales",
                                active: false
                              }
                            ].map((plan) => (
                              <div key={plan.name} style={{ padding: 16, border: plan.active ? "2px solid #d4af37" : "1px solid var(--admin-border)", borderRadius: 10, background: "var(--admin-card-bg)", display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>{plan.name}</div>
                                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", lineHeight: 1.5 }}>{plan.desc}</div>
                                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--admin-text-secondary)", lineHeight: 1.8 }}>
                                  {plan.features.map((f) => (
                                    <li key={f}>{f}</li>
                                  ))}
                                </ul>
                                <div style={{ marginTop: "auto", paddingTop: 8 }}>
                                  {plan.active ? (
                                    <span className="badge" style={{ background: "#0b1f3a", color: "#d4af37", width: "100%", textAlign: "center", display: "inline-block" }}>Current Plan</span>
                                  ) : (
                                    <button
                                      className="btn-primary"
                                      onClick={() => plan.name === "Enterprise" ? openBillingModal("sales") : openBillingModal("upgrade")}
                                      style={{ width: "100%", padding: "8px 12px", fontSize: 12 }}
                                    >
                                      {plan.button}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Billing Cycle Toggle */}
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Billing Cycle</span>
                            <div style={{ display: "inline-flex", border: "1px solid var(--admin-border)", borderRadius: 8, overflow: "hidden" }}>
                              {(["monthly", "yearly"] as const).map((cycle) => (
                                <button
                                  key={cycle}
                                  onClick={() => setBillingCycle(cycle)}
                                  style={{
                                    padding: "6px 14px",
                                    border: "none",
                                    background: billingCycle === cycle ? "#d4af37" : "var(--admin-card-bg)",
                                    color: billingCycle === cycle ? "#0b1f3a" : "var(--admin-text-secondary)",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all .15s"
                                  }}
                                >
                                  {cycle === "monthly" ? "Monthly" : "Yearly"}
                                </button>
                              ))}
                            </div>
                            <span style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>Pricing not configured</span>
                          </div>

                          {/* Payment Method */}
                          <div style={{ padding: 16, border: "1px solid var(--admin-border)", borderRadius: 10, background: "var(--admin-card-bg)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", marginBottom: 4 }}>Payment Method</div>
                              <div style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>Not configured</div>
                              <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 2 }}>No payment method has been connected to this account.</div>
                            </div>
                            <button className="btn-secondary" onClick={() => openBillingModal("payment")} style={{ padding: "6px 14px", fontSize: 12 }}>Add Payment Method</button>
                          </div>

                          {/* Billing History */}
                          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 8 }}>Billing History</div>
                          <div style={{ border: "1px solid var(--admin-border)", borderRadius: 10, overflow: "hidden", background: "var(--admin-card-bg)", marginBottom: 16 }}>
                            <table className="table" style={{ width: "100%" }}>
                              <thead>
                                <tr>
                                  <th style={{ textAlign: "left", padding: 10, fontSize: 12, color: "var(--admin-text-secondary)", borderBottom: "1px solid var(--admin-border)" }}>Date</th>
                                  <th style={{ textAlign: "left", padding: 10, fontSize: 12, color: "var(--admin-text-secondary)", borderBottom: "1px solid var(--admin-border)" }}>Description</th>
                                  <th style={{ textAlign: "left", padding: 10, fontSize: 12, color: "var(--admin-text-secondary)", borderBottom: "1px solid var(--admin-border)" }}>Amount</th>
                                  <th style={{ textAlign: "left", padding: 10, fontSize: 12, color: "var(--admin-text-secondary)", borderBottom: "1px solid var(--admin-border)" }}>Status</th>
                                  <th style={{ textAlign: "left", padding: 10, fontSize: 12, color: "var(--admin-text-secondary)", borderBottom: "1px solid var(--admin-border)" }}>Invoice</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td colSpan={5} style={{ padding: 24, textAlign: "center", color: "var(--admin-text-secondary)", fontSize: 13 }}>
                                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>No billing history yet.</div>
                                    <div style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>Billing transactions will appear here after subscription billing is enabled.</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Invoices */}
                          <div style={{ padding: 16, border: "1px solid var(--admin-border)", borderRadius: 10, background: "var(--admin-card-bg)", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)", marginBottom: 4 }}>Invoices</div>
                              <div style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>Your billing invoices will appear here once billing is enabled.</div>
                            </div>
                            <button className="btn-secondary" onClick={() => openBillingModal("invoices")} style={{ padding: "6px 14px", fontSize: 12 }}>View Invoices</button>
                          </div>

                          {/* Subscription Status */}
                          <div style={{ padding: 12, border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)", marginBottom: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
                            {[
                              { label: "Subscription", value: "Active" },
                              { label: "Plan", value: "WELMEG Starter" },
                              { label: "Billing", value: "Not configured" },
                              { label: "Payment Method", value: "Not configured" },
                            ].map((item) => (
                              <div key={item.label}>
                                <div style={{ fontSize: 11, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{item.label}</div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>{item.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Security Notice */}
                          <div style={{ padding: 12, border: "1px solid #fef3c7", borderRadius: 8, background: "#fffbeb", display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: 1 }}>
                              <path d="M12 2L1 21h22L12 2z" strokeLinejoin="round" />
                              <path d="M12 9v4" strokeLinecap="round" />
                              <circle cx="12" cy="17" r="1" fill="#d97706" />
                            </svg>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "#92400e", marginBottom: 2 }}>Billing Security</div>
                              <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                                Payment information must be handled by a secure payment provider. Never store card numbers, CVV codes, bank credentials, or payment secrets in browser storage or client-side application state.
                              </div>
                            </div>
                           </div>
                         </div>
                        </div>
                        )}

                        {/* Company / Organization Profile */}
                        {settingsTab === "company" && (
                        <div className="stat-card" style={{ flexDirection: "column", alignItems: "stretch", gap: 12 }}>
                        <div className="stat-body">
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                            <div className="stat-title" style={{ fontSize: 13 }}>Company / Organization Profile</div>
                            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                              {!companyProfileSaved && <span style={{ fontSize: 12, color: "#d97706", fontWeight: 600 }}>Unsaved Changes</span>}
                              {companyProfileSaved && <span style={{ fontSize: 12, color: "#059669", fontWeight: 600 }}>Saved</span>}
                            </div>
                          </div>

                          {/* Profile Summary */}
                          <div style={{ padding: 16, border: "1px solid var(--admin-border)", borderRadius: 10, background: "var(--admin-card-bg)", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                             <div style={{ width: 56, height: 56, borderRadius: 10, background: "var(--admin-surface)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text)", flexShrink: 0, cursor: "pointer", overflow: "hidden" }} onClick={openCompanyLogoModal}>
                               {companyProfile.logoUrl ? (
                                 <img src={companyProfile.logoUrl} alt="Company Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                               ) : (
                                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                   <rect x="3" y="3" width="18" height="18" rx="2" />
                                   <circle cx="8.5" cy="8.5" r="1.5" />
                                   <path d="M21 15l-5-5L5 21" />
                                 </svg>
                               )}
                             </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--admin-text)" }}>{companyProfile.name || "WELMEG Solution Company Limited"}</div>
                              <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 2 }}>{companyProfile.motto || "Building New Vision, Building New World"}</div>
                              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                                <span className="badge" style={{ background: "var(--admin-surface)", color: "var(--admin-text-secondary)", border: "1px solid var(--admin-border)" }}>{companyProfile.businessType}</span>
                                <span className="badge" style={{ background: "var(--admin-surface)", color: "var(--admin-text-secondary)", border: "1px solid var(--admin-border)" }}>{companyProfile.city}, {companyProfile.country}</span>
                                <span className="badge" style={{ background: "#0b1f3a", color: "#d4af37" }}>{companyProfileCompletion}% Complete</span>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                              <button className="btn-secondary" onClick={openCompanyLogoModal} style={{ padding: "6px 12px", fontSize: 12 }}>Change Logo</button>
                            </div>
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, alignItems: "start" }}>
                            {/* Left: Editor */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Company Information</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Company Name *</label>
                                  <input type="text" value={companyProfile.name} onChange={(e) => updateCompanyField("name", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Company Motto</label>
                                  <input type="text" value={companyProfile.motto} onChange={(e) => updateCompanyField("motto", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Description</label>
                                  <textarea value={companyProfile.description} onChange={(e) => updateCompanyField("description", e.target.value)} rows={3} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)", resize: "vertical" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Company Email</label>
                                  <input type="email" value={companyProfile.email} onChange={(e) => updateCompanyField("email", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Phone Number</label>
                                  <input type="tel" value={companyProfile.phone} onChange={(e) => updateCompanyField("phone", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>WhatsApp Number</label>
                                  <input type="tel" value={companyProfile.whatsapp} onChange={(e) => updateCompanyField("whatsapp", e.target.value)} placeholder="Optional" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Website</label>
                                  <input type="url" value={companyProfile.website} onChange={(e) => updateCompanyField("website", e.target.value)} placeholder="https://example.com" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Physical Address</label>
                                  <input type="text" value={companyProfile.address} onChange={(e) => updateCompanyField("address", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>City</label>
                                    <input type="text" value={companyProfile.city} onChange={(e) => updateCompanyField("city", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Country</label>
                                    <input type="text" value={companyProfile.country} onChange={(e) => updateCompanyField("country", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                  </div>
                                </div>
                              </div>

                              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 4 }}>Business Information</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Business Type</label>
                                  <select value={companyProfile.businessType} onChange={(e) => updateCompanyField("businessType", e.target.value)} style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }}>
                                    <option>Construction</option>
                                    <option>Project Management</option>
                                    <option>Property Development</option>
                                    <option>Consultancy</option>
                                    <option>Construction & Project Management</option>
                                    <option>Other</option>
                                  </select>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Services</label>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                                    {companyProfile.services.map((service) => (
                                      <span key={service} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 999, border: "1px solid var(--admin-border)", background: "var(--admin-card-bg)", fontSize: 12, color: "var(--admin-text)" }}>
                                        {service}
                                        <button onClick={() => handleRemoveService(service)} style={{ background: "transparent", border: "none", color: "var(--admin-text-secondary)", cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                                      </span>
                                    ))}
                                  </div>
                                  <div style={{ display: "flex", gap: 8 }}>
                                    <input type="text" value={customServiceInput} onChange={(e) => setCustomServiceInput(e.target.value)} placeholder="Add custom service" style={{ flex: 1, padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                    <button className="btn-secondary" onClick={handleAddService} style={{ padding: "6px 12px", fontSize: 12 }}>Add</button>
                                  </div>
                                </div>
                              </div>

                              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 4 }}>Legal & Registration Information</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Registration Number</label>
                                    <input type="text" value={companyProfile.registrationNumber} onChange={(e) => updateCompanyField("registrationNumber", e.target.value)} placeholder="Optional" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>TIN</label>
                                    <input type="text" value={companyProfile.tin} onChange={(e) => updateCompanyField("tin", e.target.value)} placeholder="Optional" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                  </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Business License Number</label>
                                    <input type="text" value={companyProfile.businessLicense} onChange={(e) => updateCompanyField("businessLicense", e.target.value)} placeholder="Optional" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                    <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>VAT Number</label>
                                    <input type="text" value={companyProfile.vatNumber} onChange={(e) => updateCompanyField("vatNumber", e.target.value)} placeholder="Optional" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                  </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <label style={{ fontSize: 12, color: "var(--admin-text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>Year Established</label>
                                  <input type="text" value={companyProfile.yearEstablished} onChange={(e) => updateCompanyField("yearEstablished", e.target.value)} placeholder="Optional" style={{ padding: "8px 10px", border: "1px solid var(--admin-border)", borderRadius: 6, fontSize: 13, background: "var(--admin-input-bg)", color: "var(--admin-input-text)" }} />
                                </div>
                                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>Enter official company information only.</div>
                              </div>

                              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                                <button className="btn-primary" onClick={handleSaveCompanyProfile}>Save Changes</button>
                                <button className="btn-secondary" onClick={handleResetCompanyProfile}>Restore Defaults</button>
                              </div>
                              {companyProfileStatus.text && (
                                <div style={{ fontSize: 13, color: companyProfileStatus.type === "error" ? "#b91c1c" : "#065f46", padding: "8px 10px", borderRadius: 6, background: companyProfileStatus.type === "error" ? "#fef2f2" : "#ecfdf5", border: `1px solid ${companyProfileStatus.type === "error" ? "#fecaca" : "#a7f3d0"}` }}>
                                  {companyProfileStatus.text}
                                </div>
                              )}
                            </div>

                            {/* Right: Preview */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>Company Profile Preview</div>
                              <div style={{ border: "1px solid var(--admin-border)", borderRadius: 10, overflow: "hidden", background: "#fff", boxShadow: "0 4px 12px rgba(11,19,34,0.06)" }}>
                                <div style={{ padding: 24, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13, lineHeight: 1.8, color: "#07132a" }}>
                                   <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 14, borderBottom: "2px solid #d4af37" }}>
                                     {companyProfile.logoUrl ? (
                                       <img src={companyProfile.logoUrl} alt="Company Logo" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "2px solid #d4af37" }} />
                                     ) : (
                                       <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0b1f3a", color: "#d4af37", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, border: "2px solid #d4af37" }}>
                                         {companyProfile.name ? companyProfile.name.charAt(0).toUpperCase() : "W"}
                                       </div>
                                     )}
                                     <div>
                                      <div style={{ fontSize: 17, fontWeight: 800, color: "#0b1f3a", letterSpacing: 0.5 }}>{companyProfile.name || "WELMEG Solution Company Limited"}</div>
                                      <div style={{ fontSize: 11, color: "#6b7280", fontStyle: "italic" }}>{companyProfile.motto || "Building New Vision, Building New World"}</div>
                                    </div>
                                  </div>

                                  <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>
                                    {companyProfile.description || "We provide professional construction, project management, property development and consultancy solutions."}
                                  </div>

                                  <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#6b7280", marginBottom: 20, padding: "8px 12px", background: "#f8fafc", borderRadius: 6, border: "1px solid #eef2f7", flexWrap: "wrap" }}>
                                    {companyProfile.email && <span>Email: {companyProfile.email}</span>}
                                    {companyProfile.phone && <span>Phone: {companyProfile.phone}</span>}
                                    {companyProfile.whatsapp && <span>WhatsApp: {companyProfile.whatsapp}</span>}
                                    {companyProfile.website && <span>Web: {companyProfile.website}</span>}
                                  </div>

                                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
                                    {companyProfile.address && <div>{companyProfile.address}</div>}
                                    {(companyProfile.city || companyProfile.country) && <div>{[companyProfile.city, companyProfile.country].filter(Boolean).join(", ")}</div>}
                                  </div>

                                  {companyProfile.services.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                      <div style={{ fontSize: 12, fontWeight: 700, color: "#0b1f3a", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>Main Services</div>
                                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {companyProfile.services.map((service) => (
                                          <span key={service} style={{ padding: "3px 10px", borderRadius: 999, background: "#f0f9ff", color: "#0b1f3a", border: "1px solid #bae6fd", fontSize: 11 }}>{service}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                                               <div style={{ marginTop: 24, paddingTop: 14, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "#9aa0a6", textTransform: "uppercase", letterSpacing: 0.5, flexWrap: "wrap", gap: 8 }}>
                                    <span>{companyProfile.name || "WELMEG Solution Company Limited"}</span>
                                    <span>{companyProfile.motto || "Building New Vision, Building New World"}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      )} 

                {/* Actions */}
<div
  style={{
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
    paddingTop: 4,
    borderTop: "1px solid #f1f5f9",
  }}
>
  <button
    className="btn-primary"
    onClick={() => {
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
    }}
  >
    Save Changes
  </button>

  <button
    className="btn-secondary"
    onClick={handleResetAllSettings}
  >
    Reset
  </button>

  {settingsSaved && (
    <span style={{ fontSize: 13, color: "#065f46" }}>
      Preferences applied for this session.
    </span>
  )}
</div>

</div>
</div>
</section>
</div>
                </div>
              )}

      {integrationModalOpen && selectedIntegration && (
        <div className="modal-overlay" onClick={handleCloseIntegration}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--admin-surface)", border: "1px solid var(--admin-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--admin-text)", flexShrink: 0 }}>
                {getIntegrationIcon(selectedIntegration.icon)}
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Integration setup</h3>
                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 2 }}>{selectedIntegration.name}</div>
              </div>
            </div>

            <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginBottom: 12 }}>
              {selectedIntegration.description}
            </div>

            <div style={{ padding: 12, border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--admin-text)", marginBottom: 4 }}>Status</div>
              <div style={{ fontSize: 13, color: selectedIntegration.status === "connected" ? "#065f46" : "var(--admin-text-secondary)" }}>
                {selectedIntegration.status === "connected" ? "Connected" : "Not connected"}
              </div>
              {selectedIntegration.status === "connected" ? (
                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 4 }}>
                  This integration is configured by the application administrator.
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "var(--admin-text-secondary)", marginTop: 4 }}>
                  Secure server-side configuration will be required before this integration can be enabled.
                </div>
              )}
            </div>

            <div style={{ padding: 12, border: "1px solid #fef3c7", borderRadius: 8, background: "#fffbeb", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#92400e", marginBottom: 2 }}>Security Notice</div>
              <div style={{ fontSize: 12, color: "#92400e", lineHeight: 1.5 }}>
                This integration requires secure server-side configuration. Credentials should never be stored in your browser.
              </div>
            </div>

            <div className="confirm-actions">
              <button className="btn-secondary" onClick={handleCloseIntegration}>Close</button>
              <button className="btn-primary" onClick={handleConnectIntegration}>
                {selectedIntegration.status === "connected" ? "Configure" : "Coming Soon"}
              </button>
             </div>
           </div>
         </div>
       )}

       {billingModal === "manage" && (
         <div className="modal-overlay" onClick={closeBillingModal}>
           <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
             <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Manage Subscription</h3>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
               Subscription management is not connected yet.
             </div>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
               Payment processing will be enabled after a secure billing provider is configured.
             </div>
             <div className="confirm-actions">
               <button className="btn-secondary" onClick={closeBillingModal}>Close</button>
             </div>
           </div>
         </div>
       )}

       {billingModal === "payment" && (
         <div className="modal-overlay" onClick={closeBillingModal}>
           <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
             <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Add Payment Method</h3>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
               Payment setup is not available yet.
             </div>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
               Connect a secure payment provider before adding payment methods.
             </div>
             <div className="confirm-actions">
               <button className="btn-secondary" onClick={closeBillingModal}>Close</button>
             </div>
           </div>
         </div>
       )}

       {billingModal === "upgrade" && (
         <div className="modal-overlay" onClick={closeBillingModal}>
           <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
             <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Upgrade Plan</h3>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
               Online subscription billing is not connected yet.
             </div>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
               Contact the WELMEG administrator to configure your subscription.
             </div>
             <div className="confirm-actions">
               <button className="btn-secondary" onClick={closeBillingModal}>Close</button>
               <button className="btn-primary" onClick={() => { closeBillingModal(); openBillingModal("sales"); }}>Contact Support</button>
             </div>
           </div>
         </div>
       )}

       {billingModal === "sales" && (
         <div className="modal-overlay" onClick={closeBillingModal}>
           <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
             <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Enterprise Solutions</h3>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
               Contact WELMEG for custom plans, workflows, integrations, and support.
             </div>
             <div style={{ padding: 12, border: "1px solid var(--admin-border)", borderRadius: 8, background: "var(--admin-card-bg)", marginTop: 12 }}>
               <div style={{ fontSize: 12, color: "var(--admin-text-secondary)" }}>Email</div>
               <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-text)" }}>welmegsolution@gmail.com</div>
             </div>
             <div className="confirm-actions">
               <button className="btn-secondary" onClick={closeBillingModal}>Close</button>
             </div>
           </div>
         </div>
       )}

       {billingModal === "invoices" && (
         <div className="modal-overlay" onClick={closeBillingModal}>
           <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
             <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Invoices</h3>
             <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
               Your billing invoices will appear here once billing is enabled.
             </div>
             <div className="confirm-actions">
               <button className="btn-secondary" onClick={closeBillingModal}>Close</button>
             </div>
           </div>
         </div>
        )}

        {profilePictureModalOpen && (
          <div className="modal-overlay" onClick={closeProfilePictureModal}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Profile Picture</h3>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
                Profile image upload requires secure storage configuration.
              </div>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
                This feature will be available after secure file storage is configured on the server.
              </div>
              <div className="confirm-actions">
                <button className="btn-secondary" onClick={closeProfilePictureModal}>Close</button>
              </div>
            </div>
          </div>
        )}

        {twoFactorModalOpen && (
          <div className="modal-overlay" onClick={closeTwoFactorModal}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Two-Factor Authentication</h3>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
                Two-factor authentication is not available yet.
              </div>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
                This security feature will be added in a future update after backend authentication infrastructure is in place.
              </div>
              <div className="confirm-actions">
                <button className="btn-secondary" onClick={closeTwoFactorModal}>Close</button>
              </div>
            </div>
          </div>
        )}

        {manageUsersModalOpen && (
          <div className="modal-overlay" onClick={closeManageUsersModal}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Manage Users & Roles</h3>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 10 }}>
                User and role management is not connected yet.
              </div>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
                This feature will be available when the administrator management system is connected.
              </div>
              <div className="confirm-actions">
                <button className="btn-secondary" onClick={closeManageUsersModal}>Close</button>
              </div>
            </div>
          </div>
        )}

        {companyLogoModalOpen && (
          <div className="modal-overlay" onClick={closeCompanyLogoModal}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 480 }}>
              <h3 style={{ margin: 0, fontSize: 16, color: "var(--admin-text)" }}>Change Company Logo</h3>
              <div style={{ fontSize: 13, color: "var(--admin-text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
                Upload a new logo for your company profile. Supported formats: PNG, JPG, WEBP. Max size: 2MB.
              </div>
              <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
                <div
                  onClick={() => companyLogoInputRef.current?.click()}
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 12,
                    border: "2px dashed var(--admin-border)",
                    background: "var(--admin-surface)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  {companyLogoPreview || companyProfile.logoUrl ? (
                    <img
                      src={companyLogoPreview || companyProfile.logoUrl}
                      alt="Logo Preview"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--admin-text-secondary)" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  )}
                </div>
              </div>
              <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "var(--admin-text-secondary)" }}>
                Click the area above to select an image
              </div>
              <input
                ref={companyLogoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleCompanyLogoFileChange}
                style={{ display: "none" }}
              />
              {companyLogoError && (
                <div style={{ marginTop: 10, fontSize: 13, color: "#b91c1c", padding: "8px 10px", borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca" }}>
                  {companyLogoError}
                </div>
              )}
              <div className="confirm-actions">
                <button className="btn-secondary" onClick={closeCompanyLogoModal} disabled={companyLogoUploading}>Cancel</button>
                <button className="btn-primary" onClick={handleCompanyLogoUpload} disabled={companyLogoUploading || !companyLogoPreview}>
                  {companyLogoUploading ? "Uploading..." : "Upload Logo"}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedProject && (
        <div className="modal-overlay">
              <div className="project-modal">
            <h2>Project Details</h2>
                <div className="project-details-grid">
                  <div>
                    <h3 className="project-client">{selectedProject.client_name || '—'}</h3>
                    <p><strong>Email:</strong> {selectedProject.email || '—'}</p>
                    <p><strong>Phone:</strong> {selectedProject.phone || '—'}</p>
                    <p><strong>Location:</strong> {selectedProject.location || '—'}</p>
                  </div>
                  <div>
                    <p><strong>Project Type:</strong> {selectedProject.project_type || '—'}</p>
                    <p><strong>Status:</strong> <span className={`badge req-${(selectedProject.status||'').toLowerCase()}`}>{selectedProject.status || 'Pending'}</span></p>
                    <p><strong>Date:</strong> {selectedProject.created_at ? new Date(selectedProject.created_at).toLocaleString() : '—'}</p>
                  </div>
                </div>

                <div className="project-message">
                  <p><strong>Message:</strong></p>
                  <div className="message-box">{selectedProject.message || '—'}</div>
                </div>

                <div className="project-modal-actions">
                   <select value={selectedProject.status || 'Pending'} onChange={(e)=> updateProjectStatus(selectedProject.id, e.target.value)}>
                     <option>Pending</option>
                     <option>Reviewing</option>
                     <option>Approved</option>
                     <option>Rejected</option>
                     <option>Completed</option>
                   </select>
                  <button onClick={() => setSelectedProject(null)} className="btn-small">Close</button>
                </div>
              </div>
        </div>
      )}

      {pendingDeleteId && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Project Request?</h3>
            <p>Are you sure you want to delete this project request? This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-secondary" onClick={cancelDelete}>Cancel</button>
              <button className="btn-danger" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
       )}

       {selectedClient && (
         <div className="modal-overlay">
           <div className="project-modal">
             <h2>Client Details</h2>
             <div className="project-details-grid">
               <div>
                 <h3 className="project-client">{selectedClient.client_name}</h3>
                 <p><strong>Email:</strong> {selectedClient.email}</p>
                 <p><strong>Phone:</strong> {selectedClient.phone}</p>
                 <p><strong>Location:</strong> {selectedClient.location}</p>
               </div>
               <div>
                 <p><strong>Total Requests:</strong> {selectedClient.requestCount}</p>
                 <p><strong>Latest Request:</strong> {selectedClient.lastRequest ? new Date(selectedClient.lastRequest).toLocaleString() : "—"}</p>
               </div>
             </div>

             <div className="project-message">
               <p><strong>Request History</strong></p>
               <div style={{ maxHeight: 300, overflow: "auto" }}>
                 <table className="table" style={{ width: "100%" }}>
                   <thead>
                     <tr>
                       <th>Project Type</th>
                       <th>Location</th>
                       <th>Status</th>
                       <th>Submitted</th>
                       <th>Message</th>
                     </tr>
                   </thead>
                   <tbody>
                     {selectedClient.requests.map((req: any, idx: number) => (
                       <tr key={idx}>
                         <td>{req.project_type || "—"}</td>
                         <td>{req.location || "—"}</td>
                          <td>
                            <select value={req.status || 'Pending'} onChange={(e)=> updateProjectStatus(req.id, e.target.value)}>
                              <option>Pending</option>
                              <option>Reviewing</option>
                              <option>Approved</option>
                              <option>Rejected</option>
                              <option>Completed</option>
                            </select>
                          </td>
                         <td>{req.created_at ? new Date(req.created_at).toLocaleDateString() : ""}</td>
                         <td>{req.message || "—"}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>

             <div className="project-modal-actions">
               <button onClick={() => setSelectedClient(null)} className="btn-small">Close</button>
             </div>
           </div>
         </div>
        )}

            </div>
    </main>
  </div>
      );
    }