import React from "react";
import { Link } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";
import { Checkbox } from "@/shared/components/ui/Checkbox";
import { Code } from "@/shared/components/ui/Code";
import { DataTableColumnHeader } from "@/shared/components/ui/DataTableColumnHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/DropdownMenu";
import { Switch } from "@/shared/components/ui/Switch";
import { ADMIN, ROOT, USER, hasRoot } from "@/shared/auth/auth-signals";
import type { User } from "@/shared/apis/backend/user";

type UserTableColumnProps = {
  submitting: boolean;
  currentUser: React.MutableRefObject<User | null>;
  onChangeStatus: (user: User, enabled: boolean) => void;
  setOpenDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenResetPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * 对话框不应该放在表格内部，否则会导致在表格刷新时（当刷新身份验证信息时），对话框就会被关闭。
 */
export function getUserTableColumns({
  submitting,
  currentUser,
  onChangeStatus,
  setOpenDeleteDialog,
  setOpenResetPasswordDialog,
}: UserTableColumnProps) {
  const isRoot = hasRoot();

  const columns: ColumnDef<User>[] = [
    {
      id: "选择",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="全选"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="选择行"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "ID",
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
    },
    {
      id: "昵称",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="昵称" />
      ),
      cell: ({ row }) => {
        return row.original.nickname;
      },
    },
    {
      id: "用户名",
      accessorKey: "username",
      header: ({ column }) => <DataTableColumnHeader column={column} title="用户名"/>,
      cell: ({ row }) => <Code>{row.original.username}</Code>
    },
    {
      id: "账号状态",
      header: ({ column }) => <DataTableColumnHeader column={column} title="账号状态"/>,
      cell: ({ row }) => {
        const user = row.original;
        const enabled = user.status === 1;

        return (
          <Switch
            checked={enabled}
            disabled={submitting}
            onCheckedChange={() => onChangeStatus(user, enabled)}
          />
        );
      },
    },
    {
      id: "权限",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="权限" />
      ),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="space-x-1">
            {user.authorities.map((authority) => {
              if (authority === ROOT.value) {
                return (
                  <Badge key={authority} variant="destructive">
                    超级管理员
                  </Badge>
                );
              }

              if (authority === ADMIN.value) {
                return <Badge key={authority}>管理员</Badge>;
              }

              if (authority === USER.value) {
                return (
                  <Badge key={authority} variant="outline">
                    用户
                  </Badge>
                );
              }

              return null;
            })}
          </div>
        );
      },
    },
    {
      id: "创建时间",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader sortable column={column} title="创建时间" />
      ),
    },
    {
      id: "更新时间",
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader sortable column={column} title="更新时间" />
      ),
    },
    {
      id: "备注",
      accessorKey: "remark",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="备注" />
      ),
    },
    {
      id: "操作",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="操作" />
      ),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={submitting}>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>操作</DropdownMenuLabel>

              <DropdownMenuItem className="p-0" asChild>
                <Link
                  to={`/users/${user.id}`}
                  className="inline-block w-full cursor-pointer px-2 py-1.5"
                >
                  查看详情
                </Link>
              </DropdownMenuItem>

              {isRoot && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem className="p-0" asChild>
                    <button
                      onClick={() => {
                        setOpenDeleteDialog(true);
                        currentUser.current = user;
                      }}
                      className="inline-block w-full cursor-pointer px-2 py-1.5 text-left text-red-500 dark:text-red-600"
                    >
                      删除用户
                    </button>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-0" asChild>
                    <button
                      onClick={() => {
                        setOpenResetPasswordDialog(true);
                        currentUser.current = user;
                      }}
                      className="inline-block w-full cursor-pointer px-2 py-1.5 text-left text-red-500 dark:text-red-600"
                    >
                      重置密码
                    </button>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isRoot) return columns;

  return columns.filter((column) => column.id !== "选择");
}
