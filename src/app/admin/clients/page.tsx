"use client";

import { useEffect, useState } from "react";
import BaseTable from "@/components/ui/BaseTable";
import { TableColumn } from "react-data-table-component";
import { SectionHeader } from "@/components/SectionHeader";
import { DeleteModal } from "@/components/modals/DeleteModal";
import toast from "react-hot-toast";
import { formatProperCase } from "@/lib/utils/formatters";
import axios from "axios";

type Client = {
  companies: {
    id: number;
    name: string;
    industry: string;
    size: string;
    website: string;
    contactFullName: string | null;
    contactJobTitle: string | null;
    contactEmail: string;
    type: string;
    partnerId: number | null;
    createdAt: Date;
  };
  partner: {
    id: number;
    name: string;
  } | null;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isShowDrawer, setIsShowDrawer] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null
  );
  const [reload, setReload] = useState(0);

  const fetchClients = async (page: number, limit: number, search: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        type: "client",
      });

      if (search) {
        params.append("search", search);
      }

      const response = await axios.get(`/api/companies?${params}`);
      const result = response.data;

      setClients(result.data.companies);
      setTotalRows(result.data.pagination.totalCount);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to fetch clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(currentPage, perPage, searchText);
  }, [currentPage, perPage, searchText, reload]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setIsShowDrawer(true);
  };

  const handleUpdate = (row: Client) => {
    setSelectedClient(row);
    setIsShowDrawer(true);
  };

  const handleDelete = (row: Client) => {
    setTarget({ id: row.companies.id, name: row.companies.name });
    setIsShowDeleteModal(true);
  };

  const deleteClient = async () => {
    if (!target) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(`/api/companies/${target.id}`);

      toast.success("Client deleted successfully");
      setReload((prev) => prev + 1);
      setIsShowDeleteModal(false);
    } catch (error: any) {
      console.error("Error deleting client:", error);
      toast.error(error.response?.data?.message || "Failed to delete client");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrawerSuccess = () => {
    setReload((prev) => prev + 1);
  };

  const columns: TableColumn<Client>[] = [
    {
      name: "ID",
      selector: (row) => row.companies.id,
    },
    {
      name: "Company Name",
      selector: (row) => row.companies.name,
      grow: 2,
    },
    {
      name: "Industry",
      selector: (row) => row.companies.industry,
      grow: 2,
      cell: (row) => formatProperCase(row.companies.industry),
    },
    {
      name: "Size",
      selector: (row) => row.companies.size,
      cell: (row) => formatProperCase(row.companies.size),
    },
    {
      name: "Website",
      cell: (row) => (
        <a
          href={row.companies.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {row.companies.website}
        </a>
      ),
    },
    {
      name: "Contact Name",
      selector: (row) => row.companies.contactFullName || "-",
      grow: 2,
    },
    {
      name: "Contact Email",
      selector: (row) => row.companies.contactEmail,
      grow: 3,
    },
    {
      name: "Partner",
      selector: (row) => row.partner?.name || "-",
      grow: 2,
    },
    {
      name: "Created At",
      selector: (row) => new Date(row.companies.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <DeleteModal
        title={`Delete ${target?.name || "client"}`}
        isDeleting={isDeleting}
        isOpen={isShowDeleteModal}
        onClose={() => setIsShowDeleteModal(false)}
        onConfirm={deleteClient}
      />

      <SectionHeader
        title="Clients"
        subtitle="Track client information and their associated partners"
        total={totalRows}
        hideAddButton={true}
      />

      <BaseTable
        columns={columns}
        data={clients}
        progressPending={loading}
        pagination
        totalRows={totalRows}
        handlePageChange={handlePageChange}
        handleRowsPerPageChange={handleRowsPerPageChange}
        highlightOnHover
        responsive
        searchable
        searchPlaceholder="Search clients by name..."
        onSearch={setSearchText}
        searchValue={searchText}
      />
    </div>
  );
}
