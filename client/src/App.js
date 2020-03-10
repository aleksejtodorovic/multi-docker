import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import OtherPage from './pages/OtherPage';
import Fib from './pages/Fib';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Fib Calculator</h1>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other page</Link>
        </header>
        <div>
          <Switch>
            <Route exact path="/" component={Fib} />
            <Route page="/otherpage" component={OtherPage} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
