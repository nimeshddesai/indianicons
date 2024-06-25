---
layout: page
title: "Social Reformers"
permalink: /social-reformers/
---
{% assign sorted_posts = site.categories.social-reformers | sort: 'date' %}
{% for post in sorted_posts %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
{% endfor %}
