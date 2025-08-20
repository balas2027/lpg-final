
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Report, ReportStatus, LatLngExpression, Role, ReportType } from '../types';
import RoutingMachine from './Routing';

// Custom icon definitions
const createIcon = (color: string, size: string = 'w-8 h-8') => {
    return new L.DivIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="${size} drop-shadow-lg"><path fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.053l.003-.004c.884-1.28.95-2.831.145-4.145l-.008-.012a5.093 5.093 0 00-3.262-2.122 3.28 3.28 0 00-2.337.132 2.81 2.81 0 00-1.428 1.45l-.002.003a2.5 2.5 0 01-2.286 1.433 2.5 2.5 0 01-2.286-1.433l-.002-.003a2.81 2.81 0 00-1.428-1.45 3.28 3.28 0 00-2.337-.132 5.093 5.093 0 00-3.262 2.122l-.008.012c-.805 1.314-.739 2.865.145 4.145l.003.004a16.975 16.975 0 005.16 4.053zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd" /></svg>`,
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });
};

const redIcon = createIcon('#ef4444'); // red-500 for Gas
const orangeIcon = createIcon('#f97316'); // orange-500 for Fire
const greenIcon = createIcon('#22c55e'); // green-500 for Resolved
const blueIcon = createIcon('#3b82f6', 'w-10 h-10'); // blue-500 for admin

const getIconForReport = (report: Report) => {
    if (report.status === ReportStatus.RESOLVED) {
        return greenIcon;
    }
    return report.type === ReportType.FIRE ? orangeIcon : redIcon;
};

// Helper component to control map view imperatively
interface MapControllerProps {
    panTo?: LatLngExpression | null;
    fitBounds?: L.LatLngBoundsExpression | null;
}

const MapController: React.FC<MapControllerProps> = ({ panTo, fitBounds }) => {
    const map = useMap();
    useEffect(() => {
        if (fitBounds) {
            map.flyToBounds(fitBounds, { padding: [50, 50], animate: true, duration: 1.5 });
        } else if (panTo) {
            map.flyTo(panTo, map.getZoom(), {
                animate: true,
                duration: 1.5
            });
        }
    }, [panTo, fitBounds, map]);
    return null;
}

interface MapComponentProps {
    reports: Report[];
    center: LatLngExpression;
    zoom?: number;
    adminLocation?: LatLngExpression | null;
    role: Role;
    onResolve?: (reportId: string) => void;
    onShowRoute?: (report: Report) => void;
    onMarkerClick?: (report: Report) => void;
    routeWaypoints?: { start: LatLngExpression; end: LatLngExpression } | null;
    panTo?: LatLngExpression | null;
    fitBounds?: L.LatLngBoundsExpression | null;
}

const MapComponent: React.FC<MapComponentProps> = ({
    reports,
    center,
    zoom = 13,
    adminLocation,
    role,
    onResolve,
    onShowRoute,
    onMarkerClick,
    routeWaypoints,
    panTo,
    fitBounds
}) => {
    return (
        <div className="h-[400px] md:h-full w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200/50 z-0">
            <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} >
                <MapController panTo={panTo} fitBounds={fitBounds} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {reports.map((report) => (
                    <Marker
                        key={report.id}
                        position={[report.lat, report.lng]}
                        icon={getIconForReport(report)}
                        eventHandlers={{
                            click: () => onMarkerClick && onMarkerClick(report),
                        }}
                    >
                        <Popup autoPan={false}>
                            <div className="w-64 font-sans text-sm p-0">
                                <div className="p-3">
                                    <h3 className="font-bold text-base text-slate-800 mb-3">{report.type === ReportType.FIRE ? 'Fire Incident' : 'Leakage Report'}</h3>
                                    <div className="space-y-2 text-slate-600">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-500">Status:</span>
                                            <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${report.status === ReportStatus.RESOLVED ? 'bg-green-100 text-green-800' : report.type === ReportType.FIRE ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-700'}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                         <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-500">Type:</span>
                                            <span className="font-medium text-slate-700 capitalize">{report.type.toLowerCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-500">Reporter:</span>
                                            <span className="font-medium text-slate-700 truncate">{report.userEmail}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium text-slate-500">Date:</span>
                                            <span className="font-medium text-slate-700">{new Date(report.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                {role === Role.ADMIN && (
                                <div className="mt-2 space-y-2 bg-slate-50 p-3 -m-1.5 rounded-b-lg border-t border-slate-200">
                                    {report.status === ReportStatus.UNRESOLVED && onResolve && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onResolve(report.id); }}
                                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all duration-300 transform hover:scale-105"
                                        >
                                            Mark as Resolved
                                        </button>
                                    )}
                                    {onShowRoute && (
                                         <button
                                            onClick={(e) => { e.stopPropagation(); onShowRoute(report); }}
                                            disabled={!adminLocation}
                                            title={!adminLocation ? "Fetch your location first on the dashboard" : "Show route to this location"}
                                            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all duration-300 transform hover:scale-105 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:scale-100"
                                        >
                                            Show Route
                                        </button>
                                    )}
                                </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
                {adminLocation && (
                     <Marker position={adminLocation} icon={blueIcon} zIndexOffset={1000}>
                         <Popup>Your Current Location</Popup>
                     </Marker>
                )}
                {routeWaypoints && (
                    <RoutingMachine
                        key={JSON.stringify(routeWaypoints)}
                        start={routeWaypoints.start}
                        end={routeWaypoints.end}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapComponent;