import React, { useState } from 'react';

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
    <div className="border rounded-lg p-4 h-full bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4 whitespace-pre-line">{subtitle}</p>
      
      <ul className="space-y-2 mb-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-center justify-between group">
            <span className="text-sm">{item}</span>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAddItem} className="mt-auto">
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