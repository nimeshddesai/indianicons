---
layout: page
title: "Freedom Fighters"
permalink: /freedom-fighters/
---
India's long struggle to freedom in full of brave stories of extraordinary people. India's freedom fighters of the non-violence movement were instrumental in the country's struggle for independence from British colonial rule. The legacy of the non-violence movement remains a powerful testament to the effectiveness of peaceful resistance in achieving political and social change.

{% assign sorted_posts = site.categories.freedom-fighters | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
