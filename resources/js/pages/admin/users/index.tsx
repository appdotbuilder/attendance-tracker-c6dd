import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface User {
    id: number;
    name: string;
    email: string;
    employee_id?: string;
    hire_date?: string;
    is_active: boolean;
    role: string;
    position_id?: number;
    position?: { name: string };
    work_hours?: { name: string };
}

interface PaginatedUsers {
    data: User[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    meta: { total: number; from: number; to: number };
}

interface Props {
    users: PaginatedUsers;
    [key: string]: unknown;
}

export default function UsersIndex({ users }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppShell>
            <Head title="Manage Users" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <span className="mr-2">👥</span>
                            Manage Users
                        </h1>
                        <p className="text-gray-600">Add, edit, and manage employee accounts</p>
                    </div>
                    <Link href={route('admin.users.create')}>
                        <Button>
                            ➕ Add User
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{users.meta.total}</div>
                        <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {users.data.filter(u => u.is_active).length}
                        </div>
                        <div className="text-sm text-gray-600">Active</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {users.data.filter(u => u.role === 'admin').length}
                        </div>
                        <div className="text-sm text-gray-600">Admins</div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {users.data.filter(u => !u.position_id).length}
                        </div>
                        <div className="text-sm text-gray-600">No Position</div>
                    </div>
                </div>

                {/* Users List */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Employee List</h2>
                    </div>
                    
                    {users.data.length > 0 ? (
                        <>
                            {/* Desktop View */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Employee
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Position
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Work Hours
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Hire Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.map((user, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <span className="text-lg">👤</span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                            <div className="text-xs text-gray-400">{user.employee_id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {user.position?.name || 'Not assigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {user.work_hours?.name || 'Not assigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {user.hire_date ? formatDate(user.hire_date) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-1">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            user.is_active 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {user.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                        {user.role === 'admin' && (
                                                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                                                Admin
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex space-x-2">
                                                        <Link href={route('admin.users.show', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                👁️ View
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('admin.users.edit', user.id)}>
                                                            <Button variant="outline" size="sm">
                                                                ✏️ Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="md:hidden divide-y divide-gray-200">
                                {users.data.map((user, index) => (
                                    <div key={index} className="p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <span className="text-lg">👤</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                                                    <p className="text-sm text-gray-500">{user.employee_id}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                {user.role === 'admin' && (
                                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                                        Admin
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>📧 {user.email}</p>
                                            <p>💼 {user.position?.name || 'No position assigned'}</p>
                                            <p>⏰ {user.work_hours?.name || 'No work hours assigned'}</p>
                                            {user.hire_date && <p>📅 Hired: {formatDate(user.hire_date)}</p>}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link href={route('admin.users.show', user.id)}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    👁️ View
                                                </Button>
                                            </Link>
                                            <Link href={route('admin.users.edit', user.id)}>
                                                <Button variant="outline" size="sm" className="flex-1">
                                                    ✏️ Edit
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {users.links && users.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Showing {users.meta.from || 0} to {users.meta.to || 0} of {users.meta.total} results
                                        </div>
                                        <div className="flex space-x-1">
                                            {users.links.map((link, index) => {
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
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h3>
                            <p className="text-gray-600 mb-6">Start by adding your first employee.</p>
                            <Link href={route('admin.users.create')}>
                                <Button>
                                    ➕ Add First User
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppShell>
    );
}