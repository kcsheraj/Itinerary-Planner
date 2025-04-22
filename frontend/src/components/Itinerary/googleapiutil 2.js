/**
 * Google Maps Place Picker Utilities
 * Updated to use PlaceAutocompleteElement as recommended by Google
 */

// Function to load the Google Maps API script with proper async loading
export const loadGoogleMapsAPI = (apiKey, callback) => {
  // Global flags to prevent multiple loading
  window._googleMapsCallbacks = window._googleMapsCallbacks || [];
  
  // If already loaded, just call the callback
  if (window.google && window.google.maps) {
    if (callback) callback();
    return;
  }
  
  // Add this callback to the queue
  if (callback) {
    window._googleMapsCallbacks.push(callback);
  }
  
  // Define the callback that will be called when the API loads
  window.initGoogleMaps = () => {
    // Call all queued callbacks
    const callbacks = window._googleMapsCallbacks;
    window._googleMapsCallbacks = [];
    for (const cb of callbacks) {
      if (cb) cb();
    }
  };
  
  // Check if script already exists
  const existingScript = document.getElementById('google-maps-api');
  if (existingScript) {
    return; // Script tag already exists, callbacks will be executed when it loads
  }
  
  // Create script element with proper async loading
  const script = document.createElement('script');
  script.id = 'google-maps-api';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps&loading=async`;
  script.async = true;
  script.defer = true;
  
  // Add script to head
  document.head.appendChild(script);
};

// Function to initialize a Google Map with a marker
export const initializeMap = (mapElement, options = {}) => {
  if (!mapElement || !window.google || !window.google.maps) return null;
  
  const defaultOptions = {
    center: { lat: 37.7749, lng: -122.4194 }, // Default: San Francisco
    zoom: 13,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true
  };
  
  const mapOptions = { ...defaultOptions, ...options };
  
  try {
    const map = new window.google.maps.Map(mapElement, mapOptions);
    
    // Create a marker at the center point
    const marker = new window.google.maps.Marker({
      position: mapOptions.center,
      map: map,
      draggable: options.draggableMarker || false
    });
    
    return { map, marker };
  } catch (error) {
    console.error("Error initializing map:", error);
    return null;
  }
};

// Create a simple bridge between the new PlaceAutocompleteElement API and existing code
export const initPlacesAutocomplete = (inputElement, options = {}) => {
  if (!inputElement || !window.google || !window.google.maps || !window.google.maps.places) {
    console.error("Google Maps Places API not available");
    return null;
  }
  
  try {
    console.log("Setting up the Places API integration");
    
    // We'll create a wrapper that mimics the Autocomplete API
    const autocompleteWrapper = {
      _listeners: [],
      _placeData: null,
      
      // Get the selected place
      getPlace: function() {
        return this._placeData;
      },
      
      // Add a listener for the place_changed event
      addListener: function(eventName, callback) {
        if (eventName === 'place_changed') {
          this._listeners.push(callback);
        }
      },
      
      // Trigger the place_changed event
      _triggerPlaceChanged: function() {
        for (const listener of this._listeners) {
          listener();
        }
      }
    };
    
    // Create a hidden div for the PlacesService
    const placesServiceDiv = document.createElement('div');
    placesServiceDiv.style.display = 'none';
    document.body.appendChild(placesServiceDiv);
    
    // Create a PlacesService for getting place details
    const placesService = new window.google.maps.places.PlacesService(placesServiceDiv);
    
    // Add the normal autocomplete behavior using browser's datalist
    const datalistId = `places-autocomplete-${Math.random().toString(36).substr(2, 9)}`;
    const datalist = document.createElement('datalist');
    datalist.id = datalistId;
    inputElement.setAttribute('list', datalistId);
    inputElement.parentNode.appendChild(datalist);
    
    // Create an invisible span for the sessiontoken
    const sessionTokenContainer = document.createElement('span');
    sessionTokenContainer.style.display = 'none';
    sessionTokenContainer.id = 'session-token-container';
    inputElement.parentNode.appendChild(sessionTokenContainer);
    
    // Generate a new session token for autocomplete
    let sessionToken = new window.google.maps.places.AutocompleteSessionToken();
    
    // Handle input changes
    let timeoutId = null;
    inputElement.addEventListener('input', () => {
      // Clear previous timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      const query = inputElement.value.trim();
      if (query.length < 3) {
        return;
      }
      
      // Debounce the API calls
      timeoutId = setTimeout(() => {
        // Clear existing options
        datalist.innerHTML = '';
        
        // Get place predictions
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions({
          input: query,
          sessionToken: sessionToken,
          types: options.types || ['address']
        }, (predictions, status) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !predictions) {
            return;
          }
          
          // Add options to datalist
          for (const prediction of predictions) {
            const option = document.createElement('option');
            option.value = prediction.description;
            option.setAttribute('data-place-id', prediction.place_id);
            datalist.appendChild(option);
          }
        });
      }, 300);
    });
    
    // Handle selection
    inputElement.addEventListener('change', () => {
      const selectedValue = inputElement.value;
      
      // Find the corresponding option to get the place_id
      let selectedPlaceId = null;
      for (const option of datalist.options) {
        if (option.value === selectedValue) {
          selectedPlaceId = option.getAttribute('data-place-id');
          break;
        }
      }
      
      if (!selectedPlaceId) {
        // Try to find a place by geocoding the entered address
        geocodeAddress(selectedValue, (result) => {
          if (result) {
            autocompleteWrapper._placeData = result;
            autocompleteWrapper._triggerPlaceChanged();
          }
        });
        return;
      }
      
      // Get place details
      placesService.getDetails({
        placeId: selectedPlaceId,
        fields: ['formatted_address', 'geometry', 'name', 'address_components'],
        sessionToken: sessionToken
      }, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          // Store the place data
          autocompleteWrapper._placeData = place;
          
          // Trigger the place_changed event
          autocompleteWrapper._triggerPlaceChanged();
          
          // Generate a new session token for the next search
          sessionToken = new window.google.maps.places.AutocompleteSessionToken();
        }
      });
    });
    
    return autocompleteWrapper;
  } catch (error) {
    console.error("Error initializing Places Autocomplete:", error);
    return null;
  }
};

// Update map with place details
export const updateMapWithPlace = (map, marker, place) => {
  if (!map || !marker || !place || !place.geometry) return;
  
  try {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    
    marker.setPosition(place.geometry.location);
  } catch (error) {
    console.error("Error updating map with place:", error);
  }
};

// Geocode an address to get coordinates
export const geocodeAddress = (address, callback) => {
  if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
    if (callback) callback(null, 'Google Maps API not loaded');
    return;
  }
  
  try {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        if (callback) callback(results[0], null);
      } else {
        if (callback) callback(null, `Geocoding failed: ${status}`);
      }
    });
  } catch (error) {
    console.error("Error geocoding address:", error);
    if (callback) callback(null, `Geocoding error: ${error.message}`);
  }
};

// Extract address components in a structured format
export const extractAddressComponents = (place) => {
  if (!place || !place.address_components) return {};
  
  const addressComponents = {};
  const componentMapping = {
    street_number: 'streetNumber',
    route: 'street',
    locality: 'city',
    administrative_area_level_1: 'state',
    country: 'country',
    postal_code: 'postalCode'
  };
  
  place.address_components.forEach(component => {
    const type = component.types[0];
    if (componentMapping[type]) {
      addressComponents[componentMapping[type]] = component.long_name;
    }
  });
  
  return addressComponents;
};