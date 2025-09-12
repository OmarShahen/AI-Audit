'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCompanyStore } from '@/store/company';
import PageLoader from '@/components/ui/PageLoader';
import axios from 'axios';

interface CompanyFormData {
  name: string;
  industry: string;
  size: string;
  website: string;
  contactFullName: string;
  contactJobTitle: string;
  contactEmail: string;
  imageURL: string;
}

interface Partner {
  id: number;
  name: string;
  imageURL: string;
}

export default function ClientRegistrationPage() {

  const router = useRouter()

  const params = useParams();
  const companyName = decodeURIComponent(params.companyName as string);

  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    industry: '',
    size: '',
    website: '',
    contactFullName: '',
    contactJobTitle: '',
    contactEmail: '',
    imageURL: 'https://via.placeholder.com/150',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { company, categories, loading, fetchCompanyData } = useCompanyStore();

  // Fetch company data using Zustand store
    useEffect(() => {
      fetchCompanyData(companyName);
    }, [companyName, fetchCompanyData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      
      const payload = {
        ...formData,
        type: 'client',
        partnerId: company?.id
      }

      const { data } = await axios.post(`/api/companies`, payload)
      const newCompany = data.data

      router.push(`/${companyName}/survey?clientId=${newCompany.id}`)
    } catch (error: any) {
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching company data
    if (loading) {
      return (
        <PageLoader
          message="Loading company data"
          subtitle="Please wait while we fetch your information..."
        />
      );
    }
  
    // Show error state
    if (!company) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">
              Company Not Found
            </h1>
            <p className="text-slate-600 mb-4">
              {`${companyName} could not be found`}
            </p>
            <p className="text-slate-500 text-sm">
              Please check the URL and try again.
            </p>
          </div>
        </div>
      );
    }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-3xl mx-auto">
          
          {/* Partner Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl mb-4 overflow-hidden">
              {company?.imageURL ? (
                <img 
                  src={company.imageURL} 
                  alt={`${company.name} logo`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
              AI & Automation Assessment
            </h1>
            <p className="text-lg text-slate-600">
              Powered by <span className="font-semibold text-blue-600">{company?.name}</span>
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-200/60 px-6 lg:px-8 py-6">
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                The AI & Automation Readiness Audit is designed to help business owners uncover where time, money, and opportunities are being lost to manual work — and how automation and AI can create measurable efficiency gains.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                By completing this audit, you'll receive:
              </p>
              
              <div className="mt-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                  <p className="text-slate-600">A personalized report highlighting your biggest workflow challenges and areas of improvement</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                  <p className="text-slate-600">Insights into where automation can free up hours of staff time every week</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                  <p className="text-slate-600">A clear view of how ready your company is to adopt AI-powered tools and smarter processes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                  <p className="text-slate-600">Recommendations aligned with your growth goals and industry context</p>
                </div>
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mt-6">
                To get started, please provide your basic company information below. This ensures your report is tailored specifically to your business.
              </p>
            </div>

            <div className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Company Name */}
                <div>
                  <label htmlFor="name" className="block text-slate-700 font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your company name"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 !text-black"
                    required
                  />
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactFullName" className="block text-slate-700 font-medium mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="contactFullName"
                      name="contactFullName"
                      value={formData.contactFullName}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 text-black"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contactJobTitle" className="block text-slate-700 font-medium mb-2">
                      Job Title / Role
                    </label>
                    <input
                      type="text"
                      id="contactJobTitle"
                      name="contactJobTitle"
                      value={formData.contactJobTitle}
                      onChange={handleInputChange}
                      placeholder="Your job title"
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 text-black"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-slate-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="your.email@company.com"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 text-black"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-slate-700 font-medium mb-2">
                    Company Website *
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="https://www.yourcompany.com"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 text-black"
                    required
                  />
                </div>

                {/* Industry & Size */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="industry" className="block text-slate-700 font-medium mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="" disabled className="text-slate-400">Select your industry</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="retail">Retail</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="construction">Construction</option>
                      <option value="real_estate">Real Estate</option>
                      <option value="transportation">Transportation</option>
                      <option value="logistics">Logistics</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="media">Media</option>
                      <option value="professional_services">Professional Services</option>
                      <option value="non_profit">Non Profit</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="size" className="block text-slate-700 font-medium mb-2">
                      Company Size *
                    </label>
                    <select
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black"
                      required
                    >
                      <option value="" disabled className="text-slate-400">Select company size</option>
                      <option value="startup">Startup (1-10 employees)</option>
                      <option value="small">Small (11-50 employees)</option>
                      <option value="medium">Medium (51-200 employees)</option>
                      <option value="large">Large (201-1000 employees)</option>
                      <option value="enterprise">Enterprise (1000+ employees)</option>
                    </select>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? 'Creating Account...' : 'Start Assessment'}
                </button>
              </form>
            </div>
          </div>
            </div>
          </div>
        </div>
  );
}