import { BrowserRouter as Router } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import LayoutAll from "./layouts/LayoutAll";

const App = () => {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <LayoutAll />
      </Router>
    </MotionConfig>
  );
};

export default App;
