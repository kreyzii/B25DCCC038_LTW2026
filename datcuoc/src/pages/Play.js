import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import BetPanel from "../components/BetPanel";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import ScoreInfo from "../components/ScoreInfo";
import { START_SCORE, MIN_BET, TIME_PER_QUESTION, formatScore } from "../data";
import { validateBet, calcChange } from "../utils";

const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [status, setStatus] = useState("betting"); // betting -> answering -> revealed
  const [betInput, setBetInput] = useState("100");
  const [bet, setBet] = useState(0);
  const [selected, setSelected] = useState(null);
  const [change, setChange] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [rounds, setRounds] = useState([]);

  const total = questions.length;
  const question = questions[index];

  const handlePlaceBet = () => {
    const value = Number(betInput);
    if (validateBet(value, score)) return;
    setBet(value);
    setTimeLeft(TIME_PER_QUESTION);
    setStatus("answering");
  };

  // choice = vị trí đáp án đã chọn, -1 nếu hết giờ
  const finishQuestion = (choice) => {
    const correct = choice === question.answer;
    const delta = calcChange(bet, question.level, correct);
    const scoreAfter = score + delta;
    setChange(delta);
    setScore(scoreAfter);
    setSelected(choice);
    setRounds([
      ...rounds,
      { id: question.id, bet, correct, change: delta, scoreAfter },
    ]);
    setStatus("revealed");
  };

  const handleSelect = (choice) => {
    if (status === "answering") finishQuestion(choice);
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== "answering") return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Hết giờ: tính như trả lời sai
  useEffect(() => {
    if (status === "answering" && timeLeft <= 0) finishQuestion(-1);
  }, [status, timeLeft]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chờ 2 giây rồi sang câu tiếp hoặc kết thúc
  useEffect(() => {
    if (status !== "revealed") return;
    const timer = setTimeout(() => {
      if (index + 1 >= total || score < MIN_BET) {
        navigate("/result", {
          replace: true,
          state: {
            name: playerName,
            rounds,
            finalScore: score,
            correctCount: rounds.filter(({ correct }) => correct).length,
            reason: score < MIN_BET ? "bankrupt" : "completed",
          },
        });
        return;
      }
      setIndex(index + 1);
      setBetInput("100");
      setSelected(null);
      setStatus("betting");
    }, 2000);
    return () => clearTimeout(timer);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!playerName) return <Navigate to="/" replace />;

  return (
    <div>
      {status === "betting" ? (
        <BetPanel
          index={index}
          total={total}
          question={question}
          score={score}
          betInput={betInput}
          onBetChange={setBetInput}
          onBet={handlePlaceBet}
        />
      ) : (
        <div>
          <QuestionCard
            index={index}
            total={total}
            question={question}
            selected={selected}
            revealed={status === "revealed"}
            onSelect={handleSelect}
          />
          <Timer timeLeft={timeLeft} />
          <ScoreInfo score={score} bet={bet} />
          {status === "revealed" && (
            <p style={{ fontWeight: "bold" }}>
              {selected === -1 && "Hết giờ! "}
              {change >= 0
                ? `+${formatScore(change)}`
                : `−${formatScore(Math.abs(change))}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Play;