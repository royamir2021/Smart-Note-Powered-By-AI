<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\GenerateIframeTokenRequest;
use App\Services\JwtService;


/**
 * @OA\Info(
 *     title="LMS API Documentation",
 *     version="1.0.0",
 *     description="API documentation for LMS Smart Notebook project"
 * )
 *
 * @OA\SecurityScheme(
 *   securityScheme="bearerAuth",
 *   type="http",
 *   scheme="bearer",
 *   bearerFormat="JWT"
 * )
 */

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/v1/auth/iframe-token",
     *     summary="Generate JWT token for LMS iframe",
     *     tags={"Auth"},
     *     description="Generate a JWT access token for a student to use in LMS iframe. Returns the token, expiration time (seconds), and issued timestamp.",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"student_id","course_id","unit_number","lesson_title"},
     *             @OA\Property(property="student_id", type="integer", example=1),
     *             @OA\Property(property="course_id", type="integer", example=2),
     *             @OA\Property(property="unit_number", type="integer", example=2),
     *             @OA\Property(property="lesson_title", type="string", example="Introduction to JWT")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="JWT token and session info",
     *         @OA\JsonContent(
     *             @OA\Property(property="token", type="string", example="eyJ0eXAiOiJK..."),
     *             @OA\Property(property="expires_in", type="integer", example=3600),
     *             @OA\Property(property="issued_at", type="integer", example=1716200000)
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     )
     * )
     */


    public function generateIframeToken(GenerateIframeTokenRequest  $request)
    {

        $data = $request->validated();

        $token = JwtService::generate($data);

        return response()->json([
            'token' => $token,
            'expires_in' => config('jwt.expires_in'),
            'issued_at' => time(),
        ]);
    }

}
