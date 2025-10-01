"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import InputField from "../inputs/InputField";
import Button from "../buttons/Button";
import toast from "react-hot-toast";

type Client = {
  id?: number;
  name: string;
  industry: string;
  size: string;
  website: string;
  contactFullName: string;
  contactJobTitle: string;
  contactEmail: string;
  partnerId: number | null;
};

type ClientDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
  onSuccess: () => void;
};

const INDUSTRIES = [
  "technology",
  "healthcare",
  "finance",
  "education",
  "manufacturing",
  "retail",
  "hospitality",
  "construction",
  "real_estate",
  "transportation",
  "logistics",
  "agriculture",
  "media",
  "professional_services",
  "non_profit",
  "other",
];

const COMPANY_SIZES = ["startup", "small", "medium", "large", "enterprise"];

export const ClientDrawer = ({
  isOpen,
  onClose,
  client,
  onSuccess,
}: ClientDrawerProps) => {
  const [formData, setFormData] = useState<Client>({
    name: "",
    industry: "technology",
    size: "small",
    website: "",
    contactFullName: "",
    contactJobTitle: "",
    contactEmail: "",
    partnerId: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [partners, setPartners] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // Fetch partners for dropdown
    const fetchPartners = async () => {
      try {
        const response = await fetch("/api/companies?type=partner&limit=1000");
        const result = await response.json();
        if (result.success && result.data) {
          const partnersData = result.data.companies.map((item: any) => ({
            id: item.companies.id,
            name: item.companies.name,
          }));
          setPartners(partnersData);
        }
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };

    if (isOpen) {
      fetchPartners();
    }
  }, [isOpen]);

  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        name: client.name,
        industry: client.industry,
        size: client.size,
        website: client.website,
        contactFullName: client.contactFullName || "",
        contactJobTitle: client.contactJobTitle || "",
        contactEmail: client.contactEmail,
        partnerId: client.partnerId,
      });
    } else {
      setFormData({
        name: "",
        industry: "technology",
        size: "small",
        website: "",
        contactFullName: "",
        contactJobTitle: "",
        contactEmail: "",
        partnerId: null,
      });
    }
  }, [client, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "partnerId" ? (value ? parseInt(value) : null) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = client ? `/api/companies/${client.id}` : "/api/companies";
      const method = client ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: "client" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save client");
      }

      toast.success(
        client ? "Client updated successfully" : "Client created successfully"
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving client:", error);
      toast.error(error.message || "Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {client ? "Edit Client" : "Create Client"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <InputField
                id="name"
                name="name"
                label="Company Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Partner <span className="text-red-500">*</span>
                </label>
                <select
                  name="partnerId"
                  value={formData.partnerId || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a partner</option>
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Company Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  {COMPANY_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <InputField
                id="website"
                name="website"
                label="Website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />

              <InputField
                id="contactFullName"
                name="contactFullName"
                label="Contact Full Name"
                value={formData.contactFullName}
                onChange={handleChange}
                placeholder="Enter contact name"
              />

              <InputField
                id="contactJobTitle"
                name="contactJobTitle"
                label="Contact Job Title"
                value={formData.contactJobTitle}
                onChange={handleChange}
                placeholder="Enter job title"
              />

              <InputField
                id="contactEmail"
                name="contactEmail"
                label="Contact Email"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="contact@example.com"
                required
              />
            </div>
          </form>

          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : client ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
