---
layout: default
title: "Scientists"
---
{% for post in site.categories.scientists %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}
