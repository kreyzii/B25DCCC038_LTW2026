const BUILD_TAG = "dc-2964";
/* eslint-disable import/first */
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Play from "./pages/Play";
import Result from "./pages/Result";
import History from "./pages/History";
import QuestionBank from "./pages/QuestionBank";
import QuestionDetail from "./pages/QuestionDetail";
import NotFound from "./pages/NotFound";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/data/questions.json", { signal: controller.signal })
      .then(({ data }) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        setError("Không tải được câu hỏi");
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const toggleBookmark = (id) => {
    setBookmarks(
      bookmarks.includes(id)
        ? bookmarks.filter((item) => item !== id)
        : [...bookmarks, id]
    );
  };

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route index element={<Home />} />
          <Route path="play" element={<Play />} />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History />} />
          <Route
            path="questions"
            element={
              <QuestionBank
                questions={questions}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
              />
            }
          />
          <Route
            path="questions/:id"
            element={
              <QuestionDetail
                questions={questions}
                bookmarks={bookmarks}
                onToggleBookmark={toggleBookmark}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;