---
layout: page
title: "Freedom Fighters"
permalink: /freedom-fighters/
---
{% for post in site.categories.freedom-fighters %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}
