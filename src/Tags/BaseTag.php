<?php

namespace JackSleight\StatamicMemberbox\Tags;

use Statamic\Support\Str;
use Statamic\Tags\TagNotFoundException;
use Statamic\Tags\Tags;

class BaseTag extends Tags
{
    protected static $handle = 'mb';

    protected $tagClasses = [
        'user'   => UserTags::class,
        'member' => MemberTags::class,
    ];

    public function wildcard(string $tag)
    {
        $tag = explode(':', $tag);

        $class = collect($this->tagClasses)
            ->map(function ($value, $key) {
                return [
                    'key'   => $key,
                    'value' => $value,
                ];
            })
            ->where('key', $tag[0])
            ->pluck('value')
            ->first();

        $method = isset($tag[1]) ? Str::camel($tag[1]) : 'index';

        if (! $class) {
            throw new TagNotFoundException("Tag [{$tag[0]}] could not be found.");
        }

        $tags = new $class();
        $tags->setProperties([
            'parser'     => $this->parser,
            'content'    => $this->content,
            'context'    => $this->context,
            'params'     => $this->params,
            'tag'        => $this->tag,
            'tag_method' => $this->method,
        ]);

        if (method_exists($tags, $method)) {
            return $tags->{$method}();
        }

        if (method_exists($tags, 'wildcard')) {
            return $tags->wildcard($method);
        }

        throw new TagNotFoundException("Tag [{$tag[0]}] could not be found.");
    }
}
