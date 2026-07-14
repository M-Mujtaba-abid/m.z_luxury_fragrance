

import { BrowserRouter as Router } from "react-router-dom";
import LayoutAll from "./layouts/LayoutAll";
import Loader from "./components/user/Loader";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store"; // apne path ke hisaab se

const App = () => {
  const loading = useSelector((state: RootState) => state.loader.loading);

  return (
    <>
      {loading && <Loader />}
      <Router>
        <LayoutAll />
      </Router>
    </>
  );
};

export default App;
