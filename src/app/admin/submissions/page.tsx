"use client";

import { useEffect, useState } from "react";
import BaseTable from "@/components/ui/BaseTable";
import { TableColumn } from "react-data-table-component";
import { Trash2, Building2 } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteModal } from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import axios from "axios";

type Submission = {
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

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [reload, setReload] = useState(0);

  const fetchSubmissions = async (page: number, limit: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await axios.get(`/api/submissions?${params}`);
      const result = response.data;

      if (result.success && result.data) {
        setSubmissions(result.data.submissions);
        setTotalRows(result.data.pagination.totalCount);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage, perPage);
  }, [currentPage, perPage, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const columns: TableColumn<Submission>[] = [
    {
      name: "ID",
      selector: (row) => row.submission.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Form",
      selector: (row) => row.form?.title || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Company",
      selector: (row) => row.company?.name || "-",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Submitted At",
      selector: (row) => new Date(row.submission.createdAt).toLocaleString(),
      sortable: true,
      minWidth: "200px",
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Submissions"
        subtitle="Track form submissions with company and form details"
        total={totalRows}
        hideAddButton={true}
      />

      <BaseTable
        columns={columns}
        data={submissions}
        progressPending={loading}
        pagination
        totalRows={totalRows}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        highlightOnHover
        responsive
      />
    </div>
  );
}
