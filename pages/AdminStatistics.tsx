// import React, { useState, useEffect, useMemo } from 'react';
// import { api } from '../services/mockApi';
// import { Report, ReportStatus, ReportType } from '../types';
// import { ResponsiveContainer, PieChart, Pie, Cell, Sector, Tooltip, PieProps } from 'recharts';

// // --- ICONS ---
// const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
//     </svg>
// );
// const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
//     </svg>
// );
// const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
// );
// const GasIcon: React.FC<{ className?: string }> = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
//     </svg>
// );
// const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
//      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048l-1.02-1.02A.75.75 0 015.75 5h3.586a.75.75 0 01.53.22l1.12 1.12a.75.75 0 001.06 0l1.12-1.12a.75.75 0 01.53-.22h3.586a.75.75 0 01.53 1.28l-1.02 1.02z" />
//     </svg>
// );


// // --- Custom Pie Chart Shape ---
// const renderActiveShape = (props: any) => {
//     const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

//     return (
//         <g>
//             <text x={cx} y={cy - 10} textAnchor="middle" fill="#334155" className="text-base font-semibold">
//                 {payload.name}
//             </text>
//              <text x={cx} y={cy + 15} textAnchor="middle" fill={fill} className="text-3xl font-bold">
//                 {`${(percent * 100).toFixed(0)}%`}
//             </text>
//             <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={5} />
//             <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} cornerRadius={5} />
//         </g>
//     );
// };

// // --- Type fix for Recharts Pie component ---
// // The default PieProps type from @types/recharts is missing activeIndex and activeShape.
// // This is a workaround to add them and avoid TypeScript errors without using @ts-ignore.
// type PieWithActiveShapeProps = PieProps & {
//   activeIndex?: number;
//   activeShape?: React.ReactElement | ((props: any) => React.ReactElement);
// };

// const PieWithActiveShape = Pie as React.ComponentType<PieWithActiveShapeProps>;


// // --- Main Component ---
// const AdminStatistics: React.FC = () => {
//     const [reports, setReports] = useState<Report[]>([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [statusActiveIndex, setStatusActiveIndex] = useState(0);
//     const [typeActiveIndex, setTypeActiveIndex] = useState(0);

//     useEffect(() => {
//         const fetchReports = async () => {
//             try {
//                 const data = await api.getReports();
//                 setReports(data);
//             } catch (err) {
//                 setError('Failed to fetch statistics.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchReports();
//     }, []);

//     const stats = useMemo(() => {
//         const total = reports.length;
//         const resolved = reports.filter(r => r.status === ReportStatus.RESOLVED).length;
//         const unresolved = total - resolved;
//         const gas = reports.filter(r => r.type === ReportType.GAS).length;
//         const fire = reports.filter(r => r.type === ReportType.FIRE).length;
//         return { total, resolved, unresolved, gas, fire };
//     }, [reports]);

//     const statusChartData = [
//         { name: 'Resolved', value: stats.resolved, fill: '#22c55e' },
//         { name: 'Unresolved', value: stats.unresolved, fill: '#ef4444' },
//     ];
    
//     const typeChartData = [
//         { name: 'Gas', value: stats.gas, fill: '#dc2626' },
//         { name: 'Fire', value: stats.fire, fill: '#f97316' },
//     ];
    
//     const statCards = [
//         { title: 'Total Reports', value: stats.total, color: 'blue', icon: ListBulletIcon },
//         { title: 'Unresolved', value: stats.unresolved, color: 'red', icon: ExclamationTriangleIcon },
//         { title: 'Resolved', value: stats.resolved, color: 'green', icon: CheckCircleIcon },
//         { title: 'Gas Reports', value: stats.gas, color: 'rose', icon: GasIcon },
//         { title: 'Fire Reports', value: stats.fire, color: 'orange', icon: FireIcon },
//     ];
    
//     const colorVariants: { [key: string]: { text: string; bg: string; iconBg: string } } = {
//         blue: { text: 'text-blue-600', bg: 'bg-blue-50', iconBg: 'bg-blue-100' },
//         red: { text: 'text-red-600', bg: 'bg-red-50', iconBg: 'bg-red-100' },
//         green: { text: 'text-green-600', bg: 'bg-green-50', iconBg: 'bg-green-100' },
//         rose: { text: 'text-rose-600', bg: 'bg-rose-50', iconBg: 'bg-rose-100' },
//         orange: { text: 'text-orange-600', bg: 'bg-orange-50', iconBg: 'bg-orange-100' },
//     };

//     if (isLoading) return <div className="text-center p-8 font-medium text-slate-500">Loading statistics...</div>;
//     if (error) return <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;

//     return (
//         <div className="space-y-8 animate-fadeInUp">
//             <div>
//                 <h1 className="text-3xl font-bold text-slate-900">Reports Statistics</h1>
//                 <p className="text-slate-500 mt-1">An overview of incident report data.</p>
//             </div>
            
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
//                 {statCards.map((card, index) => {
//                      const CIcon = card.icon;
//                      const colors = colorVariants[card.color];
//                      return (
//                          <div key={card.title}
//                             className={`p-6 rounded-2xl shadow-lg border border-slate-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${colors.bg}`}
//                          >
//                             <div className="flex justify-between items-center">
//                                 <h3 className="text-base font-semibold text-slate-600">{card.title}</h3>
//                                  <div className={`p-2 rounded-lg ${colors.iconBg}`}>
//                                   <CIcon className={`h-6 w-6 ${colors.text}`} />
//                                 </div>
//                             </div>
//                             <p className={`text-4xl font-bold ${colors.text} mt-4`}>{card.value}</p>
//                         </div>
//                      )
//                 })}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                 <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
//                      <h2 className="text-xl font-bold text-slate-800 mb-4">Status Overview</h2>
//                      <ResponsiveContainer width="100%" height={350}>
//                         <PieChart>
//                             <PieWithActiveShape
//                                 activeIndex={statusActiveIndex}
//                                 activeShape={renderActiveShape}
//                                 data={statusChartData}
//                                 cx="50%"
//                                 cy="50%"
//                                 innerRadius={90}
//                                 outerRadius={130}
//                                 dataKey="value"
//                                 onMouseEnter={(_: any, index: number) => setStatusActiveIndex(index)}
//                             >
//                                 {statusChartData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
//                                 ))}
//                             </PieWithActiveShape>
//                              <Tooltip contentStyle={{ display: 'none' }} />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200/80">
//                     <h2 className="text-xl font-bold text-slate-800 mb-4">Incident Type Breakdown</h2>
//                     <ResponsiveContainer width="100%" height={350}>
//                         <PieChart>
//                             <PieWithActiveShape
//                                 activeIndex={typeActiveIndex}
//                                 activeShape={renderActiveShape}
//                                 data={typeChartData}
//                                 cx="50%"
//                                 cy="50%"
//                                 innerRadius={90}
//                                 outerRadius={130}
//                                 dataKey="value"
//                                 onMouseEnter={(_: any, index: number) => setTypeActiveIndex(index)}
//                             >
//                                 {typeChartData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={entry.fill} stroke={entry.fill} />
//                                 ))}
//                             </PieWithActiveShape>
//                              <Tooltip contentStyle={{ display: 'none' }} />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminStatistics;

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/mockApi';
import { Report, ReportStatus, ReportType } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Sector, Tooltip, PieProps } from 'recharts';

// --- ICONS ---
const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
);
const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
    </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

// --- Custom Pie Chart Shape ---
const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    return (
        <g>
            <text x={cx} y={cy - 15} textAnchor="middle" fill="#1e293b" className="text-lg font-bold">
                {payload.name}
            </text>
             <text x={cx} y={cy + 15} textAnchor="middle" fill={fill} className="text-4xl font-black">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            <Sector 
                cx={cx} 
                cy={cy} 
                innerRadius={innerRadius} 
                outerRadius={outerRadius} 
                startAngle={startAngle} 
                endAngle={endAngle} 
                fill={fill} 
                cornerRadius={8}
                className="drop-shadow-lg" 
            />
            <Sector 
                cx={cx} 
                cy={cy} 
                startAngle={startAngle} 
                endAngle={endAngle} 
                innerRadius={outerRadius + 8} 
                outerRadius={outerRadius + 16} 
                fill={fill} 
                cornerRadius={8}
                opacity={0.6}
                className="animate-pulse" 
            />
        </g>
    );
};

// --- Type fix for Recharts Pie component ---
type PieWithActiveShapeProps = PieProps & {
  activeIndex?: number;
  activeShape?: React.ReactElement | ((props: any) => React.ReactElement);
};

const PieWithActiveShape = Pie as React.ComponentType<PieWithActiveShapeProps>;

// --- Main Component ---
const AdminStatistics: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusActiveIndex, setStatusActiveIndex] = useState(0);
    const [typeActiveIndex, setTypeActiveIndex] = useState(0);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await api.getReports();
                setReports(data);
            } catch (err) {
                setError('Failed to fetch statistics.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const stats = useMemo(() => {
        const total = reports.length;
        const resolved = reports.filter(r => r.status === ReportStatus.RESOLVED).length;
        const unresolved = total - resolved;
        const gas = reports.filter(r => r.type === ReportType.GAS).length;
        const fire = reports.filter(r => r.type === ReportType.FIRE).length;
        return { total, resolved, unresolved, gas, fire };
    }, [reports]);

    const statusChartData = [
        { name: 'Resolved', value: stats.resolved, fill: '#10b981' },
        { name: 'Unresolved', value: stats.unresolved, fill: '#ef4444' },
    ];
    
    const typeChartData = [
        { name: 'Gas', value: stats.gas, fill: '#dc2626' },
        { name: 'Fire', value: stats.fire, fill: '#ea580c' },
    ];
    
    const statCards = [
        { 
            title: 'Total Reports', 
            value: stats.total, 
            color: 'blue', 
            icon: ListBulletIcon,
            gradient: 'from-blue-500 to-cyan-600',
            description: 'All incidents reported'
        },
        { 
            title: 'Active Cases', 
            value: stats.unresolved, 
            color: 'red', 
            icon: ExclamationTriangleIcon,
            gradient: 'from-red-500 to-pink-600',
            description: 'Requires immediate attention'
        },
        { 
            title: 'Resolved Cases', 
            value: stats.resolved, 
            color: 'green', 
            icon: CheckCircleIcon,
            gradient: 'from-green-500 to-emerald-600',
            description: 'Successfully handled'
        },
        { 
            title: 'Gas Incidents', 
            value: stats.gas, 
            color: 'rose', 
            icon: GasIcon,
            gradient: 'from-rose-500 to-red-600',
            description: 'Gas leak reports'
        },
        { 
            title: 'Fire Incidents', 
            value: stats.fire, 
            color: 'orange', 
            icon: FireIcon,
            gradient: 'from-orange-500 to-red-600',
            description: 'Fire emergency reports'
        },
    ];
    
    const colorVariants: { [key: string]: { text: string; bg: string; iconBg: string; border: string } } = {
        blue: { text: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-50/80 to-cyan-50/60', iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600', border: 'border-blue-200/60' },
        red: { text: 'text-red-600', bg: 'bg-gradient-to-br from-red-50/80 to-pink-50/60', iconBg: 'bg-gradient-to-br from-red-500 to-pink-600', border: 'border-red-200/60' },
        green: { text: 'text-green-600', bg: 'bg-gradient-to-br from-green-50/80 to-emerald-50/60', iconBg: 'bg-gradient-to-br from-green-500 to-emerald-600', border: 'border-green-200/60' },
        rose: { text: 'text-rose-600', bg: 'bg-gradient-to-br from-rose-50/80 to-red-50/60', iconBg: 'bg-gradient-to-br from-rose-500 to-red-600', border: 'border-rose-200/60' },
        orange: { text: 'text-orange-600', bg: 'bg-gradient-to-br from-orange-50/80 to-red-50/60', iconBg: 'bg-gradient-to-br from-orange-500 to-red-600', border: 'border-orange-200/60' },
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center p-12">
                        <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Loading Analytics</h2>
                        <p className="text-slate-500 font-medium">Gathering statistical insights...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center p-12 bg-gradient-to-br from-red-50 to-pink-50 rounded-3xl shadow-2xl border border-red-200/60">
                        <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Statistics</h2>
                        <p className="text-red-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8 animate-fadeInUp">
                
                {/* Header Section */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white/70 backdrop-blur-xl p-8 lg:p-12 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                            <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                                Analytics Dashboard
                            </h1>
                        </div>
                        <p className="text-lg text-slate-600 font-medium max-w-2xl">
                            Comprehensive insights into incident reports, response metrics, and operational performance across all emergency categories.
                        </p>
                        
                        {/* Live Stats Bar */}
                        <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-slate-200/60">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-sm font-semibold text-slate-600">
                                    {((stats.resolved / (stats.total || 1)) * 100).toFixed(1)}% Resolution Rate
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                                <span className="text-sm font-semibold text-slate-600">
                                    {stats.total} Total Reports
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 ${stats.unresolved > 0 ? 'bg-red-400 animate-pulse' : 'bg-gray-400'} rounded-full`}></div>
                                <span className="text-sm font-semibold text-slate-600">
                                    {stats.unresolved} Pending
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 gap-6 lg:gap-8">
                    {statCards.map((card, index) => {
                        const CIcon = card.icon;
                        const colors = colorVariants[card.color];
                        return (
                            <div 
                                key={card.title}
                                className={`group relative p-6 lg:p-8 rounded-3xl shadow-xl shadow-slate-200/40 border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${colors.bg} ${colors.border} overflow-hidden`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                {/* Background Pattern */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none"></div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h3 className="text-sm lg:text-base font-bold text-slate-700 mb-1 tracking-wide">
                                                {card.title.toUpperCase()}
                                            </h3>
                                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                                {card.description}
                                            </p>
                                        </div>
                                        <div className={`p-3 lg:p-4 rounded-2xl shadow-lg ${colors.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                                            <CIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <p className={`text-4xl lg:text-5xl font-black ${colors.text} group-hover:scale-105 transition-transform duration-300`}>
                                            {card.value}
                                        </p>
                                        {card.title.includes('Cases') && stats.total > 0 && (
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                                                    <div 
                                                        className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-1000 ease-out`}
                                                        style={{ 
                                                            width: `${(card.value / stats.total) * 100}%`,
                                                            animationDelay: `${index * 200}ms` 
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-500">
                                                    {((card.value / stats.total) * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
                    
                    {/* Status Overview Chart */}
                    <div className="group relative bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 via-transparent to-red-50/20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-green-100/20 to-red-100/20 rounded-full blur-3xl -translate-y-24 translate-x-24 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-green-500 to-red-500 rounded-2xl shadow-lg">
                                    <CheckCircleIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                                        Status Distribution
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        Resolution vs Active Cases
                                    </p>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <PieWithActiveShape
                                            activeIndex={statusActiveIndex}
                                            activeShape={renderActiveShape}
                                            data={statusChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={100}
                                            outerRadius={140}
                                            dataKey="value"
                                            onMouseEnter={(_: any, index: number) => setStatusActiveIndex(index)}
                                        >
                                            {statusChartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.fill} 
                                                    stroke={entry.fill}
                                                    strokeWidth={3}
                                                />
                                            ))}
                                        </PieWithActiveShape>
                                        <Tooltip contentStyle={{ display: 'none' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                
                                {/* Legend */}
                                <div className="flex justify-center gap-8 mt-6">
                                    {statusChartData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div 
                                                className="w-4 h-4 rounded-full shadow-sm"
                                                style={{ backgroundColor: entry.fill }}
                                            ></div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {entry.name} ({entry.value})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Type Breakdown Chart */}
                    <div className="group relative bg-white/70 backdrop-blur-xl p-8 lg:p-10 rounded-3xl shadow-2xl shadow-slate-200/50 border border-white/60 overflow-hidden">
                        {/* Background Elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-transparent to-orange-50/20 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-red-100/20 to-orange-100/20 rounded-full blur-3xl -translate-y-24 translate-x-24 pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl shadow-lg">
                                    <FireIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-800">
                                        Incident Categories
                                    </h2>
                                    <p className="text-slate-500 font-medium">
                                        Fire vs Gas Emergency Types
                                    </p>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <PieWithActiveShape
                                            activeIndex={typeActiveIndex}
                                            activeShape={renderActiveShape}
                                            data={typeChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={100}
                                            outerRadius={140}
                                            dataKey="value"
                                            onMouseEnter={(_: any, index: number) => setTypeActiveIndex(index)}
                                        >
                                            {typeChartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.fill} 
                                                    stroke={entry.fill}
                                                    strokeWidth={3}
                                                />
                                            ))}
                                        </PieWithActiveShape>
                                        <Tooltip contentStyle={{ display: 'none' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                                
                                {/* Legend */}
                                <div className="flex justify-center gap-8 mt-6">
                                    {typeChartData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-2">
                                            <div 
                                                className="w-4 h-4 rounded-full shadow-sm"
                                                style={{ backgroundColor: entry.fill }}
                                            ></div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                {entry.name} Incidents ({entry.value})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;