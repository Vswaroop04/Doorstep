import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import filterAtom from "@/store/filterAtom";
import { useAtom } from "jotai";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";

const SortDropdown = () => {
  const [filter, setFilterData] = useAtom(filterAtom);
  const [sortOptions, setSortOptions] = useState(false);
  const handleSortOptionClick = async (sort: {
    rating?: number;
    distance?: number;
  }) => {
    if (sort?.distance == 1) {
      if ("geolocation" in window.navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            setFilterData({
              ...filter,
              lat,
              long,
              sort,
            });
          } catch (e) {
            console.error("Error retrieving geolocation:", e);
          }
          toast.success("Taking Your Location To Sort By Distance");
        });
      } else {
        toast.error("Geolocation not supported");
      }
    } else {
      setFilterData({
        ...filter,
        sort,
      });
    }
  };
  return (
    <div>
      {" "}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mb-0">
            <Button variant={"secondary"} className="outline">
              Sort By
            </Button>
            {sortOptions && <div></div>}
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem className=" transition-[transform] duration-200 hover:scale-105 bg-white  p-5">
            <button onClick={() => handleSortOptionClick({ rating: -1 })}>
              Rating : Low To High
            </button>
          </DropdownMenuItem>
          <DropdownMenuItem className=" transition-[transform] duration-200 hover:scale-105 bg-white  p-5">
            <button onClick={() => handleSortOptionClick({ rating: 1 })}>
              Rating : High To Low
            </button>{" "}
          </DropdownMenuItem>
          <DropdownMenuItem className=" transition-[transform] duration-200 hover:scale-105 bg-white  p-5">
            <button onClick={() => handleSortOptionClick({ distance: 1 })}>
              Distance
            </button>{" "}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SortDropdown;
