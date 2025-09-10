<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\WorkHours
 *
 * @property int $id
 * @property string $name
 * @property string $start_time
 * @property string $end_time
 * @property int $break_duration
 * @property array $work_days
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours query()
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereBreakDuration($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereEndTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereStartTime($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours whereWorkDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder|WorkHours active()
 * @method static \Database\Factories\WorkHoursFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class WorkHours extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'break_duration',
        'work_days',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'work_days' => 'array',
        'is_active' => 'boolean',
        'break_duration' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the users for the work hours.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Scope a query to only include active work hours.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}