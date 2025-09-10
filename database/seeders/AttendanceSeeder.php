<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Position;
use App\Models\WorkHours;
use App\Models\Location;
use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create positions
        $positions = [
            ['name' => 'Software Developer', 'description' => 'Full-stack software developer', 'salary' => 75000],
            ['name' => 'Project Manager', 'description' => 'IT project management', 'salary' => 85000],
            ['name' => 'HR Manager', 'description' => 'Human resources management', 'salary' => 70000],
            ['name' => 'Sales Representative', 'description' => 'Sales and customer relations', 'salary' => 60000],
            ['name' => 'Marketing Coordinator', 'description' => 'Marketing campaigns and content', 'salary' => 55000],
        ];

        foreach ($positions as $positionData) {
            Position::create($positionData);
        }

        // Create work hours
        $workHoursData = [
            [
                'name' => 'Standard Day Shift',
                'start_time' => '09:00:00',
                'end_time' => '17:00:00',
                'break_duration' => 60,
                'work_days' => [1, 2, 3, 4, 5], // Monday to Friday
            ],
            [
                'name' => 'Early Bird Shift',
                'start_time' => '08:00:00',
                'end_time' => '16:00:00',
                'break_duration' => 60,
                'work_days' => [1, 2, 3, 4, 5],
            ],
            [
                'name' => 'Flexible Hours',
                'start_time' => '10:00:00',
                'end_time' => '18:00:00',
                'break_duration' => 60,
                'work_days' => [1, 2, 3, 4, 5],
            ],
        ];

        foreach ($workHoursData as $workHours) {
            WorkHours::create($workHours);
        }

        // Create locations
        $locations = [
            [
                'name' => 'Main Office',
                'address' => '123 Business Street, Downtown, City 12345',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'radius' => 100,
            ],
            [
                'name' => 'Branch Office North',
                'address' => '456 Corporate Avenue, Uptown, City 12346',
                'latitude' => 40.7589,
                'longitude' => -73.9851,
                'radius' => 150,
            ],
            [
                'name' => 'Remote Work Hub',
                'address' => '789 Coworking Plaza, Midtown, City 12347',
                'latitude' => 40.7505,
                'longitude' => -73.9934,
                'radius' => 200,
            ],
        ];

        foreach ($locations as $locationData) {
            Location::create($locationData);
        }

        // Create admin user
        $admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@attendance.com',
            'password' => Hash::make('password'),
            'employee_id' => 'ADM001',
            'phone' => '+1-555-0100',
            'role' => 'admin',
            'is_active' => true,
            'hire_date' => now()->subYears(2),
            'email_verified_at' => now(),
        ]);

        // Create regular users with different positions and work hours
        $users = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@attendance.com',
                'password' => Hash::make('password'),
                'employee_id' => 'EMP001',
                'phone' => '+1-555-0101',
                'role' => 'user',
                'position_id' => 1, // Software Developer
                'work_hours_id' => 1, // Standard Day Shift
                'hire_date' => now()->subMonths(8),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@attendance.com',
                'password' => Hash::make('password'),
                'employee_id' => 'EMP002',
                'phone' => '+1-555-0102',
                'role' => 'user',
                'position_id' => 2, // Project Manager
                'work_hours_id' => 2, // Early Bird Shift
                'hire_date' => now()->subMonths(12),
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael.brown@attendance.com',
                'password' => Hash::make('password'),
                'employee_id' => 'EMP003',
                'phone' => '+1-555-0103',
                'role' => 'user',
                'position_id' => 3, // HR Manager
                'work_hours_id' => 1, // Standard Day Shift
                'hire_date' => now()->subMonths(15),
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily.davis@attendance.com',
                'password' => Hash::make('password'),
                'employee_id' => 'EMP004',
                'phone' => '+1-555-0104',
                'role' => 'user',
                'position_id' => 4, // Sales Representative
                'work_hours_id' => 3, // Flexible Hours
                'hire_date' => now()->subMonths(6),
            ],
            [
                'name' => 'David Wilson',
                'email' => 'david.wilson@attendance.com',
                'password' => Hash::make('password'),
                'employee_id' => 'EMP005',
                'phone' => '+1-555-0105',
                'role' => 'user',
                'position_id' => 5, // Marketing Coordinator
                'work_hours_id' => 1, // Standard Day Shift
                'hire_date' => now()->subMonths(4),
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $userData['email_verified_at'] = now();
            $userData['is_active'] = true;
            $createdUsers[] = User::create($userData);
        }

        // Create sample attendance records for the past 30 days
        $locations = Location::all();
        
        foreach ($createdUsers as $user) {
            for ($i = 29; $i >= 0; $i--) {
                $date = now()->subDays($i);
                
                // Skip weekends for most users (80% chance)
                if ($date->isWeekend() && random_int(1, 100) <= 80) {
                    continue;
                }

                $location = $locations->random();
                
                // Generate random but realistic attendance times
                $startTime = $user->workHours ? $user->workHours->start_time : '09:00:00';
                $baseClockIn = $date->copy()->setTimeFromTimeString($startTime);
                
                // Add some randomness to clock in time (±30 minutes)
                $clockInVariation = random_int(-30, 30);
                $clockIn = $baseClockIn->addMinutes($clockInVariation);
                
                // Determine status based on clock in time
                $lateThreshold = $baseClockIn->copy()->addMinutes(15);
                $status = $clockIn->gt($lateThreshold) ? 'late' : 'present';
                
                // 90% chance of having both clock in and out
                $clockOut = null;
                if (random_int(1, 100) <= 90) {
                    $workDuration = random_int(7, 9) * 60 + random_int(-30, 30); // 7-9 hours ±30 min
                    $clockOut = $clockIn->copy()->addMinutes($workDuration);
                }

                // Random coordinates near the location (±0.001 degrees ≈ ±100 meters)
                $latVariation = (random_int(-100, 100) / 100000);
                $lonVariation = (random_int(-100, 100) / 100000);
                
                $clockInLat = $location->latitude + $latVariation;
                $clockInLon = $location->longitude + $lonVariation;
                
                // 85% chance of being within radius
                $isWithinRadius = random_int(1, 100) <= 85;
                if (!$isWithinRadius) {
                    // Move coordinates further away
                    $clockInLat += (random_int(1, 5) / 1000) * (random_int(0, 1) ? 1 : -1);
                    $clockInLon += (random_int(1, 5) / 1000) * (random_int(0, 1) ? 1 : -1);
                }

                Attendance::create([
                    'user_id' => $user->id,
                    'location_id' => $location->id,
                    'date' => $date->format('Y-m-d'),
                    'clock_in' => $clockIn,
                    'clock_out' => $clockOut,
                    'clock_in_latitude' => $clockInLat,
                    'clock_in_longitude' => $clockInLon,
                    'clock_out_latitude' => $clockOut ? ($clockInLat + (random_int(-10, 10) / 10000)) : null,
                    'clock_out_longitude' => $clockOut ? ($clockInLon + (random_int(-10, 10) / 10000)) : null,
                    'is_within_radius' => $isWithinRadius,
                    'status' => $status,
                    'notes' => random_int(1, 100) <= 20 ? 'Generated sample data for demonstration' : null,
                ]);
            }
        }

        $this->command->info('✅ Attendance system seeded successfully!');
        $this->command->info('📧 Admin login: admin@attendance.com / password');
        $this->command->info('👤 Sample user: john.smith@attendance.com / password');
    }
}