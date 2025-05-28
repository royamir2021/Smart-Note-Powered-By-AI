<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NoteFilterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'student_id' => 'required|integer|exists:students,id',
            'course_id' => 'required|integer|exists:courses,id',
            'unit_number' => 'nullable|integer',
            'lesson_title' => 'nullable|string|max:255',
        ];
    }
}
