import { lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { RouteLoader } from "./components/layout/RouteLayout";

// Each route is its own chunk now. The landing page (what most first-time
// visitors see) no longer has to download the canvas engine, the WebGL
// shader background, or react-joyride's tour library before it can render.
const LandingPage = lazy(() =>
  import("./components/landing/LandingPage").then((m) => ({
    default: m.LandingPage,
  })),
);
const DrawingsGallery = lazy(() =>
  import("./components/gallery/DrawingsGallery").then((m) => ({
    default: m.DrawingsGallery,
  })),
);
const Dashboard = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.Dashboard })),
);
function DashboardRoute() {
  const { id } = useParams();
  return <Dashboard key={id ?? "new"} />;
}

function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/drawings" element={<DrawingsGallery />} />
        <Route path="/dashboard/:id" element={<DashboardRoute />} />
      </Routes>
    </Suspense>
  );
}

export default App;
