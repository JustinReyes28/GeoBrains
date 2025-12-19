import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
}

interface GeoMapProps extends MapContainerProps {
    className?: string;
    onMapClick?: (lat: number, lng: number) => void;
    markers?: MapMarker[];
}

export const GeoMap = ({ className, children, markers = [], ...props }: GeoMapProps) => {
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
                {markers.map((marker, i) => (
                    <Marker key={i} position={marker.position}>
                        {marker.popup && <Popup>{marker.popup}</Popup>}
                    </Marker>
                ))}
                {children}
            </MapContainer>
        </div>
    );
};
