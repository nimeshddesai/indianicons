---
layout: page
title: "Luminaries"
permalink: /luminaries/
---
Indian luminaries across various fields have made remarkable contributions. Their innovative ideas and dedication have propelled India's progress on the global stage. These visionaries have not only excelled in their respective domains but have also inspired future generations to strive for greatness. Their legacies continue to enrich and uplift Indian society.

{% assign sorted_posts = site.categories.luminaries | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
