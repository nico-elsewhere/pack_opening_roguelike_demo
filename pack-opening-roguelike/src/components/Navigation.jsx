import './Navigation.css';

const Navigation = ({ currentScreen, setCurrentScreen }) => {
  return (
    <nav className="navigation">
      <button 
        className={`nav-button ${currentScreen === 'home' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('home')}
      >
        Home
      </button>
      <button 
        className={`nav-button ${currentScreen === 'collection' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('collection')}
      >
        Collection
      </button>
      <button 
        className={`nav-button ${currentScreen === 'shop' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('shop')}
      >
        Shop
      </button>
    </nav>
  );
};

export default Navigation;