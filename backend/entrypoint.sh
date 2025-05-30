#!/bin/bash

composer install --no-interaction --optimize-autoloader

php artisan key:generate
php artisan jwt:secret --force
php artisan migrate --force
php artisan l5-swagger:generate
php artisan storage:link

chown -R www-data:www-data storage bootstrap/cache

exec php-fpm
