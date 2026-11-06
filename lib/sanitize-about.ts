import sanitizeHtml from 'sanitize-html'

export function sanitizeAbout(html: string | null) {
  if (!html) return null

  // Match the About editor's text formatting without allowing active content.
  return sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'b', 'i', 'del', 's', 'blockquote',
      'ul', 'ol', 'li', 'pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    allowedAttributes: { ol: ['start'] },
  }) || null
}
