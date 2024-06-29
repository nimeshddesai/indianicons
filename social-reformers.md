---
layout: page
title: "Social Reformers"
permalink: /social-reformers/
---
Indian social reformers have been instrumental in addressing social injustices and promoting progressive changes in society. They have tirelessly worked on creating a more equitable and inclusive society. These heroes have played significant role in uplifting the country after decades of slavery. Their enduring legacy continues to inspire ongoing social transformations in India.

{% assign sorted_posts = site.categories.social-reformers | sort: 'date' %}

This page is dedicated to some of these heroes. There are {{ sorted_posts | size }} stories in this category.

{% for post in sorted_posts %}
- <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}
