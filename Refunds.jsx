import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../pages/refund.css";

export default function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get user info and token from localStorage
  let user = null;
  let token = null;
  let role = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
    token = user?.token;
    role = user?.role?.toLowerCase();
  } catch {
    console.warn("Failed to parse user from localStorage");
  }

  // Fetch refunds
  useEffect(() => {
    const fetchRefunds = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      setLoading(true);
      setError(null);
      const endpoint = role === "admin" ? "/refund" : "/refund/my";

      try {
        const res = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRefunds(res.data || []);
      } catch (err) {
        console.error("Error fetching refunds:", err.response || err);
        setError(err.response?.data?.message || "Failed to fetch refunds.");
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, [navigate, token, role]);

  // Request refund (Guest)
  const handleRequestRefund = async () => {
    if (!bookingId || !amount) {
      alert("Booking ID and amount are required.");
      return;
    }

    try {
      await api.post(
        "/refund/request",
        { bookingId: parseInt(bookingId), amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Refund requested successfully.");
      setBookingId("");
      setAmount("");

      // Refresh refunds
      const res = await api.get("/refund/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefunds(res.data || []);
    } catch (err) {
      console.error("Error requesting refund:", err.response || err);
      alert(err.response?.data?.message || "Failed to request refund.");
    }
  };

  // Update refund status (Admin)
  const handleUpdateStatus = async (refundId, status) => {
    try {
      await api.put(
        `/refund/update-status/${refundId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Refund status updated to ${status}`);
      // Refresh refunds
      const res = await api.get("/refund", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefunds(res.data || []);
    } catch (err) {
      console.error("Error updating status:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="refund-container">
      <h2>Refund Center</h2>

      {role === "guest" && (
        <div className="refund-request">
          <h3>Request a Refund</h3>
          <p>Note your Booking ID for requesting a refund.</p>
          <input
            type="number"
            placeholder="Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={handleRequestRefund}>Request Refund</button>
        </div>
      )}

      <div className="refund-list">
        <h3>{role === "admin" ? "All Refunds" : "Your Refunds"}</h3>

        {loading && <p>Loading refunds...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && refunds.length === 0 && <p>No refund requests found.</p>}

        {refunds.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Refund ID</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Status</th>
                {role === "admin" && <th>Update Status</th>}
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r.refundId}>
                  <td>{r.refundId}</td>
                  <td>{r.bookingId}</td>
                  <td>₹{r.amount}</td>
                  <td>
                    <span className={`refund-status ${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  {role === "admin" && (
                    <td>
                      {r.status.toLowerCase() === "pending" && (
                        <>
                          <button
                            className="approve"
                            onClick={() =>
                              handleUpdateStatus(r.refundId, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="reject"
                            onClick={() =>
                              handleUpdateStatus(r.refundId, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
