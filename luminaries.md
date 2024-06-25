---
layout: page
title: "Luminaries"
permalink: /luminaries/
---
{% assign sorted_posts = site.categories.luminaries | sort: 'date' %}
{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
