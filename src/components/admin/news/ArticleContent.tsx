
import sanitizeHtml from "sanitize-html";

interface ArticleContentProps {
  content: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function prepareContent(content: string) {
  if (!content.trim()) return "";

  // Support existing articles saved as plain text.
  if (!/<\/?(?:p|h[1-6]|ul|ol|li|blockquote|br|strong|em|a)\b/i.test(content)) {
    return content
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((paragraph) => {
        const escaped = escapeHtml(paragraph.trim())
          .replace(/\r?\n/g, "<br />");

        return `<p>${escaped}</p>`;
      })
      .join("");
  }

  return content;
}

export default function ArticleContent({
  content,
}: ArticleContentProps) {
  const safeHtml = sanitizeHtml(prepareContent(content), {
    allowedTags: [
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "ul",
      "ol",
      "li",
      "blockquote",
      "a",
      "hr",
      "code",
      "pre",
    ],
    allowedAttributes: {
  a: ["href", "title", "target", "rel"],
  img: [
    "src",
    "alt",
    "title",
    "width",
    "height",
    "data-width",
    "data-alignment",
    "data-caption",
  ],
},
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesAppliedToAttributes: ["href", "src"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
      }),
    },
  });

  return (
    <div
      className="
        max-w-none
        break-words
        text-[16px]
        leading-8
        text-gray-600
        sm:text-[17px]

        [&_p]:mb-6

        [&_h1]:mb-6
        [&_h1]:mt-10
        [&_h1]:text-3xl
        [&_h1]:font-semibold
        [&_h1]:leading-tight
        [&_h1]:text-gray-900

        [&_h2]:mb-5
        [&_h2]:mt-10
        [&_h2]:text-2xl
        [&_h2]:font-semibold
        [&_h2]:text-gray-900

        [&_h3]:mb-4
        [&_h3]:mt-8
        [&_h3]:text-xl
        [&_h3]:font-semibold
        [&_h3]:text-gray-900

        [&_strong]:font-semibold
        [&_strong]:text-gray-900

        [&_ul]:mb-6
        [&_ul]:list-disc
        [&_ul]:pl-7

        [&_ol]:mb-6
        [&_ol]:list-decimal
        [&_ol]:pl-7

        [&_li]:mb-2

        [&_blockquote]:my-8
        [&_blockquote]:border-l-4
        [&_blockquote]:border-green-700
        [&_blockquote]:bg-green-50
        [&_blockquote]:px-6
        [&_blockquote]:py-5
        [&_blockquote]:italic

        [&_a]:font-medium
        [&_a]:text-green-700
        [&_a]:underline
        [&_a]:underline-offset-4

        [&_hr]:my-10
        [&_hr]:border-gray-200

        [&_img]:my-8
        [&_img]:h-auto
        [&_img]:max-w-full
        [&_img]:rounded-xl
        [&_img]:object-contain
        [&_img]:shadow-sm

        news-article-content
      "
      dangerouslySetInnerHTML={{
        __html: safeHtml,
      }}
    />
  );
}
