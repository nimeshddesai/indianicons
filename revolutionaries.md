---
layout: default
title: "Revolutionaries"
---
{% for post in site.categories.revolutionaries %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}