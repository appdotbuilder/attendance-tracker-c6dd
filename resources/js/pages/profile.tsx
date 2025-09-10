import React from 'react';
import { Head } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    employee_id?: string;
    phone?: string;
    address?: string;
    hire_date?: string;
    is_active: boolean;
    position?: { name: string };
    work_hours?: { 
        name: string; 
        start_time: string; 
        end_time: string;
        break_duration: number;
        work_days: number[];
    };
}

interface Props {
    user: User;
    [key: string]: unknown;
}

export default function Profile({ user }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppShell>
            <Head title="Profile" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-8 text-white">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <span className="text-4xl">👤</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <p className="text-indigo-100 text-lg">
                                {user.position?.name || 'Employee'} • {user.employee_id || 'No ID'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">📋</span>
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                                <p className="text-lg text-gray-900">{user.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email Address</label>
                                <p className="text-lg text-gray-900">{user.email}</p>
                            </div>
                            {user.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                                    <p className="text-lg text-gray-900">{user.phone}</p>
                                </div>
                            )}
                            {user.address && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Address</label>
                                    <p className="text-lg text-gray-900">{user.address}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Work Information */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">💼</span>
                            Work Information
                        </h2>
                        <div className="space-y-4">
                            {user.employee_id && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Employee ID</label>
                                    <p className="text-lg text-gray-900 font-mono">{user.employee_id}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Position</label>
                                <p className="text-lg text-gray-900">{user.position?.name || 'Not assigned'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Work Schedule</label>
                                <p className="text-lg text-gray-900">
                                    {user.work_hours ? 
                                        `${user.work_hours.name} (${user.work_hours.start_time} - ${user.work_hours.end_time})` 
                                        : 'Not assigned'
                                    }
                                </p>
                            </div>
                            {user.hire_date && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Hire Date</label>
                                    <p className="text-lg text-gray-900">{formatDate(user.hire_date)}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Status</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                    user.is_active 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work Schedule Details */}
                {user.work_hours && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                            <span className="mr-2">⏰</span>
                            Schedule Details
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Work Hours</label>
                                <p className="text-lg text-gray-900">
                                    {user.work_hours.start_time} - {user.work_hours.end_time}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Break Duration</label>
                                <p className="text-lg text-gray-900">{user.work_hours.break_duration} minutes</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Work Days</label>
                                <div className="flex space-x-1">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                        <span 
                                            key={index}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                                user.work_hours?.work_days.includes(index)
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-400'
                                            }`}
                                        >
                                            {day.charAt(0)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">⚙️</span>
                        Account Actions
                    </h2>
                    <div className="space-y-3">
                        <p className="text-gray-600">
                            To update your profile information, please contact your administrator.
                        </p>
                        <div className="flex space-x-4">
                            <Button variant="outline">
                                📧 Contact Admin
                            </Button>
                            <Button variant="outline">
                                🔒 Change Password
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppShell>
    );
}