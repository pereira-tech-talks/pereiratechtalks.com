# DRAFT: Add Reading Time to Blog Posts

**Status:** Basic draft (ready for refinement)

---

## Objective

Add an estimated reading time indicator to blog posts so readers can see how long each article will take to read.

## Context

The blog currently displays the title, date, and tags for each post, but doesn't show estimated reading time. This is a common UX feature in modern blogs that helps readers decide which posts to read. The feature should work in both English and Spanish.

## Tasks

1. Create a utility function to calculate reading time from markdown content
2. Create a ReadingTime Astro component to display the estimate
3. Integrate the component into blog post pages (en and es)
4. Add reading time to BlogCard component on listing pages
5. Add translation strings for both languages
6. Update documentation

## Plan Name

`PLAN_add_blog_reading_time`

---

**Next step:** Use `/dwp-refine` to expand this draft into a detailed, professional prompt ready for plan creation.
