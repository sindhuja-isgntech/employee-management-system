import { Outlet } from "react-router-dom";
import {Header} from "./Header.tsx";
import {Sidebar} from "./Sidebar.tsx";
import {Footer} from "./Footer.tsx";

function MainLayout1() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "24px",
            backgroundColor: "#c9daeb",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default MainLayout1;