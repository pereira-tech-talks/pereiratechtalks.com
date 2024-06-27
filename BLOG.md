## How to create a post on the blog

1. Fork this repository
2. Clone in your local
3. Create a new branch using this convention `post/<post-name>`
4. On the new branch, create in `src/content/post/<entry-name>.mdx` your `mdx` entry, following this format:

```
---
publishDate: yyyy-mm-ddTHH:MM:ssZ
author: John Doe
title: Mock title
excerpt: Summary of your post
image: ~/assets/images/posts/banners/<entry-name>.jpg
category: Category
tags:
  - tag1
  - tag2
---
```
