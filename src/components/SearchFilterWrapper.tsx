import React from "react";

type SearchFilterWrapperProps = {
  children: React.ReactNode;
};

export const SearchFilterWrapper = ({ children }: SearchFilterWrapperProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      {children}
    </div>
  );
};
