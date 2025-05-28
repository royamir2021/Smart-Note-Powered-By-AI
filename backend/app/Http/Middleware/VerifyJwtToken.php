<?php

namespace App\Http\Middleware;

use App\Services\JwtService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyJwtToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
{
    $token = $request->bearerToken();

    if (!$token) {
        return response()->json(['message' => 'Token not provided'], 401);
    }

    $payload = JwtService::validate($token);

    if (!$payload || !isset($payload->student_id)) {
        return response()->json(['message' => 'Invalid or expired token'], 401);
    }

    $payload=[
        'student_id' => $payload->student_id,
        'course_id' => $payload->course_id,
        'unit_number' => $payload->unit_number,
        'lesson_title' => $payload->lesson_title,
    ];
    $request->merge((array)$payload);

    return $next($request);
}

}
