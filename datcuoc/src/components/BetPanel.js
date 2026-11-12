import { LEVELS, MULTIPLIERS, MAX_BET, MIN_BET, BET_STEP, formatScore, formatMultiplier } from "../data";
import { validateBet } from "../utils";

const BetPanel = ({ index, total, question, score, betInput, onBetChange, onBet }) => {
  const { topic, level } = question;
  const error = validateBet(Number(betInput), score);

  return (
    <div>
      <p>{`Câu ${index + 1}/${total} · ${topic} · ${LEVELS[level]} (${formatMultiplier(MULTIPLIERS[level])})`}</p>
      <p>{`Điểm hiện có: ${formatScore(score)}`}</p>
      <div>
        <label htmlFor="bet">Mức cược</label>{" "}
        <input
          id="bet"
          type="number"
          min={MIN_BET}
          max={MAX_BET}
          step={BET_STEP}
          value={betInput}
          onChange={(e) => onBetChange(e.target.value)}
        />{" "}
        <button disabled={Boolean(error)} onClick={onBet}>Đặt cược</button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default BetPanel;