import React, { useState } from "react";
import { sendMessageToAI } from "../../services/ChatService";

const SUGGESTIONS = [
  "Tìm iPhone 15",
  "Tư vấn laptop gaming",
  "Sản phẩm khuyến mãi",
  "Tìm màn hình máy tính",
];

function renderProductList(products = []) {
  return (
    <div style={{ marginTop: 8 }}>
      {products.map((p, idx) => (
        <div
          key={p.id || idx}
          style={{
            border: "1px solid #e3f2fd",
            background: "#fafdff",
            borderRadius: 8,
            padding: 10,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 2px 6px #e3f2fd66"
          }}
        >
          {p.image && (
            <img src={p.image} alt={p.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
          )}
          <div style={{ flex: 1 }}>
            <a
              href={p.url}
              style={{ color: "#1976d2", fontWeight: 600, fontSize: 15, textDecoration: "underline" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.name}
            </a>
            <div style={{ color: "#444", fontSize: 13 }}>{p.desc}</div>
            <div style={{ color: "#ef6c00", fontWeight: 600, fontSize: 14 }}>
              {p.price?.toLocaleString()}₫
            </div>
            {p.discount > 0 && (
              <div style={{ color: "#d50000", fontSize: 13, fontWeight: 500 }}>
                Giảm {p.discount}%
              </div>
            )}
            {p.rating && (
              <div style={{ color: "#fbc02d", fontSize: 13, fontWeight: 500 }}>
                ⭐ {p.rating}/5
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const ChatBox = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (msg) => {
    const text = msg || input;
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const { reply, products } = await sendMessageToAI(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
          products: products || [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Có lỗi xảy ra, thử lại sau!", products: [] },
      ]);
    }
    setLoading(false);
  };

  const handleToggle = () => setOpen((prev) => !prev);

  const handleReset = () => setMessages([]);

  return (
    <>
      {!open && (
        <div
          onClick={handleToggle}
          style={{
            position: "fixed",
            bottom: 28,
            right: 28,
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "#1976d2",
            boxShadow: "0 2px 8px #aaa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 2000,
            transition: "all 0.2s",
          }}
          title="Nhắn tin với shop"
        >
          <svg width={32} height={32} viewBox="0 0 24 24" fill="white">
            <path d="M12 3C6.48 3 2 6.58 2 11c0 1.87.77 3.59 2.07 4.95L2 21l5.26-1.62C8.92 19.76 10.41 20 12 20c5.52 0 10-3.58 10-9s-4.48-8-10-8zm0 15c-1.4 0-2.74-.22-3.98-.62l-.28-.09-.32.1-2.18.67.67-2.01.1-.3-.22-.23C4.16 13.12 3.5 12.09 3.5 11c0-3.59 4.14-7 8.5-7s8.5 3.41 8.5 7-4.14 7-8.5 7z"/>
          </svg>
        </div>
      )}

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 350,
            background: "#fff",
            border: "1.5px solid #1976d2",
            borderRadius: 20,
            boxShadow: "0 4px 24px #0002",
            zIndex: 2000,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            animation: "fadeIn .2s",
          }}
        >
          <div
            style={{
              background: "#1976d2",
              color: "#fff",
              padding: "14px 20px",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            Hỗ trợ AI
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  cursor: "pointer",
                  fontWeight: "normal",
                  fontSize: 16,
                  padding: "2px 10px",
                  background: "#fff",
                  color: "#1976d2",
                  borderRadius: 8,
                  border: "1px solid #fff",
                  transition: "background 0.15s"
                }}
                title="Làm mới chat"
                onClick={handleReset}
              >
                ⟳ Reset
              </span>
              <span
                style={{ cursor: "pointer", fontWeight: "normal", fontSize: 24, marginLeft: 8 }}
                onClick={handleToggle}
                title="Đóng"
              >
                ×
              </span>
            </div>
          </div>

          {messages.length === 0 && (
            <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
              <div style={{ marginBottom: 8, color: "#555" }}>Gợi ý cho bạn:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {SUGGESTIONS.map((sg, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: "#e3f2fd",
                      borderRadius: 12,
                      padding: "6px 14px",
                      cursor: "pointer",
                      fontSize: 15,
                      marginBottom: 4,
                      transition: "background 0.2s"
                    }}
                    onClick={() => sendMessage(sg)}
                  >
                    {sg}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              flex: 1,
              maxHeight: 340,
              overflowY: "auto",
              padding: 16,
              background: "#f8f9fa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  margin: "8px 0",
                }}
              >
                {msg.sender === "bot" ? (
                  <div>
                    <span
                      style={{
                        background: "#e3f2fd",
                        color: "#333",
                        borderRadius: 12,
                        padding: "10px 16px",
                        display: "inline-block",
                        fontSize: 15,
                        maxWidth: 250,
                        wordBreak: "break-word"
                      }}
                    >
                      {msg.text}
                    </span>
                    {msg.products && msg.products.length > 0 && renderProductList(msg.products)}
                  </div>
                ) : (
                  <span
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "10px 16px",
                      display: "inline-block",
                      fontSize: 15,
                      maxWidth: 250,
                      wordBreak: "break-word"
                    }}
                  >
                    {msg.text}
                  </span>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ textAlign: "left", fontStyle: "italic", color: "#666" }}>
                AI đang trả lời...
              </div>
            )}
          </div>

          <div
            style={{
              padding: 12,
              borderTop: "1px solid #eee",
              background: "#fff",
              display: "flex",
              gap: 8,
            }}
          >
            <input
              style={{
                flex: 1,
                borderRadius: 10,
                border: "1px solid #bbb",
                padding: 10,
                fontSize: 15,
                outline: "none",
              }}
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
            />
            <button
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0 18px",
                fontWeight: "bold",
                fontSize: 16,
                cursor: "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onClick={() => sendMessage()}
              disabled={loading}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBox;
