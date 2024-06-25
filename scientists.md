---
layout: page
title: "Scientists"
permalink: /scientists/
---
{% assign sorted_posts = site.categories.scientists | sort: 'date' %}
{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
