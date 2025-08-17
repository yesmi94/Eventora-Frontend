import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, ArrowLeft, ArrowRight, RefreshCw } from "lucide-react";
import type { EventCardProps, EventTypeOption } from "../types/types";
import { getEventTypes, getFilteredEvents } from "../services/eventService";
import { EventCard } from "../components/eventCard";

export default function EventsPage() {
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [eventTypes, setEventTypes] = useState<EventTypeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const statuses = ["all", "upcoming", "ongoing", "completed"];

  useEffect(() => {
    getEventTypes()
      .then((types) => setEventTypes(types))
      .catch((err) => setError(`Failed to fetch event types: ${err}`));
  }, []);

  const fetchEvents = async () => {
  try {
    setLoading(true);
    setError("");

    const res = await getFilteredEvents(
      page,
      6,
      searchQuery,
      selectedCategory !== "all" ? selectedCategory : "",
      selectedStatus !== "all" ? selectedStatus : ""
    );
    setEvents(res.data?.items || []);
    setTotalPages(res.data?.totalPages || 1);
  } catch (err) {
    setError("Failed to load events");
    setEvents([]);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchEvents();
  }, [page, searchQuery, selectedCategory, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStatus("all");
    setPage(1);
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "all" || selectedStatus !== "all";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-6 py-6">
        <div className="mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 mt-10">
            All Events
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Discover events that match your interests
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 mb-4 border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 sm:h-12 border-gray-300 focus:border-blue-600 focus:ring focus:ring-blue-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-full sm:w-[160px] h-11 sm:h-12 border-gray-300">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value.toString()}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[140px] h-11 sm:h-12 border-gray-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={fetchEvents}
                disabled={loading}
                className="h-11 sm:h-12 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800"
                >
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800"
                >
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedStatus !== "all" && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1 bg-gray-200 text-gray-800"
                >
                  {selectedStatus}
                  <button
                    onClick={() => setSelectedStatus("all")}
                    className="hover:bg-gray-300 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-900"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600 mb-2">{error}</p>
            <Button
              onClick={fetchEvents}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 pb-10">{events.length} events found</p>
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 border-none"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 border-none"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-xl h-72"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((event) => (
              <EventCard key={event.id} {...event} showAdminActions />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              No events found
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? "Try adjusting your search criteria"
                : "There are currently no events available"}
            </p>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
