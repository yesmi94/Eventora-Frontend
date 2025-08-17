import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import { UpdateEventForm } from "../components/updateEventForm";
import {
  updateEvent,
  uploadEventImage,
  getEventById,
} from "../services/eventService";
import type { EventFormData } from "../types/types";
import { AlertCircle, CheckCircle } from "lucide-react";

export const EventUpdatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [eventData, setEventData] = useState<EventFormData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) {
      toast.error("Event ID is missing from the URL.");
      return;
    }

    const fetchEvent = async () => {
      getEventById(id)
        .then((response) => setEventData(response.data))
        .catch(console.error);
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async (updatedEvent: EventFormData) => {
    if (!id) {
      toast.error("Missing event ID.");
      return;
    }

    try {
      const response = await updateEvent(id, updatedEvent);
      const updatedId = response?.data?.id || id;

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await uploadEventImage(updatedId, formData);
      }

      toast.success("Event updated successfully!", {
        icon: <CheckCircle className="text-green-500" />,
      });
      navigate(`/events/${updatedId}`);
    } catch (error) {
      toast.error("Failed to update the event.", {
        icon: <AlertCircle className="text-red-500" />,
      });
    }
  };

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
          Update Event
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
          Edit the fields to update the event
        </p>
        {eventData ? (
          <UpdateEventForm
            event={eventData}
            onSubmit={handleUpdate}
            onFileChange={handleFileChange}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-center text-gray-600 text-lg">
              Loading event details...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
