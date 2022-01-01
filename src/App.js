import { Router } from "@reach/router";
import "./App.css"

import Posts from './components/posts'

function App() {
  return (
    <Router>
      <Posts path="/" />
    </Router>
  );
}

export default App;