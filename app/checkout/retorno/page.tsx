import type { Metadata } from "next";
import { ReturnView } from "@/components/ReturnView";

export const metadata: Metadata = { title: "Pagamento" };

export default function ReturnPage({ searchParams }: { searchParams: { status?: string } }) {
  return <ReturnView status={searchParams.status || ""} />;
}
