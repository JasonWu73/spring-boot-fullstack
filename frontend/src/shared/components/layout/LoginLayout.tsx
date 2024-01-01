import React from "react";
import { Outlet } from "react-router-dom";

import { Footer } from "@/shared/components/layout/Footer";
import { Header } from "@/shared/components/layout/Header";
import { LoadingFullPage } from "@/shared/components/ui/LoadingFullPage";

export function LoginLayout() {
  return (
    <div className="flex h-screen flex-col">
      <Header className="bg-night-1 dark:bg-night-1" />

      <main className="relative flex-grow bg-night bg-[url('/img/bg_login.png')] bg-[length:100%] bg-no-repeat p-4 text-snow">
        <React.Suspense fallback={<LoadingFullPage />}>
          <Outlet />
        </React.Suspense>
      </main>

      <Footer className="border-t border-t-slate-600 bg-night text-snow dark:bg-night" />
    </div>
  );
}
