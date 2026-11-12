import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import BetPanel from "../components/BetPanel";
import QuestionCard from "../components/QuestionCard";
import Timer from "../components/Timer";
import ScoreInfo from "../components/ScoreInfo";
import Supports from "../components/Supports";
import {
  START_SCORE,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  TIME_PER_QUESTION,
  formatScore,
} from "../data";
import { validateBet, calcChange, getResult } from "../utils";

const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(START_SCORE);
  const [status, setStatus] = useState("betting"); // betting -> answering -> revealed
  const [betInput, setBetInput] = useState("100");
  const [bet, setBet] = useState(0);
  const [selected, setSelected] = useState(null);
  const [change, setChange] = useState(0);
  const [saved, setSaved] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [rounds, setRounds] = useState([]);

  // Quyền trợ giúp: mỗi quyền dùng 1 lần trong cả lượt chơi
  const [usedPreview, setUsedPreview] = useState(false);
  const [usedInsurance, setUsedInsurance] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  // Tác dụng chỉ cho câu đang chơi
  const [previewing, setPreviewing] = useState(false);
  const [insuredNow, setInsuredNow] = useState(false);
  const [hintShown, setHintShown] = useState(false);

  const total = questions.length;
  const question = questions[index];

  const placeBet = (value) => {
    if (validateBet(value, score)) return;
    setBet(value);
    setTimeLeft(TIME_PER_QUESTION);
    setStatus("answering");
  };

  // choice = vị trí đáp án đã chọn, -1 nếu hết giờ
  const finishQuestion = (choice) => {
    const correct = choice === question.answer;
    const insuredSave = insuredNow && !correct;
    const delta = insuredSave ? 0 : calcChange(bet, question.level, correct);
    const scoreAfter = score + delta;
    setChange(delta);
    setSaved(insuredSave);
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

  const handlePreview = () => {
    setUsedPreview(true);
    setPreviewing(true);
  };
  const handleInsure = () => {
    setUsedInsurance(true);
    setInsuredNow(true);
  };
  const handleHint = () => {
    setUsedHint(true);
    setHintShown(true);
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
        const correctCount = rounds.filter(({ correct }) => correct).length;
        onFinish({
          id: Date.now(),
          name: playerName,
          finalScore: score,
          correctCount,
          played: rounds.length,
          result: getResult(score).title,
          playedAt: new Date().toLocaleString("vi-VN"),
        });
        navigate("/result", {
          replace: true,
          state: {
            name: playerName,
            rounds,
            finalScore: score,
            correctCount,
            reason: score < MIN_BET ? "bankrupt" : "completed",
          },
        });
        return;
      }
      setIndex(index + 1);
      setBetInput("100");
      setSelected(null);
      setSaved(false);
      setPreviewing(false);
      setInsuredNow(false);
      setHintShown(false);
      setStatus("betting");
    }, 2000);
    return () => clearTimeout(timer);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Phím tắt: chỉ có tác dụng ở bước đặt cược
  useEffect(() => {
    if (status !== "betting") return;
    const handleKey = (e) => {
      const maxBet = Math.min(MAX_BET, Math.floor(score / BET_STEP) * BET_STEP);
      const current = Number(betInput) || MIN_BET;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setBetInput(String(Math.min(current + BET_STEP, maxBet)));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setBetInput(String(Math.max(current - BET_STEP, MIN_BET)));
      } else if (e.key === "Enter") {
        e.preventDefault();
        placeBet(Number(betInput));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [status, betInput, score]); // eslint-disable-line react-hooks/exhaustive-deps

  // Tiêu đề tab
  useEffect(() => {
    if (!playerName) return;
    document.title =
      status === "betting"
        ? `Câu ${index + 1}/${total} – đặt cược`
        : `Câu ${index + 1}/${total} – cược ${bet}`;
    return () => {
      document.title = "Đặt cược kiến thức";
    };
  }, [index, status, bet, total, playerName]);

  if (!playerName) return <Navigate to="/" replace />;

  return (
    <div>
      <Supports
        status={status}
        usedPreview={usedPreview}
        usedInsurance={usedInsurance}
        usedHint={usedHint}
        onPreview={handlePreview}
        onInsure={handleInsure}
        onHint={handleHint}
      />

      {status === "betting" ? (
        <BetPanel
          index={index}
          total={total}
          question={question}
          score={score}
          betInput={betInput}
          previewing={previewing}
          onBetChange={setBetInput}
          onBet={() => placeBet(Number(betInput))}
        />
      ) : (
        <div>
          <QuestionCard
            index={index}
            total={total}
            question={question}
            selected={selected}
            revealed={status === "revealed"}
            hintShown={hintShown}
            onSelect={handleSelect}
          />
          <Timer timeLeft={timeLeft} />
          <ScoreInfo score={score} bet={bet} />
          {status === "revealed" && (
            <p style={{ fontWeight: "bold" }}>
              {selected === -1 && "Hết giờ! "}
              {saved
                ? "Bảo hiểm: không bị trừ điểm"
                : change >= 0
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