// import React, { useState, useEffect, useCallback } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { api } from '../services/mockApi';
// import { Report, LatLngExpression, Role, ReportType } from '../types';
// import MapComponent from '../components/MapComponent';

// const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
//       <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
//     </svg>
// );
// const GasIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
//     </svg>
// );
// const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
//     </svg>
// );

// const UserDashboard: React.FC = () => {
//     const { user } = useAuth();
//     const [reports, setReports] = useState<Report[]>([]);
//     const [lat, setLat] = useState('');
//     const [lng, setLng] = useState('');
//     const [reportType, setReportType] = useState<ReportType>(ReportType.GAS);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [mapCenter, setMapCenter] = useState<LatLngExpression>([34.0522, -118.2437]); // Default to LA
//     const [panTo, setPanTo] = useState<LatLngExpression | null>(null);

//     const fetchUserReports = useCallback(async () => {
//         if (!user) return;
//         setIsLoading(true);
//         try {
//             const allReports = await api.getReports();
//             const userReports = allReports.filter(report => report.userId === user.id);
//             setReports(userReports);
//             if (userReports.length > 0) {
//                 setMapCenter([userReports[0].lat, userReports[0].lng]);
//             } else {
//                  navigator.geolocation.getCurrentPosition(position => {
//                     setMapCenter([position.coords.latitude, position.coords.longitude]);
//                 });
//             }
//         } catch (e) {
//             setError('Failed to fetch reports.');
//         } finally {
//             setIsLoading(false);
//         }
//     }, [user]);

//     useEffect(() => {
//         fetchUserReports();
//     }, [fetchUserReports]);
    
//     useEffect(() => {
//         if(success) {
//             const timer = setTimeout(() => setSuccess(''), 4000);
//             return () => clearTimeout(timer);
//         }
//         if(error) {
//             const timer = setTimeout(() => setError(''), 4000);
//             return () => clearTimeout(timer);
//         }
//     }, [success, error]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!user) return;
        
//         const latNum = parseFloat(lat);
//         const lngNum = parseFloat(lng);

//         if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
//             setError('Please enter valid coordinates.');
//             return;
//         }

//         setIsLoading(true);
//         setError('');
//         setSuccess('');
//         try {
//             const newReport = await api.addReport(user.id, latNum, lngNum, reportType);
//             setSuccess('Incident reported successfully!');
//             setLat('');
//             setLng('');
//             setPanTo([newReport.lat, newReport.lng]);
//             fetchUserReports(); // Refresh the list
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to submit report.');
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     const fillCurrentLocation = () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(position => {
//                 setLat(position.coords.latitude.toFixed(6));
//                 setLng(position.coords.longitude.toFixed(6));
//                 setSuccess('Fetched current location!');
//             }, () => {
//                 setError('Unable to retrieve your location. Please grant permission.');
//             });
//         } else {
//             setError("Geolocation is not supported by this browser.");
//         }
//     }

//     return (
//         <div className="flex flex-col xl:flex-row gap-8 h-full">
//             <div className="xl:w-1/3 bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80 flex flex-col animate-fadeInUp">
//                 <div>
//                     <h1 className="text-2xl font-bold text-slate-800 mb-1">Report an Incident</h1>
//                     <p className="text-sm text-slate-500 mb-6">Enter coordinates to report an emergency.</p>
                    
//                     <form onSubmit={handleSubmit} className="space-y-4">
//                          {error && <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 animate-fadeIn">{error}</div>}
//                          {success && <div className="rounded-lg bg-green-100 p-3 text-sm text-green-700 animate-fadeIn">{success}</div>}
                        
//                         <div>
//                             <label className="block text-sm font-medium text-slate-700 mb-2">Incident Type</label>
//                             <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
//                                 <button type="button" onClick={() => setReportType(ReportType.GAS)} className={`flex items-center justify-center gap-2 w-full rounded-md py-2 text-sm font-semibold transition-all ${reportType === ReportType.GAS ? 'bg-white shadow text-red-600' : 'text-slate-600 hover:bg-slate-200'}`}><GasIcon className="w-5 h-5" /> Gas Leakage</button>
//                                 <button type="button" onClick={() => setReportType(ReportType.FIRE)} className={`flex items-center justify-center gap-2 w-full rounded-md py-2 text-sm font-semibold transition-all ${reportType === ReportType.FIRE ? 'bg-white shadow text-orange-600' : 'text-slate-600 hover:bg-slate-200'}`}><FireIcon className="w-5 h-5" /> Fire</button>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                              <div>
//                                 <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
//                                 <input id="latitude" type="text" value={lat} onChange={(e) => setLat(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g., 34.0522" required />
//                             </div>
//                             <div>
//                                 <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
//                                 <input id="longitude" type="text" value={lng} onChange={(e) => setLng(e.target.value)} className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="e.g., -118.2437" required />
//                             </div>
//                         </div>
//                          <button type="button" onClick={fillCurrentLocation} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-95">
//                             <LocationMarkerIcon className="w-5 h-5" />
//                             Use My Current Location
//                         </button>
//                         <button type="submit" disabled={isLoading} className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${reportType === ReportType.GAS ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-all transform active:scale-95`}>
//                             {isLoading ? 'Submitting...' : 'Submit Emergency Report'}
//                         </button>
//                     </form>
//                 </div>
//                  <div className="mt-8 flex flex-col flex-grow">
//                     <h2 className="text-xl font-bold text-slate-800 mb-4">My Reported Incidents</h2>
//                     <div className="flex-grow overflow-y-auto pr-2 -mr-2">
//                         {isLoading ? <p className="text-slate-500 text-center py-4">Loading reports...</p> : reports.length === 0 ? (
//                             <div className="text-center py-10 px-4 bg-slate-50 rounded-lg">
//                                 <LocationMarkerIcon className="mx-auto h-12 w-12 text-slate-400" />
//                                 <p className="text-slate-500 mt-2 font-medium">No reports found.</p>
//                                 <p className="text-sm text-slate-400">You have not reported any incidents yet.</p>
//                             </div>
//                         ) : (
//                             <div className="space-y-3">
//                             {reports.map((report) => (
//                                 <div 
//                                     key={report.id} 
//                                     className="p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all"
//                                     onClick={() => setPanTo([report.lat, report.lng])}>
//                                     <div className="flex items-center justify-between">
//                                         <p className="font-semibold text-slate-700 flex items-center gap-2 capitalize">
//                                             {report.type === ReportType.FIRE ? <FireIcon className="w-5 h-5 text-orange-500" /> : <GasIcon className="w-5 h-5 text-red-500" />}
//                                             {report.type.toLowerCase()} Incident
//                                         </p>
//                                         <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{report.status}</span>
//                                     </div>
//                                     <p className="text-sm text-slate-500 mt-2">
//                                         Reported: {new Date(report.createdAt).toLocaleString()}
//                                     </p>
//                                 </div>
//                             ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <div className="xl:w-2/3 animate-fadeIn min-h-[400px] xl:h-auto">
//                 <MapComponent reports={reports} center={mapCenter} role={Role.USER} panTo={panTo} />
//             </div>
//         </div>
//     );
// };

// export default UserDashboard;

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/mockApi';
import { Report, LatLngExpression, Role, ReportType } from '../types';
import MapComponent from '../components/MapComponent';

const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);
const GasIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 716.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
    </svg>
);
const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 716.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
    </svg>
);

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [reportType, setReportType] = useState<ReportType>(ReportType.GAS);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mapCenter, setMapCenter] = useState<LatLngExpression>([34.0522, -118.2437]); // Default to LA
    const [panTo, setPanTo] = useState<LatLngExpression | null>(null);

    const fetchUserReports = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const allReports = await api.getReports();
            const userReports = allReports.filter(report => report.userId === user.id);
            setReports(userReports);
            if (userReports.length > 0) {
                setMapCenter([userReports[0].lat, userReports[0].lng]);
            } else {
                 navigator.geolocation.getCurrentPosition(position => {
                    setMapCenter([position.coords.latitude, position.coords.longitude]);
                });
            }
        } catch (e) {
            setError('Failed to fetch reports.');
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchUserReports();
    }, [fetchUserReports]);
    
    useEffect(() => {
        if(success) {
            const timer = setTimeout(() => setSuccess(''), 4000);
            return () => clearTimeout(timer);
        }
        if(error) {
            const timer = setTimeout(() => setError(''), 4000);
            return () => clearTimeout(timer);
        }
    }, [success, error]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        const latNum = parseFloat(lat);
        const lngNum = parseFloat(lng);

        if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
            setError('Please enter valid coordinates.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');
        try {
            const newReport = await api.addReport(user.id, latNum, lngNum, reportType);
            setSuccess('Incident reported successfully!');
            setLat('');
            setLng('');
            setPanTo([newReport.lat, newReport.lng]);
            fetchUserReports(); // Refresh the list
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit report.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const fillCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                setLat(position.coords.latitude.toFixed(6));
                setLng(position.coords.longitude.toFixed(6));
                setSuccess('Fetched current location!');
            }, () => {
                setError('Unable to retrieve your location. Please grant permission.');
            });
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col 2xl:flex-row gap-6 lg:gap-8 h-full">
                    
                    {/* Left Panel - Report Form & History */}
                    <div className="2xl:w-1/3 w-full bg-white/70 backdrop-blur-xl p-6 lg:p-8 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 flex flex-col animate-fadeInUp relative overflow-hidden">
                        
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-orange-50/20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100/20 to-orange-100/20 rounded-full blur-3xl -translate-y-32 translate-x-32 pointer-events-none"></div>
                        
                        {/* Report Form Section */}
                        <div className="relative z-10 mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl shadow-lg">
                                    <LocationMarkerIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                        Report Emergency
                                    </h1>
                                    <p className="text-sm lg:text-base text-slate-500 font-medium">
                                        Submit incident location and details
                                    </p>
                                </div>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                
                                {/* Alert Messages */}
                                {error && (
                                    <div className="rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 p-4 text-sm text-red-700 animate-fadeIn border border-red-200/60 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                            {error}
                                        </div>
                                    </div>
                                )}
                                
                                {success && (
                                    <div className="rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 text-sm text-green-700 animate-fadeIn border border-green-200/60 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            {success}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Incident Type Selector */}
                                <div>
                                    <label className="text-xs font-bold text-slate-600 tracking-wide uppercase mb-3 block">
                                        Emergency Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100/80 backdrop-blur-sm p-1.5 border border-slate-200/60">
                                        <button 
                                            type="button" 
                                            onClick={() => setReportType(ReportType.GAS)} 
                                            className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 text-sm font-bold transition-all duration-300 ${
                                                reportType === ReportType.GAS 
                                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 shadow-lg shadow-red-200/60 text-white' 
                                                    : 'text-slate-600 hover:bg-red-50 hover:text-red-600'
                                            }`}
                                        >
                                            <GasIcon className="w-5 h-5" /> 
                                            Gas Leak
                                        </button>
                                        <button 
                                            type="button" 
                                            onClick={() => setReportType(ReportType.FIRE)} 
                                            className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 px-4 text-sm font-bold transition-all duration-300 ${
                                                reportType === ReportType.FIRE 
                                                    ? 'bg-gradient-to-r from-orange-500 to-red-600 shadow-lg shadow-orange-200/60 text-white' 
                                                    : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
                                            }`}
                                        >
                                            <FireIcon className="w-5 h-5" /> 
                                            Fire
                                        </button>
                                    </div>
                                </div>

                                {/* Coordinates Input */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="latitude" className="text-xs font-bold text-slate-600 tracking-wide uppercase mb-2 block">
                                            Latitude
                                        </label>
                                        <input 
                                            id="latitude" 
                                            type="text" 
                                            value={lat} 
                                            onChange={(e) => setLat(e.target.value)} 
                                            className="block w-full rounded-2xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 px-4 py-3 text-sm font-medium placeholder:text-slate-400 transition-all duration-300" 
                                            placeholder="e.g., 34.0522" 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="longitude" className="text-xs font-bold text-slate-600 tracking-wide uppercase mb-2 block">
                                            Longitude
                                        </label>
                                        <input 
                                            id="longitude" 
                                            type="text" 
                                            value={lng} 
                                            onChange={(e) => setLng(e.target.value)} 
                                            className="block w-full rounded-2xl border-2 border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-100/60 px-4 py-3 text-sm font-medium placeholder:text-slate-400 transition-all duration-300" 
                                            placeholder="e.g., -118.2437" 
                                            required 
                                        />
                                    </div>
                                </div>
                                
                                {/* Location Button */}
                                <button 
                                    type="button" 
                                    onClick={fillCurrentLocation} 
                                    className="group w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-slate-300/60 rounded-2xl shadow-lg text-sm font-bold text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-slate-50 hover:border-slate-400/60 focus:outline-none focus:ring-4 focus:ring-blue-100/60 transition-all duration-300 transform hover:scale-[1.02] active:scale-95"
                                >
                                    <LocationMarkerIcon className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                                    Use My Current Location
                                </button>
                                
                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={isLoading} 
                                    className={`group w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                                        reportType === ReportType.GAS 
                                            ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-200/50' 
                                            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-orange-200/50'
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Submitting Report...
                                        </>
                                    ) : (
                                        <>
                                            {reportType === ReportType.GAS ? <GasIcon className="w-5 h-5" /> : <FireIcon className="w-5 h-5" />}
                                            Submit Emergency Report
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                        
                        {/* Reports History Section */}
                        <div className="relative z-10 flex flex-col flex-grow border-t border-slate-200/60 pt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-sm">
                                    <LocationMarkerIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
                                        My Reports
                                    </h2>
                                    <p className="text-sm text-slate-500 font-medium">
                                        Track your submitted incidents
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex-grow overflow-y-auto pr-2 -mr-2 custom-scrollbar">
                                {isLoading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block w-8 h-8 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                        <p className="text-slate-500 font-medium">Loading your reports...</p>
                                    </div>
                                ) : reports.length === 0 ? (
                                    <div className="text-center py-12 px-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl shadow-lg flex items-center justify-center mb-6">
                                                <LocationMarkerIcon className="h-12 w-12 text-slate-400" />
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20"></div>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-600 mb-2">No reports yet</h3>
                                        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
                                            Submit your first emergency report using the form above.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reports.map((report, index) => (
                                            <div 
                                                key={report.id} 
                                                className="group relative p-5 lg:p-6 rounded-2xl cursor-pointer border-2 border-slate-200/60 bg-white/60 backdrop-blur-sm transition-all duration-300 hover:border-blue-300/80 hover:shadow-lg hover:bg-white/80 hover:-translate-y-1 transform"
                                                onClick={() => setPanTo([report.lat, report.lng])}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3 flex-1">
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
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-base capitalize">
                                                                {report.type.toLowerCase()} Emergency
                                                            </p>
                                                            <p className="text-xs text-slate-500 font-medium">
                                                                Click to view on map
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${
                                                        report.status === 'RESOLVED' 
                                                            ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200/60' 
                                                            : 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200/60'
                                                    }`}>
                                                        {report.status === 'RESOLVED' ? 'Resolved' : 'Active'}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            Reported: {new Date(report.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            Location: {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Hover Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Map */}
                    <div className="2xl:w-2/3 w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] 2xl:h-auto 2xl:min-h-[800px] animate-fadeIn">
                        <div className="h-full rounded-3xl overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/60 bg-white/20 backdrop-blur-xl">
                            <MapComponent 
                                reports={reports} 
                                center={mapCenter} 
                                role={Role.USER} 
                                panTo={panTo} 
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

export default UserDashboard;