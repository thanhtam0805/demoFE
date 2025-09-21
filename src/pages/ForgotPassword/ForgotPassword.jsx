import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../../services/UserService";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập mã + mật khẩu mới
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await forgotPassword(email);
      if (res.status === "OK") {
        setStep(2);
        setMessage("Mã xác nhận đã gửi về email, vui lòng kiểm tra hộp thư.");
      } else {
        setMessage(res.message);
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await resetPassword(email, code, newPassword);
      setMessage(res.message);
      if (res.status === "OK") {
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 2000);
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: 380,
      margin: "70px auto",
      padding: "28px 24px 22px 24px",
      boxShadow: "0 2px 16px #eee",
      borderRadius: 14,
      background: "#fff"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Quên mật khẩu</h2>
      {step === 1 ? (
        <form onSubmit={handleSendCode}>
          <label>Email đăng ký:</label>
          <input
            type="email"
            value={email}
            required
            autoFocus
            onChange={e => setEmail(e.target.value)}
            style={{ width: "100%", margin: "10px 0 18px", padding: 10, fontSize: 16 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px", fontSize: 16,
              background: "#007bff", color: "#fff", border: "none", borderRadius: 5
            }}
          >
            {loading ? "Đang gửi mã..." : "Gửi mã xác nhận"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              disabled
              style={{ width: "100%", margin: "7px 0 12px", padding: 10, background: "#f6f6f6", fontSize: 16 }}
            />
          </div>
          <div>
            <label>Mã xác nhận:</label>
            <input
              type="text"
              value={code}
              required
              onChange={e => setCode(e.target.value)}
              style={{ width: "100%", margin: "7px 0 12px", padding: 10, fontSize: 16 }}
              placeholder="Nhập mã đã gửi về email"
            />
          </div>
          <div>
            <label>Mật khẩu mới:</label>
            <input
              type="password"
              value={newPassword}
              required
              onChange={e => setNewPassword(e.target.value)}
              style={{ width: "100%", margin: "7px 0 18px", padding: 10, fontSize: 16 }}
              placeholder="Nhập mật khẩu mới"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "10px", fontSize: 16,
              background: "#28a745", color: "#fff", border: "none", borderRadius: 5
            }}
          >
            {loading ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>
        </form>
      )}
      {message && (
        <div style={{
          color: message.includes("thành công") ? "green" : "red",
          marginTop: 18, textAlign: "center", fontWeight: 500
        }}>
          {message}
        </div>
      )}
      {step === 2 &&
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => { setStep(1); setMessage(""); setCode(""); setNewPassword(""); }}
            style={{ border: "none", background: "none", color: "#007bff", cursor: "pointer", fontSize: 15 }}
          >
            Nhập lại email khác
          </button>
        </div>
      }
    </div>
  );
};

export default ForgotPassword;
