import { useNavigate } from "react-router-dom";
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  TIME_PER_QUESTION,
  formatScore,
} from "../data";

const Home = ({ playerName, onNameChange, history }) => {
  const navigate = useNavigate();
  const disabled = playerName.trim() === "";

  const best = history.reduce(
    (top, item) => (!top || item.finalScore > top.finalScore ? item : top),
    null
  );

  return (
    <div>
      <h1>Đặt cược kiến thức</h1>
      <ul>
        <li>{`Bạn bắt đầu với ${formatScore(START_SCORE)} và trả lời 12 câu hỏi.`}</li>
        <li>{`Trước mỗi câu, đặt cược từ ${formatScore(MIN_BET)} đến ${formatScore(MAX_BET)} khi mới biết chủ đề và mức độ.`}</li>
        <li>{`Mỗi câu có ${TIME_PER_QUESTION} giây để trả lời.`}</li>
        <li>Đúng được thưởng mức cược nhân hệ số; sai hoặc hết giờ mất đúng mức cược.</li>
        <li>{`Còn dưới ${formatScore(MIN_BET)} là cháy túi và lượt chơi kết thúc.`}</li>
      </ul>

      {best && <p>{`Kỷ lục: ${formatScore(best.finalScore)} – ${best.name}`}</p>}

      <div>
        <label htmlFor="player-name">Tên người chơi</label>{" "}
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={(e) => onNameChange(e.target.value)}
        />{" "}
        <button disabled={disabled} onClick={() => navigate("/play")}>
          Vào chơi
        </button>
      </div>
    </div>
  );
};

export default Home;