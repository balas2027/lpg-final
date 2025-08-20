import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import { LatLngExpression } from '../types';

interface RoutingProps {
    start: LatLngExpression;
    end: LatLngExpression;
}

const RoutingMachine: React.FC<RoutingProps> = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = (L as any).Routing.control({
            waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1])
            ],
            // Hide the default markers from the routing machine, we use our own
            createMarker: () => null, 
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            // Customize the line style for better visibility
            lineOptions: {
                styles: [{ color: '#0ea5e9', opacity: 0.8, weight: 8 }] // sky-500
            }
        }).addTo(map);

        return () => {
            // Check if map and removeControl exist before calling
            if (map && map.removeControl) {
                 map.removeControl(routingControl);
            }
        };
    }, [map, start, end]);

    return null;
};

export default RoutingMachine;