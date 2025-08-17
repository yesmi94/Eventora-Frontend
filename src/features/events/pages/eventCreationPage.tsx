// pages/CreateEventPage.tsx
import { AddEventForm } from "../components/createEventForm";
import type { EventFormData } from "../types/types";
import { createEvent, uploadEventImage } from "../services/eventService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import axios from "axios";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [imageFile, setFile] = useState<File | null>(null);

  const handleAddEvent = async (data: EventFormData) => {
    try {
      const response = await createEvent(data);
      const eventId = response.data?.id;

      if (!eventId) {
        toast.error("Failed to create the event", {
          icon: <AlertCircle className="text-red-500" />,
        });
        throw new Error("No event ID returned");
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        await uploadEventImage(eventId, formData);
      }

      toast.success("Event created successfully", {
        icon: <CheckCircle className="text-green-500" />,
      });
      navigate(`/events/${eventId}`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-center">
          Create Event
        </h1>
        <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto">
          Fill in the below details to create your new event
        </p>
        <AddEventForm onSubmit={handleAddEvent} onFileChange={setFile} />
      </div>
    </div>
  );
}
