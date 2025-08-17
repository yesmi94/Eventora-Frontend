"use client";

import { useEffect, useState, type JSX } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import axios, { AxiosError } from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Building,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import { getEventById, RegisterForEvent } from "../services/eventService";
import type { UserEventRegistrationData } from "@/features/users/types/types";
import { RegisterForEventDialog } from "../components/registerForEventDialog";
import type { EventDetailsDisplay } from "../types/types";
import { toast } from "sonner";
import { getRegistrationsForUser } from "@/features/users/publicUsers/services/publicUserService";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useRole();

  const [event, setEvent] = useState<EventDetailsDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getEventById(id)
      .then((res) => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    Promise.all([getEventById(id), getRegistrationsForUser()])
      .then(([eventRes, userRegs]) => {
        setEvent(eventRes.data);
        const registered = userRegs.data.some(
          (r: { eventId: string }) => r.eventId === id,
        );
        setIsRegistered(registered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleRegistration = async (data: UserEventRegistrationData) => {
    try {
      if (!id) return;
      data.eventId = id;
      const response = await RegisterForEvent(data);
      data.id = response.id;
      toast.success("Successfully registered for the event", {
        icon: <CheckCircle className="text-green-500" />,
      });
      navigate("/registrations");
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred.";
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{
          message: string;
          errors: string[];
        }>;
        const backendMessage = axiosError.response?.data?.errors?.[0];
        const fallbackMessage = axiosError.response?.data?.message;
        errorMessage = backendMessage || fallbackMessage || axiosError.message;
      }
      toast.error(errorMessage.replace(/^Failed:\s*/i, ""), {
        icon: <AlertCircle className="text-red-500" />,
      });
    }
  };

  const handleViewRegistrations = () => {
    navigate(`/events/${id}/registrations`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <svg
          className="animate-spin h-10 w-10 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-4">
            Event Not Found
          </h1>
          <Button asChild>
            <Link to="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  const today = new Date();
  const isRegistrationClosed = new Date(event.cutoffDate) < today;
  const registered = event.capacity - event.remainingSpots;
  const registrationPercentage = (registered / event.capacity) * 100;

  const getCategoryColor = (category: string) => {
    const colors = {
      conference: "bg-blue-50 text-blue-700 border-blue-200",
      workshop: "bg-green-50 text-green-700 border-green-200",
      seminar: "bg-yellow-50 text-yellow-700 border-yellow-200",
      networking: "bg-purple-50 text-purple-700 border-purple-200",
      social: "bg-pink-50 text-pink-700 border-pink-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ongoing: "bg-orange-50 text-orange-700 border-orange-200",
      completed: "bg-gray-50 text-gray-700 border-gray-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-50 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link to="/events" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img
                src={event.eventImageUrl || "/placeholder.png"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium bg-white/90",
                      getCategoryColor(event.type.toString()),
                    )}
                  >
                    {event.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium bg-white/90",
                      getStatusColor(event.status || "upcoming"),
                    )}
                  >
                    {event.status || "upcoming"}
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold text-white">{event.title}</h1>
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  About This Event
                </h2>
                <p className="text-gray-700 text-lg mb-8">
                  {event.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Organizer</h3>
                      <p className="text-gray-600">{event.organizer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-black">Attendees</h3>
                      <p className="text-gray-600">
                        {registered || 0} registered
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 space-y-6">
                <h2 className="text-2xl font-semibold text-black mb-6">
                  Event Details
                </h2>
                <DetailItem
                  icon={<Calendar className="w-6 h-6 text-gray-600" />}
                  label="Date"
                  value={format(event.eventDate, "PPPP")}
                />
                <DetailItem
                  icon={<Clock className="w-6 h-6 text-gray-600" />}
                  label="Time"
                  value={event.eventTime}
                />
                <DetailItem
                  icon={<MapPin className="w-6 h-6 text-gray-600" />}
                  label="Location"
                  value={event.location}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <p className="text-gray-600">Reserve your spot today</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Availability</span>
                    <span className="font-medium text-black">
                      {event.capacity - (registered || 0)} spots left
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{
                        width: `${Math.min(registrationPercentage, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    {registered || 0} of {event.capacity} registered
                  </p>
                </div>
                {hasRole("Public User") &&
                  !isRegistrationClosed &&
                  !isRegistered && (
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white h-12 cursor-pointer"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" /> Register Now
                    </Button>
                  )}
                {hasRole("Public User") &&
                  !isRegistrationClosed &&
                  isRegistered && (
                    <Button
                      className="w-full bg-black hover:bg-gray-800 text-white h-12 cursor-pointer"
                      onClick={() => setIsDialogOpen(true)}
                      disabled={isRegistered}
                    >
                      <CheckCircle className="w-5 h-5 mr-2" /> Registered
                    </Button>
                  )}
                {hasRole("Public User") && isRegistrationClosed && (
                  <div className="text-center text-red-500 font-medium">
                    Registration Closed
                  </div>
                )}
                {hasRole("Admin") && (
                  <div className="flex gap-2 mt-3 justify-center">
                    <Button
                      variant="outline"
                      className="h-12 bg-gray-300"
                      onClick={() => handleViewRegistrations()}
                    >
                      <Users className="w-4 h-4 mr-2" /> View Registered Users
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RegisterForEventDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleRegistration}
      />
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: JSX.Element;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-medium text-black">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  );
}
