"use client";

import { getProviders } from "@/lib/fetchers/getProviders";
import filterAtom from "@/store/filterAtom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { ProvidersTable } from "../Provider/RecommendationTable";
import Loading from "@/components/home/Loading";
import Image from "next/image";

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
      {isLoading && <Loading />}
      {providers?.pages && (
        <>
          <div className="flex justify-between items-center my-5">
            <h1 className="text-2xl mb-4 mt-8 py-4">
              Providers for {provider}
            </h1>
            {/* <Image
              src={"/crop-service.jpg"}
              alt="Service"
              height={100}
              width={100}
            /> */}
          </div>
          <ProvidersTable
            providers={providers}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            fetchPreviousPage={fetchPreviousPage}
          />
        </>
      )}
    </div>
  );
}
