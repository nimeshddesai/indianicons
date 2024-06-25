---
layout: page
title: "Scientists"
permalink: /scientists/
---
{% assign sorted_posts = site.categories.scientists | sort: 'date' %}
{% for post in sorted_posts %}
<h2><a href="{{ post.url }}">{{ post.title }}</a></h2>
<p>{{ post.excerpt }}</p>
{% endfor %}
