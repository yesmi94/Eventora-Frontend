import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getRegistrationsForUser } from "../services/publicUserService";
import { cancelEventRegistration } from "@/features/events/services/eventService";
import { toast } from "react-toastify";
import type { UserEventRegistrationData } from "../../types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, Search } from "lucide-react";
import { EventRegistrationCard } from "@/features/events/components/registrationsCard";

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<
    UserEventRegistrationData[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRegistrationsForUser();
        setRegistrations(response.data);
      } catch (error) {
        toast.error("Failed to fetch Registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      if (!id) return;
      await cancelEventRegistration(id);
      toast.success("Registration cancelled successfully", {
        icon: <CheckCircle className="text-green-500" />,
      });
      setRegistrations((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      toast.error("Registration cancellation failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full bg-blue-100/20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Loading your registrations...
          </p>
          <div className="mt-2 w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Registrations
              </h1>
              <p className="text-gray-600">
                Manage your event registrations and track your upcoming
                adventures
              </p>
            </div>
          </div>

          {registrations.length > 0 && (
            <div className="flex items-center ">
              <div className="justify-center mr-2">
                <div className="text-2xl font-bold text-emerald-600">
                  {registrations.length}
                </div>
              </div>
              <p className="text-gray-700 font-medium">
                Registration{registrations.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>

        {registrations.length === 0 ? (
          <div className="text-center py-20">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-xl max-w-md mx-auto">
              <CardContent className="p-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  No registrations yet
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  You haven't registered for any events yet. Explore our
                  exciting events and find your next adventure!
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform rounded-lg"
                >
                  <Link to="/events" className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Explore Events
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6">
              {registrations.map((registration: any, index) => (
                <div
                  key={registration.id}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="transform transition-all duration-300 hover:shadow-xl">
                    <EventRegistrationCard
                      eventImageUrl={registration.event.eventImageUrl}
                      eventLocation={registration.event.location}
                      userName={registration.registeredUserName}
                      email={registration.email}
                      phoneNumber={registration.phoneNumber}
                      eventTitle={registration.event.title}
                      eventDate={registration.event.eventDate}
                      eventTime={registration.event.eventTime}
                      onCancel={() => handleCancel(registration.id)}
                      registrationStatus={
                        registration.registrationStatus || "confirmed"
                      }
                      registrationDate={registration.registeredAt}
                      id={registration.id}
                      status={registration.status || "upcoming"}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-12">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 max-w-lg mx-auto">
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-4 font-medium">
                    Looking for more events?
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                  >
                    <Link to="/events">Browse More Events</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrationsPage;
