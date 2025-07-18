// src/api/userApi.js

const API_BASE = "https://aitechnotech.in/ryze/admin/users";

// Fetch users with support for filtering by user_name and email (API docs)
export async function fetchUsers({ page = 1, limit = 10, user_name = "", email = "", sortField = "", sortOrder = "asc" }) {
  let url = `${API_BASE}?skip=${(page - 1) * limit}&limit=${limit}`;
  if (user_name) url += `&user_name=${encodeURIComponent(user_name)}`;
  if (email) url += `&email=${encodeURIComponent(email)}`;
  if (sortField) url += `&sort=${sortField}&order=${sortOrder}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function fetchUserById(userId) {
  const res = await fetch(`${API_BASE}/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}

export async function deleteUser(userId) {
  // Ensure userId is a number
  const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

export async function updateUserStatus(userId, is_active) {
  const res = await fetch(`${API_BASE}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ is_active })
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
}
