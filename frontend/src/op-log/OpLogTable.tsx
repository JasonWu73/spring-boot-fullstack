import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { addDays, format } from "date-fns";

import {
  getLogsApi,
  type GetLogsParams,
  type Log,
} from "@/shared/apis/backend/op-log";
import {
  DataTable,
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  type Pagination,
} from "@/shared/components/ui/DataTable";
import { DataTableColumnHeader } from "@/shared/components/ui/DataTableColumnHeader";
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER,
} from "@/shared/constants";
import { useFetch } from "@/shared/hooks/use-fetch";
import { useRefresh } from "@/shared/hooks/use-refresh";
import { useSearchParams } from "react-router-dom";

const columns: ColumnDef<Log>[] = [
  {
    id: "ID",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
  },
  {
    id: "请求时间",
    accessorKey: "requestedAt",
    header: ({ column }) => (
      <DataTableColumnHeader sortable column={column} title="请求时间" />
    ),
  },
  {
    id: "客户端 IP",
    accessorKey: "clientIp",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="客户端 IP" />
    ),
  },
  {
    id: "用户名",
    accessorKey: "username",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="用户名" />
    ),
  },
  {
    id: "操作描述",
    accessorKey: "message",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="操作描述" />
    ),
  },
];

export function OpLogTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNum =
    Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM;
  const pageSize =
    Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE;
  const sortColumn =
    searchParams.get(URL_QUERY_KEY_SORT_COLUMN) || "requestedAt";
  const sortOrder = searchParams.get(URL_QUERY_KEY_SORT_ORDER) || "desc";
  const startAt =
    searchParams.get("startAt") ||
    format(addDays(new Date(), -6), "yyyy-MM-dd");
  const endAt = searchParams.get("endAt") || format(new Date(), "yyyy-MM-dd");
  const clientIp = searchParams.get("clientIp") || "";
  const username = searchParams.get("username") || "";
  const message = searchParams.get("message") || "";

  const params: GetLogsParams = { pageNum, pageSize, startAt, endAt };

  if (sortColumn) params.sortColumn = sortColumn;
  if (sortOrder) params.sortOrder = sortOrder === "asc" ? "asc" : "desc";
  if (startAt) params.startAt = startAt;
  if (endAt) params.endAt = endAt;
  if (clientIp) params.clientIp = clientIp;
  if (username) params.username = username;
  if (message) params.message = message;

  const {
    loading,
    data: logs,
    error,
    fetchData: getLogs,
  } = useFetch(getLogsApi);

  useRefresh(() => {
    getLogs(params).then();
  });

  function handlePaginate(paging: Pagination) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum));
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize));

    setSearchParams(searchParams, { replace: true });
  }

  const handleSorting = (sorting: SortingState) => {
    searchParams.delete("requestedAt");

    const sortColumn = sorting[0]?.id === "请求时间" ? "requestedAt" : "";
    const sortOrder = sorting[0]?.desc === true ? "desc" : "asc";

    if (!sortColumn) return;

    searchParams.set(URL_QUERY_KEY_SORT_COLUMN, sortColumn);
    searchParams.set(URL_QUERY_KEY_SORT_ORDER, sortOrder);

    setSearchParams(searchParams);
  };

  return (
    <DataTable
      columns={columns}
      data={logs?.list || []}
      error={error}
      loading={loading}
      pagination={{
        pageNum,
        pageSize,
        total: logs?.total || 0,
      }}
      onPaginate={handlePaginate}
      sortColumn={{
        id: "请求时间",
        desc: searchParams.get(URL_QUERY_KEY_SORT_ORDER) !== "asc",
      }}
      onSorting={handleSorting}
    />
  );
}
