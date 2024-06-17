# indianheroes
A blog about Indian Heroes

# Setup

- [Jekyll 4.3.3](https://jekyllrb.com/)
- [Ruby 3.3.2](https://rubyinstaller.org/)
- [Minima theme](https://github.com/jekyll/minima) inlined and customised
- [Netlify](https://app.netlify.com/sites/indianheroes/overview)

  - Build command: `jekyll build`
  - Publish directory: `_site/`
  - Environment variables: `JEKYLL_ENV=production`

## Running locally

`bundle exec jekyll serve --host 0.0.0.0 --drafts --livereload`

- Serves the website on `localhost:4000`
- `--host 0.0.0.0`: Allows other devices on your network to access
- `--drafts`: Displays posts in `__drafts` folder as if they were published today
- `--livereload`: Auto-reloads site without manual page refresh