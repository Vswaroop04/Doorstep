"use client";

import { getProviders } from "@/lib/fetchers/getProviders";
import filterAtom from "@/store/filterAtom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ProvidersTable } from "../Provider/RecommendationTable";
import Loading from "@/components/home/Loading";

export function Services({ provider }: { provider: string }) {
  console.log(provider);
  const [filter, setFilterData] = useAtom(filterAtom);

  const {
    data: providers,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    hasPreviousPage,
    fetchPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["projects"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      let page = pageParam || 1;
      return getProviders({ ...filter, serviceName: provider, page });
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage + 1;
    },
  });
  return (
    <div className="flex-col text-center align-middle">
      {" "}
      <h1 className="text-2xl mb-4 mt-8 py-4">Providers for {provider}</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></ul>
      {isLoading && <Loading />}
      {providers?.pages && (
        <ProvidersTable
          providers={providers}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          fetchPreviousPage={fetchPreviousPage}
        />
      )}
    </div>
  );
}
