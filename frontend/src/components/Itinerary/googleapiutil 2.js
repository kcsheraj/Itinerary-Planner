/**
 * Google Maps Place Picker Utilities
 * 
 * This file contains helper functions for working with Google Maps and Places API
 */

// Function to load the Google Maps API script
export const loadGoogleMapsAPI = (apiKey, callback) => {
    // Check if the script is already loaded
    if (window.google && window.google.maps) {
      if (callback) callback();
      return;
    }
  
    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    
    // Define callback function
    window.initGoogleMaps = () => {
      if (callback) callback();
    };
    
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
    const map = new window.google.maps.Map(mapElement, mapOptions);
    
    // Create a marker at the center point
    const marker = new window.google.maps.Marker({
      position: mapOptions.center,
      map: map,
      draggable: options.draggableMarker || false
    });
    
    return { map, marker };
  };
  
  // Initialize Places Autocomplete for an input field
  export const initPlacesAutocomplete = (inputElement, options = {}) => {
    if (!inputElement || !window.google || !window.google.maps || !window.google.maps.places) {
      return null;
    }
    
    const defaultOptions = {
      types: ['address'],
      fields: ['formatted_address', 'geometry', 'name', 'address_components']
    };
    
    const autocompleteOptions = { ...defaultOptions, ...options };
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputElement,
      autocompleteOptions
    );
    
    return autocomplete;
  };
  
  // Update map with place details
  export const updateMapWithPlace = (map, marker, place) => {
    if (!map || !marker || !place || !place.geometry) return;
    
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
    
    marker.setPosition(place.geometry.location);
  };
  
  // Geocode an address to get coordinates
  export const geocodeAddress = (address, callback) => {
    if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
      if (callback) callback(null, 'Google Maps API not loaded');
      return;
    }
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        if (callback) callback(results[0], null);
      } else {
        if (callback) callback(null, `Geocoding failed: ${status}`);
      }
    });
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