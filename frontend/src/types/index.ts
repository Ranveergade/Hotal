/**
 * Domain & API contracts for AI Hotel Operations Workforce
 */

// 1. AI Concierge
export type SupportedLanguage = 'en' | 'hi';

export interface ConciergeQueryRequest {
  query: string;
  language: SupportedLanguage;
  sessionId?: string;
}

export interface ConciergeQueryResponse {
  answer: string;
  sourceKnowledgeIds?: number[];
  confidence: number;
  isEscalated: boolean;
  escalationReason?: string;
  language: SupportedLanguage;
}

// 2. Room Booking & Reservations
export interface RoomType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  maxOccupancy: number;
  availableRooms: number;
}

export interface BookingCreationRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
}

export type BookingStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'checked_in' | 'completed';

export interface Booking {
  id: string;
  bookingReference: string;
  status: BookingStatus;
  guestName: string;
  guestEmail: string;
  roomTypeId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// 3. Service Requests & Task Dispatcher
export type ServiceCategory = 'housekeeping' | 'towels' | 'maintenance' | 'room_service' | 'other';
export type ServicePriority = 'low' | 'medium' | 'high' | 'urgent';
export type ServiceStatus = 'logged' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceRequestItem {
  id: string;
  roomReference: string;
  category: ServiceCategory;
  priority: ServicePriority;
  description: string;
  department: string;
  assignedStaff?: string;
  status: ServiceStatus;
  createdAt: string;
  updatedAt: string;
}

// 4. Human Handoff & Escalation
export type EscalationReason = 'complaint' | 'low_confidence' | 'sensitive_request' | 'action_failure' | 'guest_request';
export type HandoffStatus = 'pending' | 'claimed' | 'resolved';

export interface HumanHandoffTicket {
  id: string;
  sessionId: string;
  guestReference?: string;
  conversationSummary: string;
  reason: EscalationReason;
  status: HandoffStatus;
  claimedByStaff?: string;
  createdAt: string;
}

// 5. Payment & Booking Confirmation
export type PaymentStatus = 'pending' | 'processing' | 'successful' | 'failed' | 'refunded';

export interface PaymentInitiationRequest {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: 'card' | 'upi' | 'cash_on_arrival';
}

export interface PaymentVerificationResponse {
  paymentId: string;
  bookingId: string;
  status: PaymentStatus;
  isSimulated: boolean;
  verifiedAt: string;
}

