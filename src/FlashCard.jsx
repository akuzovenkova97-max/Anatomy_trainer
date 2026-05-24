import { useState } from "react";

/**
 * FlashCard — Anatomy Trainer
 *
 * Expects a muscle object matching muscle_description.json:
 * {
 *   id: string
 *   name: string
 *   group: string
 *   image: string          ← full public path e.g. "/images/soleus.png"
 *   origin: string
 *   insertion: string
 *   function: string[]     ← array of strings
 * }
 */
export default function FlashCard({ muscle, onNext, onPrev, onResume, index, total }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((f) => !f);

  const handleNav = (cb) => (e) => {
    e.stopPropagation();
    setFlipped(false);
    cb?.();
  };

  if (!muscle) return null;

  return (
    <div style={styles.wrapper}>
      <div
        style={styles.scene}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleFlip()}
        aria-label={
          flipped
            ? "Нажмите, чтобы перевернуть обратно"
            : `${muscle.name} — нажмите, чтобы увидеть детали`
        }
      >
        <div style={{ ...styles.card, ...(flipped ? styles.cardFlipped : {}) }}>

          {/* ── Front ── */}
          <div style={styles.face}>
            <div style={styles.imgArea}>
              <img
                src={muscle.image}
                alt={muscle.name}
                style={styles.img}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <div style={styles.frontBody}>
              <div style={styles.nameRow}>
                <span style={styles.muscleName}>{muscle.name}</span>
                <span style={styles.badge}>{muscle.group}</span>
              </div>
              <span style={styles.hint}>↻ нажмите для деталей</span>
            </div>
          </div>

          {/* ── Back ── */}
          <div style={{ ...styles.face, ...styles.backFace }}>
            <div style={styles.backBody}>
              <p style={styles.backTitle}>{muscle.name}</p>

              <Detail label="Начало" value={muscle.origin} />
              <Detail label="Прикрепление" value={muscle.insertion} />

              {/* function is an array */}
              <div style={styles.detail}>
                <div style={styles.detailLabel}>Функция</div>
                {muscle.function.map((f, i) => (
                  <div key={i} style={styles.funcItem}>
                    <span style={styles.bullet}>·</span>
                    <span style={styles.detailVal}>{f}</span>
                  </div>
                ))}
              </div>

              <span style={styles.flipHint}>↻ нажмите, чтобы вернуться</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {(onPrev || onNext) && (
        <div style={styles.navRow}>
          {onPrev && (
            <button style={styles.navBtn} onClick={handleNav(onPrev)}>← назад</button>
          )}
          {index != null && total != null && (
            <span style={styles.counter}>{index + 1} / {total}</span>
          )}
          {onNext && (
            <button style={styles.navBtn} onClick={handleNav(onNext)}>вперёд →</button>
          )}
          {onResume && (
            <button style={{ ...styles.navBtn, ...styles.resumeBtn }} onClick={handleNav(onResume)}>↺ сначала</button>
          )}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div style={styles.detail}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailVal}>{value}</div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.25rem",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    padding: "1.5rem 1rem",
  },
  scene: {
    width: 320,
    height: 460,
    perspective: 900,
    cursor: "pointer",
    outline: "none",
  },
  card: {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardFlipped: { transform: "rotateY(180deg)" },
  face: {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: 16,
    border: "0.5px solid #e2e0db",
    backgroundColor: "#fff",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  backFace: { transform: "rotateY(180deg)" },
  imgArea: {
    width: "100%",
    height: 230,
    background: "#f6f5f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "0.5px solid #e2e0db",
    flexShrink: 0,
    overflow: "hidden",
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  frontBody: {
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1,
  },
  nameRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  muscleName: {
    fontSize: 20,
    fontWeight: 600,
    color: "#1a1a18",
    lineHeight: 1.25,
    flex: 1,
  },
  badge: {
    fontSize: 11,
    padding: "2px 10px",
    borderRadius: 20,
    background: "#f0eeea",
    color: "#5f5e5a",
    border: "0.5px solid #d3d1c7",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  hint: { fontSize: 12, color: "#aaa9a0", marginTop: "auto" },
  backBody: {
    padding: "1.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    boxSizing: "border-box",
    overflowY: "auto",
  },
  backTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#1a1a18",
    margin: "0 0 0.875rem",
    paddingBottom: "0.75rem",
    borderBottom: "0.5px solid #e2e0db",
  },
  detail: { marginBottom: "0.75rem" },
  detailLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: "#888780",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 4,
  },
  detailVal: { fontSize: 12.5, color: "#2c2c2a", lineHeight: 1.55 },
  funcItem: {
    display: "flex",
    gap: 6,
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bullet: { color: "#aaa9a0", flexShrink: 0, lineHeight: 1.55 },
  flipHint: {
    marginTop: "auto",
    paddingTop: 8,
    fontSize: 11,
    color: "#aaa9a0",
    textAlign: "center",
  },
  navRow: { display: "flex", gap: 8, alignItems: "center" },
  navBtn: {
    background: "#fff",
    border: "0.5px solid #b4b2a9",
    borderRadius: 8,
    padding: "8px 20px",
    fontSize: 13,
    color: "#2c2c2a",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  counter: {
    fontSize: 13,
    color: "#888780",
    minWidth: 40,
    textAlign: "center",
  },
  resumeBtn: {
    borderColor: "#a0998f",
    color: "#5a5450",
    background: "#f6f5f0",
  },
};
