<?php

namespace App\Helpers;

class JsonToHtml
{
    public static function render($json): string
    {
        if (!is_array($json)) {
            $json = json_decode($json, true);
        }

        if (!isset($json['content']) || !is_array($json['content'])) {
            return '';
        }

        $html = '';

        foreach ($json['content'] as $node) {
            $html .= self::renderNode($node);
        }

        return $html;
    }

    private static function renderNode(array $node): string
    {
        $tag = 'p';
        $style = '';
        $children = '';

        if (isset($node['content'])) {
            foreach ($node['content'] as $child) {
                $children .= self::renderNode($child);
            }
        }

        switch ($node['type'] ?? '') {
            case 'text':
                $text = htmlspecialchars($node['text'] ?? '', ENT_QUOTES, 'UTF-8');
                $marks = $node['marks'] ?? [];

                foreach ($marks as $mark) {
                    switch ($mark['type']) {
                        case 'bold':
                            $text = '<strong>' . $text . '</strong>';
                            break;
                        case 'italic':
                            $text = '<em>' . $text . '</em>';
                            break;
                        case 'underline':
                            $text = '<u>' . $text . '</u>';
                            break;
                        case 'color':
                            $style .= 'color:' . $mark['attrs']['color'] . ';';
                            break;
                        case 'textStyle':
                            if (!empty($mark['attrs']['fontSize'])) {
                                $style .= 'font-size:' . $mark['attrs']['fontSize'] . ';';
                            }
                            if (!empty($mark['attrs']['fontFamily'])) {
                                $style .= 'font-family:' . $mark['attrs']['fontFamily'] . ';';
                            }
                            break;
                        case 'subscript':
                            $text = '<sub>' . $text . '</sub>';
                            break;
                        case 'superscript':
                            $text = '<sup>' . $text . '</sup>';
                            break;
                    }
                }

                return '<span style="' . $style . '">' . $text . '</span>';

            case 'heading':
                $level = $node['attrs']['level'] ?? 2;
                return "<h{$level}>{$children}</h{$level}>";

            case 'paragraph':
                $align = $node['attrs']['textAlign'] ?? '';
                $style = $align ? "text-align:{$align};" : '';
                return "<p style='{$style}'>{$children}</p>";

            case 'bulletList':
                return "<ul>{$children}</ul>";

            case 'orderedList':
                return "<ol>{$children}</ol>";

            case 'listItem':
                return "<li>{$children}</li>";

            case 'taskList':
                return "<ul class='task-list'>{$children}</ul>";

            case 'taskItem':
                $checked = !empty($node['attrs']['checked']) ? 'checked' : '';
                return "<li><input type='checkbox' disabled {$checked}> {$children}</li>";

            case 'image':
                $src = $node['attrs']['src'] ?? '';
                if ($src && !str_starts_with($src, 'http')) {
                    $src = asset($src);
                }
                $alt = $node['attrs']['alt'] ?? '';
                return "<img src='{$src}' alt='{$alt}' style='max-width:100%; margin:10px 0;' />";

            case 'mathBlock':
                $latex = $node['attrs']['latex'] ?? '';
                return "<div class='math-block'>\\[{$latex}\\]</div>";

            case 'chartBlock':
                // later you can replace with actual rendered chart
                return "<div class='chart-placeholder'>📊 <i>Chart block (to be rendered)</i></div>";

            default:
                return $children; // fallback for unknown types
        }
    }
}
