/**
 * Domain & API contracts for AI Hotel Operations Workforce
 * The Grand Concierge — Warm Editorial Swiss Edition
 */

// --- Verified Backend API Contracts (Django) ---
export interface BackendAiAssistantRequest {
  message: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  hotel_name?: string;
  hotel_id?: number;
  room_number?: string;
  room_type?: string;
  check_in?: string;
  check_out?: string;
  rooms?: number;
  adults?: number;
  children?: number;
}

export interface IndianHotelRecord {
  id: number;
  name: string;
  city: string;
  state: string;
  address: string;
  hotel_type: string;
  star_rating: number;
  review_rating: number;
  review_count: number;
  description: string;
  facilities: string[];
  room_type: string;
  room_facilities: string[];
  latitude?: number | null;
  longitude?: number | null;
}

export interface IndianHotelsApiResponse {
  count: number;
  results: IndianHotelRecord[];
  error?: string;
}

export interface HotelListingRecord {
  id: number;
  name: string;
  location: string;
  rating: number;
  review_score: number;
  room_type: string;
  bed_type: string;
  price: string;
}

export interface HotelListingsApiResponse {
  count: number;
  results: HotelListingRecord[];
  error?: string;
}

export interface BackendAiAssistantResponse {
  answer?: string;
  intent?: string;
  hotels?: IndianHotelRecord[];
  matched_city?: string | null;
  matched_facility?: string | null;
  booking?: {
    id?: string | number;
    status?: string;
    room_type?: string;
    guest_name?: string;
    check_in?: string;
    check_out?: string;
    total_price?: number;
  };
  ticket?: {
    id?: string | number;
    title?: string;
    department?: string;
    status?: string;
    room?: string;
  };
  action_status?: string;
  error?: string;
}

export interface BackendRetrievalResult {
  title: string;
  category: string;
  content: string;
  score: number;
}

export interface BackendRetrievalResponse {
  question: string;
  results: BackendRetrievalResult[];
  error?: string;
}

// --- Application Views & Navigation ---
export type ApplicationViewMode =
  | 'cockpit'      // Operations Cockpit (Triage, Incident Stream, Telemetry)
  | 'concierge'    // AI Concierge Desk (Live Chat against POST /api/ai-assistant/)
  | 'search'       // Verified Hotel Search & Property Intelligence
  | 'services'     // Service Tasks & Department Dispatcher
  | 'handoff'      // Human Handoff & Escalations Protocol
  | 'booking'      // Reservations & Folio Intake Demo
  | 'payments'     // Payment & Folio Settlement Demo
  | 'overview';    // Immersive Story & Operational Thread

export type SupportedLanguage = 'en' | 'hi';

// --- Messaging & Triage ---
export interface ConciergeMessage {
  id: string;
  sender: 'guest' | 'ai' | 'manager';
  senderName: string;
  timestamp: string;
  content: string;
  channel?: string;
  isAutomated?: boolean;
  policyCitation?: {
    sopSection: string;
    verifiedDocument: string;
    turnaroundConstraint?: string;
  };
}

export interface TriageIncident {
  id: string;
  roomNumber: string;
  roomType: string;
  guestName: string;
  guestTier: string;
  stayDates: string;
  priority: 'high' | 'medium' | 'standard';
  category: 'escalation' | 'vip' | 'maintenance' | 'standard';
  title: string;
  description: string;
  elapsedTime: string;
  sentiment: 'anxious' | 'neutral' | 'positive';
  status: 'awaiting_manager' | 'dispatched' | 'auto_handled' | 'in_diagnostic';
  assignedTo?: string;
  aiConfidence: number;
  messages: ConciergeMessage[];
  roomTelemetry: {
    state: string;
    activeKeys: number;
    wing: string;
    nextArrival: {
      guestName: string;
      tier: string;
      arrivalTime: string;
      bookingRef: string;
      minTurnaroundMins: number;
    };
  };
  policyCitations: Array<{
    title: string;
    status: 'verified' | 'standard';
    excerpt: string;
  }>;
  serviceTasks: Array<{
    id: string;
    title: string;
    assignedStaff: string;
    status: 'ready' | 'pending_approval' | 'completed';
    note: string;
  }>;
}

// --- Service Dispatch Domain ---
export type ServiceDepartment = 'Housekeeping' | 'Maintenance' | 'Luggage & Porter' | 'Front Desk' | 'In-Room Dining';
export type ServicePriority = 'Urgent' | 'High' | 'Normal' | 'Scheduled';
export type ServiceTaskStatus = 'Pending' | 'Dispatched' | 'In Progress' | 'Completed' | 'Escalated';

export interface ServiceTaskItem {
  id: string;
  title: string;
  roomNumber: string;
  guestName: string;
  department: ServiceDepartment;
  priority: ServicePriority;
  status: ServiceTaskStatus;
  assignedStaff: string;
  createdAt: string;
  targetCompletion: string;
  slaMinutes: number;
  notes: string;
  isSimulatedDemo: true;
}

// --- Human Escalation Record ---
export interface HumanEscalation {
  id: string;
  incidentId: string;
  roomNumber: string;
  guestName: string;
  guestTier: string;
  reason: string;
  aiConfidence: number;
  timestamp: string;
  status: 'Pending Review' | 'Approved' | 'Modified' | 'Rejected';
  recommendedAction: string;
  reviewedBy?: string;
  reviewNotes?: string;
  policyRef: string;
  isSimulatedDemo: true;
}

// --- Reservation Intake Record ---
export interface ReservationIntake {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  nightsCount: number;
  guestsCount: number;
  specialRequests: string;
  estimatedRatePerNight: number;
  totalEstimatedAmount: number;
  status: 'Draft' | 'Submitted For Verification' | 'Hold Placed (Simulated)' | 'Cancelled';
  createdTimestamp: string;
  isSimulatedDemo: true;
}

// --- Payment & Folio Charge Record ---
export interface FolioChargeItem {
  id: string;
  date: string;
  category: 'Room Accommodation' | 'F&B In-Room Dining' | 'Spa & Wellness' | 'Porterage & Valet' | 'Taxes & Luxury Cess';
  description: string;
  amount: number;
  currency: 'INR' | 'USD';
  status: 'Posted' | 'Settled' | 'Disputed';
}

export interface GuestFolio {
  folioNumber: string;
  roomNumber: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  charges: FolioChargeItem[];
  totalBilled: number;
  totalPaid: number;
  balanceDue: number;
  isSimulatedDemo: true;
}

// --- System Telemetry ---
export interface SystemTelemetry {
  activeSessions: number;
  aiResolutionRate: number;
  pendingEscalations: number;
  backendConnected: boolean;
  backendEndpoint: string;
  pmsState: 'simulated_demo' | 'live_connected';
  shiftName: string;
  dutyManager: string;
}
