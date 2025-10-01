"use client";

import { useEffect, useState } from "react";
import BaseTable from "@/components/ui/BaseTable";
import { TableColumn } from "react-data-table-component";
import { Pencil, Trash2, Handshake } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { PageHeader } from "@/components/admin/PageHeader";
import { DeleteModal } from "@/components/modals/DeleteModal";
import { PartnerDrawer } from "@/components/drawers/PartnerDrawer";
import toast from "react-hot-toast";
import { formatProperCase } from "@/lib/utils/formatters";

type Partner = {
  id: number;
  name: string;
  industry: string;
  size: string;
  website: string;
  contactFullName: string | null;
  contactJobTitle: string | null;
  contactEmail: string;
  type: string;
  createdAt: Date;
};

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null
  );
  const [reload, setReload] = useState(0);

  const fetchPartners = async (page: number, limit: number, search: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type: "partner",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await fetch(`/api/companies?${params}`);
      const result = await response.json();

      if (result.success && result.data) {
        const companiesData = result.data.companies.map(
          (item: any) => item.companies
        );
        setPartners(companiesData);
        setTotalRows(result.data.pagination.totalCount);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners(currentPage, perPage, searchText);
  }, [currentPage, perPage, searchText, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setSelectedPartner(null);
    setIsShowDrawer(true);
  };

  const handleUpdate = (row: Partner) => {
    setSelectedPartner(row);
    setIsShowDrawer(true);
  };

  const handleDelete = (row: Partner) => {
    setTarget({ id: row.id, name: row.name });
    setIsShowDeleteModal(true);
  };

  const deletePartner = async () => {
    if (!target) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/companies/${target.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete partner");
      }

      toast.success("Partner deleted successfully");
      setReload((prev) => prev + 1);
      setIsShowDeleteModal(false);
    } catch (error: any) {
      console.error("Error deleting partner:", error);
      toast.error(error.message || "Failed to delete partner");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrawerSuccess = () => {
    setReload((prev) => prev + 1);
  };

  const columns: TableColumn<Partner>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Company Name",
      selector: (row) => row.name,
      grow: 2,
    },
    {
      name: "Industry",
      selector: (row) => row.industry,
      cell: (row) => formatProperCase(row.industry),
      grow: 3,
    },
    {
      name: "Size",
      selector: (row) => row.size,
      cell: (row) => formatProperCase(row.size),
      grow: 2,
    },
    {
      name: "Website",
      grow: 3,
      cell: (row) => (
        <a
          href={row.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.website}
        </a>
      ),
    },
    {
      name: "Contact Name",
      selector: (row) => row.contactFullName || "-",
      grow: 2,
    },
    {
      name: "Contact Email",
      selector: (row) => row.contactEmail,
      grow: 3,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(row)}
            className="p-1 cursor-pointer hover:text-indigo-600"
            title="Edit"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 cursor-pointer hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: "120px",
    },
  ];

  return (
    <div>
      <DeleteModal
        title={`Delete ${target?.name || "partner"}`}
        isDeleting={isDeleting}
        isOpen={isShowDeleteModal}
        onClose={() => setIsShowDeleteModal(false)}
        onConfirm={deletePartner}
      />

      <PartnerDrawer
        isOpen={isShowDrawer}
        onClose={() => setIsShowDrawer(false)}
        partner={selectedPartner}
        onSuccess={handleDrawerSuccess}
      />

      <SectionHeader
        title="All Partners"
        subtitle="Manage your partner organizations, track collaborations, and maintain strategic business relationships"
        addBtnText="Create Partner"
        total={totalRows}
        onAction={handleCreate}
      />

      <BaseTable
        columns={columns}
        data={partners}
        progressPending={loading}
        pagination
        totalRows={totalRows}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        highlightOnHover
        responsive
        searchable
        searchPlaceholder="Search partners by name..."
        onSearch={setSearchText}
        searchValue={searchText}
      />
    </div>
  );
}
