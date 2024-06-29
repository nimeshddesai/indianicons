---
layout: page
title: "Revolutionaries"
permalink: /revolutionaries/
---
India's revolutionaries played a crucial role in the struggle for independence from British rule by resorting to radical measures and armed rebellion, contrasting with the non-violent resistance of mainstream leaders. They were the icons of bravery and defiance, inspiring many to join the fight for freedom. Their actions and sacrifices, alongside efforts to awaken national consciousness, significantly fueled the spirit of resistance and highlighted the urgency of achieving independence.

{% assign sorted_posts = site.categories.revolutionaries | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
