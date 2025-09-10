import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface MonthlyStats {
    total_records: number;
    present_count: number;
    late_count: number;
    outside_radius_count: number;
}

interface Attendance {
    user?: { name: string };
    location?: { name: string };
    date: string;
    clock_in?: string;
    clock_out?: string;
    status: string;
    work_hours?: string;
    is_within_radius: boolean;
}

interface Props {
    stats: {
        totalEmployees: number;
        totalLocations: number;
        totalPositions: number;
        presentToday: number;
        lateToday: number;
        absentToday: number;
    };
    monthlyStats?: MonthlyStats;
    recentAttendances: Attendance[];
    todayAttendances: Attendance[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, monthlyStats, recentAttendances, todayAttendances }: Props) {
    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
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

    const attendanceRate = stats.totalEmployees > 0 
        ? Math.round(((stats.presentToday + stats.lateToday) / stats.totalEmployees) * 100)
        : 0;

    return (
        <AppShell>
            <Head title="Admin Dashboard" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2">👨‍💼 Admin Dashboard</h1>
                    <p className="text-indigo-100">
                        Attendance management overview • {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>

                {/* Key Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <span className="text-2xl">👥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-blue-600">{stats.totalEmployees}</p>
                                <p className="text-sm text-gray-600">Total Employees</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
                                <p className="text-sm text-gray-600">Present Today</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">⏰</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-yellow-600">{stats.lateToday}</p>
                                <p className="text-sm text-gray-600">Late Today</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <span className="text-2xl">❌</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-bold text-red-600">{stats.absentToday}</p>
                                <p className="text-sm text-gray-600">Absent Today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Attendance Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Today's Attendance Rate */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Today's Attendance</h2>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{attendanceRate}%</div>
                            <p className="text-gray-600">Attendance Rate</p>
                            <div className="mt-4 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                                    style={{ width: `${attendanceRate}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Statistics */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 This Month</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Records:</span>
                                <span className="font-semibold">{monthlyStats?.total_records || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Present:</span>
                                <span className="font-semibold text-green-600">{monthlyStats?.present_count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Late:</span>
                                <span className="font-semibold text-yellow-600">{monthlyStats?.late_count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Outside Radius:</span>
                                <span className="font-semibold text-orange-600">{monthlyStats?.outside_radius_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href={route('admin.users.create')}>
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                <span className="text-2xl mb-1">👤+</span>
                                <span className="text-xs">Add Employee</span>
                            </Button>
                        </Link>
                        <Link href={route('admin.locations.create')}>
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                <span className="text-2xl mb-1">📍+</span>
                                <span className="text-xs">Add Location</span>
                            </Button>
                        </Link>
                        <Link href={route('admin.attendances.index')}>
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                <span className="text-2xl mb-1">📊</span>
                                <span className="text-xs">View Records</span>
                            </Button>
                        </Link>
                        <Link href={route('admin.reports.index')}>
                            <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center">
                                <span className="text-2xl mb-1">📈</span>
                                <span className="text-xs">Reports</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Today's Live Attendance */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">🔴</span>
                            Live: Today's Attendance
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {todayAttendances.length > 0 ? todayAttendances.slice(0, 10).map((attendance, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{attendance.user?.name}</p>
                                        <p className="text-sm text-gray-600">{attendance.location?.name || 'Unknown location'}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(attendance.status)}`}>
                                            {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                        </span>
                                        {!attendance.is_within_radius && (
                                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                                📍 Out of range
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        In: {attendance.clock_in ? formatTime(attendance.clock_in) : 'N/A'} • 
                                        Out: {attendance.clock_out ? formatTime(attendance.clock_out) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500">
                                <span className="text-4xl mb-2 block">📋</span>
                                No attendance records for today
                            </div>
                        )}
                    </div>
                    {todayAttendances.length > 10 && (
                        <div className="p-4 border-t border-gray-200">
                            <Link href={route('admin.attendances.index')}>
                                <Button variant="outline" className="w-full">
                                    View All {todayAttendances.length} Records
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📅</span>
                            Recent Activity
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentAttendances.length > 0 ? recentAttendances.map((attendance, index) => (
                            <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl">👤</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{attendance.user?.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {formatDate(attendance.date)} • {attendance.location?.name || 'Unknown location'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(attendance.status)}`}>
                                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                    </span>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {attendance.work_hours || '0:00'} hours
                                    </p>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500">
                                <span className="text-4xl mb-2 block">📋</span>
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppShell>
    );
}