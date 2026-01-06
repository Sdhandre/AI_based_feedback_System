import { useEffect, useState } from "react";

function App() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchReviews() {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/reviews");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchReviews();

    // refresh every 10 seconds
    const interval = setInterval(fetchReviews, 10000);
    return () => clearInterval(interval);
  }, []);

  const total = reviews.length;
  const counts = [1, 2, 3, 4, 5].map(
    n => reviews.filter(r => r.rating === n).length
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
      fontFamily: "Inter, system-ui, sans-serif",
      boxSizing: "border-box",  // ADD THIS
      width: "100vw"  // ADD THIS
    }}>
      
      <div style={{
        width: "100%",  // CHANGED from maxWidth: 1400
        maxWidth: "1400px",  // ADD THIS
        margin: "0 auto",
        color: "#fff",
        boxSizing: "border-box"  // ADD THIS
      }}>
        
        <h2 style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 10
        }}>
          📊 Admin Dashboard
        </h2>

        {/* Stats Cards */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 30,
          flexWrap: "wrap"
        }}>
          <div style={{
            background: "rgba(255, 255, 255, 0.95)",
            padding: "20px 24px",
            borderRadius: 16,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            minWidth: 140,
            backdropFilter: "blur(10px)"
          }}>
            <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>
              TOTAL REVIEWS
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#667eea" }}>
              {total}
            </div>
          </div>

          {counts.map((c, i) => (
            <div key={i} style={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "20px 24px",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
              minWidth: 120,
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 600, marginBottom: 4 }}>
                {"⭐".repeat(i + 1)}
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#374151" }}>
                {c}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: "#ffffff",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflowX: "auto",
          boxSizing: "border-box"  // ADD THIS
        }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
              ⏳ Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>
              📭 No reviews yet
            </div>
          ) : (
            <table width="100%" cellPadding="14" cellSpacing="0" style={{
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#fff"
                }}>
                  <th align="left" style={{
                    padding: 16,
                    borderRadius: "12px 0 0 0",
                    fontWeight: 600,
                    fontSize: 14
                  }}>Rating</th>
                  <th align="left" style={{
                    padding: 16,
                    fontWeight: 600,
                    fontSize: 14
                  }}>Review</th>
                  <th align="left" style={{
                    padding: 16,
                    fontWeight: 600,
                    fontSize: 14
                  }}>Summary</th>
                  <th align="left" style={{
                    padding: 16,
                    fontWeight: 600,
                    fontSize: 14
                  }}>Recommendation</th>
                  <th align="left" style={{
                    padding: 16,
                    borderRadius: "0 12px 0 0",
                    fontWeight: 600,
                    fontSize: 14
                  }}>Time</th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((r, idx) => (
                  <tr key={r._id} style={{
                    background: idx % 2 === 0 ? "#f9fafb" : "#fff",
                    borderBottom: "1px solid #e5e7eb",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f0f9ff"}
                  onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? "#f9fafb" : "#fff"}
                  >
                    <td style={{
                      padding: 16,
                      fontSize: 18,
                      color: "#374151"
                    }}>
                      {"⭐".repeat(r.rating)}
                    </td>
                    <td style={{
                      padding: 16,
                      color: "#374151",
                      maxWidth: 250,
                      fontSize: 14
                    }}>{r.review}</td>
                    <td style={{
                      padding: 16,
                      color: "#6b7280",
                      fontSize: 14,
                      maxWidth: 200
                    }}>{r.aiSummary}</td>
                    <td style={{
                      padding: 16,
                      color: "#6b7280",
                      fontSize: 14,
                      maxWidth: 200
                    }}>{r.aiRecommendation}</td>
                    <td style={{
                      padding: 16,
                      color: "#9ca3af",
                      fontSize: 13,
                      whiteSpace: "nowrap"
                    }}>{new Date(r.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
