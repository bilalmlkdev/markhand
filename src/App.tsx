import { lazy, Suspense } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { RouteLoader } from "./components/layout/RouteLayout";

// Lazy routes keep the landing chunk free of the canvas engine + tour libs.
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
const NotFound = lazy(() =>
  import("./pages/NotFound").then((m) => ({ default: m.NotFound })),
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
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
