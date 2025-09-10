<?php

use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/dashboard')->assertRedirect('/');
});

test('authenticated regular users can visit the home page', function () {
    $this->actingAs($user = User::factory()->user()->create());

    $this->get('/')->assertOk();
});

test('authenticated admin users are redirected to admin dashboard', function () {
    $this->actingAs($user = User::factory()->admin()->create());

    $this->get('/')->assertRedirect('/admin/dashboard');
});
