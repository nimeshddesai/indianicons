---
layout: page
title: "Luminaries"
permalink: /luminaries/
---
{% for post in site.categories.luminaries %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}
