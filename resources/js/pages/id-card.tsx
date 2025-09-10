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
    hire_date?: string;
    is_active: boolean;
    position?: { name: string };
    work_hours?: { name: string; start_time: string; end_time: string };
}

interface Props {
    user: User;
    [key: string]: unknown;
}

export default function IdCard({ user }: Props) {
    const handlePrint = () => {
        window.print();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    // Generate a simple QR code placeholder (in a real app, you'd use a QR code library)
    // const qrCodeData = `emp:${user.employee_id || user.id}:${user.email}`;

    return (
        <AppShell>
            <Head title="Employee ID Card" />
            
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">🆔 Employee ID Card</h1>
                        <p className="text-gray-600">Digital employee identification card</p>
                    </div>
                    <Button onClick={handlePrint} variant="outline">
                        🖨️ Print Card
                    </Button>
                </div>

                {/* ID Card */}
                <div className="flex justify-center">
                    <div className="w-96 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden print:shadow-none print:border print:border-gray-300">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white rounded-full"></div>
                            <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white rounded-full"></div>
                        </div>

                        {/* Company Header */}
                        <div className="relative z-10 text-center mb-6">
                            <div className="text-3xl mb-2">🏢</div>
                            <h2 className="text-xl font-bold">AttendanceTracker</h2>
                            <p className="text-sm opacity-80">Employee ID Card</p>
                        </div>

                        {/* Employee Photo Placeholder */}
                        <div className="relative z-10 flex justify-center mb-4">
                            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center border-4 border-white">
                                <span className="text-4xl">👤</span>
                            </div>
                        </div>

                        {/* Employee Information */}
                        <div className="relative z-10 text-center space-y-2">
                            <h3 className="text-xl font-bold">{user.name}</h3>
                            <p className="text-sm opacity-90">{user.position?.name || 'Employee'}</p>
                            
                            <div className="bg-white bg-opacity-20 rounded-lg p-3 mt-4">
                                <div className="text-xs opacity-80 mb-1">Employee ID</div>
                                <div className="text-lg font-bold font-mono">{user.employee_id || `EMP${user.id.toString().padStart(4, '0')}`}</div>
                            </div>

                            <div className="text-xs opacity-80 mt-4">
                                <p>Hire Date: {user.hire_date ? formatDate(user.hire_date) : 'N/A'}</p>
                                <p>Email: {user.email}</p>
                                {user.phone && <p>Phone: {user.phone}</p>}
                            </div>
                        </div>

                        {/* QR Code Placeholder */}
                        <div className="relative z-10 flex justify-center mt-4">
                            <div className="bg-white p-2 rounded-lg">
                                <div className="w-16 h-16 bg-black bg-opacity-80 rounded flex items-center justify-center">
                                    <div className="text-xs text-white font-mono leading-none">
                                        QR<br/>CODE
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Features */}
                        <div className="relative z-10 text-center text-xs opacity-60 mt-4">
                            <p>Valid Until: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getFullYear()}</p>
                            <p>ID#{Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Card Back */}
                <div className="flex justify-center mt-8">
                    <div className="w-96 bg-gray-100 rounded-2xl p-8 shadow-lg print:shadow-none print:border print:border-gray-300">
                        <div className="text-center text-gray-800">
                            <h3 className="text-lg font-bold mb-4">📋 Employee Information</h3>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">Department:</span>
                                    <span>{user.position?.name || 'General'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Work Schedule:</span>
                                    <span>{user.work_hours?.name || 'Standard'}</span>
                                </div>
                                {user.work_hours && (
                                    <div className="flex justify-between">
                                        <span className="font-medium">Hours:</span>
                                        <span>{user.work_hours.start_time} - {user.work_hours.end_time}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="font-medium">Status:</span>
                                    <span className={user.is_active ? 'text-green-600' : 'text-red-600'}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">🔒 Security Notice</h4>
                                <p className="text-xs text-blue-800">
                                    This card is for identification purposes only. 
                                    Report lost or stolen cards immediately to HR.
                                </p>
                            </div>

                            <div className="mt-4 text-xs text-gray-500">
                                <p>Generated on: {new Date().toLocaleDateString()}</p>
                                <p>Card Version: 2.0</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Usage Instructions */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 print:hidden">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">📖</span>
                        How to Use Your ID Card
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Digital Display</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Show this card on your mobile device</li>
                                <li>• Use for identification at work</li>
                                <li>• Take screenshot for offline access</li>
                                <li>• Share QR code for quick verification</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Physical Card</h3>
                            <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Print on cardstock or photo paper</li>
                                <li>• Laminate for durability</li>
                                <li>• Report lost cards immediately</li>
                                <li>• Keep your card information secure</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        body { 
                            margin: 0;
                            padding: 20px;
                            font-size: 12px;
                        }
                        .print\\:hidden {
                            display: none !important;
                        }
                        .print\\:shadow-none {
                            box-shadow: none !important;
                        }
                        .print\\:border {
                            border: 1px solid #ccc !important;
                        }
                    }
                `
            }} />
        </AppShell>
    );
}