import { useState } from "react";
import { formatScore } from "../data";

const History = ({ history, onClear }) => {
  const [player, setPlayer] = useState("Tất cả");

  if (history.length === 0) {
    return (
      <div>
        <h2>Lịch sử</h2>
        <p>Chưa có lượt chơi nào</p>
      </div>
    );
  }

  const names = [...new Set(history.map(({ name }) => name))];
  const shown = history.filter(({ name }) => player === "Tất cả" || name === player);
  const sorted = [...shown].sort((a, b) => b.finalScore - a.finalScore);
  const best = shown.reduce((max, { finalScore }) => Math.max(max, finalScore), 0);
  const bankrupt = shown.filter(({ result }) => result === "Cháy túi").length;

  const handleClear = () => {
    onClear();
    setPlayer("Tất cả");
  };

  return (
    <div>
      <h2>Lịch sử</h2>

      <div className="filters">
        <span>
          <label htmlFor="player">Người chơi</label>{" "}
          <select id="player" value={player} onChange={(e) => setPlayer(e.target.value)}>
            {["Tất cả", ...names].map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </span>
        <button onClick={handleClear}>Xóa lịch sử</button>
      </div>

      <p>{`Số lượt chơi: ${shown.length}`}</p>
      <p>{`Điểm cao nhất: ${formatScore(best)}`}</p>
      <p>{`Số lần cháy túi: ${bankrupt}`}</p>

      <table>
        <thead>
          <tr>
            <th>Người chơi</th>
            <th>Số câu đúng</th>
            <th>Điểm cuối</th>
            <th>Đánh giá</th>
            <th>Thời gian</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ id, name, correctCount, played, finalScore, result, playedAt }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{`${correctCount}/${played}`}</td>
              <td>{formatScore(finalScore)}</td>
              <td>{result}</td>
              <td>{playedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;