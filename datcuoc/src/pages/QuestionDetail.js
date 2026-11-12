import { useParams, useNavigate } from "react-router-dom";
import { LEVELS, MULTIPLIERS, LETTERS, formatMultiplier } from "../data";

const QuestionDetail = ({ questions, bookmarks, onToggleBookmark }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = questions.find((q) => q.id === Number(id));

  if (!item) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  const { id: qid, topic, level, question, options, answer, hint } = item;
  const marked = bookmarks.includes(qid);

  return (
    <div>
      <h2>{`Câu hỏi số ${qid} – ${topic} · ${LEVELS[level]} (${formatMultiplier(MULTIPLIERS[level])})`}</h2>
      <p>{question}</p>
      {options.map((option, index) => (
        <div key={index} className={index === answer ? "option correct" : "option"}>
          {`${LETTERS[index]}. ${option}`}
          {index === answer && " (Đáp án đúng)"}
        </div>
      ))}
      <p>{`Gợi ý: ${hint}`}</p>
      <button onClick={() => onToggleBookmark(qid)}>
        {marked ? "Bỏ đánh dấu" : "Đánh dấu"}
      </button>{" "}
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;