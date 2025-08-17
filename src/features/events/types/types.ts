// src/types/event.types.ts
export interface EventDetails {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  eventTime: string;
  cutoffDate: Date;
  type?: number;
  location: string;
  capacity: number;
  remainingSpots?: number;
  eventImageUrl?: string;
  organizer?: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  showAdminActions?: boolean;
}

export interface EventDetailsDisplay {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  eventTime: string;
  cutoffDate: Date;
  type: number;
  location: string;
  capacity: number;
  remainingSpots: number;
  eventImageUrl: string;
  organizer: string;
  status?: "upcoming" | "ongoing" | "completed" | "cancelled";
  showAdminActions?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  eventDate: Date;
  eventTime: string;
  cutoffDate: Date;
  type: number;
  organization: string;
  capacity: number;
  eventImageUrl?: string;
}

export interface EventCardProps {
  id: string;
  title: string;
  description: string;
  eventDate: Date;
  eventTime: string;
  cutoffDate: Date;
  type: number;
  location: string;
  capacity: number;
  remainingSpots: number;
  eventImageUrl: string;
  organizer?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  showAdminActions?: boolean;
}

export interface EventTypeOption {
  value: number;
  label: string;
}

export interface Event {
  id: string;
  title: string;
  eventDate: Date;
  eventTime: string;
  location: string;
  eventImageUrl?: string;
}

export interface Props {
  onSubmit: (data: EventFormData) => void;
  onFileChange?: (file: File | null) => void;
}

export interface DateAndTimePickerProps {
  onDateChange?: (date: Date) => void;
  onTimeChange?: (time: string) => void;
}

export interface DateOnlyPickerProps {
  onDateChange?: (date: Date) => void;
  initialDate?: Date;
}

export interface UpdateFormProps {
  event: EventFormData;
  onSubmit: (event: EventFormData) => void;
  onFileChange?: (file: File | null) => void;
}

export interface EventRegistrationCardProps {
  id: string;
  eventImageUrl?: string;
  eventLocation?: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  eventDate: Date;
  eventTime: string;
  registrationStatus: string;
  registrationDate: string;
  eventTitle: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  onCancel: () => void;
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface FilterOptions {
  location: string;
  type: string;
  dateFrom: string;
  dateTo: string;
  status: string;
}

export interface EventSearchProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
  eventTypes: EventTypeOption[];
  uniqueLocations: string[];
}
