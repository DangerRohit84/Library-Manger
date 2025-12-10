const API = "https://library-manger.onrender.com";

// ================= AUTH =================
export const loginUser = async (email: string, password: string) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
};

export const registerUser = async (user: any) => {
  const res = await fetch(`${API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

// ================= USERS (ADMIN) =================
export const fetchUsers = async () => {
  const res = await fetch(`${API}/api/users`);
  return res.json();
};

export const updateUser = async (user: any) => {
  const res = await fetch(`${API}/api/users/${user._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  return res.json();
};

// ================= SEATS =================
export const fetchSeats = async () => {
  const res = await fetch(`${API}/api/seats`);
  return res.json();
};

export const updateSeat = async (seat: any) => {
  const res = await fetch(`${API}/api/seats/${seat._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(seat)
  });

  return res.json();
};

export const deleteSeat = async (id: string) => {
  const res = await fetch(`${API}/api/seats/${id}`, {
    method: "DELETE"
  });

  return res.json();
};

// ================= BOOKINGS =================
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
  const res = await fetch(`${API}/api/bookings/${id}`, {
    method: "DELETE"
  });

  return res.json();
};
