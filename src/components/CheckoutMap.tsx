/* eslint-disable @typescript-eslint/no-require-imports */
"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { TbCurrentLocation as LocationIcon } from "react-icons/tb";
import { FiMapPin } from "react-icons/fi";
import "leaflet/dist/leaflet.css";

interface CheckoutMapProps {
  markerPosition: [number, number] | null;
  setMarkerPosition: (pos: [number, number]) => void;
  mapCenter: [number, number] | null;
  setMapCenter: (pos: [number, number]) => void;
  handleCurrentLocation: () => void;
}

// MapFlyTo Sub-component
const MapFlyTo = ({ target }: { target: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(target, 16, { animate: true, duration: 0.8 });
  }, [target[0], target[1], map]);
  return null;
};

export default function CheckoutMap({
  markerPosition,
  setMarkerPosition,
  mapCenter,
  setMapCenter,
  handleCurrentLocation,
}: CheckoutMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [markerIcon, setMarkerIcon] = useState<any>(null);

  useEffect(() => {
    setIsMounted(true);
    const L = require("leaflet");
    const svgPin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:40px;height:40px;filter:drop-shadow(0px 4px 4px rgba(0,0,0,0.3))"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#ffffff"></circle></svg>`;
    const customRedIcon = L.divIcon({
      className: "",
      html: svgPin,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
    setMarkerIcon(customRedIcon);
  }, []);

  // DraggableMarker Sub-component
  const DraggableMarker = () => {
    const markerRef = useRef<any>(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const { lat, lng } = marker.getLatLng();
            setMarkerPosition([lat, lng]);
            setMapCenter([lat, lng]);
            localStorage.setItem(
              "grocio_checkout_location",
              JSON.stringify([lat, lng]),
            );
          }
        },
      }),
      [],
    );

    return markerPosition && markerIcon ? (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={markerPosition}
        ref={markerRef}
        icon={markerIcon}
      />
    ) : null;
  };

  return (
    <div className="relative h-[300px] md:h-[350px] w-full rounded-2xl overflow-hidden border-2 border-gray-100 z-0">
      <button
        type="button"
        onClick={handleCurrentLocation}
        className="absolute bottom-6 right-8 z-[1000] bg-green-600 p-2.5 rounded-full shadow-md border-none hover:bg-green-700 transition-all active:scale-95"
      >
        <LocationIcon size={22} className="text-white" />
      </button>

      {isMounted && markerPosition ? (
        <MapContainer
          center={mapCenter || markerPosition}
          zoom={16}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution="OSM"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker />
          {mapCenter && <MapFlyTo target={mapCenter} />}
        </MapContainer>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-3">
          <div className="w-8 h-8 border-4 border-[#00a850] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading map...</span>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-[11px] md:text-xs font-medium shadow-lg z-[1000] flex items-center gap-2 pointer-events-none whitespace-nowrap">
        <FiMapPin className="text-red-400" /> Drag the red pin to exact location
      </div>
    </div>
  );
}
