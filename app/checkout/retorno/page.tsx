"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ReturnView } from "@/components/ReturnView";

function ReturnPage() {
  const status = useSearchParams().get("status") || "";
  return <ReturnView status={status} />;
}

export default function Page() {
  return (
    <Suspense>
      <ReturnPage />
    </Suspense>
  );
}
