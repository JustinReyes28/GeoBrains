import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../../lib/utils';
import L from 'leaflet';

// Fix for default marker icon in Next.js
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

interface MapMarker {
    position: [number, number];
    popup?: string;
    color?: string; // hex color for custom marker
}

interface GeoMapProps extends MapContainerProps {
    className?: string;
    onMapClick?: (lat: number, lng: number) => void;
    markers?: MapMarker[];
}

// Component to handle map clicks
function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

// Custom icon creator
const createCustomIcon = (color: string) => {
    return new L.DivIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -10]
    });
}

export const GeoMap = ({ className, children, markers = [], onMapClick, ...props }: GeoMapProps) => {
    return (
        <div className={cn("relative w-full h-full rounded-xl overflow-hidden shadow-2xl border border-white/20 z-10", className)}>
            <MapContainer
                center={[20, 0]}
                zoom={2}
                className="w-full h-full"
                minZoom={2}
                maxBounds={[[-90, -180], [90, 180]]}
                {...props}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {onMapClick && <MapClickHandler onClick={onMapClick} />}

                {markers.map((marker, i) => (
                    <Marker
                        key={i}
                        position={marker.position}
                        icon={marker.color ? createCustomIcon(marker.color) : new L.Icon.Default()}
                    >
                        {marker.popup && <Popup>{marker.popup}</Popup>}
                    </Marker>
                ))}

                {children}
            </MapContainer>
        </div>
    );
};
