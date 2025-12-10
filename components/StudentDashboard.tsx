import React, { useState, useEffect } from 'react';
import { User, Booking, Seat } from '../types';
import { SeatMap } from './SeatMap';
import { fetchSeats, fetchBookings, createBooking, cancelBooking } from "../src/services/api";
import { format, addDays, addHours, isSameDay } from 'date-fns';
import { Calendar, Clock, LogOut, CheckCircle2, History, XCircle, AlertCircle } from 'lucide-react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

const ALL_TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8;
  return {
    value: `${hour.toString().padStart(2, '0')}:00`,
    label: `${hour % 12 || 12} ${hour < 12 ? 'AM' : 'PM'} - ${(hour + 1) % 12 || 12} ${hour + 1 < 12 ? 'AM' : 'PM'}`,
    hourInt: hour
  };
});

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // ✅ LOAD FROM REAL DATABASE
  useEffect(() => {
    fetchSeats().then(setSeats);
    fetchBookings().then(setBookings);
  }, [activeTab]);

  const getAvailableTimeSlots = () => {
    const now = new Date();
    const isToday = isSameDay(new Date(selectedDate), now);
    const currentHour = now.getHours();

    return ALL_TIME_SLOTS.filter(slot => {
      if (isToday) return slot.hourInt > currentHour;
      return true;
    });
  };

  const filteredSlots = getAvailableTimeSlots();

  useEffect(() => {
    if (filteredSlots.length > 0) {
      const isValid = filteredSlots.some(s => s.value === selectedTime);
      if (!isValid) setSelectedTime(filteredSlots[0].value);
    } else {
      setSelectedTime('');
    }
  }, [selectedDate]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const activeSlotBookings = bookings
    .filter(b => b.date === selectedDate && b.startTime === selectedTime && b.status === 'ACTIVE')
    .map(b => b.seatId);

  // ✅ REAL BOOKING API
  const handleBook = async () => {
    if (!selectedSeat || !selectedTime) return;

    const hasConflict = bookings.some(b =>
      b.userId === user.id &&
      b.date === selectedDate &&
      b.startTime === selectedTime &&
      b.status === 'ACTIVE'
    );

    if (hasConflict) {
      showToast("You already booked a seat for this time.", 'error');
      return;
    }

    const newBooking: Booking = {
      id: '',
      seatId: selectedSeat.id,
      userId: user.id,
      userName: user.name,
      date: selectedDate,
      startTime: selectedTime,
      endTime: format(addHours(new Date(`2000-01-01T${selectedTime}`), 1), 'HH:00'),
      timestamp: Date.now(),
      status: 'ACTIVE'
    };

    const saved = await createBooking(newBooking);
    setBookings(prev => [...prev, saved]);
    showToast("Seat booked successfully!", 'success');
    setSelectedSeat(null);
  };

  // ✅ REAL CANCEL API
  const handleCancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;

    await cancelBooking(id);
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'CANCELLED' as const } : b));
    showToast("Booking cancelled.", 'success');
  };

  const myBookings = bookings.filter(b => b.userId === user.id).sort((a, b) => b.timestamp - a.timestamp);
  const availableDates = [0, 1, 2].map(days => format(addDays(new Date(), days), 'yyyy-MM-dd'));

  return (
    <div className="min-h-screen bg-slate-100 pb-20">

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg border flex items-center gap-3 
        ${toast.type === 'success' ? 'bg-white border-green-200 text-green-700' : 'bg-white border-red-200 text-red-700'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header className="bg-white border-b h-16 flex justify-between items-center px-6">
        <span className="font-bold">LibBook Student</span>
        <div className="flex items-center gap-4">
          <span className="text-sm">Welcome, {user.name}</span>
          <button onClick={onLogout}><LogOut /></button>
        </div>
      </header>

      <div className="p-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('book')} className={activeTab === 'book' ? 'btn-primary' : ''}>
            <Calendar size={16} /> Book
          </button>
          <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? 'btn-primary' : ''}>
            <History size={16} /> History
          </button>
        </div>

        {activeTab === 'book' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Clock /> Select Slot
              {filteredSlots.map(slot => (
                <button key={slot.value} onClick={() => setSelectedTime(slot.value)}>
                  {slot.label}
                </button>
              ))}
            </div>

            <SeatMap
              seats={seats}
              bookingsForSlot={activeSlotBookings}
              onSeatClick={setSelectedSeat}
              selectedSeatId={selectedSeat?.id || null}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            {myBookings.map(b => (
              <div key={b._id} className="p-4 border flex justify-between">
                <span>{b.date} {b.startTime}</span>
                <button onClick={() => handleCancel(b._id)}>
                  <XCircle />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
