<h1>{{ $note->title ?? '-' }}</h1>
{!! \App\Helpers\JsonToHtml::render($note->content) !!}
