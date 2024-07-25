---
layout: page
title: "Kargil War Heroes"
permalink: /kargil/
---
<img src="/images/KargilIcons.png" alt="Kargil Icons Image"/>

The Kargil War of 1999 showcased the extraordinary bravery and resilience of India's military heroes as they defended the nation's borders in the challenging terrains of the Himalayas. Their strategic acumen and unwavering courage were pivotal in reclaiming occupied territories, demonstrating their commitment to India's sovereignty. The sacrifices made by these soldiers became a symbol of national pride and unity. Their legacy continues to inspire and honor India's armed forces.

{% assign sorted_posts = site.categories.kargil-heroes | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
