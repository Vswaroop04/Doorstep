import { Input } from "@/components/ui/input";
import { searchService } from "@/lib/fetchers/searchService";
import { useMutation } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

export const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ services: any[] }>({
    services: [],
  });
  const debouncedSearchText = useDebounce(searchQuery, 500);
  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () =>
    setSearchResults({
      services: [],
    })
  );
  const { mutate, error, isError, isPending } = useMutation({
    mutationFn: searchService,
    onSuccess: (data) => {
      setSearchResults(data);
    },
  });

  const handleChange = (event: any) => {
    setSearchQuery(event.target.value);
    mutate(debouncedSearchText);
  };

  return (
    <div className="lg:w-full max-w-md mx-auto absolute">
      <div className="relative">
        <Input
          type="service"
          placeholder="Search For A Service"
          value={searchQuery}
          onChange={handleChange}
          className="lg:w-full pr-10 pl-4 py-2 border rounded-md focus:outline-none focus:border-indigo-500"
        />
        <SearchIcon className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />{" "}
      </div>
      {searchResults.services.length > 0 && (
        <div
          className="absolute z-40 mt-4 bg-white shadow-md rounded-lg overflow-hidden max-h-60 w-full"
          ref={navRef}
        >
          <ul className="p-4">
            {searchResults.services.map((result, index) => (
              <Link key={index} href={`/service/${result.serviceName}`}>
                <li className="border-b border-gray-200 py-4 hover:bg-gray-100">
                  <div className="block w-full px-4 py-2 text-sm font-medium text-gray-900">
                    {result.serviceName}
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
