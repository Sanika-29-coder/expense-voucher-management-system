import { useState, useEffect } from "react";

function App() {
  const path = window.location.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed");
        return;
      }

      console.log("LOGIN RESPONSE:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      alert("Login successful!");

      if (data.user.role === "EMPLOYEE") {
        window.location.href = "/employee-dashboard";
      } else if (data.user.role === "DIRECTOR") {
        window.location.href = "/director-dashboard";
      } else if (data.user.role === "ACCOUNTS") {
        window.location.href = "/accounts-dashboard";
      }

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  // EMPLOYEE DASHBOARD
  if (path === "/employee-dashboard") {
    const [dashboard, setDashboard] = useState(null);

    const token = localStorage.getItem("token");

    const loadDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/vouchers/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load dashboard");
          return;
        }

        setDashboard(data.dashboard);

      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    if (!dashboard) {
      loadDashboard();

      return (
        <div style={{ padding: "40px" }}>
          <h1>Employee Dashboard</h1>
          <p>Loading dashboard...</p>
        </div>
      );
    }

    return (
      <div style={{ padding: "40px" }}>

        <h1>Employee Dashboard</h1>
        <p>Welcome to the Expense Voucher System</p>

        <button
          onClick={() => {
            window.location.href = "/create-voucher";
          }}
        >
          Create Voucher
        </button>

        <button
          onClick={() => {
            window.location.href = "/my-vouchers";
          }}
          style={{ marginLeft: "10px" }}
        >
          My Vouchers
        </button>

        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            marginTop: "20px"
          }}
        >

          <div>
            <h3>Total Vouchers</h3>
            <p>{dashboard.total_vouchers}</p>
          </div>

          <div>
            <h3>Draft</h3>
            <p>{dashboard.draft}</p>
          </div>

          <div>
            <h3>Pending Approval</h3>
            <p>{dashboard.pending_approval}</p>
          </div>

          <div>
            <h3>Approved</h3>
            <p>{dashboard.approved}</p>
          </div>

          <div>
            <h3>Rejected</h3>
            <p>{dashboard.rejected}</p>
          </div>

          <div>
            <h3>Total Amount Claimed</h3>
            <p>₹{dashboard.total_amount_claimed}</p>
          </div>

        </div>

        <br />

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>
    );
  }

  // CREATE VOUCHER PAGE
  // CREATE VOUCHER PAGE
  if (path === "/create-voucher") {
    const [voucherDate, setVoucherDate] = useState("");
    const [expenseDate, setExpenseDate] = useState("");
    const [department, setDepartment] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const handleCreateVoucher = async (e) => {
      e.preventDefault();

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/vouchers",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              voucher_date: voucherDate,
              expense_date: expenseDate,
              department_name: department,
              expense_title: title,
              expense_category: category,
              expense_description: description,
              amount: amount
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to create voucher");
          return;
        }

        alert("Voucher created successfully!");

        window.location.href = "/employee-dashboard";

      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    return (
      <div style={{ padding: "40px", maxWidth: "700px", margin: "auto" }}>

        <h1>Create Voucher</h1>

        <form onSubmit={handleCreateVoucher}>

          <label>Voucher Date</label>
          <input
            type="date"
            value={voucherDate}
            onChange={(e) => setVoucherDate(e.target.value)}
            required
          />

          <br /><br />

          <label>Expense Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />

          <br /><br />

          <label>Department</label>
          <input
            type="text"
            placeholder="Enter department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <br /><br />

          <label>Expense Title</label>
          <input
            type="text"
            placeholder="Enter expense title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <br /><br />

          <label>Expense Category</label>
          <input
            type="text"
            placeholder="Enter category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <br /><br />

          <label>Description</label>
          <textarea
            placeholder="Enter expense description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />

          <br /><br />

          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <br /><br />

          <button type="submit">
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/employee-dashboard";
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>

        </form>

      </div>
    );
  }

  // MY VOUCHERS PAGE
  if (path === "/my-vouchers") {
    const [vouchers, setVouchers] = useState(null);

    const token = localStorage.getItem("token");

    const loadVouchers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/vouchers/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load vouchers");
          return;
        }

        setVouchers(data.vouchers);

      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    if (!vouchers) {
      loadVouchers();

      return (
        <div style={{ padding: "40px" }}>
          <h1>My Vouchers</h1>
          <p>Loading vouchers...</p>
        </div>
      );
    }

    return (
      <div style={{ padding: "40px" }}>

        <h1>My Vouchers</h1>

        <button
          onClick={() => {
            window.location.href = "/employee-dashboard";
          }}
        >
          Back to Dashboard
        </button>

        <br />
        <br />

        {vouchers.length === 0 ? (
          <p>No vouchers found.</p>
        ) : (
          <table border="1" cellPadding="10" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Voucher Number</th>
                <th>Expense Title</th>
                <th>Department</th>
                <th>Amount</th>
                <th>Expense Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id}>
                  <td>{voucher.voucher_number}</td>
                  <td>{voucher.expense_title}</td>
                  <td>{voucher.department_name}</td>
                  <td>₹{voucher.amount}</td>
                  <td>{voucher.expense_date}</td>
                  <td>{voucher.status}</td>

                  <td>
                    <button
                      onClick={() => {
                        window.location.href = `/voucher-details/${voucher.id}`;
                      }}
                    >
                      View
                    </button>

                    {voucher.status === "DRAFT" && (
                      <>
                        <button
                          onClick={() => {
                            window.location.href = `/edit-voucher/${voucher.id}`;
                          }}
                          style={{ marginLeft: "10px" }}
                        >
                          Edit
                        </button>

                        <button
                          onClick={async () => {
                            const confirmDelete = window.confirm(
                              "Are you sure you want to delete this draft voucher?"
                            );

                            if (!confirmDelete) {
                              return;
                            }

                            try {
                              const response = await fetch(
                                `http://localhost:5000/api/vouchers/${voucher.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    Authorization: `Bearer ${token}`
                                  }
                                }
                              );

                              const data = await response.json();

                              if (!response.ok) {
                                alert(data.message || "Failed to delete voucher");
                                return;
                              }

                              alert("Voucher deleted successfully");

                              loadVouchers();

                            } catch (error) {
                              console.error(error);
                              alert("Unable to connect to server");
                            }
                          }}
                          style={{ marginLeft: "10px" }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    );
  }

  // EDIT VOUCHER PAGE
  if (path.startsWith("/edit-voucher/")) {
    const voucherId = path.split("/")[2];

    const [voucher, setVoucher] = useState(null);
    const [expenseDate, setExpenseDate] = useState("");
    const [department, setDepartment] = useState("");
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
      fetch(`http://localhost:5000/api/vouchers/${voucherId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.voucher) {
            setVoucher(data.voucher);

            setExpenseDate(
              data.voucher.expense_date
                ? data.voucher.expense_date.substring(0, 10)
                : ""
            );

            setDepartment(data.voucher.department_name || "");
            setTitle(data.voucher.expense_title || "");
            setCategory(data.voucher.expense_category || "");
            setDescription(data.voucher.expense_description || "");
            setAmount(data.voucher.amount || "");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, [voucherId, token]);

    const handleUpdateVoucher = async (e) => {
      e.preventDefault();

      const response = await fetch(
        `http://localhost:5000/api/vouchers/${voucherId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            voucher_date: voucher.voucher_date,
            expense_date: expenseDate,
            department_name: department,
            expense_title: title,
            expense_category: category,
            expense_description: description,
            amount: amount
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Voucher updated successfully");
        window.location.href = "/my-vouchers";
      } else {
        alert(data.message);
      }
    };

    if (!voucher) {
      return <p style={{ padding: "40px" }}>Loading...</p>;
    }

    if (voucher.status !== "DRAFT") {
      return (
        <div style={{ padding: "40px" }}>
          <h2>This voucher cannot be edited.</h2>
          <button onClick={() => window.location.href = "/my-vouchers"}>
            Back to My Vouchers
          </button>
        </div>
      );
    }

    return (
      <div style={{ padding: "40px" }}>
        <h1>Edit Voucher</h1>

        <form onSubmit={handleUpdateVoucher}>

          <label>Voucher Number</label>
          <input
            type="text"
            value={voucher.voucher_number}
            disabled
          />

          <br /><br />

          <label>Voucher Date</label>
          <input
            type="date"
            value={
              voucher.voucher_date
                ? voucher.voucher_date.substring(0, 10)
                : ""
            }
            disabled
          />

          <br /><br />

          <label>Expense Date</label>
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
            required
          />

          <br /><br />

          <label>Department</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />

          <br /><br />

          <label>Expense Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <br /><br />

          <label>Expense Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <br /><br />

          <label>Expense Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <br /><br />

          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <br /><br />

          <button type="submit">
            Update Voucher
          </button>

          <button
            type="button"
            onClick={() => window.location.href = "/my-vouchers"}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>

        </form>
      </div>
    );
  }
  // VOUCHER DETAILS PAGE
  // VOUCHER DETAILS PAGE
if (path.startsWith("/voucher-details/")) {
  const voucherId = path.split("/")[2];

  const [voucher, setVoucher] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadVoucher = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/vouchers/${voucherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();

        console.log("VOUCHER DETAILS RESPONSE:", data);

        if (!response.ok) {
          alert(data.message || "Failed to load voucher");
          return;
        }

        setVoucher(data.voucher);

      } catch (error) {
        console.error("LOAD VOUCHER ERROR:", error);
        alert("Unable to connect to server");
      }
    };

    loadVoucher();
  }, [voucherId, token]);


  // DATE FORMAT FUNCTION
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };


  // LOADING
  if (!voucher) {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Voucher Details</h1>
        <p>Loading voucher...</p>
      </div>
    );
  }



  // REFRESH VOUCHER AFTER SIGNATURE/SUBMIT
  const loadVoucherAgain = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/vouchers/${voucherId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setVoucher(data.voucher);
      } else {
        alert(data.message || "Failed to reload voucher");
      }

    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };


  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "auto"
      }}
    >

      <h1>Voucher Details</h1>

      <p>
        <strong>Voucher Number:</strong>{" "}
        {voucher.voucher_number || "-"}
      </p>

      <p>
        <strong>Voucher Date:</strong>{" "}
        {formatDate(voucher.voucher_date)}
      </p>

      <p>
        <strong>Expense Date:</strong>{" "}
        {formatDate(voucher.expense_date)}
      </p>

      <p>
        <strong>Department:</strong>{" "}
        {voucher.department_name || "-"}
      </p>

      <p>
        <strong>Expense Title:</strong>{" "}
        {voucher.expense_title || "-"}
      </p>

      <p>
        <strong>Category:</strong>{" "}
        {voucher.expense_category || "-"}
      </p>

      <p>
        <strong>Description:</strong>{" "}
        {voucher.expense_description || "-"}
      </p>

      <p>
        <strong>Amount:</strong>{" "}
        ₹{voucher.amount || "0"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {voucher.status || "-"}
      </p>

      <p>
        <strong>Employee Name:</strong>{" "}
        {voucher.employee_name || "-"}
      </p>


      {/* EMPLOYEE SIGNATURE + SUBMIT */}

      {voucher.status === "DRAFT" && (
        <div style={{ marginTop: "20px" }}>

          <h3>Employee Signature</h3>

          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {

              const file = e.target.files[0];

              if (!file) return;

              const formData = new FormData();

              formData.append("signature", file);

              try {

                const response = await fetch(
                  `http://localhost:5000/api/vouchers/${voucherId}/signature`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`
                    },
                    body: formData
                  }
                );

                const data = await response.json();

                if (!response.ok) {
                  alert(
                    data.message ||
                    "Signature upload failed"
                  );
                  return;
                }

                alert(
                  "Employee signature uploaded successfully"
                );

                loadVoucherAgain();

              } catch (error) {

                console.error(error);

                alert(
                  "Unable to connect to server"
                );
              }
            }}
          />

          <br />
          <br />

          <button
            onClick={async () => {

              try {

                const response = await fetch(
                  `http://localhost:5000/api/vouchers/${voucherId}/submit`,
                  {
                    method: "PUT",
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                );

                const data = await response.json();

                if (!response.ok) {

                  alert(
                    data.message ||
                    "Failed to submit voucher"
                  );

                  return;
                }

                alert(
                  "Voucher submitted successfully"
                );

                loadVoucherAgain();

              } catch (error) {

                console.error(error);

                alert(
                  "Unable to connect to server"
                );
              }
            }}
          >
            Submit Voucher
          </button>

        </div>
      )}


      {/* REJECTION REASON */}

      {voucher.rejection_reason && (
        <p>
          <strong>Rejection Reason:</strong>{" "}
          {voucher.rejection_reason}
        </p>
      )}


      <br />

      <button
        onClick={() => {
          window.location.href = "/my-vouchers";
        }}
      >
        Back to My Vouchers
      </button>

    </div>
  );
}
  // DIRECTOR DASHBOARD
  if (path === "/director-dashboard") {
  const [dashboard, setDashboard] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/director/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load dashboard");
          return;
        }

        setDashboard(data);
      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    loadDashboard();
  }, []);

  if (!dashboard) {
    return <h2 style={{ padding: "40px" }}>Loading dashboard...</h2>;
  }

  const summary = dashboard.summary;
  const recentActivity = dashboard.recent_activity || [];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Director Dashboard</h1>

      <p>Welcome to the Expense Voucher System</p>

      {/* Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Pending Approvals</h3>
          <h2>{summary.pending_approval_count}</h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Approved Today</h3>
          <h2>{summary.approved_today}</h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Rejected Today</h3>
          <h2>{summary.rejected_today}</h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Total Pending Amount</h3>
          <h2>₹{summary.total_pending_amount}</h2>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => {
            window.location.href = "/director-pending";
          }}
          style={{ marginRight: "10px" }}
        >
          Pending Approvals
        </button>

        <button
          onClick={() => {
            window.location.href = "/director-vouchers";
          }}
          style={{ marginRight: "10px" }}
        >
          All Vouchers
        </button>

        <button onClick={logout}>Logout</button>
      </div>

      {/* Recent Activity */}
      <h2 style={{ marginTop: "40px" }}>Recent Activity</h2>

      {recentActivity.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginTop: "15px",
          }}
        >
          <thead>
            <tr>
              <th>Voucher Number</th>
              <th>Employee</th>
              <th>Expense Title</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {recentActivity.map((voucher) => (
              <tr key={voucher.id}>
                <td>{voucher.voucher_number}</td>
                <td>{voucher.employee_name}</td>
                <td>{voucher.expense_title}</td>
                <td>₹{voucher.amount}</td>
                <td>{voucher.status}</td>
                <td>
                  {voucher.updated_at
                    ? new Date(voucher.updated_at).toLocaleDateString("en-IN")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

if (path === "/director-pending") {
  const [vouchers, setVouchers] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadPendingVouchers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/director/vouchers/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load pending vouchers");
          return;
        }

        setVouchers(data.vouchers);
      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    loadPendingVouchers();
  }, []);

  if (!vouchers) {
    return <h2 style={{ padding: "40px" }}>Loading pending approvals...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Pending Approvals</h1>

      <button
        onClick={() => {
          window.location.href = "/director-dashboard";
        }}
        style={{ marginBottom: "20px" }}
      >
        Back to Dashboard
      </button>

      {vouchers.length === 0 ? (
        <p>No vouchers are currently pending approval.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Voucher Number</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Expense Title</th>
              <th>Amount</th>
              <th>Expense Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td>{voucher.voucher_number}</td>

                <td>{voucher.employee_name}</td>

                <td>{voucher.department_name}</td>

                <td>{voucher.expense_title}</td>

                <td>₹{voucher.amount}</td>

                <td>
                  {voucher.expense_date
                    ? new Date(voucher.expense_date).toLocaleDateString(
                        "en-IN"
                      )
                    : "-"}
                </td>

                <td>{voucher.status}</td>

                <td>
                  <button
                    onClick={() => {
                      window.location.href =
                        `/director-voucher-details/${voucher.id}`;
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

if (path === "/director-vouchers") {
  const [vouchers, setVouchers] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/director/vouchers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load vouchers");
          return;
        }

        setVouchers(data.vouchers);
      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    loadVouchers();
  }, []);

  if (!vouchers) {
    return <h2 style={{ padding: "40px" }}>Loading vouchers...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>All Vouchers</h1>

      <button
        onClick={() => {
          window.location.href = "/director-dashboard";
        }}
        style={{ marginBottom: "20px" }}
      >
        Back to Dashboard
      </button>

      {vouchers.length === 0 ? (
        <p>No vouchers found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{
            borderCollapse: "collapse",
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Voucher Number</th>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Category</th>
              <th>Expense Title</th>
              <th>Amount</th>
              <th>Expense Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td>{voucher.voucher_number}</td>
                <td>{voucher.employee_name}</td>
                <td>{voucher.department_name}</td>
                <td>{voucher.expense_category || "-"}</td>
                <td>{voucher.expense_title}</td>
                <td>₹{voucher.amount}</td>

                <td>
                  {voucher.expense_date
                    ? new Date(voucher.expense_date).toLocaleDateString(
                        "en-IN"
                      )
                    : "-"}
                </td>

                <td>{voucher.status}</td>

                <td>
                  <button
                    onClick={() => {
                      window.location.href =
                        `/director-voucher-details/${voucher.id}`;
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
if (path.startsWith("/director-voucher-details/")) {
  const voucherId = path.split("/")[2];

  const [voucher, setVoucher] = useState(null);
  const [signature, setSignature] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadVoucher = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/director/vouchers/${voucherId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.message || "Failed to load voucher");
          return;
        }

        setVoucher(data.voucher);
      } catch (error) {
        console.error(error);
        alert("Unable to connect to server");
      }
    };

    loadVoucher();
  }, [voucherId]);

  if (!voucher) {
    return <h2 style={{ padding: "40px" }}>Loading voucher...</h2>;
  }

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const approveVoucher = async () => {
    if (!signature) {
      alert("Please upload Director signature before approval.");
      return;
    }

    const formData = new FormData();
    formData.append("signature", signature);

    try {
      const response = await fetch(
        `http://localhost:5000/api/director/vouchers/${voucherId}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to approve voucher");
        return;
      }

      alert("Voucher approved successfully!");

      window.location.href = "/director-pending";
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  const rejectVoucher = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter rejection reason.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/director/vouchers/${voucherId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rejection_reason: rejectionReason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to reject voucher");
        return;
      }

      alert("Voucher rejected successfully!");

      window.location.href = "/director-pending";
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Voucher Details</h1>

      <button
        onClick={() => {
          window.location.href = "/director-pending";
        }}
        style={{ marginBottom: "20px" }}
      >
        Back to Pending Approvals
      </button>

      {/* Basic Voucher Information */}
      <h2>Voucher Information</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <tbody>
          <tr>
            <th>Voucher Number</th>
            <td>{voucher.voucher_number}</td>
          </tr>

          <tr>
            <th>Voucher Date</th>
            <td>{formatDate(voucher.voucher_date)}</td>
          </tr>

          <tr>
            <th>Expense Date</th>
            <td>{formatDate(voucher.expense_date)}</td>
          </tr>

          <tr>
            <th>Department</th>
            <td>{voucher.department_name}</td>
          </tr>

          <tr>
            <th>Expense Title</th>
            <td>{voucher.expense_title}</td>
          </tr>

          <tr>
            <th>Category</th>
            <td>{voucher.expense_category || "-"}</td>
          </tr>

          <tr>
            <th>Description</th>
            <td>{voucher.expense_description || "-"}</td>
          </tr>

          <tr>
            <th>Amount</th>
            <td>₹{voucher.amount}</td>
          </tr>

          <tr>
            <th>Status</th>
            <td>{voucher.status}</td>
          </tr>
        </tbody>
      </table>

      {/* Employee Information */}
      <h2 style={{ marginTop: "30px" }}>Employee Information</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <tbody>
          <tr>
            <th>Employee Name</th>
            <td>{voucher.employee_name}</td>
          </tr>

          <tr>
            <th>Employee Email</th>
            <td>{voucher.employee_email}</td>
          </tr>

          <tr>
            <th>Employee Signature</th>
            <td>
              {voucher.employee_signature ? (
                <img
                  src={`http://localhost:5000/${voucher.employee_signature}`}
                  alt="Employee Signature"
                  style={{
                    maxWidth: "250px",
                    maxHeight: "100px",
                  }}
                />
              ) : (
                "Not uploaded"
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Approval Information */}
      <h2 style={{ marginTop: "30px" }}>Approval Information</h2>

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <tbody>
          <tr>
            <th>Approval Date</th>
            <td>{formatDate(voucher.approval_date)}</td>
          </tr>

          <tr>
            <th>Director Signature</th>
            <td>
              {voucher.director_signature ? (
                <img
                  src={`http://localhost:5000/${voucher.director_signature}`}
                  alt="Director Signature"
                  style={{
                    maxWidth: "250px",
                    maxHeight: "100px",
                  }}
                />
              ) : (
                "Not uploaded"
              )}
            </td>
          </tr>

          <tr>
            <th>Rejection Reason</th>
            <td>{voucher.rejection_reason || "-"}</td>
          </tr>
        </tbody>
      </table>

      {/* Director Actions */}
      {voucher.status === "PENDING_APPROVAL" && (
        <div style={{ marginTop: "30px" }}>
          <h2>Director Action</h2>

          <div style={{ marginBottom: "20px" }}>
            <label>
              <strong>Director Signature:</strong>
            </label>

            <br />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setSignature(e.target.files[0]);
              }}
            />
          </div>

          <button
            onClick={approveVoucher}
            style={{ marginRight: "15px" }}
          >
            Approve Voucher
          </button>

          <div style={{ marginTop: "25px" }}>
            <label>
              <strong>Rejection Reason:</strong>
            </label>

            <br />

            <textarea
              rows="4"
              cols="60"
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
              }}
              placeholder="Enter reason for rejection"
            />

            <br />

            <button
              onClick={rejectVoucher}
              style={{ marginTop: "10px" }}
            >
              Reject Voucher
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

  // ACCOUNTS DASHBOARD
  if (path === "/accounts-dashboard") {
    return (
      <div style={{ padding: "40px" }}>
        <h1>Accounts Dashboard</h1>
        <p>Welcome to the Expense Voucher System</p>
      </div>
    );
  }

  // LOGIN PAGE
  return (
    <div className="login-page">
      <div className="login-card">

        <h1>Expense Voucher System</h1>
        <p className="subtitle">ABC Company</p>

        <form onSubmit={handleLogin}>

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            LOGIN
          </button>

        </form>

      </div>
    </div>
  );
}

export default App;