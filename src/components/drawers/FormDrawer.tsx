"use client";

import { X, FolderTree, HelpCircle, Calendar, Building2, FileText, ArrowRight } from "lucide-react";
import Button from "../buttons/Button";
import Link from "next/link";

type Form = {
  form: {
    id: number;
    title: string;
    description: string;
    createdAt: Date;
  };
  categoriesCount: number;
  companiesCount: number;
};

type FormDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: Form | null;
};

export const FormDrawer = ({
  isOpen,
  onClose,
  formData,
}: FormDrawerProps) => {
  if (!isOpen || !formData) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/20" onClick={onClose} />

      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="pr-8">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-white/80" />
                <span className="text-sm font-medium text-white/80">Form Details</span>
              </div>
              <h2 className="text-2xl font-bold text-white leading-tight">
                {formData.form.title}
              </h2>
              <p className="text-sm text-white/80 mt-1">ID: #{formData.form.id}</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Stats Cards */}
            <div className="px-6 py-4 bg-gray-50">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FolderTree className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{formData.categoriesCount || 0}</p>
                      <p className="text-xs text-gray-600">Categories</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{formData.companiesCount || 0}</p>
                      <p className="text-xs text-gray-600">Companies</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                {formData.form.description}
              </p>
            </div>

            {/* Date Info */}
            <div className="px-6 py-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">Created:</span>
                <span>{formatDate(formData.form.createdAt)}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/admin/forms/${formData.form.id}/categories`}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                      <FolderTree className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View Categories</p>
                      <p className="text-xs text-gray-600">
                        {formData.categoriesCount} {formData.categoriesCount === 1 ? 'category' : 'categories'}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href={`/admin/forms/${formData.form.id}/questions`}
                  className="group flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all border border-purple-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">View Questions</p>
                      <p className="text-xs text-gray-600">
                        Manage form questions
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
