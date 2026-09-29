(() => {
  // Works from index.html (site root) and from pages/*.html.
  const inPages = location.pathname.includes('/pages/');
  const root = inPages ? '../' : '';
  const pagesDir = inPages ? '' : 'pages/';
  const resolve = (url) => {
    if (!url || /^(https?:|mailto:|#)/.test(url)) return url;
    return /^[\w-]+\.html/.test(url) ? pagesDir + url : root + url;
  };
  const posts = [...window.blogPosts].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };
  const recent = document.querySelector('[data-recent-news]');
  if (recent) {
    recent.replaceChildren(...posts.slice(0, 3).map(post => {
      const card = create('div', 'pub-card news-card');
      const copy = create('div', 'pub-copy');
      const heading = create('h3');
      const link = create('a', '', post.title);
      link.href = `${pagesDir}blog.html#${post.id}`;
      // Preserve the existing news heading color.
      link.style.color = 'inherit';
      heading.append(link);
      copy.append(heading, create('p', '', post.summary || post.text));
      card.append(copy);
      return card;
    }));
  }
  const blog = document.querySelector('[data-blog-posts]');
  if (!blog) return;
  for (const post of posts) {
    const article = create('article', 'blog-card card');
    article.id = post.id;
    const cover = create('a', 'blog-cover' + (post.contain ? ' diagram-cover' : ''));
    cover.href = resolve(post.image);
    cover.target = '_blank';
    cover.rel = 'noreferrer';
    cover.setAttribute('aria-label', `${post.alt} (view full image)`);
    const img = create('img');
    img.src = resolve(post.image);
    img.alt = post.alt;
    img.loading = 'lazy';
    if (post.position) img.style.objectPosition = post.position;
    cover.append(img);
    const body = create('div', 'blog-copy');
    const meta = create('div', 'blog-meta');
    const tag = create('span', 'tag', post.category);
    const date = create(post.date ? 'time' : 'span', '', post.dateLabel);
    if (post.date) date.dateTime = post.date;
    meta.append(tag, date);
    body.append(meta, create('h2', '', post.title), create('p', '', post.text));
    if (post.link) {
      const external = /^https?:/.test(post.link);
      const link = create('a', 'blog-link', post.linkLabel + (external ? ' ↗' : ' →'));
      link.href = resolve(post.link);
      if (external) {
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      body.append(link);
    }
    article.append(cover, body);
    blog.append(article);
  }
  if (location.hash) {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) requestAnimationFrame(() => target.scrollIntoView());
  }
})();
