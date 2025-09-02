'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import EmailCapturePage from '@/components/EmailCapturePage';
import PageLoader from '@/components/ui/PageLoader';

interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  imageURL: string;
  formId: number;
  createdAt: string;
}

export default function CompanyEmailCapture() {
  const params = useParams();
  const router = useRouter();
  const companyName = params.companyName as string;
  
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for form data and fetch company data
  useEffect(() => {
    // Check if user completed the form
    const formDataString = sessionStorage.getItem('formData');
    if (!formDataString) {
      // No form data found, redirect back to form
      router.push(`/${companyName}`);
      return;
    }

    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        const companyResponse = await fetch(
          `/api/companies/names/${encodeURIComponent(companyName)}`
        );
        if (!companyResponse.ok) {
          throw new Error('Company not found');
        }
        const companyData = await companyResponse.json();
        setCompany(companyData.company);
        
      } catch (error) {
        console.error('Error fetching company data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load company data');
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      fetchCompanyData();
    }
  }, [companyName, router]);

  const handleEmailSubmit = async (email: string) => {
    try {
      // Get stored form data from sessionStorage
      const formDataString = sessionStorage.getItem('formData');
      if (!formDataString) {
        // No form data found, redirect back to form
        router.push(`/${companyName}`);
        return;
      }

      const formData = JSON.parse(formDataString);
      
      // Here you would submit the form data to your API
      // For now, we'll just show a success message
      console.log('Form submitted with email:', email);
      console.log('Form data:', formData);
      
      // Clear the stored form data
      sessionStorage.removeItem('formData');
      
      // Redirect to a thank you page or show success message
      alert('Assessment completed successfully! Your report will be sent to ' + email);
      
      // You could redirect to a thank you page
      // router.push(`/${companyName}/thank-you`);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your assessment. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <PageLoader 
        message="Loading company data" 
        subtitle="Please wait while we fetch your information..." 
      />
    );
  }

  // Error state
  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Company Not Found</h1>
          <p className="text-slate-600 mb-4">
            {error || `The company "${companyName}" could not be found.`}
          </p>
          <p className="text-slate-500 text-sm">
            Please check the URL and try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <EmailCapturePage 
      onEmailSubmit={handleEmailSubmit} 
      companyName={company.name}
      companyLogo={company.imageURL}
    />
  );
}