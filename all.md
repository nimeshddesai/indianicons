---
layout: page
title: "All Heroes"
permalink: /all/
---
{% assign sorted_posts = site.posts | sort: 'date' %}

This blog is dedicated to some of the Indian heroes who have played a significant role in uplifting the country over the last two centuries. There are total {{ sorted_posts | size }} stories.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
