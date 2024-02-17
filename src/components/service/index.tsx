"use client";

import { getProviders } from "@/lib/fetchers/getProviders";
import filterAtom from "@/store/filterAtom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";

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
  console.log(providers);
  return (
    <div>
      {" "}
      <h1 className="text-2xl font-bold mb-4">Providers for {provider}</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></ul>
    </div>
  );
}
