"use client";

import { useEffect, useState } from "react";
import { Building2, Users, FileText, CheckCircle } from "lucide-react";
import CircularLoading from "@/components/ui/Loader";
import BaseTable from "@/components/ui/BaseTable";
import { TableColumn } from "react-data-table-component";
import Link from "next/link";
import { StatCard } from "@/components/cards/StatCard";
import axios from "axios";
import { SectionHeader } from "@/components/SectionHeader";

type Stats = {
  totalPartners: number;
  totalClients: number;
  totalForms: number;
  totalSubmissions: number;
};

type RecentSubmission = {
  submission: {
    id: number;
    formId: number | null;
    companyId: number | null;
    createdAt: Date;
  };
  company: {
    id: number;
    name: string;
  } | null;
  form: {
    id: number;
    title: string;
  } | null;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalPartners: 0,
    totalClients: 0,
    totalForms: 0,
    totalSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentSubmissions, setRecentSubmissions] = useState<
    RecentSubmission[]
  >([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch stats from your API endpoints
        const [partnersRes, clientsRes, formsRes, submissionsRes] =
          await Promise.all([
            axios.get("/api/companies?page=1&limit=1&type=partner"),
            axios.get("/api/companies?page=1&limit=1&type=client"),
            axios.get("/api/forms?page=1&limit=1"),
            axios.get("/api/submissions?page=1&limit=1"),
          ]);

        const partnersData = partnersRes.data;
        const clientsData = clientsRes.data;
        const formsData = formsRes.data;
        const submissionsData = submissionsRes.data;

        setStats({
          totalPartners: partnersData.data?.pagination?.totalCount || 0,
          totalClients: clientsData.data?.pagination?.totalCount || 0,
          totalForms: formsData.data?.pagination?.totalCount || 0,
          totalSubmissions: submissionsData.data?.pagination?.totalCount || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentSubmissions = async () => {
      try {
        setSubmissionsLoading(true);
        const response = await axios.get("/api/submissions?page=1&limit=10");
        const result = response.data;

        setRecentSubmissions(result.data.submissions);
      } catch (error) {
        console.error("Error fetching recent submissions:", error);
      } finally {
        setSubmissionsLoading(false);
      }
    };

    fetchStats();
    fetchRecentSubmissions();
  }, []);

  const cards = [
    {
      title: "Total Partners",
      value: stats.totalPartners,
      icon: <Building2 className="w-8 h-8 text-indigo-600" />,
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: <Users className="w-8 h-8 text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Forms",
      value: stats.totalForms,
      icon: <FileText className="w-8 h-8 text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Total Submissions",
      value: stats.totalSubmissions,
      icon: <CheckCircle className="w-8 h-8 text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];

  const submissionColumns: TableColumn<RecentSubmission>[] = [
    {
      name: "ID",
      selector: (row) => row.submission.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Company",
      selector: (row) => row.company?.name || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Form",
      selector: (row) => row.form?.title || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Submitted At",
      selector: (row) => new Date(row.submission.createdAt).toLocaleString(),
      sortable: true,
      minWidth: "180px",
    },
  ];

  if (loading) {
    return <CircularLoading />;
  }

  return (
    <div>
      <SectionHeader
        title="Dashboard"
        subtitle="Get a comprehensive overview of your audit system with real-time analytics, partner metrics, and submission insights"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            bgColor={card.bgColor}
          />
        ))}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Submissions
          </h2>
          <Link
            href="/admin/submissions"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
          </Link>
        </div>
        <BaseTable
          columns={submissionColumns}
          data={recentSubmissions}
          progressPending={submissionsLoading}
          pagination={false}
          highlightOnHover
          responsive
        />
      </div>
    </div>
  );
}
