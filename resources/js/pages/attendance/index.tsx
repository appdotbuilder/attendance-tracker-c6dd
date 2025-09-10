import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';

interface Location {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    radius: number;
}

interface Attendance {
    id: number;
    date: string;
    clock_in?: string;
    clock_out?: string;
    work_hours?: string;
}

interface Props {
    todayAttendance?: Attendance;
    locations: Location[];
    canClockIn: boolean;
    canClockOut: boolean;
    [key: string]: unknown;
}

export default function AttendanceIndex({ todayAttendance, locations, canClockIn, canClockOut }: Props) {
    const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
    const [locationError, setLocationError] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [nearestLocation, setNearestLocation] = useState<(Location & { distance: number }) | null>(null);

    useEffect(() => {
        getCurrentLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation(position);
                    findNearestLocation(position.coords.latitude, position.coords.longitude);
                    setLocationError('');
                },
                () => {
                    setLocationError('Unable to get your location. Please enable location services.');
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
        } else {
            setLocationError('Geolocation is not supported by this browser.');
        }
    };

    const findNearestLocation = (lat: number, lon: number) => {
        if (locations.length === 0) return;

        let nearest = locations[0];
        let minDistance = calculateDistance(lat, lon, nearest.latitude, nearest.longitude);

        locations.forEach(location => {
            const distance = calculateDistance(lat, lon, location.latitude, location.longitude);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = location;
            }
        });

        setNearestLocation({ ...nearest, distance: minDistance });
    };

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    };

    const handleClockIn = () => {
        if (!currentLocation) {
            setLocationError('Please allow location access to clock in.');
            return;
        }

        setIsProcessing(true);
        router.post(route('attendance.store'), {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            notes: notes,
        }, {
            preserveState: false,
            onFinish: () => setIsProcessing(false),
        });
    };

    const handleClockOut = () => {
        if (!currentLocation || !todayAttendance) {
            setLocationError('Please allow location access to clock out.');
            return;
        }

        setIsProcessing(true);
        router.put(route('attendance.update', todayAttendance.id), {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            notes: notes,
        }, {
            preserveState: false,
            onFinish: () => setIsProcessing(false),
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isWithinRadius = nearestLocation && nearestLocation.distance <= nearestLocation.radius;

    return (
        <AppShell>
            <Head title="Attendance" />
            
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">📍 Attendance</h1>
                    <p className="text-gray-600">Clock in and out with automatic location detection</p>
                </div>

                {/* Current Time */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white text-center">
                    <p className="text-blue-100 mb-2">Current Time</p>
                    <p className="text-3xl font-bold">
                        {new Date().toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            second: '2-digit' 
                        })}
                    </p>
                    <p className="text-blue-100 mt-1">
                        {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>

                {/* Today's Status */}
                {todayAttendance && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Status</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Clock In</p>
                                <p className="text-lg font-semibold">
                                    {todayAttendance.clock_in ? formatTime(todayAttendance.clock_in) : 'Not clocked in'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Clock Out</p>
                                <p className="text-lg font-semibold">
                                    {todayAttendance.clock_out ? formatTime(todayAttendance.clock_out) : 'Not clocked out'}
                                </p>
                            </div>
                        </div>
                        {todayAttendance.work_hours && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-sm text-gray-600">Work Hours: <span className="font-semibold">{todayAttendance.work_hours}</span></p>
                            </div>
                        )}
                    </div>
                )}

                {/* Location Status */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="mr-2">🗺️</span>
                        Location Status
                    </h2>
                    
                    {locationError ? (
                        <div className="text-center py-4">
                            <div className="text-red-500 mb-4">
                                <span className="text-2xl block mb-2">❌</span>
                                {locationError}
                            </div>
                            <Button onClick={getCurrentLocation} variant="outline">
                                🔄 Retry Location Access
                            </Button>
                        </div>
                    ) : currentLocation ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Your Location:</span>
                                <span className="text-sm font-mono">
                                    {currentLocation.coords.latitude.toFixed(6)}, {currentLocation.coords.longitude.toFixed(6)}
                                </span>
                            </div>
                            
                            {nearestLocation && (
                                <>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Nearest Office:</span>
                                        <span className="text-sm font-semibold">{nearestLocation.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Distance:</span>
                                        <span className="text-sm">{Math.round(nearestLocation.distance)}m</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Within Range:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            isWithinRadius 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {isWithinRadius ? '✅ Yes' : '⚠️ Outside radius'}
                                        </span>
                                    </div>
                                </>
                            )}

                            {!isWithinRadius && nearestLocation && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-yellow-800 text-sm">
                                        <strong>Notice:</strong> You are outside the designated attendance area. 
                                        Your attendance will be recorded but flagged for review.
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
                            <p>Getting your location...</p>
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Add any notes about your attendance..."
                    />
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    {canClockIn && (
                        <Button
                            onClick={handleClockIn}
                            disabled={!currentLocation || isProcessing}
                            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700"
                        >
                            {isProcessing ? (
                                <span className="flex items-center">
                                    <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Processing...
                                </span>
                            ) : (
                                <>🕐 Clock In</>
                            )}
                        </Button>
                    )}

                    {canClockOut && (
                        <Button
                            onClick={handleClockOut}
                            disabled={!currentLocation || isProcessing}
                            className="w-full h-14 text-lg bg-red-600 hover:bg-red-700"
                        >
                            {isProcessing ? (
                                <span className="flex items-center">
                                    <div className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                    Processing...
                                </span>
                            ) : (
                                <>🕐 Clock Out</>
                            )}
                        </Button>
                    )}

                    {!canClockIn && !canClockOut && todayAttendance && (
                        <div className="text-center py-8">
                            <div className="text-green-500 mb-4">
                                <span className="text-4xl block mb-2">✅</span>
                                <h3 className="text-xl font-semibold">All Done for Today!</h3>
                                <p className="text-gray-600 mt-1">You have already clocked in and out.</p>
                            </div>
                        </div>
                    )}

                    <Button
                        onClick={getCurrentLocation}
                        variant="outline"
                        className="w-full"
                        disabled={isProcessing}
                    >
                        🔄 Refresh Location
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}