FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git unzip libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring bcmath

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction
RUN docker-php-ext-enable opcache

RUN mkdir -p storage/framework/{cache,sessions,views} storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 9000

CMD ["php-fpm"]
