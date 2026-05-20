import { useState, useCallback, useRef, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from "@react-google-maps/api";
import { useTranslation } from "react-i18next";
import facilitiesData from "../data/facilitiesData";
import "./booking.css";

const MAPS_API_KEY = "AIzaSyCoQrUXoCZwiVC4Y32s0KTMlqtvSjtHXHE";
const TAMPINES_CENTER = { lat: 1.3521, lng: 103.9442 };

const FILTER_KEYS = ["all", "healthcare", "bbq", "community", "courses", "sports"];
const FILTER_EN = ["All", "Healthcare", "BBQ", "Community", "Courses", "Sports"];

const SPORT_KEYS = ["allSports", "badminton", "basketball", "swimming", "futsal", "soccer"];
const SPORT_EN = ["All Sports", "Badminton", "Basketball", "Swimming", "Futsal", "Soccer"];

const COURSE_KEYS = ["allCourses", "arts", "dance", "kids"];
const COURSE_EN = ["All Courses", "Arts", "Dance", "Kids"];

const LIBRARIES = ["places"];

const langMap = { en: "en", ms: "ms", zh: "zh-CN", ta: "ta" };
const currentLang = langMap[localStorage.getItem("i18nextLng") || "en"] || "en";

const CATEGORY_CLASS = {
  Sports: "sports",
  Community: "community",
  BBQ: "bbq",
  Courses: "courses",
  Healthcare: "healthcare",
};

const CATEGORY_ICON = {
  Sports: "⚽",
  Community: "🏛️",
  BBQ: "🔥",
  Courses: "📚",
  Healthcare: "🏥",
};

const CATEGORY_MARKER = {
  Sports: "red",
  Community: "blue",
  BBQ: "orange",
  Courses: "purple",
  Healthcare: "green",
};

const LEGEND_ITEMS = [
  { key: "healthcare", color: "#16a34a" },
  { key: "sports", color: "#B81C1D" },
  { key: "bbq", color: "#ea580c" },
  { key: "community", color: "#1e3a6e" },
  { key: "courses", color: "#2563eb" },
];

function getCategoryMarkerUrl(category) {
  const color = CATEGORY_MARKER[category] || "red";
  return `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`;
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export default function BookingPage() {
  const { t, i18n } = useTranslation();

  const tFacility = (id, field, fallback) => {
    const key = `booking.facilityDetails.${id}.${field}`;
    const translated = t(key);
    return translated === key ? fallback : translated;
  };

  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSport, setActiveSport] = useState("All Sports");
  const [activeCourse, setActiveCourse] = useState("All Courses");

  const [selectedFacility, setSelectedFacility] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [liveLocation, setLiveLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [sortedFacilities, setSortedFacilities] = useState(facilitiesData);
  const [directions, setDirections] = useState(null);
  const [directionsError, setDirectionsError] = useState("");
  const [travelMode, setTravelMode] = useState("WALKING");
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: LIBRARIES,
    language: currentLang,
  });

  useEffect(() => {
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  useEffect(() => {
    const savedLoc = sessionStorage.getItem("savedUserLocation");
    const savedFilter = sessionStorage.getItem("savedFilter");
    const savedSport = sessionStorage.getItem("savedSport");
    const savedCourse = sessionStorage.getItem("savedCourse");
    const savedFacility = sessionStorage.getItem("savedFacility");

    if (savedLoc) { const loc = JSON.parse(savedLoc); setUserLocation(loc); sortByDistance(loc); sessionStorage.removeItem("savedUserLocation"); }
    if (savedFilter) { setActiveFilter(savedFilter); sessionStorage.removeItem("savedFilter"); }
    if (savedSport) { setActiveSport(savedSport); sessionStorage.removeItem("savedSport"); }
    if (savedCourse) { setActiveCourse(savedCourse); sessionStorage.removeItem("savedCourse"); }
    if (savedFacility) { setSelectedFacility(JSON.parse(savedFacility)); sessionStorage.removeItem("savedFacility"); }
  }, []);

  useEffect(() => {
    const prevLang = sessionStorage.getItem("mapLang");
    const newLang = i18n.language;

    if (prevLang && prevLang !== newLang) {
      if (userLocation) sessionStorage.setItem("savedUserLocation", JSON.stringify(userLocation));
      sessionStorage.setItem("savedFilter", activeFilter);
      sessionStorage.setItem("savedSport", activeSport);
      sessionStorage.setItem("savedCourse", activeCourse);
      if (selectedFacility) sessionStorage.setItem("savedFacility", JSON.stringify(selectedFacility));
      sessionStorage.setItem("mapLang", newLang);
      window.location.reload();
    } else {
      sessionStorage.setItem("mapLang", newLang);
    }
  }, [i18n.language]);

  const filteredFacilities = (() => {
    let results = activeFilter === "All"
      ? sortedFacilities
      : sortedFacilities.filter((f) => f.filter === activeFilter);

    if (activeFilter === "Sports" && activeSport !== "All Sports")
      results = results.filter((f) => f.sport === activeSport);

    if (activeFilter === "Courses" && activeCourse !== "All Courses")
      results = results.filter((f) => f.courseType === activeCourse || f.filter === activeCourse);

    return results;
  })();

  const handleGetLocation = () => {
    if (!navigator.geolocation) { setLocationError(t("booking.locationError")); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        setLocationError("");
        sortByDistance(loc);
        if (mapRef.current) { mapRef.current.panTo(loc); mapRef.current.setZoom(14); }
      },
      () => setLocationError(t("booking.locationError"))
    );
  };

  const handleStartTracking = () => {
    if (!navigator.geolocation) return;
    setIsTracking(true);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLiveLocation(loc);
        setUserLocation(loc);

        if (directions && selectedFacility) {
          const steps = directions.routes[selectedRouteIndex].legs[0].steps;
          if (currentStepIndex < steps.length - 1) {
            const nextStep = steps[currentStepIndex + 1];
            const distToNext = haversineDistance(loc.lat, loc.lng, nextStep.start_location.lat(), nextStep.start_location.lng());
            if (distToNext < 0.03) { setCurrentStepIndex((prev) => prev + 1); setShowSteps(true); }
          }
          handleGetDirections(selectedFacility, travelMode, loc);
        }

        if (mapRef.current) mapRef.current.panTo(loc);
      },
      () => setLocationError(t("booking.locationError")),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const handleStopTracking = () => {
    if (watchIdRef.current) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
    setIsTracking(false);
    setLiveLocation(null);
  };

  const sortByDistance = (loc) => {
    const sorted = [...facilitiesData].sort((a, b) =>
      haversineDistance(loc.lat, loc.lng, a.lat, a.lng) - haversineDistance(loc.lat, loc.lng, b.lat, b.lng)
    );
    setSortedFacilities(sorted);
  };

  const handleManualSearch = async () => {
    if (!manualAddress.trim()) return;
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: manualAddress + ", Singapore" }, (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
          setUserLocation(loc);
          setLocationError("");
          sortByDistance(loc);
          if (mapRef.current) { mapRef.current.panTo(loc); mapRef.current.setZoom(14); }
        } else {
          setLocationError(t("booking.addressNotFound"));
        }
      });
    } catch {
      setLocationError(t("booking.errorFindingAddress"));
    }
  };

  const handleGetDirections = (facility, mode = travelMode, origin = userLocation) => {
    if (!origin) { setDirectionsError(t("booking.noLocationForDirections")); return; }
    setDirectionsError("");

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      { origin, destination: { lat: facility.lat, lng: facility.lng }, travelMode: window.google.maps.TravelMode[mode], provideRouteAlternatives: true },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
          setSelectedRouteIndex(0);
          setCurrentStepIndex(0);
          if (mapRef.current) {
            const bounds = new window.google.maps.LatLngBounds();
            result.routes[0].legs[0].steps.forEach((step) => { bounds.extend(step.start_location); bounds.extend(step.end_location); });
            mapRef.current.fitBounds(bounds, { padding: 60 });
          }
        } else {
          setDirectionsError(t("booking.couldNotGetDirections"));
        }
      }
    );
  };

  const clearDirections = () => {
    setDirections(null);
    setDirectionsError("");
    setShowSteps(false);
    setSelectedRouteIndex(0);
    setCurrentStepIndex(0);
  };

  const onMapLoad = useCallback((map) => { mapRef.current = map; }, []);

  if (!isLoaded) {
    return (
      <div className="booking-loading">
        <div className="booking-spinner"></div>
        <p>{t("booking.loadingMap")}</p>
      </div>
    );
  }

  const currentRoute = directions?.routes[selectedRouteIndex];
  const catClass = (filter) => CATEGORY_CLASS[filter] || "sports";

  return (
    <div className="booking-layout">
      <div className="booking-content">

        <div className="booking-sidebar">

          <div className="booking-sidebar-header">
            <p className="booking-eyebrow">{t("booking.eyebrow")}</p>
            <h1 className="booking-title">{t("booking.title")}</h1>
            <span className="booking-header-pill">{t("booking.pill")}</span>
          </div>

          <div className="booking-location-card">
            <p className="booking-section-title">{t("booking.yourLocation")}</p>

            <button className="booking-location-btn" onClick={handleGetLocation}>
              {t("booking.useMyLocation")}
            </button>

            <div className="booking-divider">{t("booking.or")}</div>

            <div className="booking-address-row">
              <input
                className="booking-address-input"
                type="text"
                placeholder={t("booking.addressPlaceholder")}
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              />
              <button className="booking-search-btn" onClick={handleManualSearch}>
                {t("booking.go")}
              </button>
            </div>

            {locationError && <p className="booking-error">{locationError}</p>}
            {userLocation && <p className="booking-success">{t("booking.locationSuccess")}</p>}
          </div>

          <div className="booking-filters">
            <p className="booking-section-title">{t("booking.filterByType")}</p>
            <div className="booking-filter-buttons">
              {FILTER_KEYS.map((key, i) => (
                <button
                  key={key}
                  className={`booking-filter-btn ${activeFilter === FILTER_EN[i] ? "active" : ""}`}
                  onClick={() => { setActiveFilter(FILTER_EN[i]); setActiveSport("All Sports"); setActiveCourse("All Courses"); }}
                >
                  {t(`booking.filters.${key}`)}
                </button>
              ))}
            </div>

            {activeFilter === "Sports" && (
              <div className="booking-subfilter">
                <p className="booking-section-title" style={{ marginTop: "10px" }}>{t("booking.sportType")}</p>
                <div className="booking-filter-buttons">
                  {SPORT_KEYS.map((key, i) => (
                    <button
                      key={key}
                      className={`booking-filter-btn ${activeSport === SPORT_EN[i] ? "active" : ""}`}
                      onClick={() => setActiveSport(SPORT_EN[i])}
                    >
                      {t(`booking.filters.${key}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeFilter === "Courses" && (
              <div className="booking-subfilter">
                <p className="booking-section-title" style={{ marginTop: "10px" }}>{t("booking.courseType")}</p>
                <div className="booking-filter-buttons">
                  {COURSE_KEYS.map((key, i) => (
                    <button
                      key={key}
                      className={`booking-filter-btn ${activeCourse === COURSE_EN[i] ? "active" : ""}`}
                      onClick={() => setActiveCourse(COURSE_EN[i])}
                    >
                      {t(`booking.filters.${key}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {directions && currentRoute && (
            <div className="booking-directions-panel">
              <div className="booking-directions-header">
                <p className="booking-section-title">{t("booking.directions")}</p>
                <button className="booking-clear-btn" onClick={clearDirections}>
                  {t("booking.clearDirections")}
                </button>
              </div>

              <div className="booking-travel-modes">
                {["WALKING", "DRIVING", "TRANSIT"].map((mode) => (
                  <button
                    key={mode}
                    className={`booking-travel-btn ${travelMode === mode ? "active" : ""}`}
                    onClick={() => { setTravelMode(mode); if (selectedFacility) handleGetDirections(selectedFacility, mode); }}
                  >
                    {mode === "WALKING" ? "🚶" : mode === "DRIVING" ? "🚗" : "🚌"}
                    <span>{t(`booking.${mode.toLowerCase()}`)}</span>
                  </button>
                ))}
              </div>

              {directions.routes.length > 1 && (
                <div className="booking-alt-routes">
                  <p className="booking-section-title">{t("booking.routeOptions")}</p>
                  {directions.routes.map((route, index) => (
                    <button
                      key={index}
                      className={`booking-route-option ${selectedRouteIndex === index ? "active" : ""}`}
                      onClick={() => setSelectedRouteIndex(index)}
                    >
                      <span className="booking-route-label">
                        {index === 0 ? t("booking.fastest") : index === 1 ? t("booking.alternative") : t("booking.scenic")}
                      </span>
                      <span className="booking-route-info">
                        {route.legs[0].duration.text} • {route.legs[0].distance.text}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="booking-directions-summary">
                <p>📍 {currentRoute.legs[0].start_address.split(",")[0]}</p>
                <p>🏁 {currentRoute.legs[0].end_address.split(",")[0]}</p>
                <p className="booking-directions-distance">
                  🕐 {currentRoute.legs[0].duration.text} &nbsp;•&nbsp; 📏 {currentRoute.legs[0].distance.text}
                </p>
              </div>

              <button
                className={`booking-track-btn ${isTracking ? "active" : ""}`}
                onClick={isTracking ? handleStopTracking : handleStartTracking}
              >
                {isTracking ? t("booking.stopNavigation") : t("booking.startNavigation")}
              </button>

              {isTracking && <p className="booking-tracking-label">{t("booking.liveNavigationActive")}</p>}

              <button className="booking-steps-toggle" onClick={() => setShowSteps(!showSteps)}>
                {showSteps ? t("booking.hideSteps") : t("booking.showSteps")}
              </button>

              {showSteps && (
                <div className="booking-steps-list">
                  {currentRoute.legs[0].steps.map((step, index) => (
                    <div
                      key={index}
                      className={`booking-step ${index === currentStepIndex ? "active-step" : ""} ${index < currentStepIndex ? "completed-step" : ""}`}
                    >
                      <span className="booking-step-num">{index < currentStepIndex ? "✓" : index + 1}</span>
                      <div className="booking-step-content">
                        <p>{stripHtml(step.instructions)}</p>
                        <span>{step.distance.text}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {directionsError && (
            <div className="booking-location-card">
              <p className="booking-error">{directionsError}</p>
            </div>
          )}

          {!directions &&
            <div className="booking-list">
              <div className="booking-list-header">
                <p className="booking-section-title">
                  {t("booking.facilities")}
                  <span className="booking-count-pill">{filteredFacilities.length}</span>
                </p>
              </div>

              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className={`booking-list-item ${selectedFacility?.id === facility.id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedFacility(facility);
                    clearDirections();
                    if (mapRef.current) { mapRef.current.panTo({ lat: facility.lat, lng: facility.lng }); mapRef.current.setZoom(16); }
                  }}
                >

                  <div className={`booking-list-icon ${catClass(facility.filter)}`}>
                    {CATEGORY_ICON[facility.filter] || "📍"}
                  </div>

                  <div className="booking-list-body">
                    <div className="booking-list-item-header">
                      <span className={`booking-list-badge ${catClass(facility.filter)}`}>
                        {t(`booking.filters.${facility.filter.toLowerCase()}`)}
                      </span>
                      {userLocation && (
                        <span className="booking-list-distance">
                          {haversineDistance(userLocation.lat, userLocation.lng, facility.lat, facility.lng).toFixed(1)} km
                        </span>
                      )}
                    </div>
                    <p className="booking-list-name">{facility.name}</p>
                    <p className="booking-list-address">{facility.address}</p>
                  </div>
                </div>
              ))}
            </div>}
        </div>

        <div className="booking-map-container">
          <GoogleMap
            mapContainerClassName="booking-map"
            center={TAMPINES_CENTER}
            zoom={14}
            onLoad={onMapLoad}
            options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
          >
            {userLocation && !liveLocation && !directions && (
              <Marker
                position={userLocation}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                title={t("booking.yourLocation")}
              />
            )}

            {liveLocation && (
              <Marker
                position={liveLocation}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
                title={t("booking.liveTrackingActive")}
              />
            )}

            {!directions && filteredFacilities.map((facility) => (
              <Marker
                key={facility.id}
                position={{ lat: facility.lat, lng: facility.lng }}
                onClick={() => setSelectedFacility(facility)}
                title={facility.name}
                icon={{ url: getCategoryMarkerUrl(facility.filter) }}
                animation={window.google.maps.Animation.DROP}
              />
            ))}

            {directions && (
              <DirectionsRenderer
                directions={directions}
                routeIndex={selectedRouteIndex}
                options={{ polylineOptions: { strokeColor: "#B81C1D", strokeWeight: 5 } }}
              />
            )}

            {selectedFacility && !directions && (
              <InfoWindow
                position={{ lat: selectedFacility.lat, lng: selectedFacility.lng }}
                onCloseClick={() => setSelectedFacility(null)}
              >
                <div className="booking-infowindow">
                  {/* Soft-tinted badge */}
                  <span className={`booking-infowindow-badge ${catClass(selectedFacility.filter)}`}>
                    {t(`booking.filters.${selectedFacility.filter.toLowerCase()}`)}
                  </span>

                  <h3>{selectedFacility.name}</h3>

                  <p className="booking-infowindow-address">📍 {selectedFacility.address}</p>

                  <div className="booking-infowindow-divider"></div>

                  <p className="booking-infowindow-desc">{tFacility(selectedFacility.id, "description", selectedFacility.description)}</p>
                  <p className="booking-infowindow-hours">🕐 {tFacility(selectedFacility.id, "openingHours", selectedFacility.openingHours)}</p>
                  <p className="booking-infowindow-req">📋 {tFacility(selectedFacility.id, "requirements", selectedFacility.requirements)}</p>
                  {selectedFacility.cost && (
                    <p className="booking-infowindow-cost">💲 {tFacility(selectedFacility.id, "cost", selectedFacility.cost)}</p>
                  )}

                  <div className="booking-infowindow-actions">
                    <button
                      className="booking-infowindow-directions-btn"
                      onClick={() => handleGetDirections(selectedFacility)}
                    >
                      {t("booking.getDirections")}
                    </button>
                    <a
                      href={selectedFacility.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="booking-infowindow-btn"
                    >
                      {selectedFacility.category === "polyclinic"
                        ? t("booking.viewServices")
                        : `${t("booking.bookVia")} ${selectedFacility.websiteName}`} →
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          <div className="booking-map-legend">
            <div className="booking-legend-title">{t("booking.legend")}</div>
            {LEGEND_ITEMS.map(({ key, color }) => (
              <div key={key} className="booking-legend-item">
                <span className="booking-legend-dot" style={{ background: color }}></span>
                {t(`booking.filters.${key}`)}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}