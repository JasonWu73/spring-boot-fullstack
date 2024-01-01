import { LogOut } from "lucide-react";

import { logoutApi } from "@/shared/apis/backend/auth";
import LoadingButton from "@/shared/components/ui/LoadingButton";
import { useFetch } from "@/shared/hooks/use-fetch";
import { clearAuth } from "@/shared/auth/auth-signals";

export function LogoutButton() {
  const { loading, fetchData: logout } = useFetch(logoutApi);

  async function handleLogout() {
    await logout(null);

    clearAuth();
  }

  return (
    <LoadingButton
      variant="link"
      loading={loading}
      onClick={handleLogout}
      className="grid w-full grid-cols-[auto_1fr] gap-2 text-left"
    >
      {!loading && <LogOut className="h-4 w-4" />}
      退出
    </LoadingButton>
  );
}
