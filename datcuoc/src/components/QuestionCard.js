import AnswerButton from "./AnswerButton";
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from "../data";

const QuestionCard = ({ index, total, question, selected, revealed, onSelect }) => {
  const { topic, level, question: text, options, answer } = question;

  const getState = (i) => {
    if (!revealed) return "";
    if (i === answer) return "correct";
    if (i === selected) return "wrong";
    return "";
  };

  return (
    <div>
      <p>{`Câu ${index + 1}/${total} · ${topic} · ${LEVELS[level]} (${formatMultiplier(MULTIPLIERS[level])})`}</p>
      <h3>{text}</h3>
      <div className="answers">
        {options.map((option, i) => (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={getState(i)}
            disabled={revealed}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;