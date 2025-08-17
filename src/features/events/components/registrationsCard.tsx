import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventRegistrationCardProps } from "../types/types";
import { Button } from "@/components/ui/button";
import { useEventStatus } from "@/shared/hooks/useEventStatus";

const getEventStatusColor = (status: string) => {
  const colors = {
    upcoming: "bg-blue-50 text-blue-700 border-blue-200",
    ongoing: "bg-orange-50 text-orange-700 border-orange-200",
    completed: "bg-gray-50 text-gray-700 border-gray-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    colors[status as keyof typeof colors] ||
    "bg-gray-50 text-gray-700 border-gray-200"
  );
};

export const EventRegistrationCard: React.FC<EventRegistrationCardProps> = ({
  eventTitle,
  eventImageUrl,
  eventDate,
  eventTime,
  eventLocation,
  registrationDate,
  userName,
  phoneNumber,
  email,
  onCancel,
}) => {
  const eventStatus = useEventStatus(eventDate, eventTime);

  return (
    <Card className="w-full bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-3">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Image */}
          <div className="lg:w-60 w-full h-48 flex-shrink-0 rounded-2xl overflow-hidden">
            <img
              src={eventImageUrl}
              alt={eventTitle}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Event Info */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Title & Badges */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">
                  {eventTitle}
                </h3>
                <div className="flex gap-1 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium px-2 py-1",
                      getEventStatusColor(eventStatus),
                    )}
                  >
                    {eventStatus}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium px-2 py-1"
                  >
                    confirmed
                  </Badge>
                </div>
              </div>

              {/* Date, Time, Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <div className="text-sm font-medium">
                    {new Date(eventDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors">
                  <Clock className="w-4 h-4" />
                  <div className="text-sm font-medium">{eventTime}</div>
                </div>
                <div className="flex items-center gap-2 text-gray-700 bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors">
                  <MapPin className="w-4 h-4" />
                  <div className="text-sm font-medium truncate">
                    {eventLocation}
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Info & Cancel Button */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
                {/* User Info */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Registered on:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(registrationDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium text-gray-900">
                      {userName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900 truncate">
                      {email}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium text-gray-900">
                      {phoneNumber}
                    </span>
                  </div>
                </div>

                {/* Cancel Button */}
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1 transition-colors"
                    onClick={onCancel}
                  >
                    <Trash2 className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
