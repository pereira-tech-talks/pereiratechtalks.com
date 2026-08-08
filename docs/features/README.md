# Features Documentation

This directory contains detailed documentation for specific features implemented in the Pereira Tech Talks v3.0.0 website.

## Available Feature Docs

| Feature | File | Description |
|---------|------|-------------|
| Authors | [AUTHORS.md](./AUTHORS.md) | Multi-author support: YAML schema, AuthorCard, JSON-LD integration |
| Blog Posts | [BLOG_POSTS.md](./BLOG_POSTS.md) | Post structure, naming, frontmatter, hero layouts |
| Blog Content Lifecycle | [BLOG_CONTENT_LIFECYCLE.md](./BLOG_CONTENT_LIFECYCLE.md) | Draft, scheduled, published, demo visibility rules |
| Blog Search | [BLOG_SEARCH.md](./BLOG_SEARCH.md) | Client-side search functionality |
| Dark Mode | [DARK_MODE.md](./DARK_MODE.md) | Theme toggle and persistence |
| Image Optimization | [IMAGE_OPTIMIZATION.md](./IMAGE_OPTIMIZATION.md) | Sharp-based image pipeline and staging workflow |
| Internationalization | [I18N.md](./I18N.md) | Multi-language support |
| Pagination | [PAGINATION.md](./PAGINATION.md) | Blog post pagination |
| Pereira Tech Days | [PEREIRA_TECH_DAYS.md](./PEREIRA_TECH_DAYS.md) | Edition routes, content schema, upcoming/past templates, `EditionScope`, component map |
| Public Assets | [PUBLIC_ASSETS.md](./PUBLIC_ASSETS.md) | Static assets structure (`public/`) |
| RSS Feed | [RSS_FEED.md](./RSS_FEED.md) | RSS feed generation |

## Feature Documentation Pattern

Each feature document follows this structure:

1. **Overview** - What the feature does
2. **Architecture** - How it's implemented
3. **Components** - Related components and files
4. **Configuration** - How to configure/customize
5. **Usage Examples** - How to use/extend
6. **Related Documentation** - Links to related docs

## Adding New Feature Documentation

1. Create a new markdown file in this directory:
   ```bash
   touch docs/features/NEW_FEATURE.md
   ```

2. Follow the documentation pattern above

3. Add entry to this README's table

4. Cross-reference from relevant component/page READMEs

## Related Documentation

- [Architecture Guide](../ARCHITECTURE.md)
- [Standards](../STANDARDS.md)
- [Documentation Guide](../DOCUMENTATION_GUIDE.md)
