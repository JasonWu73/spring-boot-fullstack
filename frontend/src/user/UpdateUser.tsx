import { zodResolver } from "@hookform/resolvers/zod";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import {
  getUserApi,
  updateUserApi,
  type User,
} from "@/shared/apis/backend/user";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/Alert";
import { Button } from "@/shared/components/ui/Button";
import { Code } from "@/shared/components/ui/Code";
import {
  FormInput,
  FormMultiSelect,
  FormTextarea,
} from "@/shared/components/ui/CustomFormField";
import { Form } from "@/shared/components/ui/Form";
import LoadingButton from "@/shared/components/ui/LoadingButton";
import { Skeleton } from "@/shared/components/ui/Skeleton";
import { toast } from "@/shared/components/ui/use-toast";
import { useFetch } from "@/shared/hooks/use-fetch";
import { useInitial } from "@/shared/hooks/use-refresh";
import { ADMIN, ROOT, USER } from "@/shared/auth/auth-signals";

const AUTHORITY_OPTIONS = [ADMIN, USER];

const formSchema = z.object({
  nickname: z.string().min(1, "必须输入昵称").trim(),
  authorities: z.array(z.record(z.string().trim())),
  remark: z.string().trim(),
});

type FormSchema = z.infer<typeof formSchema>;

const defaultValues: FormSchema = {
  nickname: "",
  authorities: [],
  remark: "",
};

export function UpdateUser() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const {
    loading,
    data: user,
    error,
    fetchData: getUser,
  } = useFetch(getUserApi);

  const params = useParams();
  const userId = Number(params.userId);

  useInitial(() => {
    getUser(userId).then(({ data }) => {
      if (data) {
        initializeUserData(data);
      }
    });
  });

  const { loading: submitting, fetchData: updateUser } =
    useFetch(updateUserApi);

  const navigate = useNavigate();

  function initializeUserData(user: User) {
    form.reset({
      nickname: user.nickname,
      authorities: user.authorities.map((authority) => ({
        value: authority,
        label:
          authority === ROOT.value
            ? ROOT.label
            : authority === ADMIN.value
              ? ADMIN.label
              : authority === USER.value
                ? USER.label
                : "",
      })),
      remark: user.remark,
    });
  }

  async function onSubmit(values: FormSchema) {
    if (!user) return;

    const { status, error } = await updateUser({
      userId: user.id,
      nickname: values.nickname,
      authorities: values.authorities.map((authority) => authority.value),
      remark: values.remark,
    });

    if (status !== 204) {
      toast({
        title: "用户更新失败",
        description: error,
        variant: "destructive",
      });

      return;
    }

    toast({
      title: "用户更新成功",
      description: (
        <span>
          成功更新用户 <Code>{user.username}</Code>
        </span>
      ),
    });

    goBackToUserListPage();
  }

  function goBackToUserListPage() {
    navigate("/users");
  }

  return (
    <>
      {loading && <FormSkeleton />}

      {!loading && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {error && (
              <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>获取用户详情失败</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <p>
              <label className="inline-block w-[80px]">用户名：</label>
              <span>{user?.username}</span>
            </p>

            <p>
              <label>账号状态：</label>
              <span>
                {user?.status === 1 ? (
                  <span className="text-green-500 dark:text-green-600">
                    启用
                  </span>
                ) : (
                  <span className="text-red-500 dark:text-red-600">禁用</span>
                )}
              </span>
            </p>

            <p>
              <label>创建时间：</label>
              <span>{user?.createdAt}</span>
            </p>

            <p>
              <label>更新时间：</label>
              <span>{user?.updatedAt}</span>
            </p>

            <FormInput
              control={form.control}
              name="nickname"
              type="text"
              label="昵称"
              labelWidth={60}
              placeholder="昵称"
              isError={form.getFieldState("nickname")?.invalid}
            />

            <FormMultiSelect
              control={form.control}
              name="authorities"
              label="功能权限"
              labelWidth={60}
              placeholder="请选择功能权限"
              options={AUTHORITY_OPTIONS}
              isError={form.getFieldState("authorities")?.invalid}
            />

            <FormTextarea
              control={form.control}
              name="remark"
              label="备注"
              labelWidth={60}
              placeholder="备注"
              isError={form.getFieldState("remark")?.invalid}
            />

            <div className="flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={goBackToUserListPage}
              >
                返回
              </Button>

              <LoadingButton
                type="submit"
                loading={submitting}
                className="self-end"
              >
                提交
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}

      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9" />
          </div>
        </div>
      ))}

      <div className="grid grid-flow-row items-center gap-2 lg:grid-cols-[auto_1fr]">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-16" />
      </div>

      <div className="flex gap-2 sm:justify-end">
        <Skeleton className="h-9 w-20 self-end" />
        <Skeleton className="h-9 w-20 self-end" />
      </div>
    </div>
  );
}
