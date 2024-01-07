import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { SortingState } from "@tanstack/react-table";

import { Button, buttonVariants } from "@/shared/components/ui/Button";
import { Code } from "@/shared/components/ui/Code";
import { ConfirmDialog } from "@/shared/components/ui/ConfirmDialog";
import {
  DEFAULT_PAGE_NUM,
  DEFAULT_PAGE_SIZE,
  DataTable,
  type Pagination,
} from "@/shared/components/ui/DataTable";
import { toast } from "@/shared/components/ui/use-toast";
import { useFetch } from "@/shared/hooks/use-fetch";
import { useRefresh } from "@/shared/hooks/use-refresh";
import { hasRoot } from "@/shared/auth/auth-signals";
import {
  URL_QUERY_KEY_PAGE_NUM,
  URL_QUERY_KEY_PAGE_SIZE,
  URL_QUERY_KEY_SORT_COLUMN,
  URL_QUERY_KEY_SORT_ORDER,
} from "@/shared/constants";
import {
  deleteUserApi,
  getUsersApi,
  updateUserStatusApi,
  type AccountStatus,
  type GetUsersParams,
  type User,
} from "@/shared/apis/backend/user";
import { cn } from "@/shared/utils/helpers";
import { ResetPasswordDialog } from "@/user/ResetPasswordDialog";
import { getUserTableColumns } from "@/user/UserTableColumns";

type UpdateUserStatus = {
  userId: number;
  status: AccountStatus;
};

export function UserTable() {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNum =
    Number(searchParams.get(URL_QUERY_KEY_PAGE_NUM)) || DEFAULT_PAGE_NUM;
  const pageSize =
    Number(searchParams.get(URL_QUERY_KEY_PAGE_SIZE)) || DEFAULT_PAGE_SIZE;
  const sortColumn = searchParams.get(URL_QUERY_KEY_SORT_COLUMN) || "createdAt";
  const sortOrder = searchParams.get(URL_QUERY_KEY_SORT_ORDER) || "desc";
  const username = searchParams.get("username") || "";
  const nickname = searchParams.get("nickname") || "";
  const status = searchParams.get("status") || "";
  const authority = searchParams.get("authority") || "";

  const params: GetUsersParams = { pageNum, pageSize };

  if (sortColumn) params.sortColumn = sortColumn;
  if (sortOrder) params.sortOrder = sortOrder === "asc" ? "asc" : "desc";
  if (username) params.username = username;
  if (nickname) params.nickname = nickname;
  if (status) params.status = status;
  if (authority) params.authority = authority;

  const {
    loading: loadingUsers,
    data: users,
    error: errorUsers,
    fetchData: getUsers,
    invalidateFetch: invalidateUsers,
  } = useFetch(getUsersApi);

  useRefresh(() => {
    getUsers(params).then();
  });

  const { loading: loadingUpdateUserStatus, fetchData: updateUserStatus } =
    useFetch(
      async ({ userId, status }: UpdateUserStatus) =>
        await updateUserStatusApi(userId, status),
    );

  const { loading: loadingDeleteUser, fetchData: deleteUser } = useFetch(
    async (userId: number) => await deleteUserApi(userId),
  );

  const [indexes, setIndexes] = React.useState<number[]>([]); // 选中的行的索引

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openResetPasswordDialog, setOpenResetPasswordDialog] =
    React.useState(false);
  const currentUser = React.useRef<User>(null);

  function handlePaginate(paging: Pagination) {
    searchParams.set(URL_QUERY_KEY_PAGE_NUM, String(paging.pageNum));
    searchParams.set(URL_QUERY_KEY_PAGE_SIZE, String(paging.pageSize));

    setSearchParams(searchParams, { replace: true });
  }

  const handleSorting = (sorting: SortingState) => {
    searchParams.delete("createdAt");
    searchParams.delete("updatedAt");

    const sortColumn =
      sorting[0]?.id === "更新时间" ? "updatedAt" : "createdAt";
    const sortOrder = sorting[0]?.desc === true ? "desc" : "asc";

    if (!sortColumn) return;

    searchParams.set(URL_QUERY_KEY_SORT_COLUMN, sortColumn);
    searchParams.set(URL_QUERY_KEY_SORT_ORDER, sortOrder);

    setSearchParams(searchParams);
  };

  function handleShowSelection() {
    const ids = (users?.list || [])
      .filter((_, index) => indexes.includes(index))
      .map((user) => user.id);

    if (ids.length === 0) {
      toast({
        title: "未选中任何行",
        description: "请先选中要操作的行",
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "选中的行",
      description: (
        <span>
          被选中的行 ID(s)：<Code>{ids.join(", ")}</Code>
        </span>
      ),
    });
  }

  async function handleChangeStatus(user: User, enabled: boolean) {
    const newStatus = enabled ? 0 : 1;

    const { status, error } = await updateUserStatus({
      userId: user.id,
      status: newStatus,
    });

    if (status !== 204) {
      toast({
        title: "账号状态更新失败",
        description: error,
        variant: "destructive",
      });

      return;
    }

    invalidateUsers().then();

    toast({
      title: "账号状态更新成功",
      description: (
        <span>
          {!enabled ? "启用" : "禁用"} <Code>{user.username}</Code> 账号
        </span>
      ),
    });
  }

  async function handleDeleteUser() {
    if (!currentUser.current) return;

    const { id, username } = currentUser.current;
    const { status, error } = await deleteUser(id);

    if (status !== 204) {
      toast({
        title: "用户删除失败",
        description: error,
        variant: "destructive",
      });

      return;
    }

    invalidateUsers().then();

    toast({
      title: "用户删除成功",
      description: (
        <span>
          已删除用户 <Code>{username}</Code>
        </span>
      ),
    });
  }

  return (
    <>
      <DataTable
        columns={getUserTableColumns({
          submitting: loadingUpdateUserStatus || loadingDeleteUser,
          currentUser,
          onChangeStatus: handleChangeStatus,
          setOpenDeleteDialog,
          setOpenResetPasswordDialog,
        })}
        data={users?.list || []}
        error={errorUsers}
        loading={loadingUsers}
        pagination={{
          pageNum,
          pageSize,
          total: users?.total || 0,
        }}
        onPaginate={handlePaginate}
        sortColumn={{
          id:
            searchParams.get(URL_QUERY_KEY_SORT_COLUMN) === "updatedAt"
              ? "更新时间"
              : "创建时间",
          desc: searchParams.get(URL_QUERY_KEY_SORT_ORDER) !== "asc",
        }}
        onSorting={handleSorting}
        enableRowSelection
        onSelect={setIndexes}
      >
        {hasRoot() && (
          <div>
            <Button variant="secondary" size="sm" onClick={handleShowSelection}>
              查看被选中的行
            </Button>

            <Link
              to="/users/add"
              className={cn(
                "ml-2",
                buttonVariants({
                  variant: "default",
                  size: "sm",
                }),
              )}
            >
              新增用户
            </Link>
          </div>
        )}
      </DataTable>

      {currentUser.current && (
        <ConfirmDialog
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title={
            <span>
              您确定要删除用户 <Code>{currentUser.current.username}</Code> 吗？
            </span>
          }
          onConfirm={handleDeleteUser}
        />
      )}

      {currentUser.current && (
        <ResetPasswordDialog
          open={openResetPasswordDialog}
          onOpenChange={setOpenResetPasswordDialog}
          user={currentUser.current}
          invalidateUsers={invalidateUsers}
        />
      )}
    </>
  );
}
