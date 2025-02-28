// Main JavaScript file for Itinerate app

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Get references to key UI elements
    const searchInput = document.querySelector('input[placeholder="Search Your Plans..."]');
    const editPlanBtn = document.querySelector('.edit-plan-btn');
    const shareBtn = document.querySelector('.share-btn');
    const checklistBtn = document.querySelector('.checklist-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const socialBtn = document.querySelector('.social-btn');
    const profileBtn = document.querySelector('.profile-btn');
    const homeBtn = document.querySelector('.home-btn');
    
    // Event listeners
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    if (editPlanBtn) {
        editPlanBtn.addEventListener('click', openEditPlanModal);
    }
    
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShare);
    }
    
    if (checklistBtn) {
        checklistBtn.addEventListener('click', openChecklist);
    }
    
    if (socialBtn) {
        socialBtn.addEventListener('click', openSocialPage);
    }
    
    if (profileBtn) {
        profileBtn.addEventListener('click', openProfile);
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', goToHome);
    }
    
    // Add click handlers to timeline items
    if (timelineItems) {
        timelineItems.forEach(item => {
            item.addEventListener('click', () => editTimelineItem(item));
        });
    }
    
    // Initialize the timeline
    initializeTimeline();
});

// Search functionality
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const itemTitle = item.querySelector('.item-title').textContent.toLowerCase();
        const isVisible = itemTitle.includes(searchTerm);
        item.style.display = isVisible ? 'flex' : 'none';
    });
}

// Edit plan functionality
function openEditPlanModal() {
    console.log('Opening edit plan modal');
    // Create and show modal for editing the plan
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Edit Your Japan 2025 Plan</h2>
            <form id="edit-plan-form">
                <div class="form-group">
                    <label for="plan-title">Plan Title:</label>
                    <input type="text" id="plan-title" value="JAPAN 2025">
                </div>
                <div class="form-group">
                    <label for="start-date">Start Date:</label>
                    <input type="date" id="start-date" value="2025-01-01">
                </div>
                <div class="form-group">
                    <label for="end-date">End Date:</label>
                    <input type="date" id="end-date">
                </div>
                <button type="submit" class="save-btn">Save Changes</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const form = modal.querySelector('#edit-plan-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const planTitle = document.querySelector('#plan-title').value;
        document.querySelector('.plan-title').textContent = planTitle;
        document.body.removeChild(modal);
    });
}

// Share functionality
function handleShare() {
    console.log('Sharing itinerary');
    
    // Create a shareable link
    const shareLink = `https://itinerate.app/share/${generateShareId()}`;
    
    // Show share options
    const shareModal = document.createElement('div');
    shareModal.classList.add('share-modal');
    shareModal.innerHTML = `
        <div class="share-modal-content">
            <span class="close-btn">&times;</span>
            <h2>Share Your Itinerary</h2>
            <p>Share this link with others:</p>
            <div class="share-link-container">
                <input type="text" readonly value="${shareLink}" class="share-link">
                <button class="copy-btn">Copy</button>
            </div>
            <div class="share-options">
                <button class="share-option" data-platform="email">
                    <i class="fa fa-envelope"></i> Email
                </button>
                <button class="share-option" data-platform="whatsapp">
                    <i class="fa fa-whatsapp"></i> WhatsApp
                </button>
                <button class="share-option" data-platform="telegram">
                    <i class="fa fa-telegram"></i> Telegram
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(shareModal);
    
    // Add event listeners
    const closeBtn = shareModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(shareModal);
    });
    
    const copyBtn = shareModal.querySelector('.copy-btn');
    copyBtn.addEventListener('click', () => {
        const linkInput = shareModal.querySelector('.share-link');
        linkInput.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
        }, 2000);
    });
    
    const shareOptions = shareModal.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', () => {
            const platform = option.dataset.platform;
            shareToPlatform(platform, shareLink);
        });
    });
}

// Generate a random share ID
function generateShareId() {
    return Math.random().toString(36).substring(2, 10);
}

// Share to different platforms
function shareToplatform(platform, link) {
    switch(platform) {
        case 'email':
            window.open(`mailto:?subject=Check out my Japan 2025 itinerary&body=Here's my travel plan: ${link}`);
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=Check out my Japan 2025 itinerary: ${link}`);
            break;
        case 'telegram':
            window.open(`https://t.me/share/url?url=${link}&text=Check out my Japan 2025 itinerary`);
            break;
    }
}

// Checklist functionality
function openChecklist() {
    console.log('Opening checklist');
    
    const checklistModal = document.createElement('div');
    checklistModal.classList.add('checklist-modal');
    checklistModal.innerHTML = `
        <div class="checklist-modal-content">
            <span class="close-btn">&times;</span>
            <h2>Japan 2025 Checklist</h2>
            <div class="checklist-items">
                <div class="checklist-item">
                    <input type="checkbox" id="passport">
                    <label for="passport">Passport & Travel Documents</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="currency">
                    <label for="currency">Japanese Yen / Credit Cards</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="adapter">
                    <label for="adapter">Power Adapter</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="jrpass">
                    <label for="jrpass">Japan Rail Pass</label>
                </div>
                <div class="checklist-item">
                    <input type="checkbox" id="portable-wifi">
                    <label for="portable-wifi">Portable WiFi / SIM Card</label>
                </div>
            </div>
            <button class="add-item-btn">+ Add Item</button>
        </div>
    `;
    
    document.body.appendChild(checklistModal);
    
    // Add event listeners
    const closeBtn = checklistModal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(checklistModal);
    });
    
    const addItemBtn = checklistModal.querySelector('.add-item-btn');
    addItemBtn.addEventListener('click', addChecklistItem);
    
    // Load saved checklist items
    loadChecklistItems();
}

// Add new checklist item
function addChecklistItem() {
    const checklistItems = document.querySelector('.checklist-items');
    const newItem = document.createElement('div');
    newItem.classList.add('checklist-item', 'new-item');
    
    const itemId = 'item-' + Date.now();
    newItem.innerHTML = `
        <input type="checkbox" id="${itemId}">
        <input type="text" class="item-input" placeholder="New item">
        <button class="save-item-btn">Save</button>
    `;
    
    checklistItems.appendChild(newItem);
    
    const itemInput = newItem.querySelector('.item-input');
    itemInput.focus();
    
    const saveBtn = newItem.querySelector('.save-item-btn');
    saveBtn.addEventListener('click', () => {
        const inputValue = itemInput.value.trim();
        if (inputValue) {
            newItem.classList.remove('new-item');
            newItem.innerHTML = `
                <input type="checkbox" id="${itemId}">
                <label for="${itemId}">${inputValue}</label>
            `;
            
            // Save to local storage
            saveChecklistItems();
        } else {
            checklistItems.removeChild(newItem);
        }
    });
}

// Save checklist items to local storage
function saveChecklistItems() {
    const items = [];
    const checklistItems = document.querySelectorAll('.checklist-item:not(.new-item)');
    
    checklistItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const label = item.querySelector('label');
        
        items.push({
            id: checkbox.id,
            text: label.textContent,
            checked: checkbox.checked
        });
    });
    
    localStorage.setItem('japan2025Checklist', JSON.stringify(items));
}

// Load checklist items from local storage
function loadChecklistItems() {
    const savedItems = localStorage.getItem('japan2025Checklist');
    
    if (savedItems) {
        const items = JSON.parse(savedItems);
        const checklistItems = document.querySelector('.checklist-items');
        
        items.forEach(item => {
            if (!document.getElementById(item.id)) {
                const itemElement = document.createElement('div');
                itemElement.classList.add('checklist-item');
                itemElement.innerHTML = `
                    <input type="checkbox" id="${item.id}" ${item.checked ? 'checked' : ''}>
                    <label for="${item.id}">${item.text}</label>
                `;
                
                checklistItems.appendChild(itemElement);
                
                // Add change listener
                const checkbox = itemElement.querySelector('input[type="checkbox"]');
                checkbox.addEventListener('change', saveChecklistItems);
            }
        });
    }
}

// Timeline functionality
function initializeTimeline() {
    // Calculate total trip duration and distance between points
    updateTimelineDuration();
    
    // Make timeline items draggable for reordering
    makeTimelineItemsDraggable();
}

// Update timeline duration calculations
function updateTimelineDuration() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    let totalDuration = 0;
    
    for (let i = 0; i < timelineItems.length - 1; i++) {
        const currentTime = parseTimeString(timelineItems[i].querySelector('.time').textContent);
        const nextTime = parseTimeString(timelineItems[i + 1].querySelector('.time').textContent);
        
        const durationMinutes = (nextTime - currentTime) / (1000 * 60);
        totalDuration += durationMinutes;
    }
    
    // Update the total duration display if it exists
    const durationDisplay = document.querySelector('.total-duration');
    if (durationDisplay) {
        const hours = Math.floor(totalDuration / 60);
        const minutes = Math.round(totalDuration % 60);
        durationDisplay.textContent = `${hours}h ${minutes}m`;
    }
}

// Parse time string to Date object
function parseTimeString(timeStr) {
    // Assuming format like "3:15PM"
    const [time, period] = timeStr.split(/([AP]M)/i);
    let [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    
    if (period.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
    }
    
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Make timeline items draggable
function makeTimelineItemsDraggable() {
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (!timelineContainer) return;
    
    let draggedItem = null;
    
    // Add event listeners to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.setAttribute('draggable', 'true');
        
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            setTimeout(() => {
                item.classList.add('dragging');
            }, 0);
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            draggedItem = null;
            
            // Update timeline after reordering
            updateTimelineDuration();
            updateTimelineConnectors();
        });
    });
    
    // Add event listeners to timeline container
    timelineContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(timelineContainer, e.clientY);
        
        if (afterElement == null) {
            timelineContainer.appendChild(draggedItem);
        } else {
            timelineContainer.insertBefore(draggedItem, afterElement);
        }
    });
}

// Helper function to determine where to place dragged element
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.timeline-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Update timeline connectors (arrows between items)
function updateTimelineConnectors() {
    // Remove existing connectors
    const oldConnectors = document.querySelectorAll('.timeline-connector');
    oldConnectors.forEach(connector => connector.remove());
    
    // Add new connectors
    const timelineItems = document.querySelectorAll('.timeline-item');
    for (let i = 0; i < timelineItems.length - 1; i++) {
        const currentItem = timelineItems[i];
        const nextItem = timelineItems[i + 1];
        
        const connector = document.createElement('div');
        connector.classList.add('timeline-connector');
        
        // Calculate position and rotation
        const currentRect = currentItem.getBoundingClientRect();
        const nextRect = nextItem.getBoundingClientRect();
        
        const startX = currentRect.left + currentRect.width / 2;
        const startY = currentRect.bottom;
        const endX = nextRect.left + nextRect.width / 2;
        const endY = nextRect.top;
        
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        connector.style.width = `${length}px`;
        connector.style.transformOrigin = '0 0';
        connector.style.transform = `translate(${startX}px, ${startY}px) rotate(${angle}deg)`;
        
        document.body.appendChild(connector);
    }
}

// Edit timeline item
function editTimelineItem(item) {
    console.log('Editing timeline item:', item);
    
    const itemTitle = item.querySelector('.item-title').textContent;
    const itemTime = item.querySelector('.time').textContent;
    const itemCost = item.querySelector('.cost').textContent.replace('$', '');
    
    const modal = document.createElement('div');
    modal.classList.add('edit-item-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <h2>Edit Activity</h2>
            <form id="edit-item-form">
                <div class="form-group">
                    <label for="item-title">Activity:</label>
                    <input type="text" id="item-title" value="${itemTitle}">
                </div>
                <div class="form-group">
                    <label for="item-time">Time:</label>
                    <input type="text" id="item-time" value="${itemTime}">
                </div>
                <div class="form-group">
                    <label for="item-cost">Cost ($):</label>
                    <input type="number" id="item-cost" value="${itemCost}" step="0.01">
                </div>
                <div class="form-group">
                    <label for="item-icon">Icon:</label>
                    <select id="item-icon">
                        <option value="home">Home</option>
                        <option value="car">Car/Taxi</option>
                        <option value="plane">Airplane</option>
                        <option value="train">Train</option>
                        <option value="hotel">Hotel</option>
                        <option value="food">Restaurant</option>
                        <option value="attraction">Attraction</option>
                    </select>
                </div>
                <div class="form-buttons">
                    <button type="submit" class="save-btn">Save Changes</button>
                    <button type="button" class="delete-btn">Delete Activity</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set the correct icon option
    const iconSelect = modal.querySelector('#item-icon');
    // You would need to determine which icon is currently used and select it
    
    // Add event listeners
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    const deleteBtn = modal.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this activity?')) {
            item.remove();
            document.body.removeChild(modal);
            updateTimelineDuration();
            updateTimelineConnectors();
        }
    });
    
    const form = modal.querySelector('#edit-item-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Update the item with new values
        item.querySelector('.item-title').textContent = document.querySelector('#item-title').value;
        item.querySelector('.time').textContent = document.querySelector('#item-time').value;
        item.querySelector('.cost').textContent = '$' + document.querySelector('#item-cost').value;
        
        // Update icon based on selection
        const selectedIcon = document.querySelector('#item-icon').value;
        // You would need to implement icon changing logic here
        
        document.body.removeChild(modal);
        updateTimelineDuration();
    });
}

// Add new timeline item
function addTimelineItem() {
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (!timelineContainer) return;
    
    const newItem = document.createElement('div');
    newItem.classList.add('timeline-item');
    
    // Set default time based on last item or current time
    const timelineItems = document.querySelectorAll('.timeline-item');
    let defaultTime = '12:00PM';
    
    if (timelineItems.length > 0) {
        const lastItem = timelineItems[timelineItems.length - 1];
        const lastTime = lastItem.querySelector('.time').textContent;
        defaultTime = incrementTime(lastTime, 30); // Add 30 minutes
    }
    
    newItem.innerHTML = `
        <div class="item-icon">
            <i class="fa fa-map-marker"></i>
        </div>
        <div class="item-details">
            <div class="item-title">New Activity</div>
            <div class="time">${defaultTime}</div>
            <div class="cost">$0.00</div>
        </div>
    `;
    
    timelineContainer.appendChild(newItem);
    
    // Add event listeners
    newItem.addEventListener('click', () => editTimelineItem(newItem));
    
    // Make it draggable
    newItem.setAttribute('draggable', 'true');
    newItem.addEventListener('dragstart', (e) => {
        draggedItem = newItem;
        setTimeout(() => {
            newItem.classList.add('dragging');
        }, 0);
    });
    
    newItem.addEventListener('dragend', () => {
        newItem.classList.remove('dragging');
        draggedItem = null;
        
        updateTimelineDuration();
        updateTimelineConnectors();
    });
    
    // Update timeline
    updateTimelineDuration();
    updateTimelineConnectors();
    
    // Open edit modal immediately
    editTimelineItem(newItem);
}

// Increment time by specified minutes
function incrementTime(timeStr, minutesToAdd) {
    const time = parseTimeString(timeStr);
    time.setMinutes(time.getMinutes() + minutesToAdd);
    
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const isPM = hours >= 12;
    
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}${isPM ? 'PM' : 'AM'}`;
}

// Navigation functions
function openSocialPage() {
    console.log('Opening social page');
    // Implementation for social page navigation
}

function openProfile() {
    console.log('Opening profile page');
    // Implementation for profile page navigation
}

function goToHome() {
    console.log('Going to home page');
    // Implementation for home page navigation
}

// Function to add "Add Activity" button to timeline
function addActivityButton() {
    const timelineContainer = document.querySelector('.timeline-container');
    
    if (!timelineContainer) return;
    
    const addButton = document.createElement('button');
    addButton.classList.add('add-activity-btn');
    addButton.textContent = '+ Add Activity';
    addButton.addEventListener('click', addTimelineItem);
    
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('add-button-container');
    buttonContainer.appendChild(addButton);
    
    // Insert after timeline container
    timelineContainer.parentNode.insertBefore(buttonContainer, timelineContainer.nextSibling);
}

// Initialize the "Add Activity" button when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addActivityButton();
});