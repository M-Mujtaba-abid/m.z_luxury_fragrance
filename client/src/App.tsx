

import { BrowserRouter as Router } from "react-router-dom";
<<<<<<< HEAD
import LayoutAll from "./Layout.tsx/LayoutAll";
=======
import { MotionConfig } from "framer-motion";
import LayoutAll from "./layouts/LayoutAll";
import Loader from "./components/user/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store"; // apne path ke hisaab se
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44

const App = () => {
  return (
<<<<<<< HEAD
    <Router>
      <LayoutAll />
    </Router>
=======
    // reducedMotion="user" makes every framer-motion animation in the app
    // respect the OS-level prefers-reduced-motion setting automatically
    <MotionConfig reducedMotion="user">
      {loading && <Loader />}
      <Router>
        <LayoutAll />
      </Router>
    </MotionConfig>
>>>>>>> 58a249e3315431d3cb1baffc2e79c74b6949ce44
  );
};

export default App;
