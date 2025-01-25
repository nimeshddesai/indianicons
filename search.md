---
layout: default
title: Search
permalink: /search/
---

<h1>Search</h1>
<input type="text" id="search-input" placeholder="Type here to search..." onkeyup="performSearch()" />
<ul id="search-results"></ul>

<script>
  let searchIndex = [];

  // Fetch the search index from search.json
  fetch('{{ "/search.json" | relative_url }}')
    .then(response => response.json())
    .then(data => {
      searchIndex = data;
    });

  function performSearch() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const results = searchIndex.filter(item => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      );
    });

    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = "";

    if (results.length > 0) {
      results.forEach(result => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${result.url}">${result.title}</a>`;
        resultsContainer.appendChild(li);
      });
    } else {
      resultsContainer.innerHTML = "<li>No results found.</li>";
    }
  }
</script>