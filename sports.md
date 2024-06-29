---
layout: page
title: "Sports"
permalink: /sports/
---
Indian sports heroes have achieved extraordinary success, bringing glory to the nation in diverse disciplines and tournaments. Their dedication, hard work, and outstanding performances have earned them international accolades and inspired millions. These athletes have broken records and set new benchmarks, showcasing India's talent on the global stage.

{% assign sorted_posts = site.categories.sports | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
