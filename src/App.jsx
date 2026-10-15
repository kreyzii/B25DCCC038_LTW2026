import { useState, useEffect } from "react";
import StudentList from "./StudentList";

const defaultStudents = [
  { id: 1, name: "Nguyễn Văn An", score: 9, class: "D25CQCC01" },
  { id: 2, name: "Trần Thị Bình", score: 7, class: "D25CQCC01" },
  { id: 3, name: "Lê Văn Cường", score: 4, class: "D25CQCC02" },
];

const loadStudents = () => {
  const saved = localStorage.getItem("students");
  return saved ? JSON.parse(saved) : defaultStudents;
};

const App = () => {
  const [students, setStudents] = useState(loadStudents);
  const [form, setForm] = useState({ name: "", score: "", studentClass: "" });
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  const { name, score, studentClass } = form;

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    setForm({ ...form, [field]: value });
  };

  const handleAdd = () => {
    const scoreNum = Number(score);
    if (
      !name.trim() ||
      !studentClass.trim() ||
      score === "" ||
      isNaN(scoreNum) ||
      scoreNum < 0 ||
      scoreNum > 10
    ) {
      setError("Vui lòng nhập đủ thông tin và điểm phải từ 0 đến 10!");
      return;
    }
    const newStudent = {
      id: Math.max(0, ...students.map(({ id }) => id)) + 1,
      name: name.trim(),
      score: scoreNum,
      class: studentClass.trim(),
    };
    setStudents([...students, newStudent]);
    setForm({ name: "", score: "", studentClass: "" });
    setError("");
  };

  const handleDelete = (deleteId) => {
    setStudents(students.filter(({ id }) => id !== deleteId));
  };

  const displayed = students.filter(({ score }) => {
    if (filter === "good") return score >= 8;
    if (filter === "fail") return score < 5;
    return true;
  });

  const total = students.length;
  const average = total
    ? (students.reduce((sum, { score }) => sum + score, 0) / total).toFixed(2)
    : 0;

  return (
    <div style={{ padding: 20 }}>
      <h1>Quản lý Điểm Sinh viên</h1>

      <div>
        <input name="name" placeholder="Họ tên" value={name} onChange={handleChange} />{" "}
        <input name="score" type="number" placeholder="Điểm số" value={score} onChange={handleChange} />{" "}
        <input name="studentClass" placeholder="Lớp" value={studentClass} onChange={handleChange} />{" "}
        <button onClick={handleAdd}>Thêm</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <div style={{ margin: "16px 0" }}>
        <button onClick={() => setFilter("all")}>Tất cả</button>{" "}
        <button onClick={() => setFilter("good")}>Giỏi (≥ 8)</button>{" "}
        <button onClick={() => setFilter("fail")}>Trượt (&lt; 5)</button>
      </div>

      <StudentList students={displayed} onDelete={handleDelete} />

      <p>{`Tổng số sinh viên: ${total} | Điểm trung bình: ${average}`}</p>
    </div>
  );
};

export default App;