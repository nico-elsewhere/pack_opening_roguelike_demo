import './Shop.css';

const Shop = ({ canBuyPack, packCost, buyPack, pp, packSlots, packSlotCost, buyPackSlot, runeSlots, runeSlotCost, buyRuneSlot }) => {
  return (
    <div className="shop">
      <h2 className="shop-title">Mystic Shop</h2>
      <div className="shop-items">
        <div className="shop-item">
          <div className="pack-preview">
            <div className="pack-card-back">
              <div className="pack-design">
                <div className="mystic-symbol">✦</div>
              </div>
            </div>
          </div>
          <h3>Tarot Pack</h3>
          <p className="pack-description">Contains 5 mystical cards</p>
          <button 
            className={`buy-button ${canBuyPack ? '' : 'disabled'}`}
            onClick={buyPack}
            disabled={!canBuyPack}
          >
            Buy Pack - {packCost} PP
          </button>
        </div>
        
        <div className="shop-item upgrade">
          <div className="upgrade-icon">📦</div>
          <h3>Pack Slots</h3>
          <p className="pack-description">Open {packSlots + 1} packs at once</p>
          <p className="current-status">Current: {packSlots} slot{packSlots > 1 ? 's' : ''}</p>
          <button 
            className={`buy-button ${pp >= packSlotCost ? '' : 'disabled'}`}
            onClick={buyPackSlot}
            disabled={pp < packSlotCost}
          >
            Upgrade - {packSlotCost} PP
          </button>
        </div>
        
        <div className="shop-item upgrade">
          <div className="upgrade-icon">✨</div>
          <h3>Rune Slots</h3>
          <p className="pack-description">Equip {runeSlots + 1} runes at once</p>
          <p className="current-status">Current: {runeSlots} slot{runeSlots > 1 ? 's' : ''}</p>
          <button 
            className={`buy-button ${pp >= runeSlotCost ? '' : 'disabled'}`}
            onClick={buyRuneSlot}
            disabled={pp < runeSlotCost}
          >
            Upgrade - {runeSlotCost} PP
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop;