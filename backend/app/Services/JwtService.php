<?php

namespace App\Services;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtService
{
    public static function generate(array $payload): string
    {
//        dd(config('jwt.expires_in', 3600));
        $payload['exp'] = time() + config('jwt.expires_in');
        $payload['iat'] = time();

        return JWT::encode(
            $payload,
            config('jwt.secret'),
            'HS256'
        );
    }

    public static function validate(string $token): ?object
    {
        try {
            return JWT::decode(
                $token,
                new Key(config('jwt.secret'), 'HS256')
            );
        } catch (\Exception $e) {
            return null;
        }
    }
}
