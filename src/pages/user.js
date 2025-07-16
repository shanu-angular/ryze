
import { useEffect, useState } from "react";


function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    setLoading(true);
    let url = `https://aitechnotech.in/ryze/admin/users?skip=${(page - 1) * limit}&limit=${limit}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (sortField) url += `&sort=${sortField}&order=${sortOrder}`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data from server");
        }
        return res.json();
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

  // Error state for API failures
  const [errorMsg, setErrorMsg] = useState("");

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
            placeholder="Search by username, email, mobile..."
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
                // Sort users client-side if sortField is set
                [...users].sort((a, b) => {
                  if (!sortField) return 0;
                  let valA = a[sortField];
                  let valB = b[sortField];
                  if (typeof valA === "string") valA = valA.toLowerCase();
                  if (typeof valB === "string") valB = valB.toLowerCase();
                  if (valA < valB) return sortOrder === "asc" ? -1 : 1;
                  if (valA > valB) return sortOrder === "asc" ? 1 : -1;
                  return 0;
                }).map((user, idx) => (
                  <tr key={user.user_id}>
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
                      {user.is_active ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>{user.total_loans}</td>
                    <td>{user.total_goals}</td>
                    <td>{user.last_financial_update || "-"}</td>
                    <td>
                      <button className="btn btn-sm btn-danger">Delete</button>
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
    </>
  );
}

export default User;