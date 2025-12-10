const API = "https://YOUR-BACKEND.onrender.com"; // 🔴 REPLACE

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const registerUser = async (user: any) => {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });
  return res.json();
};

export const fetchSeats = async () => {
  const res = await fetch(`${API}/api/seats`);
  return res.json();
};

export const updateSeat = async (seat: any) => {
  await fetch(`${API}/api/seats/${seat._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(seat)
  });
};

export const fetchBookings = async () => {
  const res = await fetch(`${API}/api/bookings`);
  return res.json();
};

export const createBooking = async (booking: any) => {
  const res = await fetch(`${API}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking)
  });
  return res.json();
};

export const cancelBooking = async (id: string) => {
  await fetch(`${API}/api/bookings/${id}`, {
    method: "DELETE"
  });
};
