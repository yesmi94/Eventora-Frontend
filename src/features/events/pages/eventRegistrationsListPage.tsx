import { useEffect, useState } from "react";
import { getRegistrationsForEvent } from "../services/eventService";
import { Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { UserEventRegistrationData } from "@/features/users/types/types";
import { useParams } from "react-router-dom";
import { useBoolean } from "@/shared/hooks/useBoolean";

const EventRegistrationsListPage = () => {
  const [registrations, setRegistrations] = useState<
    UserEventRegistrationData[]
  >([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    UserEventRegistrationData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, { setTrue }] = useBoolean();
  const { eventId } = useParams();

  useEffect(() => {
    if (eventId) fetchRegistrations(eventId);
  }, [eventId]);

  useEffect(() => {
    const timeout = setTimeout(() => setTrue(), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (Array.isArray(registrations)) {
      const filtered = registrations.filter(
        (r) =>
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.registeredUserName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredRegistrations(filtered);
    }
  }, [registrations, searchTerm]);

  const fetchRegistrations = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getRegistrationsForEvent(id);
      setRegistrations(response.data);
    } catch (err: any) {
      setError("Failed to load registrations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (eventId) fetchRegistrations(eventId);
  };

  const EventSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-10 mb-2"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden pt-6">
      <div className="max-w-5xl mx-auto px-6 mt-9">
        <div
          className={`text-center mb-9 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-1 text-black">
            Event Registrations
          </h1>
          <p className="text-gray-600 text-sm">
            View and manage users who have registered for this event.
          </p>
          <div className="w-20 h-1 bg-blue-400 mx-auto rounded-full mt-2"></div>
        </div>

        <div
          className={`mb-4 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <div className="bg-white shadow rounded-xl p-3 border border-gray-200 flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400 text-sm"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="border-gray-300 text-gray-800 hover:bg-gray-100 text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-center">
            <p className="text-red-700 mb-2">{error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="border-red-400 text-red-700 hover:bg-red-100 text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        )}

        {/* Table */}
        <div>
          {loading ? (
            [...Array(6)].map((_, index) => <EventSkeleton key={index} />)
          ) : filteredRegistrations.length > 0 ? (
            <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
              <table className="min-w-full text-sm text-left text-gray-700 border-collapse border border-gray-200">
                <thead className="bg-blue-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-4 py-2 border border-gray-300">#</th>
                    <th className="px-4 py-2 border border-gray-300">Name</th>
                    <th className="px-4 py-2 border border-gray-300">Email</th>
                    <th className="px-4 py-2 border border-gray-300">Phone</th>
                    <th className="px-4 py-2 border border-gray-300">
                      Registered At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                    >
                      <td className="px-4 py-2 border border-gray-300 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {r.registeredUserName}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {r.email}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {r.phoneNumber}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {r.registeredAt
                          ? new Date(r.registeredAt).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">
              No registrations found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsListPage;
