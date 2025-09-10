import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    employee_id?: string;
    position?: { name: string };
    work_hours?: { name: string };
    is_active: boolean;
}

interface Attendance {
    id: number;
    date: string;
    clock_in?: string;
    clock_out?: string;
    status: string;
    work_hours?: string;
    location?: { name: string };
}

interface MonthlyStats {
    total_days: number;
    present_days: number;
    late_days: number;
    avg_work_minutes: number;
}

interface Props {
    user: User;
    todayAttendance?: Attendance;
    recentAttendances: Attendance[];
    monthlyStats?: MonthlyStats;
    [key: string]: unknown;
}

export default function UserDashboard({ user, todayAttendance, recentAttendances, monthlyStats }: Props) {
    const handleQuickClockIn = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    router.post(route('attendance.store'), {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }, {
                        preserveState: true,
                    });
                },
                () => {
                    alert('Location access is required for attendance. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleQuickClockOut = () => {
        if (!todayAttendance) return;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    router.put(route('attendance.update', todayAttendance.id), {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }, {
                        preserveState: true,
                    });
                },
                () => {
                    alert('Location access is required for attendance. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

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
            year: 'numeric',
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

    const avgWorkHours = monthlyStats?.avg_work_minutes 
        ? Math.round(monthlyStats.avg_work_minutes / 60 * 100) / 100 
        : 0;

    return (
        <AppShell>
            <Head title="Dashboard" />
            
            <div className="space-y-6">
                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Welcome back, {user.name}! 👋</h1>
                            <p className="text-blue-100 mt-1">
                                {user.position?.name || 'Employee'} • {user.employee_id || 'No ID'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-blue-100 text-sm">Today</p>
                            <p className="text-xl font-semibold">
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Today's Attendance */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">⏰</span>
                            Today's Attendance
                        </h2>
                        
                        {todayAttendance ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Clock In</p>
                                        <p className="text-lg font-semibold">
                                            {todayAttendance.clock_in ? formatTime(todayAttendance.clock_in) : 'Not clocked in'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Clock Out</p>
                                        <p className="text-lg font-semibold">
                                            {todayAttendance.clock_out ? formatTime(todayAttendance.clock_out) : 'Not clocked out'}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(todayAttendance.status)}`}>
                                        {todayAttendance.status.charAt(0).toUpperCase() + todayAttendance.status.slice(1)}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Work Hours: {todayAttendance.work_hours || '0:00'}
                                    </span>
                                </div>

                                {!todayAttendance.clock_out && todayAttendance.clock_in && (
                                    <Button 
                                        onClick={handleQuickClockOut}
                                        className="w-full bg-red-600 hover:bg-red-700"
                                    >
                                        🕐 Clock Out Now
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-600 mb-4">You haven't clocked in today</p>
                                <Button 
                                    onClick={handleQuickClockIn}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    🕐 Clock In Now
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">🚀</span>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href={route('attendance.index')}>
                                <Button variant="outline" className="w-full h-16 flex flex-col items-center">
                                    <span className="text-lg mb-1">📍</span>
                                    <span className="text-xs">Attendance</span>
                                </Button>
                            </Link>
                            <Link href={route('profile')}>
                                <Button variant="outline" className="w-full h-16 flex flex-col items-center">
                                    <span className="text-lg mb-1">👤</span>
                                    <span className="text-xs">Profile</span>
                                </Button>
                            </Link>
                            <Link href={route('id-card')}>
                                <Button variant="outline" className="w-full h-16 flex flex-col items-center">
                                    <span className="text-lg mb-1">🆔</span>
                                    <span className="text-xs">ID Card</span>
                                </Button>
                            </Link>
                            <Link href={route('attendance.history')}>
                                <Button variant="outline" className="w-full h-16 flex flex-col items-center">
                                    <span className="text-lg mb-1">📊</span>
                                    <span className="text-xs">History</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{monthlyStats?.total_days || 0}</div>
                        <div className="text-sm text-gray-600">Days This Month</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{monthlyStats?.present_days || 0}</div>
                        <div className="text-sm text-gray-600">Present Days</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-600">{monthlyStats?.late_days || 0}</div>
                        <div className="text-sm text-gray-600">Late Days</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{avgWorkHours}h</div>
                        <div className="text-sm text-gray-600">Avg Work Hours</div>
                    </div>
                </div>

                {/* Recent Attendance */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                            <span className="mr-2">📅</span>
                            Recent Attendance
                        </h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {recentAttendances.length > 0 ? recentAttendances.map((attendance, index) => (
                            <div key={index} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{formatDate(attendance.date)}</p>
                                    <p className="text-sm text-gray-600">
                                        {attendance.location?.name || 'Unknown location'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-900">
                                        {attendance.clock_in ? formatTime(attendance.clock_in) : 'No clock in'} - {' '}
                                        {attendance.clock_out ? formatTime(attendance.clock_out) : 'No clock out'}
                                    </p>
                                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(attendance.status)}`}>
                                        {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="p-8 text-center text-gray-500">
                                <span className="text-4xl mb-2 block">📋</span>
                                No attendance records yet
                            </div>
                        )}
                    </div>
                    {recentAttendances.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                            <Link href={route('attendance.history')}>
                                <Button variant="outline" className="w-full">
                                    View All History
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}