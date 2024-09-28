import SearchBar from "@/components/block/search-bar";
import SearchHistory from "@/components/block/search-history";

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-4 pt-4 max-w-screen-xs w-full items-center justify-start">
      <SearchBar />
      <SearchHistory />
    </div>
  );
}
