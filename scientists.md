---
layout: page
title: "Scientists"
permalink: /scientists/
---
Indian scientists have made significant contributions to various fields, driving advancements in space exploration, nuclear technology, and information technology. Their innovative research and development efforts have positioned India as a global leader in science and technology. These pioneers have not only solved complex problems but also inspired future generations to pursue scientific excellence. Their achievements have greatly enhanced India's reputation on the world stage.

{% assign sorted_posts = site.categories.scientists | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
