<?php
namespace App\Helpers;

class JsonToText
{
    public static function extractText($json): string
    {
        if (!is_array($json)) {
            $json = json_decode($json, true);
        }

        if (!isset($json['content']) || !is_array($json['content'])) {
            return '';
        }

        $text = '';

        foreach ($json['content'] as $node) {

            if (isset($node['type']) && $node['type'] === 'text' && isset($node['text'])) {
                $text .= $node['text'] . ' ';
            }


            if (isset($node['content']) && is_array($node['content'])) {
                $text .= self::extractText(['content' => $node['content']]);
            }
        }

        return trim($text);
    }
}
