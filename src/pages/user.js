import { useEffect, useState, useCallback } from "react";
import { fetchUsers, deleteUser, updateUserStatus } from "../api/userApi";

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
  const [actionMsg, setActionMsg] = useState("");

  // ✅ Memoized fetch function to avoid missing dependency warning
  const fetchData = useCallback(() => {
    setLoading(true);
    setErrorMsg("");
    fetchUsers({
      page,
      limit,
      user_name: search,
      email: search,
    })
      .then((data) => {
        const userList = data.results?.users || [];
        setUsers(sortUsers(userList, sortField, sortOrder));
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortUsers = (data, field, order) => {
    if (!field) return data;
    const sorted = [...data].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (field === "is_active") {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const handleSort = (field) => {
    let order = sortOrder;
    if (sortField === field) {
      order = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(order);
    } else {
      setSortField(field);
      setSortOrder("asc");
      order = "asc";
    }
    const sorted = sortUsers(users, field, order);
    setUsers(sorted);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    deleteUser(userId)
      .then((res) => {
        setActionMsg(res.message || "User deleted successfully");
        setUsers(users.filter(u => u.user_id !== userId));
      })
      .catch(() => setActionMsg("Failed to delete user"));
  };

  const handleToggleActive = (user) => {
    updateUserStatus(user.user_id, !user.is_active)
      .then((res) => {
        setActionMsg(res.message || "User updated successfully");
        setUsers(users.map(u => u.user_id === user.user_id ? { ...u, is_active: !u.is_active } : u));
      })
      .catch(() => setActionMsg("Failed to update user"));
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-20">
        <h4 className="mb-0">User List</h4>
        <input
          type="text"
          className="form-control"
          placeholder="Search by username or email"
          value={search}
          onChange={handleSearch}
          style={{ width: 250 }}
        />
      </div>

      <div className="wg-box">
        {errorMsg && (
          <div className="alert alert-danger text-center mb-3">{errorMsg}</div>
        )}
        {actionMsg && (
          <div className="alert alert-success text-center mb-3">
            {actionMsg}
            <button className="btn btn-sm btn-link" style={{ float: 'right', marginTop: -6 }} onClick={() => setActionMsg("")}>x</button>
          </div>
        )}

        <div className="table-responsive" style={{ maxHeight: "60vh", overflow: "auto" }}>
          <table className="table align-middle table-hover" style={{ minWidth: "1100px" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Profile</th>
                <th onClick={() => handleSort("user_name")} style={{ cursor: "pointer" }}>
                  Username {sortField === "user_name" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
                <th onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                  Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
                <th onClick={() => handleSort("mobile")} style={{ cursor: "pointer" }}>
                  Mobile {sortField === "mobile" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
                <th onClick={() => handleSort("total_loans")} style={{ cursor: "pointer" }}>
                  Total Loans {sortField === "total_loans" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
                <th onClick={() => handleSort("total_goals")} style={{ cursor: "pointer" }}>
                  Total Goals {sortField === "total_goals" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
                <th>Last Financial Update</th>
                <th onClick={() => handleSort("is_active")} style={{ cursor: "pointer" }}>
                  Status {sortField === "is_active" ? (sortOrder === "asc" ? "▲" : "▼") : "⇅"}
                </th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan={10} className="text-center">Loading...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={10} className="text-center">No users found.</td></tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.user_id}>
                    <td>{(page - 1) * limit + idx + 1}</td>
                    <td>
                      <img
                        src={user.profile_photo?.trim() || "assets/images/logo/logo.png"}
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }}
                        onError={e => { e.target.onerror = null; e.target.src = "assets/images/logo/logo.png"; }}
                      />
                    </td>
                    <td>{user.user_name}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.total_loans}</td>
                    <td>{user.total_goals}</td>
                    <td>{user.last_financial_update || "-"}</td>
                    <td>
                      <span
                        className={user.is_active ? "badge bg-success" : "badge bg-danger"}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleToggleActive(user)}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(user.user_id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-center align-items-center mt-3 gap-2">
          <button className="btn btn-outline-primary btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button className="btn btn-outline-primary btn-sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default User;
