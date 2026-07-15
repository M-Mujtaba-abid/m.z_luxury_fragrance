

import { BrowserRouter as Router } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import LayoutAll from "./layouts/LayoutAll";
import Loader from "./components/user/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store"; // apne path ke hisaab se

const App = () => {
  const loading = useSelector((state: RootState) => state.loader.loading);

  return (
    // reducedMotion="user" makes every framer-motion animation in the app
    // respect the OS-level prefers-reduced-motion setting automatically
    <MotionConfig reducedMotion="user">
      {loading && <Loader />}
      <Router>
        <LayoutAll />
      </Router>
    </MotionConfig>
  );
};

export default App;
