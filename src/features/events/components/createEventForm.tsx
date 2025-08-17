// src/components/events/AddEventForm.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { DateOnlyPicker } from "./dateOnlyPicker";
import { getEventTypes } from "../services/eventService";
import { eventSchema } from "../schemas/eventSchema";
import type { EventFormData, EventTypeOption, Props } from "../types/types";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Building2,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const AddEventForm: React.FC<Props> = ({ onSubmit, onFileChange }) => {
  const [eventTypes, setEventTypes] = useState<EventTypeOption[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      type: 0,
      description: "",
      location: "",
      organization: "",
      capacity: 1,
      eventDate: new Date(),
      eventTime: "",
      eventImageUrl: "",
      cutoffDate: new Date(),
    },
  });

  const eventDate = watch("eventDate");
  const eventTime = watch("eventTime");
  const cutoffDate = watch("cutoffDate");
  const title = watch("title");
  const description = watch("description");
  const location = watch("location");
  const capacity = watch("capacity");
  const type = watch("type");
  const eventImageUrl = watch("eventImageUrl");
  const organization = watch("organization");

  useEffect(() => {
    getEventTypes().then(setEventTypes).catch(console.error);
  }, []);

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    onFileChange?.(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Information */}
          <Card>
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Basic Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Event Title</Label>
                  <Input
                    {...register("title")}
                    placeholder="Enter event title"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Event Type</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("type", Number(value), { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={errors.type ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem
                          key={type.value}
                          value={type.value.toString()}
                        >
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500">
                      {errors.type.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    {...register("description")}
                    placeholder="Describe your event"
                    rows={4}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location & Organization */}
          <Card>
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" /> Location &
                Organization
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label>Location</Label>
                  <Input
                    {...register("location")}
                    placeholder="Event venue or address"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Organization</Label>
                  <Input
                    {...register("organization")}
                    placeholder="Organizer name"
                    className={errors.organization ? "border-red-500" : ""}
                  />
                  {errors.organization && (
                    <p className="text-sm text-red-500">
                      {errors.organization.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Details */}
          <Card>
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Event Date</Label>
                  <DateOnlyPicker
                    onDateChange={(date) =>
                      date &&
                      setValue("eventDate", date, { shouldValidate: true })
                    }
                  />
                  {errors.eventDate && (
                    <p className="text-sm text-red-500">
                      {errors.eventDate.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Event Time</Label>
                  <Input
                    type="time"
                    {...register("eventTime")}
                    className={errors.eventTime ? "border-red-500" : ""}
                  />
                  {errors.eventTime && (
                    <p className="text-sm text-red-500">
                      {errors.eventTime.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    min={1}
                    {...register("capacity", {
                      setValueAs: (v) => (v === "" ? undefined : Number(v)),
                    })}
                    className={errors.capacity ? "border-red-500" : ""}
                  />
                  {errors.capacity && (
                    <p className="text-sm text-red-500">
                      {errors.capacity.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Registration Cutoff Date</Label>
                <DateOnlyPicker
                  onDateChange={(date) =>
                    date &&
                    setValue("cutoffDate", date, { shouldValidate: true })
                  }
                />
                {errors.cutoffDate && (
                  <p className="text-sm text-red-500">
                    {errors.cutoffDate.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-6">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" /> Event Image
              </h2>
              <Input
                className="cursor-pointer"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              />
            </CardContent>
          </Card>

          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-black text-white"
          >
            {isSubmitting ? "Creating Event..." : "Create Event"}
          </Button>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardContent className="space-y-4">
              {selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
              ) : eventImageUrl ? (
                <img
                  src={eventImageUrl}
                  alt="Event preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
                  Image Preview
                </div>
              )}
              <h3 className="text-xl font-semibold">
                {title || "Event Title"}
              </h3>
              <p className="text-gray-600 line-clamp-3">
                {description || "Event description will appear here..."}
              </p>
              <div className="space-y-2 text-sm text-gray-700">
                {eventDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {format(eventDate, "PPP")}
                  </div>
                )}
                {cutoffDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {format(cutoffDate, "PPP")}
                  </div>
                )}
                {eventTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> {eventTime}
                  </div>
                )}
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {location}
                  </div>
                )}
                {capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {capacity} attendees
                  </div>
                )}
                {organization && (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {organization}
                  </div>
                )}
                {type && <div className="flex items-center gap-2">{type}</div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
