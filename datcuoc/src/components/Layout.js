import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({ loading, error }) => (
  <div>
    <NavBar />
    <main>
      {loading ? <p>Đang tải câu hỏi...</p> : error ? <p>{error}</p> : <Outlet />}
    </main>
  </div>
);

export default Layout;