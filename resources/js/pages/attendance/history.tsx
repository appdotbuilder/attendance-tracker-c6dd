import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Attendance {
    id: number;
    date: string;
    clock_in?: string;
    clock_out?: string;
    status: string;
    work_hours?: string;
    notes?: string;
    is_within_radius: boolean;
    location?: { name: string };
}

interface PaginatedAttendances {
    data: Attendance[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { total: number; from: number; to: number };
}

interface Props {
    attendances: PaginatedAttendances;
    [key: string]: unknown;
}

export default function AttendanceHistory({ attendances }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            present: 'bg-green-100 text-green-800',
            late: 'bg-yellow-100 text-yellow-800',
            absent: 'bg-red-100 text-red-800',
            sick: 'bg-blue-100 text-blue-800',
            leave: 'bg-purple-100 text-purple-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getLocationBadge = (isWithinRadius: boolean) => {
        return isWithinRadius
            ? 'bg-green-100 text-green-800'
            : 'bg-orange-100 text-orange-800';
    };

    return (
        <AppShell>
            <Head title="Attendance History" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <span className="mr-2">📊</span>
                            Attendance History
                        </h1>
                        <p className="text-gray-600">Your complete attendance record</p>
                    </div>
                    <Link href={route('attendance.index')}>
                        <Button>
                            📍 Clock In/Out
                        </Button>
                    </Link>
                </div>

                {/* Statistics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{attendances.meta.total}</div>
                        <div className="text-sm text-gray-600">Total Records</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {attendances.data.filter(a => a.status === 'present').length}
                        </div>
                        <div className="text-sm text-gray-600">Present</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                            {attendances.data.filter(a => a.status === 'late').length}
                        </div>
                        <div className="text-sm text-gray-600">Late</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {attendances.data.filter(a => !a.is_within_radius).length}
                        </div>
                        <div className="text-sm text-gray-600">Out of Range</div>
                    </div>
                </div>

                {/* Attendance Records */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Attendance Records</h2>
                    </div>
                    
                    {attendances.data.length > 0 ? (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Clock In
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Clock Out
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Work Hours
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Location
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {attendances.data.map((attendance, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatDate(attendance.date)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {attendance.location?.name || 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {attendance.clock_in ? formatTime(attendance.clock_in) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {attendance.clock_out ? formatTime(attendance.clock_out) : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {attendance.work_hours || '0:00'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(attendance.status)}`}>
                                                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLocationBadge(attendance.is_within_radius)}`}>
                                                        {attendance.is_within_radius ? '✅ Within' : '📍 Outside'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {attendances.data.map((attendance, index) => (
                                    <div key={index} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium text-gray-900">{formatDate(attendance.date)}</h3>
                                            <div className="flex space-x-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(attendance.status)}`}>
                                                    {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLocationBadge(attendance.is_within_radius)}`}>
                                                    {attendance.is_within_radius ? '✅' : '📍'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>📍 {attendance.location?.name || 'Unknown location'}</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-500 block">Clock In</span>
                                                <span className="font-medium">{attendance.clock_in ? formatTime(attendance.clock_in) : '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Clock Out</span>
                                                <span className="font-medium">{attendance.clock_out ? formatTime(attendance.clock_out) : '-'}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 block">Hours</span>
                                                <span className="font-medium">{attendance.work_hours || '0:00'}</span>
                                            </div>
                                        </div>
                                        {attendance.notes && (
                                            <div className="text-sm">
                                                <span className="text-gray-500">Notes: </span>
                                                <span className="text-gray-700">{attendance.notes}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {attendances.links && attendances.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {attendances.meta.from || 0} to {attendances.meta.to || 0} of {attendances.meta.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {attendances.links.map((link, index) => {
                                                if (link.url === null) {
                                                    return (
                                                        <span key={index} className="px-3 py-2 text-sm text-gray-400">
                                                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                                        </span>
                                                    );
                                                }
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={link.url}
                                                        className={`px-3 py-2 text-sm rounded-md ${
                                                            link.active
                                                                ? 'bg-blue-600 text-white'
                                                                : 'text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                    >
                                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Attendance Records</h3>
                            <p className="text-gray-600 mb-6">You haven't clocked in yet. Start tracking your attendance today!</p>
                            <Link href={route('attendance.index')}>
                                <Button>
                                    📍 Clock In Now
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}