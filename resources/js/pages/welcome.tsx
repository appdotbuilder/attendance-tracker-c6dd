import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Smart Attendance System" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                {/* Header */}
                <header className="px-6 py-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">📍</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">AttendanceTracker</span>
                        </div>
                        <div className="space-x-4">
                            <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                                Login
                            </Link>
                            <Link href="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <main className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            📍 Smart Attendance System
                            <span className="block text-blue-600 mt-2">with GPS Location Tracking</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Modern attendance management with automatic location detection. Perfect for businesses 
                            that need accurate, reliable employee time tracking with geolocation verification.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="text-lg px-8 py-3">
                                    🚀 Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                                    👨‍💼 Admin Login
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">GPS Location Tracking</h3>
                            <p className="text-gray-600">
                                Automatic location detection when clocking in/out. Verify employees are at designated work locations.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-time Dashboard</h3>
                            <p className="text-gray-600">
                                Live attendance monitoring, statistics, and reporting. Get instant insights into attendance patterns.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">⏰</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Flexible Work Hours</h3>
                            <p className="text-gray-600">
                                Configure multiple shift patterns, work schedules, and break times for different employee groups.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Employee Management</h3>
                            <p className="text-gray-600">
                                Comprehensive user management with positions, departments, and role-based access control.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Mobile Friendly</h3>
                            <p className="text-gray-600">
                                Responsive design works perfectly on phones, tablets, and desktops. Clock in from anywhere.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <span className="text-2xl">📈</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Reports</h3>
                            <p className="text-gray-600">
                                Generate detailed attendance reports, export data, and analyze productivity trends over time.
                            </p>
                        </div>
                    </div>

                    {/* Screenshots Preview */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-16">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
                            📸 See It In Action
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 h-48 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">👨‍💼</div>
                                        <h4 className="font-semibold text-gray-900">Admin Dashboard</h4>
                                        <p className="text-sm text-gray-600">Complete overview of all employees</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 h-48 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📍</div>
                                        <h4 className="font-semibold text-gray-900">Location Tracking</h4>
                                        <p className="text-sm text-gray-600">GPS verification for attendance</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl p-6 h-48 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">⏱️</div>
                                        <h4 className="font-semibold text-gray-900">Clock In/Out</h4>
                                        <p className="text-sm text-gray-600">Simple one-tap attendance</p>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 h-48 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📊</div>
                                        <h4 className="font-semibold text-gray-900">Reports & Analytics</h4>
                                        <p className="text-sm text-gray-600">Detailed attendance insights</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Features */}
                    <div className="bg-gray-900 rounded-2xl p-8 text-white mb-16">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-8">
                                🎯 Powerful Admin Features
                            </h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">👥</span> Employee Management
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Add, edit, and manage employee accounts</li>
                                        <li>• Assign positions and work schedules</li>
                                        <li>• Track employee information and history</li>
                                        <li>• Generate ID cards with QR codes</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">📊</span> Analytics & Reports
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Daily, weekly, monthly attendance reports</li>
                                        <li>• Location compliance monitoring</li>
                                        <li>• Late arrival and early departure tracking</li>
                                        <li>• Export data to Excel and PDF</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">🏢</span> Location Management
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Define office locations with GPS coordinates</li>
                                        <li>• Set attendance radius for each location</li>
                                        <li>• Monitor out-of-bounds attendance</li>
                                        <li>• Multiple location support</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                                        <span className="mr-2">⚙️</span> System Configuration
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Flexible work hour templates</li>
                                        <li>• Holiday and leave management</li>
                                        <li>• Role-based access control</li>
                                        <li>• Automated notifications and alerts</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center bg-blue-600 rounded-2xl p-12 text-white">
                        <h2 className="text-3xl font-bold mb-4">
                            🚀 Ready to Transform Your Attendance Management?
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join hundreds of companies using our smart attendance system
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                                    🎯 Start Free Trial
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="ghost" className="text-white border-white hover:bg-blue-700 text-lg px-8 py-3">
                                    🔐 Admin Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 py-8 px-6">
                    <div className="max-w-7xl mx-auto text-center text-gray-600">
                        <p>&copy; 2024 AttendanceTracker. Built with ❤️ for modern businesses.</p>
                    </div>
                </footer>
            </div>
        </>
    );
}