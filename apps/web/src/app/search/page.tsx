import { auth } from "@/lib/auth";
import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export default async function SearchPage() {
  const session = await auth().catch(() => null);
  const currentUsername = session?.user?.login;

  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <SearchClient currentUsername={currentUsername} />
    </Suspense>
  );
}