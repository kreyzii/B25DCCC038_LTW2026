import { useState } from "react";
import { Link } from "react-router-dom";
import { LEVELS, MULTIPLIERS, formatMultiplier } from "../data";

const QuestionBank = ({ questions, bookmarks, onToggleBookmark }) => {
  const [levels, setLevels] = useState([1, 2, 3]);
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [query, setQuery] = useState("");

  const handleLookupShift = (e) => setQuery(e.target.value);

  const handleLevelChange = (level) => {
    setLevels(
      levels.includes(level)
        ? levels.filter((item) => item !== level)
        : [...levels, level]
    );
  };

  const keyword = query.trim().toLowerCase();
  const filtered = questions.filter(
    ({ id, level, question }) =>
      levels.includes(level) &&
      (!onlyBookmarked || bookmarks.includes(id)) &&
      question.toLowerCase().includes(keyword)
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>

      <div className="filters">
        {[1, 2, 3].map((level) => (
          <label key={level}>
            <input
              type="checkbox"
              checked={levels.includes(level)}
              onChange={() => handleLevelChange(level)}
            />{" "}
            {LEVELS[level]}
          </label>
        ))}
        <label>
          <input
            type="checkbox"
            checked={onlyBookmarked}
            onChange={(e) => setOnlyBookmarked(e.target.checked)}
          />{" "}
          Chỉ hiện câu đã đánh dấu
        </label>
        <span>
          <label htmlFor="lookup">Tìm kiếm</label>{" "}
          <input
            id="lookup"
            type="text"
            value={query}
            onChange={handleLookupShift}
          />
        </span>
      </div>

      <p>{`Có ${filtered.length} câu hỏi`}</p>
      <p>{`Đã đánh dấu: ${bookmarks.length} câu`}</p>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Chủ đề</th>
            <th>Mức độ</th>
            <th>Hệ số</th>
            <th>Câu hỏi</th>
            <th>Đánh dấu</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(({ id, topic, level, question }) => (
            <tr key={id}>
              <td>{id}</td>
              <td>{topic}</td>
              <td>{LEVELS[level]}</td>
              <td>{formatMultiplier(MULTIPLIERS[level])}</td>
              <td><Link to={`/questions/${id}`}>{question}</Link></td>
              <td>
                <button onClick={() => onToggleBookmark(id)}>
                  {bookmarks.includes(id) ? "★" : "☆"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionBank;