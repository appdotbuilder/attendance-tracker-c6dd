<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkHoursRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'break_duration' => 'required|integer|min:0|max:480',
            'work_days' => 'required|array|min:1',
            'work_days.*' => 'integer|between:0,6',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Work hours name is required.',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            'end_time.required' => 'End time is required.',
            'end_time.date_format' => 'End time must be in HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            'break_duration.required' => 'Break duration is required.',
            'break_duration.min' => 'Break duration cannot be negative.',
            'break_duration.max' => 'Break duration cannot exceed 8 hours (480 minutes).',
            'work_days.required' => 'At least one work day must be selected.',
            'work_days.min' => 'At least one work day must be selected.',
            'work_days.*.between' => 'Invalid work day selected.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_active' => $this->boolean('is_active', true),
        ]);

        // Convert time inputs to proper format
        if ($this->has('start_time') && strlen($this->input('start_time')) === 5) {
            $this->merge(['start_time' => $this->input('start_time')]);
        }
        
        if ($this->has('end_time') && strlen($this->input('end_time')) === 5) {
            $this->merge(['end_time' => $this->input('end_time')]);
        }
    }
}