<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed a default admin user for the Filament panel.
     *
     * In production you should change these credentials immediately
     * (or create the user via `php artisan make:filament-user` instead).
     */
    public function run(): void
    {
        $defaults = [
            ['email' => 'admin@example.com', 'name' => 'Admin', 'password' => 'password'],
            ['email' => 'Mia@smartgarmentpeople.com', 'name' => 'Mia', 'password' => 'SmartGarment'],
            ['email' => 'cath@smartgarmentpeople.com', 'name' => 'Cath', 'password' => 'SmartGarment'],
        ];

        foreach ($defaults as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                ],
            );
        }
    }
}
