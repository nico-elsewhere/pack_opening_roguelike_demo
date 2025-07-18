import React from 'react';
import './Shop.css';

const Shop = ({
  pp,
  packSlots,
  packSlotCost,
  buyPackSlot,
  runeSlots,
  runeSlotCost,
  buyRuneSlot
}) => {
  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Mystic Shop</h1>
        <div className="shop-balance">
          <span className="balance-label">Your Balance:</span>
          <span className="balance-amount">{pp} PP</span>
        </div>
      </div>
      
      <div className="shop-content">
        <div className="shop-grid">
          {/* Pack Slots Upgrade */}
          <div className="shop-item glass upgrade">
            <div className="item-icon">📦</div>
            <h3>Pack Slots</h3>
            <p className="item-description">Open more packs at once</p>
            <div className="current-level">Current: {packSlots} slots</div>
            <div className="item-price">{packSlotCost} PP</div>
            <button 
              className={`shop-button ${pp >= packSlotCost ? 'available' : 'disabled'}`}
              onClick={buyPackSlot}
              disabled={pp < packSlotCost}
            >
              Upgrade to {packSlots + 1}
            </button>
          </div>
          
          {/* Rune Slots Upgrade */}
          <div className="shop-item glass upgrade">
            <div className="item-icon">✨</div>
            <h3>Rune Slots</h3>
            <p className="item-description">Equip more runes</p>
            <div className="current-level">Current: {runeSlots} slots</div>
            <div className="item-price">{runeSlotCost} PP</div>
            <button 
              className={`shop-button ${pp >= runeSlotCost ? 'available' : 'disabled'}`}
              onClick={buyRuneSlot}
              disabled={pp < runeSlotCost}
            >
              Upgrade to {runeSlots + 1}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;