import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import type { EventCardProps } from "../types/types";
import { cn } from "@/lib/utils";
import { useRole } from "@/shared/hooks/useRole";
import { deleteEvent } from "../services/eventService";
import { toast } from "sonner";
import { useState } from "react";
import { useEventStatus } from "@/shared/hooks/useEventStatus";

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  eventDate,
  eventTime,
  location,
  cutoffDate,
  eventImageUrl,
  remainingSpots,
  type,
  capacity,
  description,
}) => {
  const { hasRole } = useRole();
  const [, setEvents] = useState<EventCardProps[]>([]);
  const eventStatus = useEventStatus(eventDate, eventTime);
  const registered = capacity - remainingSpots;
  const registrationPercentage = (registered / capacity) * 100;
  const isRegistrationExpired = cutoffDate < new Date();

  const handleDelete = async (id: string) => {
    try {
      await deleteEvent(id);
      toast.success("Event deleted successfully", {
        icon: <CheckCircle className="text-green-500" />,
      });
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      toast.error("Failed to delete event");
    }
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
    <Card className="group hover:shadow-md transition-all duration-300 border border-gray-200 bg-white overflow-hidden pt-0 max-w-sm">
      <div className="relative">
        <img
          src={eventImageUrl}
          alt={title}
          className="w-full h-35 object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            variant="outline"
            className={cn("text-xs font-medium bg-gray-50")}
          >
            {type}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium", getStatusColor(eventStatus))}
          >
            {eventStatus}
          </Badge>
        </div>
      </div>

      <CardContent className="">
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-semibold text-black line-clamp-1 group-hover:text-gray-700 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center text-xs text-gray-600">
              <Calendar className="w-3 h-3 mr-2" />
              {new Date(eventDate).toLocaleDateString()}
              <Clock className="w-3 h-3 ml-3 mr-2" />
              {eventTime}
            </div>

            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-2" />
              <span className="truncate">{location}</span>
            </div>

            <div className="flex items-center text-xs text-gray-600">
              <AlertCircle className="w-3 h-3 mr-2" />
              <span
                className={cn(
                  "font-medium",
                  isRegistrationExpired ? "text-red-600" : "text-gray-600",
                )}
              >
                Register by {new Date(cutoffDate).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center text-gray-600">
                <Users className="w-3 h-3 mr-2" />
                <span>
                  {registered}/{capacity}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-1">
              <div
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  registrationPercentage >= 90
                    ? "bg-red-500"
                    : registrationPercentage >= 70
                      ? "bg-yellow-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              asChild
              size="sm"
              className="flex-1 bg-black hover:bg-gray-800 text-white h-7 text-xs"
            >
              <Link
                to={`/events/${id}`}
                className="flex items-center justify-center"
              >
                View Details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
          </div>

          {hasRole("Admin") && (
            <div className="flex gap-2 pt-2">
              <Button
                asChild
                size="sm"
                variant="outline"
                className="flex-1 h-7 text-xs"
              >
                <Link
                  to={`/events-update/${id}`}
                  className="flex items-center justify-center"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Update Event
                </Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="h-7 text-xs flex items-center justify-center"
                onClick={() => handleDelete(id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
