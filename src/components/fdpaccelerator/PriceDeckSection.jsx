import React from 'react';
import CollapsibleSection from './CollapsibleSection';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PriceDeckRow from './PriceDeckRow';

const PriceDeckSection = ({ formState, setFormState }) => {
  const { priceDeck } = formState;

  const addPriceYear = () => setFormState(prev => ({ ...prev, priceDeck: [...prev.priceDeck, { id: Date.now(), year: new Date().getFullYear(), oil_price_usd: 80, gas_price_usd: 3 }] }));
  
  const updatePriceYear = (id, field, value) => {
    const newPriceDeck = priceDeck.map(p => p.id === id ? { ...p, [field]: value } : p);
    setFormState(prev => ({ ...prev, priceDeck: newPriceDeck }));
  };

  const removePriceYear = (id) => {
    const newPriceDeck = priceDeck.filter(p => p.id !== id);
    setFormState(prev => ({ ...prev, priceDeck: newPriceDeck }));
  };

  return (
    <CollapsibleSection title="Price Deck">
      <div className="space-y-2">
        {priceDeck.map((price) => <PriceDeckRow key={price.id} item={price} updateFn={updatePriceYear} removeFn={removePriceYear} />)}
        <Button type="button" variant="outline" size="sm" onClick={addPriceYear} className="w-full border-lime-400 text-lime-400 hover:bg-lime-400/10"><PlusCircle className="w-4 h-4 mr-2" /> Add Year</Button>
      </div>
    </CollapsibleSection>
  );
};

export default PriceDeckSection;