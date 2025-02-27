import React, { useState } from 'react';
import {
  UserGroupIcon,
  CogIcon,
  CubeIcon,
  SparklesIcon,
  HeartIcon,
  TruckIcon,
  UsersIcon,
  CurrencyDollarIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const getIconForSection = (sectionKey) => {
  const icons = {
    key_partners: UserGroupIcon,
    key_activities: CogIcon,
    key_resources: CubeIcon,
    value_propositions: SparklesIcon,
    customer_relationships: HeartIcon,
    channels: TruckIcon,
    customer_segments: UsersIcon,
    cost_structure: CurrencyDollarIcon,
    revenue_streams: BanknotesIcon
  };

  const IconComponent = icons[sectionKey] || UserGroupIcon;
  return <IconComponent className="w-5 h-5 mr-2" />;
};

export default function CanvasSection({ sectionKey, title, subtitle, items, onUpdate }) {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      onUpdate([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    const filteredItems = [...items];
    filteredItems.splice(indexToRemove, 1);
    onUpdate(filteredItems);
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm h-full flex flex-col">
      <div className="flex items-center mb-2 sticky top-0 bg-white z-10">
        {getIconForSection(sectionKey)}
        <h3 className="text-lg font-semibold truncate">{title}</h3>
      </div>
      
      <div className="overflow-y-auto flex-1 min-h-0">
        <p className="text-xs text-gray-400 mb-4 whitespace-pre-line">{subtitle}</p>
        
        <ul className="space-y-2 mb-4">
          {items.map((item, index) => (
            <li key={index} className="flex items-center justify-between group hover:bg-gray-50 p-1.5 rounded">
              <span className="text-sm break-words flex-1 mr-2">{item}</span>
              <button
                onClick={() => handleRemoveItem(index)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleAddItem} className="mt-auto pt-3 border-t sticky bottom-0 bg-white">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item..."
          className="w-full p-2 border rounded text-sm"
        />
      </form>
    </div>
  );
}