"use client";

import { useEffect, useState } from "react";
import BaseTable from "@/components/ui/BaseTable";
import { TableColumn } from "react-data-table-component";
import { Trash2, FileText } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteModal } from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import axios from "axios";

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

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  const [reload, setReload] = useState(0);

  const fetchForms = async (page: number, limit: number, search: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      const response = await axios.get(`/api/forms?${params}`);
      const result = response.data;

      setForms(result.data.forms);
      setTotalRows(result.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Failed to fetch forms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms(currentPage, perPage, searchText);
  }, [currentPage, perPage, searchText, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const columns: TableColumn<Form>[] = [
    {
      name: "ID",
      selector: (row) => row.form.id,
    },
    {
      name: "Title",
      selector: (row) => row.form.title,
    },
    {
      name: "Categories",
      selector: (row) => row.categoriesCount || 0,
    },
    {
      name: "Companies",
      selector: (row) => row.companiesCount || 0,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.form.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <SectionHeader
        title="Forms"
        subtitle="View all audit forms and their associated categories and companies"
        total={totalRows}
        hideAddButton={true}
      />

      <BaseTable
        columns={columns}
        data={forms}
        progressPending={loading}
        pagination
        totalRows={totalRows}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        highlightOnHover
        responsive
        searchable
        searchPlaceholder="Search forms by title..."
        onSearch={setSearchText}
        searchValue={searchText}
      />
    </div>
  );
}
