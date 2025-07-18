
import { useEffect, useState } from "react";
import { fetchUsers, fetchUserById, deleteUser, updateUserStatus } from "../api/userApi";


function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editStatus, setEditStatus] = useState(null);

  useEffect(() => {
    setLoading(true);
    setErrorMsg("");
    fetchUsers({
      page,
      limit,
      user_name: search,
      email: search,
      sortField,
      sortOrder
    })
      .then((data) => {
        setUsers(data.results?.users || []);
        setTotalPages(data.results?.total_pages || 1);
        setLoading(false);
      })
      .catch((error) => {
        setUsers([]);
        setTotalPages(1);
        setLoading(false);
        setErrorMsg(error.message || "Failed to load data from server");
      });
  }, [page, limit, search, sortField, sortOrder]);


  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Show user details modal
  const handleUserClick = (userId) => {
    setDetailsLoading(true);
    setSelectedUser(null);
    setEditMode(false);
    setEditStatus(null);
    fetchUserById(userId)
      .then((data) => {
        setSelectedUser(data.results);
        setDetailsLoading(false);
      })
      .catch(() => {
        setSelectedUser(null);
        setDetailsLoading(false);
      });
  };

  // Delete user
  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    deleteUser(userId)
      .then((res) => {
        setActionMsg(res.message || "User deleted successfully");
        setUsers(users.filter(u => u.user_id !== userId));
      })
      .catch(() => setActionMsg("Failed to delete user"));
  };

  // Toggle active/inactive from table
  const handleToggleActive = (user) => {
    updateUserStatus(user.user_id, !user.is_active)
      .then((res) => {
        setActionMsg(res.message || "User updated successfully");
        setUsers(users.map(u => u.user_id === user.user_id ? { ...u, is_active: !u.is_active } : u));
        if (selectedUser && selectedUser.user_id === user.user_id) {
          setSelectedUser({ ...selectedUser, is_active: !selectedUser.is_active });
        }
      })
      .catch(() => setActionMsg("Failed to update user"));
  };

  // Save status change from modal
  const handleSaveStatus = () => {
    if (!selectedUser) return;
    updateUserStatus(selectedUser.user_id, editStatus)
      .then((res) => {
        setActionMsg(res.message || "User updated successfully");
        setUsers(users.map(u => u.user_id === selectedUser.user_id ? { ...u, is_active: editStatus } : u));
        setSelectedUser({ ...selectedUser, is_active: editStatus });
        setEditMode(false);
      })
      .catch(() => setActionMsg("Failed to update user"));
  };



  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <div>
          <h4 className="mb-0">User List</h4>
        </div>
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Search by username or email"
            value={search}
            onChange={handleSearch}
            style={{ width: 250 }}
          />
        </div>
      </div>
      <div className="wg-box">
        {errorMsg && (
          <div className="alert alert-danger text-center mb-3" role="alert">
            {errorMsg}
          </div>
        )}
        {actionMsg && (
          <div className="alert alert-success text-center mb-3" role="alert">
            {actionMsg}
            <button className="btn btn-sm btn-link" style={{ float: 'right', marginTop: -6 }} onClick={() => setActionMsg("")}>x</button>
          </div>
        )}
        <div className="table-responsive" style={{ maxHeight: "60vh", overflowY: "auto", overflowX: "auto" }}>
          <table className="table align-middle table-hover" style={{ minWidth: "1100px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Profile Photo</th>
                <th onClick={() => handleSort("user_name")} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                  Username {sortField === "user_name" ? (sortOrder === "asc" ? "▲" : "▼") : <span style={{opacity:0.3}}>⇅</span>}
                </th>
                <th onClick={() => handleSort("email")} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                  Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : <span style={{opacity:0.3}}>⇅</span>}
                </th>
                <th onClick={() => handleSort("mobile")} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                  Mobile {sortField === "mobile" ? (sortOrder === "asc" ? "▲" : "▼") : <span style={{opacity:0.3}}>⇅</span>}
                </th>
                <th>Status</th>
                <th onClick={() => handleSort("total_loans")} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                  Total Loans {sortField === "total_loans" ? (sortOrder === "asc" ? "▲" : "▼") : <span style={{opacity:0.3}}>⇅</span>}
                </th>
                <th onClick={() => handleSort("total_goals")} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                  Total Goals {sortField === "total_goals" ? (sortOrder === "asc" ? "▲" : "▼") : <span style={{opacity:0.3}}>⇅</span>}
                </th>
                <th>Last Financial Update</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>Loading...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center" }}>No users found.</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.user_id} style={{ cursor: "pointer" }} onClick={e => { if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SPAN') handleUserClick(user.user_id); }}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>
                      <img
                        src={user.profile_photo && user.profile_photo.trim() !== "" ? user.profile_photo : "assets/images/logo/logo.png"}
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                        onError={e => { e.target.onerror = null; e.target.src = "assets/images/logo/logo.png"; }}
                      />
                    </td>
                    <td>{user.user_name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>
                      <span className={user.is_active ? "badge bg-success" : "badge bg-danger"} style={{ cursor: "pointer" }}
                        onClick={e => { e.stopPropagation(); handleToggleActive(user); }}
                      >{user.is_active ? "Active" : "Inactive"}</span>
                    </td>
                    <td>{user.total_loans}</td>
                    <td>{user.total_goals}</td>
                    <td>{user.last_financial_update || "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={e => { e.stopPropagation(); handleDelete(user.user_id); }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination UI */}
        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            className="btn btn-outline-primary btn-sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal show" tabIndex="-1" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">User Details</h5>
                <button type="button" className="btn-close" onClick={() => { setSelectedUser(null); setEditMode(false); }}></button>
              </div>
              <div className="modal-body">
                {detailsLoading ? (
                  <div>Loading...</div>
                ) : (
                  <div>
                    <div className="text-center mb-3">
                      <img
                        src={selectedUser.profile_photo && selectedUser.profile_photo.trim() !== "" ? selectedUser.profile_photo : "assets/images/logo/logo.png"}
                        alt="Profile"
                        style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
                        onError={e => { e.target.onerror = null; e.target.src = "assets/images/logo/logo.png"; }}
                      />
                    </div>
                    <div><b>Name:</b> {selectedUser.user_name}</div>
                    <div><b>Email:</b> {selectedUser.email}</div>
                    <div><b>Mobile:</b> {selectedUser.mobile}</div>
                    <div><b>Status:</b> {editMode ? (
                      <select className="form-select" value={editStatus} onChange={e => setEditStatus(e.target.value === 'true')} style={{ width: 120, display: 'inline-block' }}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    ) : (
                      selectedUser.is_active ? "Active" : "Inactive"
                    )}
                    </div>
                    <div><b>Created At:</b> {selectedUser.created_at}</div>
                    <div><b>Total Loans:</b> {selectedUser.total_loans}</div>
                    <div><b>Total Goals:</b> {selectedUser.total_goals}</div>
                    <div><b>Last Financial Update:</b> {selectedUser.last_financial_update || "-"}</div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {editMode ? (
                  <>
                    <button type="button" className="btn btn-primary" onClick={handleSaveStatus}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button type="button" className="btn btn-warning" onClick={() => { setEditMode(true); setEditStatus(selectedUser.is_active); }}>Edit Status</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default User;