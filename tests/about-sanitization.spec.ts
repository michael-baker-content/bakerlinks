import { expect, test } from '@playwright/test'
import { sanitizeAbout } from '../lib/sanitize-about'

test('About keeps Markdown formatting and strips active markup from stored HTML', () => {
  const html = '<h2 onclick="unsafe()">Hello</h2><p><strong>About me</strong></p>'
    + '<ol start="3"><li>Projects</li></ol><pre><code>&lt;example&gt;</code></pre>'
    + '<img src="invalid" onerror="unsafe()"><script>unsafe()</script>'
    + '<a href="javascript:unsafe()">Link text</a>'
    + '<iframe srcdoc="<script>unsafe()</script>"></iframe>'
    + '<svg><circle onload="unsafe()"></circle></svg>'

  expect(sanitizeAbout(html)).toBe(
    '<h2>Hello</h2><p><strong>About me</strong></p><ol start="3"><li>Projects</li></ol>'
    + '<pre><code>&lt;example&gt;</code></pre>Link text',
  )
})

test('About returns no markup when its only content is unsafe', () => {
  expect(sanitizeAbout('<img src="invalid" onerror="unsafe()">')).toBeNull()
  expect(sanitizeAbout(null)).toBeNull()
})
