/**
 * Google Maps Place Picker Utilities
 * Updated to use PlacesAutocomplete with dropdown UI
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

// Updated initialization function for Places Autocomplete
export const initPlacesAutocomplete = (inputElement, options = {}) => {
  if (!inputElement || !window.google || !window.google.maps || !window.google.maps.places) {
    console.error("Google Maps Places API not available");
    return null;
  }
  
  try {
    console.log("Setting up Google Places Autocomplete");
    
    // Create the autocomplete object
    const autocompleteOptions = {
      types: options.types || ['geocode', 'establishment'],
      fields: ['place_id', 'formatted_address', 'geometry', 'name', 'address_components'],
    };
    
    // If bounds are provided, add them to the options
    if (options.bounds) {
      autocompleteOptions.bounds = options.bounds;
    }
    
    // Create the proper Google Places Autocomplete with dropdown
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputElement,
      autocompleteOptions
    );
    
    // Set the country restriction if provided
    if (options.countries && options.countries.length) {
      autocomplete.setComponentRestrictions({
        country: options.countries
      });
    }
    
    // Fix for invisible text issue - preserve original value
    const originalValue = inputElement.value;
    
    // Add event listener to ensure text remains visible
    inputElement.addEventListener('blur', () => {
      // Sometimes autocomplete clears the input value, restore it if needed
      if (!inputElement.value && originalValue) {
        setTimeout(() => {
          if (!inputElement.value) {
            inputElement.value = originalValue;
          }
        }, 100);
      }
    });
    
    // Add custom behavior to handle focus/blur events
    inputElement.addEventListener('focus', () => {
      // Add a class we can style when focused
      inputElement.classList.add('pac-active');
    });
    
    // Fix for Google's CSS overriding input color
    const observer = new MutationObserver((mutations) => {
      // When autocomplete dropdown appears or changes
      const pacContainers = document.querySelectorAll('.pac-container');
      if (pacContainers.length > 0) {
        // Make sure our text is still visible
        inputElement.style.color = '#000';
        inputElement.style.backgroundColor = '#fff';
      }
    });
    
    // Observe the body for added/removed pac-container elements
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    return autocomplete;
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