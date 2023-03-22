import './App.css';
import MLBScore from './MLBScore.js'
import NBAScore from './NBAScore.js';

function App() {
  return (
    <div className="App">
      <header id="siteheader">
        <h1>Barstool Scoreboard</h1>
      </header>
      <NBAScore />
      <MLBScore />
    </div>
  );
}

export default App;
