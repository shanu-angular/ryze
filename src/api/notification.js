
const BASE_URL = 'https://aitechnotech.in/ryze';

// Send custom notification to a device using FCM token
export async function sendCustomNotification({ fcm_token, title, body }) {
  try {
    const res = await fetch(`${BASE_URL}/send_custom_notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ fcm_token, title, body }),
    });
    const data = await res.json();
    if (data && data.status === '1') {
      return { success: true, message: 'Notification sent successfully' };
    } else {
      throw new Error(data?.message || 'Failed to send notification');
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error sending notification' };
  }
}

// Send notification to all users
export async function sendNotificationToAll({ title, body }) {
  try {
    const res = await fetch(`${BASE_URL}/send_notification_to_all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ title, body }),
    });
    const data = await res.json();
    if (data && data.status === '1') {
      return { success: true, message: 'Notifications sent successfully' };
    } else {
      throw new Error(data?.message || 'Failed to send notifications');
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error sending notifications' };
  }
}

// Get all users (for selecting FCM tokens)
export async function getAllUsers() {
  try {
    const res = await fetch(`${BASE_URL}/users/`, {
      method: 'GET',
    });
    const data = await res.json();
    if (Array.isArray(data)) {
      return { success: true, users: data };
    } else {
      throw new Error('Failed to fetch users');
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error fetching users', users: [] };
  }
}

// Get a single user by user_id
export async function getUserById(user_id) {
  try {
    const res = await fetch(`${BASE_URL}/users/${user_id}`, {
      method: 'GET',
    });
    const data = await res.json();
    if (data && data.fcm_token) {
      return { success: true, user: data };
    } else {
      throw new Error('User not found or missing FCM token');
    }
  } catch (error) {
    return { success: false, message: error.message || 'Error fetching user', user: null };
  }
}
