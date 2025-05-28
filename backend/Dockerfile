FROM php:8.2-fpm


RUN apt-get update && apt-get install -y \
    git unzip zip libpng-dev libonig-dev libxml2-dev libzip-dev curl libcurl4-openssl-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip


COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www


COPY . .


RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN docker-php-ext-enable opcache

RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
