import React, { useState, useEffect } from 'react';
import { sendCustomNotification, sendNotificationToAll, getAllUsers } from '../api/notification';

const Notification = () => {
  const [form, setForm] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState('all'); // 'all', 'single', 'multiple'
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.users);
      }
    }
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
    setMessage('');
    setSelectedUser(null);
    setSelectedUsers([]);
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    setSelectedUser(userId);
  };

  const handleMultiUserSelect = (e) => {
    const options = Array.from(e.target.selectedOptions);
    setSelectedUsers(options.map(opt => opt.value));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let res;
    if (recipient === 'all') {
      res = await sendNotificationToAll({ title: form.title, body: form.body });
    } else if (recipient === 'single') {
      if (!selectedUser) {
        setMessage('Please select a user.');
        setLoading(false);
        return;
      }
      const user = users.find(u => String(u.id) === String(selectedUser));
      if (!user || !user.fcm_token) {
        setMessage('Selected user does not have a valid token.');
        setLoading(false);
        return;
      }
      res = await sendCustomNotification({ fcm_token: user.fcm_token, title: form.title, body: form.body });
    } else if (recipient === 'multiple') {
      if (!selectedUsers.length) {
        setMessage('Please select users.');
        setLoading(false);
        return;
      }
      let allSuccess = true;
      let errorMsg = '';
      for (const userId of selectedUsers) {
        const user = users.find(u => String(u.id) === String(userId));
        if (user && user.fcm_token) {
          const r = await sendCustomNotification({ fcm_token: user.fcm_token, title: form.title, body: form.body });
          if (!r.success) {
            allSuccess = false;
            errorMsg += `Failed for ${user.user_name}. `;
          }
        } else {
          allSuccess = false;
          errorMsg += `Unable to send Notification ${user?.user_name || userId}. `;
        }
      }
      res = { success: allSuccess, message: allSuccess ? 'Notifications sent successfully' : errorMsg };
    }
    setLoading(false);
    if (res.success) {
      setMessage(res.message);
      setForm({ title: '', body: '' });
      setSelectedUser(null);
      setSelectedUsers([]);
    } else {
      setMessage(res.message || 'Failed to send notification');
    }
  };

  return (
    <>
      <div className="flex items-center flex-wrap justify-between gap20 mb-27">
        <h3>Send Notification</h3>
      </div>
      <div className="wg-box mb-4">
        <form onSubmit={handleSend} className="row g-3">
          <div className="col-md-3">
            <select
              className="form-control"
              value={recipient}
              onChange={handleRecipientChange}
            >
              <option value="all">All Users</option>
              <option value="single">Single User</option>
              <option value="multiple">Multiple Users</option>
            </select>
          </div>
          {recipient === 'single' && (
            <div className="col-md-4">
              <select
                className="form-control"
                value={selectedUser || ''}
                onChange={handleUserSelect}
                required
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.user_name}{user.is_active ? '' : '(Inactive)'}
                  </option>
                ))}
              </select>
            </div>
          )}
          {recipient === 'multiple' && (
            <div className="col-md-5">
              <select
                className="form-control"
                multiple
                value={selectedUsers}
                onChange={handleMultiUserSelect}
                required
                style={{ height: '120px' }}
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.user_name} {user.is_active ? '' : '(Inactive)'}
                  </option>
                ))}
              </select>
              <small>Select multiple users (Ctrl+Click)</small>
            </div>
          )}
          <div className="col-md-3">
            <input
              name="title"
              className="form-control"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              name="body"
              className="form-control"
              placeholder="Body"
              value={form.body}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
        {message && (
          <div className="mt-3">
            <span>{message}</span>
          </div>
        )}
      </div>
    </>
  );
}

export default Notification;