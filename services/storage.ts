import { User, Seat, Booking, UserRole, SeatType } from '../types';

// Initial Mock Data based on the provided floor plan image
const INITIAL_SEATS: Seat[] = [
  // --- Top Left: Lounge Area (3 Seats) ---
  { id: 's-l1', label: 'L1', type: SeatType.STANDARD, isMaintenance: false, x: 1, y: 1, rotation: 180 },
  { id: 's-l2', label: 'L2', type: SeatType.STANDARD, isMaintenance: false, x: 2, y: 1, rotation: 180 },
  { id: 's-l3', label: 'L3', type: SeatType.STANDARD, isMaintenance: false, x: 3, y: 1, rotation: 180 },

  // --- Top Right: PC Stations (3 + 1 Corner) ---
  { id: 's-pc1', label: 'PC1', type: SeatType.PC, isMaintenance: false, x: 9, y: 0, rotation: 180 },
  { id: 's-pc2', label: 'PC2', type: SeatType.PC, isMaintenance: false, x: 10, y: 0, rotation: 180 },
  { id: 's-pc3', label: 'PC3', type: SeatType.PC, isMaintenance: false, x: 11, y: 0, rotation: 180 },
  { id: 's-pc4', label: 'PC4', type: SeatType.PC, isMaintenance: false, x: 13, y: 1, rotation: 225 }, // Corner-ish

  // --- Middle Right: Group Table 1 (Square arrangement) ---
  // Center roughly at 11, 4
  { id: 's-t1-1', label: 'T1-A', type: SeatType.QUIET, isMaintenance: false, x: 11, y: 3, rotation: 180 }, // Top
  { id: 's-t1-2', label: 'T1-B', type: SeatType.QUIET, isMaintenance: false, x: 11, y: 5, rotation: 0 },   // Bottom
  { id: 's-t1-3', label: 'T1-C', type: SeatType.QUIET, isMaintenance: false, x: 10, y: 4, rotation: 90 },  // Left
  { id: 's-t1-4', label: 'T1-D', type: SeatType.QUIET, isMaintenance: false, x: 12, y: 4, rotation: 270 }, // Right

  // --- Lower Right: Group Table 2 (Square arrangement) ---
  // Center roughly at 11, 8
  { id: 's-t2-1', label: 'T2-A', type: SeatType.QUIET, isMaintenance: false, x: 11, y: 7, rotation: 180 }, // Top
  { id: 's-t2-2', label: 'T2-B', type: SeatType.QUIET, isMaintenance: false, x: 11, y: 9, rotation: 0 },   // Bottom
  { id: 's-t2-3', label: 'T2-C', type: SeatType.QUIET, isMaintenance: false, x: 10, y: 8, rotation: 90 },  // Left
  { id: 's-t2-4', label: 'T2-D', type: SeatType.QUIET, isMaintenance: false, x: 12, y: 8, rotation: 270 }, // Right

  // --- Left Side: Study Carrels (Simulating space between bookshelves) ---
  // Row 4
  { id: 's-c1', label: 'C1', type: SeatType.STANDARD, isMaintenance: false, x: 1, y: 4, rotation: 90 },
  { id: 's-c2', label: 'C2', type: SeatType.STANDARD, isMaintenance: false, x: 2, y: 4, rotation: 90 },
  { id: 's-c3', label: 'C3', type: SeatType.STANDARD, isMaintenance: false, x: 3, y: 4, rotation: 90 },
  { id: 's-c4', label: 'C4', type: SeatType.STANDARD, isMaintenance: false, x: 4, y: 4, rotation: 90 },
  
  // Row 6
  { id: 's-c5', label: 'C5', type: SeatType.STANDARD, isMaintenance: false, x: 1, y: 6, rotation: 90 },
  { id: 's-c6', label: 'C6', type: SeatType.STANDARD, isMaintenance: false, x: 2, y: 6, rotation: 90 },
  { id: 's-c7', label: 'C7', type: SeatType.STANDARD, isMaintenance: false, x: 3, y: 6, rotation: 90 },
  { id: 's-c8', label: 'C8', type: SeatType.STANDARD, isMaintenance: false, x: 4, y: 6, rotation: 90 },

  // Row 8
  { id: 's-c9', label: 'C9', type: SeatType.STANDARD, isMaintenance: false, x: 1, y: 8, rotation: 90 },
  { id: 's-c10', label: 'C10', type: SeatType.STANDARD, isMaintenance: false, x: 2, y: 8, rotation: 90 },
  { id: 's-c11', label: 'C11', type: SeatType.STANDARD, isMaintenance: false, x: 3, y: 8, rotation: 90 },
  { id: 's-c12', label: 'C12', type: SeatType.STANDARD, isMaintenance: false, x: 4, y: 8, rotation: 90 },
];

const ADMIN_USER: User = {
  id: 'admin-1',
  name: 'Library Admin',
  email: 'admin@library.edu',
  password: 'admin@123', // Kept simple as per request in first prompt history
  role: UserRole.ADMIN,
  isBlocked: false
};

const DEMO_STUDENT: User = {
  id: 'student-1',
  name: 'John Doe',
  email: 'john@student.edu',
  password: 'password',
  role: UserRole.STUDENT,
  studentId: 'CS2024001',
  department: 'Computer Science',
  yearSection: '3-A',
  mobile: '5550123456',
  isBlocked: false
};

// Storage Keys
const KEYS = {
  USERS: 'libbook_users',
  SEATS: 'libbook_seats',
  BOOKINGS: 'libbook_bookings',
  CURRENT_USER: 'libbook_current_user'
};

// Helpers
export const getStoredUsers = (): User[] => {
  const stored = localStorage.getItem(KEYS.USERS);
  if (!stored) {
    const initial = [ADMIN_USER, DEMO_STUDENT];
    localStorage.setItem(KEYS.USERS, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(stored);
};

export const getStoredSeats = (): Seat[] => {
  const stored = localStorage.getItem(KEYS.SEATS);
  if (!stored) {
    localStorage.setItem(KEYS.SEATS, JSON.stringify(INITIAL_SEATS));
    return INITIAL_SEATS;
  }
  return JSON.parse(stored);
};

export const getStoredBookings = (): Booking[] => {
  const stored = localStorage.getItem(KEYS.BOOKINGS);
  return stored ? JSON.parse(stored) : [];
};

// Actions
export const saveUser = (user: User) => {
  const users = getStoredUsers();
  users.push(user);
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const updateUser = (updatedUser: User) => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

export const saveSeats = (seats: Seat[]) => {
  localStorage.setItem(KEYS.SEATS, JSON.stringify(seats));
};

export const createBooking = (booking: Booking): boolean => {
  const bookings = getStoredBookings();
  // Simple validation: check if seat is taken
  const isTaken = bookings.some(b => 
    b.seatId === booking.seatId && 
    b.date === booking.date && 
    b.startTime === booking.startTime &&
    b.status === 'ACTIVE'
  );

  if (isTaken) return false;

  bookings.push(booking);
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  return true;
};

export const cancelBooking = (bookingId: string) => {
  const bookings = getStoredBookings();
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) {
    bookings[index].status = 'CANCELLED';
    localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  }
};

export const toggleSeatMaintenance = (seatId: string) => {
  const seats = getStoredSeats();
  const seat = seats.find(s => s.id === seatId);
  if (seat) {
    seat.isMaintenance = !seat.isMaintenance;
    localStorage.setItem(KEYS.SEATS, JSON.stringify(seats));
  }
};
