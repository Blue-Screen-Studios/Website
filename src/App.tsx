import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PlaceholderPage from "./pages/PlaceholderPage";
import Discord from "./pages/Discord";
import About from "./pages/About";
import GamePage from "./pages/GamePage";
import Software from "./pages/Software";
import Sdk from "./pages/Sdk";
import SdkLibrary from "./pages/SdkLibrary";
import { games, software } from "./data/catalog";
import { sdkLibraries } from "./data/sdk";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="games" element={<Navigate to="/" replace />} />
        {games.map((g) => (
          <Route
            key={g.slug}
            path={`games/${g.slug}`}
            element={<GamePage game={g} />}
          />
        ))}
        <Route path="software" element={<Software />} />
        {software.map((s) => (
          <Route
            key={s.slug}
            path={`software/${s.slug}`}
            element={<PlaceholderPage eyebrow="Software" title={s.title} />}
          />
        ))}
        <Route path="sdk" element={<Sdk />} />
        {sdkLibraries.map((lib) => (
          <Route key={lib.slug} path={`sdk/${lib.slug}`} element={<SdkLibrary lib={lib} />} />
        ))}
        <Route path="discord" element={<Discord />} />
        <Route path="about" element={<About />} />
        <Route
          path="*"
          element={<PlaceholderPage eyebrow="Error 404" title="Page not found" body="The page you're looking for doesn't exist or has moved." />}
        />
      </Route>
    </Routes>
  );
}
