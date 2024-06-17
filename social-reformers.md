---
layout: page
title: "Social Reformers"
permalink: /social-reformers/
---
{% for post in site.categories.social-reformers %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}
