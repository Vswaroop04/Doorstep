import { Input } from "@/components/ui/input";
import { searchService } from "@/lib/fetchers/searchService";
import { useMutation } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";

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
        <div className="lg:w-full absolute bg-slate-100" ref={navRef}>
          <ul className="flex-col items-center justify-center">
            {searchResults?.services?.map((result, index) => (
              <li
                key={index}
                className="text-gray-800 my-2 flex items-center justify-center py-1 cursor-pointer hover:bg-slate-200"
              >
                {result?.serviceName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
