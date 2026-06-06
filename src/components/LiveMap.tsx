import L, { LatLngExpression } from "leaflet";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface ILocation {
  latitude: number;
  longitude: number;
}
interface Iprops {
  userLocation: ILocation;
  deliveryBoyLocation: ILocation;
}

// ✅ Map center কে live update করার জন্য
const MapUpdater = ({
  deliveryBoyLocation,
}: {
  deliveryBoyLocation: ILocation;
}) => {
  const map = useMap();
  useEffect(() => {
    if (deliveryBoyLocation.latitude !== 0) {
      map.setView(
        [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        map.getZoom(),
      );
    }
  }, [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude]);
  return null;
};

const LiveMap = ({ userLocation, deliveryBoyLocation }: Iprops) => {
  const DeliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/16422/16422519.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/4821/4821951.png",
    iconSize: [45, 45],
  });

  const center: LatLngExpression =
    userLocation.latitude !== 0
      ? [userLocation.latitude, userLocation.longitude]
      : [23.8103, 90.4125]; // default Dhaka

  const linePositions: LatLngExpression[] =
    deliveryBoyLocation.latitude !== 0 && userLocation.latitude !== 0
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative">
      <MapContainer
        center={center}
        zoom={15}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Live center update */}
        <MapUpdater deliveryBoyLocation={deliveryBoyLocation} />

        {/* User location */}
        {userLocation.latitude !== 0 && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={userIcon}
          >
            <Popup>📦 Delivery Address</Popup>
          </Marker>
        )}

        {/* Delivery boy location */}
        {deliveryBoyLocation.latitude !== 0 && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={DeliveryBoyIcon}
          >
            <Popup>🛵 Delivery Boy</Popup>
          </Marker>
        )}

        {/* Line between two points */}
        {linePositions.length > 0 && (
          <Polyline
            positions={linePositions}
            color="#00a850"
            weight={3}
            dashArray="6"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LiveMap;
