// import React, { useState, useEffect, useCallback } from 'react';
// import { api } from '../services/mockApi';
// import { Report, LatLngExpression, Role, ReportStatus, ReportType } from '../types';
// import MapComponent from '../components/MapComponent';
// import L from 'leaflet';

// // --- ICONS ---
// const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
//     </svg>
// );
// const ClearIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
// );
// const GasIcon: React.FC<{ className?: string }> = ({ className }) => (
//      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
//     </svg>
// );
// const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
//      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
//     </svg>
// );


// const AdminDashboard: React.FC = () => {
//     const [reports, setReports] = useState<Report[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [adminLocation, setAdminLocation] = useState<LatLngExpression | null>(null);
//     const [mapCenter, setMapCenter] = useState<LatLngExpression>([34.0522, -118.2437]);
//     const [panTo, setPanTo] = useState<LatLngExpression | null>(null);
//     const [fitBounds, setFitBounds] = useState<L.LatLngBoundsExpression | null>(null);
//     const [selectedReport, setSelectedReport] = useState<Report | null>(null);
//     const [routeWaypoints, setRouteWaypoints] = useState<{ start: LatLngExpression; end: LatLngExpression } | null>(null);
//     const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
//     const [typeFilter, setTypeFilter] = useState<ReportType | 'ALL'>('ALL');

//     const fetchAllReports = useCallback(async () => {
//         setIsLoading(true);
//         try {
//             const allReports = await api.getReports();
//             setReports(allReports);
//             if (allReports.length > 0 && !adminLocation) {
//                 const unresolved = allReports.find(r => r.status === ReportStatus.UNRESOLVED);
//                 setMapCenter(unresolved ? [unresolved.lat, unresolved.lng] : [allReports[0].lat, allReports[0].lng]);
//             }
//         } catch (e) {
//             setError('Failed to fetch reports.');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [adminLocation]);

//     useEffect(() => {
//         fetchAllReports();
//     }, [fetchAllReports]);

//      useEffect(() => {
//         if(error) {
//             const timer = setTimeout(() => setError(''), 4000);
//             return () => clearTimeout(timer);
//         }
//     }, [error]);
    
//     const fetchAdminLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(position => {
//                 const coords: LatLngExpression = [position.coords.latitude, position.coords.longitude];
//                 setAdminLocation(coords);
//                 setPanTo(coords);
//                 if (routeWaypoints) { // if a route is active, update it with new location
//                      setRouteWaypoints(prev => prev ? { ...prev, start: coords} : null);
//                      setFitBounds([coords, routeWaypoints.end]);
//                 }
//             }, () => {
//                 setError('Unable to retrieve your location.');
//             });
//         } else {
//             setError("Geolocation is not supported.");
//         }
//     };

//     const handleResolve = async (reportId: string) => {
//         try {
//             await api.updateReportStatus(reportId, ReportStatus.RESOLVED);
//             if (selectedReport?.id === reportId && routeWaypoints) {
//                 setRouteWaypoints(null); // Clear route if resolved
//                 setFitBounds(null);
//             }
//             fetchAllReports(); // Refresh data
//         } catch (err) {
//             setError('Failed to update report status.');
//         }
//     };
    
//     const handleShowRoute = (report: Report) => {
//         if (adminLocation) {
//             const start: LatLngExpression = adminLocation;
//             const end: LatLngExpression = [report.lat, report.lng];
//             setRouteWaypoints({ start, end });
//             setSelectedReport(report);
//             setFitBounds([start, end]);
//             setPanTo(null);
//         } else {
//             setError("Please fetch your location first to show a route.");
//         }
//     };
    
//     const handleMarkerClick = (report: Report) => {
//         setSelectedReport(report);
//         setPanTo([report.lat, report.lng]);
//         setFitBounds(null);
//     };

//     const handleClearRoute = () => {
//         setRouteWaypoints(null);
//         setFitBounds(null);
//     }

//     const filteredReports = reports.filter(report => {
//         const statusMatch = statusFilter === 'ALL' || report.status === statusFilter;
//         const typeMatch = typeFilter === 'ALL' || report.type === typeFilter;
//         return statusMatch && typeMatch;
//     });

//     return (
//         <div className="flex flex-col xl:flex-row gap-8 h-full">
//             <div className="xl:w-1/3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col animate-fadeInUp">
//                 <div className="flex justify-between items-start mb-4 gap-2 border-b border-slate-200 pb-4">
//                     <div>
//                         <h1 className="text-2xl font-bold text-slate-800">All Reports</h1>
//                         <p className="text-sm text-slate-500">Manage and view incidents</p>
//                     </div>
//                      <div className="flex gap-2 flex-shrink-0">
//                          {routeWaypoints && (
//                             <button onClick={handleClearRoute} title="Clear Route" className="bg-amber-100 text-amber-600 p-2.5 rounded-lg hover:bg-amber-200 transition-all transform active:scale-95 shadow-sm border border-amber-200">
//                                 <ClearIcon className="w-5 h-5"/>
//                             </button>
//                          )}
//                          <button onClick={fetchAdminLocation} title="Fetch My Location" className="bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 transition-all transform active:scale-95 shadow">
//                             <LocationMarkerIcon className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>

//                 <div className="mb-4 space-y-2">
//                     <div>
//                         <label className="text-xs font-semibold text-slate-500">STATUS</label>
//                         <div className="flex space-x-2 rounded-lg bg-slate-100 p-1 mt-1">
//                             <button onClick={() => setStatusFilter('ALL')} className={`w-full rounded-md py-1.5 text-sm font-semibold transition-all ${statusFilter === 'ALL' ? 'bg-white shadow text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}>All</button>
//                             <button onClick={() => setStatusFilter(ReportStatus.UNRESOLVED)} className={`w-full rounded-md py-1.5 text-sm font-semibold transition-all ${statusFilter === ReportStatus.UNRESOLVED ? 'bg-white shadow text-red-600' : 'text-slate-600 hover:bg-slate-200'}`}>Unresolved</button>
//                             <button onClick={() => setStatusFilter(ReportStatus.RESOLVED)} className={`w-full rounded-md py-1.5 text-sm font-semibold transition-all ${statusFilter === ReportStatus.RESOLVED ? 'bg-white shadow text-green-600' : 'text-slate-600 hover:bg-slate-200'}`}>Resolved</button>
//                         </div>
//                     </div>
//                      <div>
//                         <label className="text-xs font-semibold text-slate-500">TYPE</label>
//                         <div className="flex space-x-2 rounded-lg bg-slate-100 p-1 mt-1">
//                             <button onClick={() => setTypeFilter('ALL')} className={`w-full rounded-md py-1.5 text-sm font-semibold transition-all ${typeFilter === 'ALL' ? 'bg-white shadow text-slate-800' : 'text-slate-600 hover:bg-slate-200'}`}>All Types</button>
//                             <button onClick={() => setTypeFilter(ReportType.GAS)} className={`w-full rounded-md py-1.5 text-sm font-semibold transition-all ${typeFilter === ReportType.GAS ? 'bg-white shadow text-red-600' : 'text-slate-600 hover:bg-slate-200'}`}>Gas</button>
//                             <button onClick={() => setTypeFilter(ReportType.FIRE)} className={`w-full rounded-md py-1.5 text-sm font-semibold transition-all ${typeFilter === ReportType.FIRE ? 'bg-white shadow text-orange-600' : 'text-slate-600 hover:bg-slate-200'}`}>Fire</button>
//                         </div>
//                     </div>
//                 </div>

//                 {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 mb-4 animate-fadeIn">{error}</div>}

//                 <div className="flex-grow overflow-y-auto pr-2 -mr-2">
//                     {isLoading ? <p className="text-center text-slate-500 py-4">Loading reports...</p> : (
//                         filteredReports.length > 0 ? <div className="space-y-3">{filteredReports.map(report => (
//                             <div key={report.id} onClick={() => handleMarkerClick(report)} className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${selectedReport?.id === report.id ? 'bg-blue-50 border-blue-400 shadow-lg' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
//                                 <div className="flex items-center justify-between">
//                                     <p className="font-semibold text-slate-800 truncate flex items-center gap-2" title={report.userEmail}>
//                                         {report.type === ReportType.FIRE ? <FireIcon className="w-5 h-5 text-orange-500" /> : <GasIcon className="w-5 h-5 text-red-500" />}
//                                         {report.userEmail}
//                                     </p>
//                                     <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${report.status === ReportStatus.RESOLVED ? 'bg-green-100 text-green-800' : report.type === ReportType.FIRE ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>{report.status}</span>
//                                 </div>
//                                 <div className="flex items-center gap-2 mt-2">
//                                   <p className="text-xs text-slate-500">Reported: {new Date(report.createdAt).toLocaleString()}</p>
//                                 </div>
//                             </div>
//                         ))}</div> : <div className="text-center py-10 px-4 bg-slate-50 rounded-lg">
//                                 <LocationMarkerIcon className="mx-auto h-12 w-12 text-slate-400" />
//                                 <p className="text-slate-500 mt-2 font-medium">No matching reports.</p>
//                                 <p className="text-sm text-slate-400">Try adjusting your filters.</p>
//                             </div>
//                     )}
//                 </div>
//             </div>
//             <div className="xl:w-2/3 h-full animate-fadeIn min-h-[400px] xl:h-auto">
//                 <MapComponent
//                     reports={reports}
//                     center={mapCenter}
//                     adminLocation={adminLocation}
//                     role={Role.ADMIN}
//                     onResolve={handleResolve}
//                     onShowRoute={handleShowRoute}
//                     onMarkerClick={handleMarkerClick}
//                     routeWaypoints={routeWaypoints}
//                     panTo={panTo}
//                     fitBounds={fitBounds}
//                 />
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/mockApi';
import { Report, LatLngExpression, Role, ReportStatus, ReportType } from '../types';
import MapComponent from '../components/MapComponent';
import L from 'leaflet';

// --- ICONS ---
const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);
const ClearIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const GasIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
    </svg>
);
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
    </svg>
);


const AdminDashboard: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminLocation, setAdminLocation] = useState<LatLngExpression | null>(null);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([34.0522, -118.2437]);
    const [panTo, setPanTo] = useState<LatLngExpression | null>(null);
    const [fitBounds, setFitBounds] = useState<L.LatLngBoundsExpression | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [routeWaypoints, setRouteWaypoints] = useState<{ start: LatLngExpression; end: LatLngExpression } | null>(null);
    const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
    const [typeFilter, setTypeFilter] = useState<ReportType | 'ALL'>('ALL');

    const fetchAllReports = useCallback(async () => {
        setIsLoading(true);
        try {
            const allReports = await api.getReports();
            setReports(allReports);
            if (allReports.length > 0 && !adminLocation) {
                const unresolved = allReports.find(r => r.status === ReportStatus.UNRESOLVED);
                setMapCenter(unresolved ? [unresolved.lat, unresolved.lng] : [allReports[0].lat, allReports[0].lng]);
            }
        } catch (e) {
            setError('Failed to fetch reports.');
        } finally {
            setIsLoading(false);
        }
    }, [adminLocation]);

    useEffect(() => {
        fetchAllReports();
    }, [fetchAllReports]);

     useEffect(() => {
        if(error) {
            const timer = setTimeout(() => setError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [error]);
    
    const fetchAdminLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const coords: LatLngExpression = [position.coords.latitude, position.coords.longitude];
                setAdminLocation(coords);
                setPanTo(coords);
                if (routeWaypoints) { // if a route is active, update it with new location
                     setRouteWaypoints(prev => prev ? { ...prev, start: coords} : null);
                     setFitBounds([coords, routeWaypoints.end]);
                }
            }, () => {
                setError('Unable to retrieve your location.');
            });
        } else {
            setError("Geolocation is not supported.");
        }
    };

    const handleResolve = async (reportId: string) => {
        try {
            await api.updateReportStatus(reportId, ReportStatus.RESOLVED);
            if (selectedReport?.id === reportId && routeWaypoints) {
                setRouteWaypoints(null); // Clear route if resolved
                setFitBounds(null);
            }
            fetchAllReports(); // Refresh data
        } catch (err) {
            setError('Failed to update report status.');
        }
    };
    
    const handleShowRoute = (report: Report) => {
        if (adminLocation) {
            const start: LatLngExpression = adminLocation;
            const end: LatLngExpression = [report.lat, report.lng];
            setRouteWaypoints({ start, end });
            setSelectedReport(report);
            setFitBounds([start, end]);
            setPanTo(null);
        } else {
            setError("Please fetch your location first to show a route.");
        }
    };
    
    const handleMarkerClick = (report: Report) => {
        setSelectedReport(report);
        setPanTo([report.lat, report.lng]);
        setFitBounds(null);
    };

    const handleClearRoute = () => {
        setRouteWaypoints(null);
        setFitBounds(null);
    }

    const filteredReports = reports.filter(report => {
        const statusMatch = statusFilter === 'ALL' || report.status === statusFilter;
        const typeMatch = typeFilter === 'ALL' || report.type === typeFilter;
        return statusMatch && typeMatch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col 2xl:flex-row gap-6 lg:gap-8 h-full">
                    {/* Left Panel - Reports Dashboard */}
                    <div className="2xl:w-1/3 w-full bg-white/70 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 flex flex-col animate-fadeInUp relative overflow-hidden">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none"></div>
                        
                        {/* Header */}
                        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8 gap-4 border-b border-slate-200/60 pb-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        Incident Dashboard
                                    </h1>
                                </div>
                                <p className="text-sm lg:text-base text-slate-500 font-medium">
                                    Real-time monitoring & response center
                                </p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        {filteredReports.filter(r => r.status === ReportStatus.RESOLVED).length} Resolved
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                        {filteredReports.filter(r => r.status === ReportStatus.UNRESOLVED).length} Active
                                    </span>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3 flex-shrink-0">
                                {routeWaypoints && (
                                    <button 
                                        onClick={handleClearRoute} 
                                        title="Clear Route" 
                                        className="group relative bg-gradient-to-r from-amber-400 to-orange-500 text-white p-3 lg:p-3.5 rounded-2xl hover:from-amber-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-amber-200/40 hover:shadow-xl hover:shadow-amber-300/50"
                                    >
                                        <ClearIcon className="w-5 h-5 lg:w-6 lg:h-6 relative z-10"/>
                                        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                )}
                                <button 
                                    onClick={fetchAdminLocation} 
                                    title="Fetch My Location" 
                                    className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 lg:p-3.5 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-200/40 hover:shadow-xl hover:shadow-blue-300/50"
                                >
                                    <LocationMarkerIcon className="w-5 h-5 lg:w-6 lg:h-6 relative z-10" />
                                    <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="relative z-10 mb-6 space-y-4">
                            {/* Status Filter */}
                            <div>
                                <label className="text-xs font-bold text-slate-600 tracking-wide uppercase mb-3 block">
                                    Status Filter
                                </label>
                                <div className="flex space-x-1 rounded-2xl bg-slate-100/80 backdrop-blur-sm p-1.5 border border-slate-200/60">
                                    <button 
                                        onClick={() => setStatusFilter('ALL')} 
                                        className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-bold transition-all duration-300 ${
                                            statusFilter === 'ALL' 
                                                ? 'bg-white shadow-lg shadow-slate-200/60 text-slate-800 border border-white/80' 
                                                : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
                                        }`}
                                    >
                                        All
                                    </button>
                                    <button 
                                        onClick={() => setStatusFilter(ReportStatus.UNRESOLVED)} 
                                        className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-bold transition-all duration-300 ${
                                            statusFilter === ReportStatus.UNRESOLVED 
                                                ? 'bg-gradient-to-r from-red-500 to-pink-600 shadow-lg shadow-red-200/60 text-white' 
                                                : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                    >
                                        Active
                                    </button>
                                    <button 
                                        onClick={() => setStatusFilter(ReportStatus.RESOLVED)} 
                                        className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-bold transition-all duration-300 ${
                                            statusFilter === ReportStatus.RESOLVED 
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-200/60 text-white' 
                                                : 'text-slate-600 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                    >
                                        Resolved
                                    </button>
                                </div>
                            </div>
                            
                            {/* Type Filter */}
                            <div>
                                <label className="text-xs font-bold text-slate-600 tracking-wide uppercase mb-3 block">
                                    Incident Type
                                </label>
                                <div className="flex space-x-1 rounded-2xl bg-slate-100/80 backdrop-blur-sm p-1.5 border border-slate-200/60">
                                    <button 
                                        onClick={() => setTypeFilter('ALL')} 
                                        className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-bold transition-all duration-300 ${
                                            typeFilter === 'ALL' 
                                                ? 'bg-white shadow-lg shadow-slate-200/60 text-slate-800 border border-white/80' 
                                                : 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
                                        }`}
                                    >
                                        All Types
                                    </button>
                                    <button 
                                        onClick={() => setTypeFilter(ReportType.GAS)} 
                                        className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-bold transition-all duration-300 ${
                                            typeFilter === ReportType.GAS 
                                                ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-200/60 text-white' 
                                                : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                    >
                                        Gas
                                    </button>
                                    <button 
                                        onClick={() => setTypeFilter(ReportType.FIRE)} 
                                        className={`flex-1 rounded-xl py-2.5 px-4 text-sm font-bold transition-all duration-300 ${
                                            typeFilter === ReportType.FIRE 
                                                ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-200/60 text-white' 
                                                : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                                        }`}
                                    >
                                        Fire
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="relative z-10 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 p-4 text-sm text-red-700 mb-6 animate-fadeIn border border-red-200/60 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* Reports List */}
                        <div className="relative z-10 flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                            {isLoading ? (
                                <div className="text-center text-slate-500 py-8">
                                    <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-lg font-medium">Loading incidents...</p>
                                </div>
                            ) : (
                                filteredReports.length > 0 ? (
                                    <div className="space-y-4">
                                        {filteredReports.map((report, index) => (
                                            <div 
                                                key={report.id} 
                                                onClick={() => handleMarkerClick(report)} 
                                                className={`group relative p-5 lg:p-6 rounded-2xl cursor-pointer border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                                                    selectedReport?.id === report.id 
                                                        ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-300/60 shadow-xl shadow-blue-200/40 backdrop-blur-sm' 
                                                        : 'bg-white/60 backdrop-blur-sm border-slate-200/60 hover:border-slate-300/80 hover:shadow-lg hover:bg-white/80'
                                                } animate-fadeInUp`}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {/* Report Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        <div className={`p-2.5 rounded-xl shadow-sm ${
                                                            report.type === ReportType.FIRE 
                                                                ? 'bg-gradient-to-br from-orange-100 to-red-100 text-orange-600' 
                                                                : 'bg-gradient-to-br from-red-100 to-pink-100 text-red-600'
                                                        }`}>
                                                            {report.type === ReportType.FIRE ? 
                                                                <FireIcon className="w-5 h-5" /> : 
                                                                <GasIcon className="w-5 h-5" />
                                                            }
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-slate-800 truncate text-base" title={report.userEmail}>
                                                                {report.userEmail}
                                                            </p>
                                                            <p className="text-xs text-slate-500 capitalize font-medium">
                                                                {report.type.toLowerCase()} incident
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                                                        report.status === ReportStatus.RESOLVED 
                                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200/60' 
                                                            : report.type === ReportType.FIRE 
                                                                ? 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200/60' 
                                                                : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200/60'
                                                    }`}>
                                                        {report.status === ReportStatus.RESOLVED ? 'Resolved' : 'Active'}
                                                    </span>
                                                </div>

                                                {/* Report Details */}
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            Reported: {new Date(report.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {selectedReport?.id === report.id && (
                                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                                                            <p className="text-xs text-blue-600 font-semibold">
                                                                Selected for navigation
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Hover Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 px-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-lg flex items-center justify-center mb-6">
                                                <LocationMarkerIcon className="h-12 w-12 text-slate-400" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-600 mb-2">No matching incidents</h3>
                                        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                                            Try adjusting your filters or check back later for new reports.
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    {/* Right Panel - Map */}
                    <div className="2xl:w-2/3 w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] 2xl:h-auto 2xl:min-h-[800px] animate-fadeIn">
                        <div className="h-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/60 bg-white/20 backdrop-blur-xl">
                            <MapComponent
                                reports={reports}
                                center={mapCenter}
                                adminLocation={adminLocation}
                                role={Role.ADMIN}
                                onResolve={handleResolve}
                                onShowRoute={handleShowRoute}
                                onMarkerClick={handleMarkerClick}
                                routeWaypoints={routeWaypoints}
                                panTo={panTo}
                                fitBounds={fitBounds}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(248, 250, 252, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, rgb(99, 102, 241), rgb(139, 92, 246));
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, rgb(79, 70, 229), rgb(124, 58, 237));
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;