import BytesMenu from './Components/BytesMenu';
import './App.css';

function App() {
  return (
    <div className="App">
      <BytesMenu 
        heroImage="/assets/hero.jpg"
        logoImage="/assets/bytes-logo.png"
        className="my-custom-menu"
      />
    </div>
  );
}

export default App;