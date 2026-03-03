import { useMemo, useState, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, SortChangedEvent } from "ag-grid-community";
import { Loader } from "@mantine/core";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useProductsQuery, type Sort } from "./useProductsQuery";
import { columnDefs } from "./columns";
import type { Product } from "./types";
import c from "./table.module.scss";
import { Actions } from "./components/actions";

const PAGE_SIZE = 5;

export const Table = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const gridRef = useRef<AgGridReact<Product>>(null);
  const skip = currentPage * PAGE_SIZE;

  const [sortColId, setSortColId] = useState<string>("title");
  const [sortOrder, setOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading, error, refetch } = useProductsQuery(
    skip,
    PAGE_SIZE,
    sortColId as Sort,
    sortOrder,
  );

  const rowData = useMemo(() => data?.products || [], [data?.products]);
  const totalRows = data?.total || 0;
  const totalPages = totalRows > 0 ? Math.ceil(totalRows / PAGE_SIZE) : 0;

  const onSortChanged = useCallback((event: SortChangedEvent<Product>) => {
    const sortColumn = event.api
      .getColumnState()
      .find((colState) => colState.sort !== null);

    setSortColId(sortColumn!.colId);
    setOrder(sortColumn!.sort!);
    setCurrentPage(0);
    refetch();
  }, []);

  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      minWidth: 100,
      filter: false,
    }),
    [],
  );

  if (error) {
    return <div className={c.error}>Error loading data: {error.message}</div>;
  }

  const tableHeight = 48 + PAGE_SIZE * 72 + 3;

  const NoRowsOverlay = () => {
    if (isLoading) {
      return (
        <div className={c.loadingOverlay}>
          <Loader size="xl" />
        </div>
      );
    }
    return null;
  };

  const PaginationControls = () => {
    const actualSkip = data?.skip ?? skip;
    const actualStart =
      totalRows > 0 && rowData.length > 0 ? actualSkip + 1 : 0;
    const actualEnd =
      totalRows > 0 && rowData.length > 0
        ? Math.min(actualSkip + rowData.length, totalRows)
        : 0;
    const pages: (number | string)[] = [];
    const currentPageNum = currentPage + 1;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPageNum > 3) {
        pages.push("...");
      }

      const startPage = Math.max(2, currentPageNum - 1);
      const endPage = Math.min(totalPages - 1, currentPageNum + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (currentPageNum < totalPages - 2) {
        pages.push("...");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    const handlePageChange = (page: number) => {
      if (page >= 0 && page < totalPages) {
        setCurrentPage(page);
        if (gridRef.current?.api) {
          gridRef.current.api.paginationGoToPage(page);
        }
      }
    };

    return (
      <div className={c.customPagination}>
        <div className={c.paginationInfo}>
          Показано <b className={c.pageStat}>{actualStart}</b>-
          <b className={c.pageStat}>{actualEnd}</b> из{" "}
          <b className={c.pageStat}>{totalRows}</b>
        </div>
        <div className={c.paginationButtons}>
          <button
            className={c.paginationArrow}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            type="button"
          >
            ‹
          </button>
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={c.paginationEllipsis}
                >
                  ...
                </span>
              );
            }
            const pageNum = page as number;
            const isActive = currentPage + 1 === pageNum;
            return (
              <button
                disabled={isActive}
                key={pageNum}
                className={`${c.paginationButton} ${isActive ? c.active : ""}`}
                onClick={() => handlePageChange(pageNum - 1)}
                type="button"
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className={c.paginationArrow}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            type="button"
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={c.wrapper}>
      <Actions refetch={refetch} />

      <div className={c.tableWrapper}>
        <div
          className={`ag-theme-quartz ${c.tableContainer}`}
          style={{ height: `${tableHeight}px` }}
        >
          <AgGridReact<Product>
            ref={gridRef}
            rowData={isLoading && !rowData.length ? [] : rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={false}
            domLayout="normal"
            animateRows={true}
            loading={false}
            onSortChanged={onSortChanged}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            headerHeight={48}
            rowHeight={72}
            suppressCellFocus={true}
            suppressMenuHide={true}
            noRowsOverlayComponent={NoRowsOverlay}
          />
        </div>
        <PaginationControls />
      </div>
    </div>
  );
};
