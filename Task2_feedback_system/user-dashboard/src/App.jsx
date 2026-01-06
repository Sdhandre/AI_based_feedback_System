import { useState } from "react";

function App() {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitReview(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!review.trim()) {
      setError("Review cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/reviews",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, review })
        }
      );

      const data = await res.json();

      if (!data.success) {
        setError("Something went wrong.");
      } else {
        setMessage(data.aiUserMessage);
        setReview("");
      }

    } catch (err) {
      setError("Server unavailable");
    }

    setLoading(false);
  }

  return (
<div style={{
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  padding: "40px 20px",
  fontFamily: "Inter, system-ui, sans-serif",
  boxSizing: "border-box",  // Add this
  width: "100vw"  // Add this
}}>

  <div style={{
    width: "100%",
    maxWidth: "1200px",
    background: "#fff",
    borderRadius: 20,
    padding: 32,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    boxSizing: "border-box"  // Add this
  }}>

        <h2 style={{ 
          marginTop: 0, 
          display: "flex", 
          alignItems: "center", 
          gap: 10,
          fontSize: 28,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700
        }}>
          <span style={{ fontSize: 32 }}>⭐</span> Leave a Review
        </h2>

        <form onSubmit={submitReview}>
          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>Rating</label><br />
          <select
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            style={{
              marginTop: 8,
              padding: "12px 14px",
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              width: "100%",
              fontSize: 15,
              transition: "all 0.2s",
              outline: "none",
              cursor: "pointer",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{"⭐".repeat(n)} ({n})</option>
            ))}
          </select>

          <br /><br />

          <label style={{ fontWeight: 600, color: "#374151", fontSize: 14 }}>Review</label>
          <textarea
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Share your experience..."
            rows={5}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 12,
              borderRadius: 12,
              border: "2px solid #e5e7eb",
              background: "#fff",
              color: "#1f2937",
              fontSize: 15,
              transition: "all 0.2s",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
              boxSizing: "border-box"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />

          <br /><br />

          <button
            disabled={loading}
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              border: "none",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 15,
              transition: "all 0.3s",
              boxShadow: loading ? "none" : "0 4px 15px rgba(102, 126, 234, 0.4)",
              transform: loading ? "scale(1)" : "scale(1)"
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)", e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)")}
            onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)", e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)")}
          >
            {loading ? "✨ Submitting..." : "Submit Review"}
          </button>
        </form>

        {error && (
          <div style={{ 
            marginTop: 16,
            padding: 12,
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: 10,
            color: "#dc2626",
            fontSize: 14
          }}>
            ⚠️ {error}
          </div>
        )}

        {message && (
          <div style={{
            marginTop: 20,
            background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
            border: "2px solid #bae6fd",
            borderRadius: 12,
            padding: 16
          }}>
            <strong style={{ color: "#0369a1", fontSize: 15 }}>🤖 AI Response:</strong>
            <p style={{ marginTop: 8, marginBottom: 0, color: "#374151", lineHeight: 1.6 }}>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
