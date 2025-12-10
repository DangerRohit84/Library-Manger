import React, { useState, useEffect } from 'react';
import { User, Booking, Seat, SeatType } from '../types';
import { SeatMap } from './SeatMap';
import { fetchUsers, fetchSeats, fetchBookings, updateUser, updateSeat, deleteSeat } from "../src/services/api";
import {
  LayoutDashboard, Users, Armchair, LogOut, Ban, CheckCircle,
  Pencil, Save, RotateCw, Trash2, Monitor, BookOpen,
  Download, CalendarRange
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'seats' | 'students'>('overview');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // ✅ LOAD FROM DATABASE
  const refreshData = async () => {
    setSeats(await fetchSeats());
    setUsers(await fetchUsers());
    setBookings(await fetchBookings());
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const generateLabel = (x: number, y: number) => `${String.fromCharCode(65 + y)}${x + 1}`;

  const handleSeatInteraction = async (seat: Seat) => {
    if (isEditMode) {
      setSelectedSeat(selectedSeat?.id === seat.id ? null : seat);
    } else {
      const updated = { ...seat, isMaintenance: !seat.isMaintenance };
      await updateSeat(updated);
      refreshData();
    }
  };

  const handleEmptySlotClick = async (x: number, y: number) => {
    if (!isEditMode) return;

    if (selectedSeat) {
      const updated = { ...selectedSeat, x, y, label: generateLabel(x, y) };
      await updateSeat(updated);
      setSelectedSeat(null);
    }
    refreshData();
  };

  const handleChangeType = async (type: SeatType) => {
    if (!selectedSeat) return;
    const updated = { ...selectedSeat, type };
    await updateSeat(updated);
    setSelectedSeat(updated);
    refreshData();
  };

  const handleRotateSeat = async () => {
    if (!selectedSeat) return;
    const updated = { ...selectedSeat, rotation: ((selectedSeat.rotation || 0) + 90) % 360 };
    await updateSeat(updated);
    setSelectedSeat(updated);
    refreshData();
  };

  const handleDeleteSeat = async () => {
    if (!selectedSeat) return;
    if (confirm(`Delete seat ${selectedSeat.label}?`)) {
      await deleteSeat(selectedSeat._id);
      setSelectedSeat(null);
      refreshData();
    }
  };

  const handleBlockUser = async (u: User) => {
    const updated = { ...u, isBlocked: !u.isBlocked };
    await updateUser(updated);
    refreshData();
  };

  const handleExportData = () => {
    const filtered = bookings.filter(b => b.date >= startDate && b.date <= endDate);
    if (!filtered.length) return alert("No data found");

    const rows = filtered.map(b => {
      const u = users.find(x => x.id === b.userId);
      const s = seats.find(x => x.id === b.seatId);
      return [
        b.id,
        b.userName,
        u?.studentId || "N/A",
        u?.department || "N/A",
        s?.label || "Unknown",
        b.date,
        `${b.startTime}-${b.endTime}`,
        b.status
      ].join(",");
    });

    const csv = ["BookingID,Name,StudentID,Dept,Seat,Date,Time,Status", ...rows].join("\n");
    const blob = new Blob([csv]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bookings_${startDate}_to_${endDate}.csv`;
    link.click();
  };

  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'ACTIVE').length;
  const maintenanceSeats = seats.filter(s => s.isMaintenance).length;

  return (
    <div className="min-h-screen bg-slate-100 flex">

      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <button onClick={() => setActiveTab('overview')}>Overview</button>
        <button onClick={() => setActiveTab('seats')}>Seats</button>
        <button onClick={() => setActiveTab('students')}>Students</button>
        <button onClick={onLogout}>Logout</button>
      </aside>

      <main className="flex-1 p-8">

        {activeTab === 'overview' && (
          <>
            <h2>Dashboard</h2>
            <p>Total Bookings: {totalBookings}</p>
            <p>Active: {activeBookings}</p>
            <p>Maintenance: {maintenanceSeats}</p>
            <button onClick={handleExportData}>Export CSV</button>
          </>
        )}

        {activeTab === 'seats' && (
          <>
            <button onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? <Save /> : <Pencil />}
            </button>

            <SeatMap
              seats={seats}
              bookingsForSlot={[]}
              onSeatClick={handleSeatInteraction}
              onEmptySlotClick={handleEmptySlotClick}
              selectedSeatId={selectedSeat?.id || null}
              isAdmin
              isEditMode={isEditMode}
            />

            {selectedSeat && (
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleChangeType(SeatType.STANDARD)}><Armchair /></button>
                <button onClick={() => handleChangeType(SeatType.PC)}><Monitor /></button>
                <button onClick={() => handleChangeType(SeatType.QUIET)}><BookOpen /></button>
                <button onClick={handleRotateSeat}><RotateCw /></button>
                <button onClick={handleDeleteSeat}><Trash2 /></button>
              </div>
            )}
          </>
        )}

        {activeTab === 'students' && (
          <>
            <h2>Students</h2>
            {users.filter(u => u.role === 'STUDENT').map(u => (
              <div key={u.id} className="flex justify-between p-2 border-b">
                <span>{u.name} ({u.studentId})</span>
                <button onClick={() => handleBlockUser(u)}>
                  {u.isBlocked ? <CheckCircle /> : <Ban />}
                </button>
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
};
