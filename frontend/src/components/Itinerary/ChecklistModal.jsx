import React, { useEffect, useState } from 'react';
import { checklistService } from '../../services/api';
import './Itinerary.css';

const defaultCategories = [
  {
    id: 'essentials',
    name: 'Essentials',
    items: [
      { id: 'e1', text: 'Passport', completed: false },
      { id: 'e2', text: 'Visa documents', completed: false },
      { id: 'e3', text: 'Flight tickets', completed: false },
      { id: 'e4', text: 'Hotel reservations', completed: false },
      { id: 'e5', text: 'Travel insurance', completed: false }
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing',
    items: [
      { id: 'c1', text: 'T-shirts', completed: false },
      { id: 'c2', text: 'Pants/shorts', completed: false },
      { id: 'c3', text: 'Underwear', completed: false },
      { id: 'c4', text: 'Socks', completed: false },
      { id: 'c5', text: 'Jacket/sweater', completed: false },
      { id: 'c6', text: 'Sleepwear', completed: false },
      { id: 'c7', text: 'Swimwear', completed: false }
    ]
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    items: [
      { id: 't1', text: 'Toothbrush & toothpaste', completed: false },
      { id: 't2', text: 'Shampoo & conditioner', completed: false },
      { id: 't3', text: 'Soap/body wash', completed: false },
      { id: 't4', text: 'Deodorant', completed: false },
      { id: 't5', text: 'Sunscreen', completed: false },
      { id: 't6', text: 'Medications', completed: false }
    ]
  },
  {
    id: 'electronics',
    name: 'Electronics',
    items: [
      { id: 'el1', text: 'Phone & charger', completed: false },
      { id: 'el2', text: 'Laptop & charger', completed: false },
      { id: 'el3', text: 'Camera', completed: false },
      { id: 'el4', text: 'Power adapter', completed: false },
      { id: 'el5', text: 'Headphones', completed: false },
      { id: 'el6', text: 'Portable power bank', completed: false }
    ]
  },
  {
    id: 'misc',
    name: 'Miscellaneous',
    items: [
      { id: 'm1', text: 'Books/e-reader', completed: false },
      { id: 'm2', text: 'Travel pillow', completed: false },
      { id: 'm3', text: 'Eye mask & earplugs', completed: false },
      { id: 'm4', text: 'Snacks', completed: false },
      { id: 'm5', text: 'Water bottle', completed: false },
      { id: 'm6', text: 'First aid kit', completed: false }
    ]
  }
];

function ChecklistModal({ show, onClose, tripTitle = "JAPAN 2025", itineraryId }) {
  const [categories, setCategories] = useState(defaultCategories);
  const [activeCategory, setActiveCategory] = useState('essentials');
  const [newItemText, setNewItemText] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Calculate progress
  useEffect(() => {
    let completed = 0;
    let total = 0;
    
    categories.forEach(category => {
      category.items.forEach(item => {
        total++;
        if (item.completed) completed++;
      });
    });
    
    setCompletedCount(completed);
    setTotalCount(total);
  }, [categories]);

  // Load checklist data when modal is opened
  useEffect(() => {
    if (!show || !itineraryId) return;
    
    const loadChecklist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const checklistData = await checklistService.getChecklist(itineraryId);
        
        if (checklistData && checklistData.categories && checklistData.categories.length > 0) {
          setCategories(checklistData.categories);
          console.log("Loaded checklist from MongoDB");
        } else {
          // Fallback to localStorage if MongoDB data isn't available
          const savedChecklist = localStorage.getItem(`checklist_${tripTitle.replace(/\s+/g, '_')}`);
          if (savedChecklist) {
            setCategories(JSON.parse(savedChecklist));
            console.log("Loaded checklist from localStorage");
          }
        }
      } catch (error) {
        console.error('Error loading checklist:', error);
        setError("Failed to load checklist");
        
        // Fallback to localStorage
        const savedChecklist = localStorage.getItem(`checklist_${tripTitle.replace(/\s+/g, '_')}`);
        if (savedChecklist) {
          try {
            setCategories(JSON.parse(savedChecklist));
          } catch (err) {
            console.error('Error loading checklist from localStorage:', err);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadChecklist();
  }, [show, itineraryId, tripTitle]);

  // Save to MongoDB when categories change
  useEffect(() => {
    if (!show || !itineraryId) return;
    
    const saveChecklist = async () => {
      try {
        await checklistService.saveChecklist(itineraryId, { categories });
        console.log("Saved checklist to MongoDB");
        
        // Also save to localStorage as backup
        localStorage.setItem(
          `checklist_${tripTitle.replace(/\s+/g, '_')}`, 
          JSON.stringify(categories)
        );
      } catch (error) {
        console.error('Error saving checklist to MongoDB:', error);
        
        // Still save to localStorage even if MongoDB fails
        localStorage.setItem(
          `checklist_${tripTitle.replace(/\s+/g, '_')}`, 
          JSON.stringify(categories)
        );
      }
    };
    
    // Debounce the save function to avoid too many API calls
    const timeoutId = setTimeout(() => {
      saveChecklist();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [categories, itineraryId, tripTitle, show]);

  if (!show) {
    return null;
  }

  const toggleItemCompletion = (itemId) => {
    setCategories(categories.map(category => ({
      ...category,
      items: category.items.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    })));
  };

  const addNewItem = () => {
    if (!newItemText.trim()) return;
    
    setCategories(categories.map(category => {
      if (category.id === activeCategory) {
        return {
          ...category,
          items: [
            ...category.items,
            {
              id: `new-${Date.now()}`,
              text: newItemText.trim(),
              completed: false
            }
          ]
        };
      }
      return category;
    }));
    
    setNewItemText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addNewItem();
    }
  };

  const deleteItem = (itemId) => {
    setCategories(categories.map(category => ({
      ...category,
      items: category.items.filter(item => item.id !== itemId)
    })));
  };

  const activeItems = categories.find(cat => cat.id === activeCategory)?.items || [];
  const progressPercentage = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  // Show loading indicator if needed
  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="checklist-modal" onClick={(e) => e.stopPropagation()}>
          <div className="checklist-header">
            <h2 className="checklist-title">Trip Checklist</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          <div className="checklist-content">
            <p>Loading checklist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="checklist-modal" onClick={(e) => e.stopPropagation()}>
        <div className="checklist-header">
          <h2 className="checklist-title">Trip Checklist for {tripTitle}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="checklist-content">
          {error && (
            <div className="error-message">
              {error} - Using local data instead.
            </div>
          )}
          
          <div className="progress-summary">
            <div>
              <div className="progress-text">
                {completedCount} of {totalCount} items completed ({progressPercentage}%)
              </div>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          <div className="checklist-categories">
            {categories.map(category => (
              <div 
                key={category.id} 
                className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </div>
            ))}
          </div>
          
          <div className="checklist-items">
            {activeItems.length > 0 ? (
              activeItems.map(item => (
                <div key={item.id} className="checklist-item">
                  <input
                    type="checkbox"
                    className="checklist-checkbox"
                    checked={item.completed}
                    onChange={() => toggleItemCompletion(item.id)}
                    id={`item-${item.id}`}
                  />
                  <label 
                    htmlFor={`item-${item.id}`}
                    className={`item-text ${item.completed ? 'completed-item' : ''}`}
                  >
                    {item.text}
                  </label>
                  <button 
                    onClick={() => deleteItem(item.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      color: 'var(--text-light)',
                      fontSize: '1rem'
                    }}
                    aria-label="Delete item"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-category-message">
                No items in this category yet. Add some below!
              </div>
            )}
          </div>
          
          <div className="add-item-input">
            <input
              type="text"
              placeholder="Add new item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={addNewItem}>Add</button>
          </div>
        </div>
        
        <div className="checklist-footer">
          <button 
            className="cancel-button" 
            onClick={onClose}
            style={{ 
              background: 'white', 
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChecklistModal;
