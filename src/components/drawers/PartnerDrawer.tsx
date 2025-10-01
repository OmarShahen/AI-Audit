"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import AdminInputField from "../admin/AdminInputField";
import SelectInput from "../admin/SelectInput";
import Button from "../buttons/Button";
import toast from "react-hot-toast";
import axios from "axios";
import { formatProperCase } from "@/lib/utils/formatters";

type Partner = {
  id?: number;
  name: string;
  industry: string;
  size: string;
  website: string;
  imageURL?: string;
  contactFullName?: string;
  contactJobTitle?: string;
  contactEmail: string;
};

type PartnerDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  partner?: Partner | null;
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

export const PartnerDrawer = ({
  isOpen,
  onClose,
  partner,
  onSuccess,
}: PartnerDrawerProps) => {
  const [formData, setFormData] = useState<Partner>({
    name: "",
    industry: "technology",
    size: "small",
    website: "",
    imageURL: "",
    contactFullName: "",
    contactJobTitle: "",
    contactEmail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (partner) {
      setFormData({
        id: partner.id,
        name: partner.name,
        industry: partner.industry,
        size: partner.size,
        website: partner.website,
        imageURL: partner.imageURL || "",
        contactFullName: partner.contactFullName || "",
        contactJobTitle: partner.contactJobTitle || "",
        contactEmail: partner.contactEmail,
      });
    } else {
      setFormData({
        name: "",
        industry: "technology",
        size: "small",
        website: "",
        imageURL: "",
        contactFullName: "",
        contactJobTitle: "",
        contactEmail: "",
      });
    }
  }, [partner, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = partner ? `/api/companies/${partner.id}` : "/api/companies";

      if (partner) {
        await axios.put(url, { ...formData, type: "partner", formId: 4 });
      } else {
        await axios.post(url, { ...formData, type: "partner", formId: 4 });
      }

      toast.success(
        partner
          ? "Partner updated successfully"
          : "Partner created successfully"
      );
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving partner:", error);
      toast.error(error.response?.data?.error || "Failed to save partner");
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
              {partner ? "Edit Partner" : "Create Partner"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-4">
              <AdminInputField
                id="name"
                name="name"
                label="Company Name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                required
              />

              <SelectInput
                id="industry"
                name="industry"
                label="Industry"
                value={formData.industry}
                onChange={handleChange}
                options={INDUSTRIES.map((ind) => ({
                  value: ind,
                  label: formatProperCase(ind),
                }))}
                required
              />

              <SelectInput
                id="size"
                name="size"
                label="Company Size"
                value={formData.size}
                onChange={handleChange}
                options={COMPANY_SIZES.map((size) => ({
                  value: size,
                  label: formatProperCase(size),
                }))}
                required
              />

              <AdminInputField
                id="website"
                name="website"
                label="Website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />

              <AdminInputField
                id="imageURL"
                name="imageURL"
                label="Image URL"
                type="url"
                value={formData.imageURL}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                required
              />

              <AdminInputField
                id="contactFullName"
                name="contactFullName"
                label="Contact Full Name"
                value={formData.contactFullName}
                onChange={handleChange}
                placeholder="Enter contact name"
                required
              />

              <AdminInputField
                id="contactJobTitle"
                name="contactJobTitle"
                label="Contact Job Title"
                value={formData.contactJobTitle}
                onChange={handleChange}
                placeholder="Enter job title"
                required
              />

              <AdminInputField
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
                {isSubmitting ? "Saving..." : partner ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
