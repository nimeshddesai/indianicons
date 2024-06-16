---
layout: default
title: "Military Heroes"
---
{% for post in site.categories.military %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}
