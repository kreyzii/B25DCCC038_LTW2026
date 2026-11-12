import { formatScore } from "../data";

const ScoreChart = ({ rounds }) => {
  const max = Math.max(0, ...rounds.map(({ scoreAfter }) => scoreAfter));

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 260 }}>
      {rounds.map(({ id, correct, scoreAfter }, index) => {
        const height = max === 0 ? 0 : Math.round((scoreAfter / max) * 200);
        return (
          <div
            key={id}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              width: 68,
            }}
          >
            <span style={{ fontSize: 12 }}>{formatScore(scoreAfter)}</span>
            <div
              style={{
                width: 36,
                height,
                minHeight: 2,
                background: correct ? "#4caf50" : "#e53935",
              }}
            />
            <span>{index + 1}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ScoreChart;