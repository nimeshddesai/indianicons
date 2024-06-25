---
layout: page
title: "Freedom Fighters"
permalink: /freedom-fighters/
---
{% assign sorted_posts = site.categories.freedom-fighters | sort: 'date' %}
{% for post in sorted_posts %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
{% endfor %}
