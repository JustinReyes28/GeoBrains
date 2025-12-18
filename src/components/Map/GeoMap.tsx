import { MapContainer, TileLayer } from 'react-leaflet';
import type { MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '../../lib/utils';

interface GeoMapProps extends MapContainerProps {
    className?: string;
    onMapClick?: (lat: number, lng: number) => void;
}

export const GeoMap = ({ className, children, ...props }: GeoMapProps) => {
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
                {children}
            </MapContainer>
        </div>
    );
};
