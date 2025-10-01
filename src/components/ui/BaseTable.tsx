"use client";

import React from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import CircularLoading from "./Loader";
import EmptySection from "./EmptySection";
import { Search } from "lucide-react";

type BaseTableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  onRowClicked?: (row: T) => void;
  pagination?: boolean;
  highlightOnHover?: boolean;
  selectableRows?: boolean;
  responsive?: boolean;
  striped?: boolean;
  progressPending?: boolean;
  isShowEmptyForm?: boolean;
  handlePageChange?: (page: number) => void;
  handleRowsPerPageChange?: (rowsPerPage: number, currentPage: number) => void;
  totalRows?: number;
  isExpandableRows?: boolean;
  ExpandedComponent?: React.ComponentType<{ data: T }>;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  searchValue?: string;
};

function BaseTable<T>({
  columns,
  data,
  onRowClicked,
  pagination = true,
  highlightOnHover = true,
  selectableRows = false,
  responsive = true,
  striped = false,
  progressPending = false,
  isShowEmptyForm = false,
  handlePageChange,
  handleRowsPerPageChange,
  totalRows = 0,
  isExpandableRows = false,
  ExpandedComponent,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchValue = "",
}: BaseTableProps<T>) {
  return (
    <div className="shadow-sm rounded-lg bg-white border border-gray-200 overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white shadow-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      )}
      <DataTable
        columns={columns}
        data={data}
        onRowClicked={onRowClicked}
        pagination={pagination}
        highlightOnHover={highlightOnHover}
        selectableRows={selectableRows}
        responsive={responsive}
        striped={striped}
        progressPending={progressPending}
        progressComponent={<CircularLoading />}
        noDataComponent={<EmptySection />}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        expandableRows={isExpandableRows}
        expandOnRowClicked={isExpandableRows}
        expandableRowsComponent={ExpandedComponent}
      />
    </div>
  );
}

export default BaseTable;
