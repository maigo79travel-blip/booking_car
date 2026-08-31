import Image from "next/image";

function inlineText(value: string) {
  return value.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

function imageSource(value: string) {
  if (value.startsWith("/")) return value;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export default function ArticleContent({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="text-gray-800 text-base md:text-lg leading-relaxed py-2 space-y-5">
      {blocks.map((block, index) => {
        // Older posts may have a line break between the alt text and URL.
        // Accept both `![alt](url)` and `![alt]\n(url)` so valid uploaded
        // Cloudinary images are rendered instead of displayed as Markdown.
        const image = block.match(/^!\[([^\]]*)\]\s*\(\s*([^\s)]+)\s*\)$/);
        if (image) {
          const src = imageSource(image[2]);
          return src ? (
            <figure key={index} className="my-6 w-full overflow-hidden">
              <Image
                src={src}
                alt={image[1] || "Ảnh minh họa bài viết"}
                width={1600}
                height={1200}
                sizes="(max-width: 768px) 100vw, 960px"
                className="block h-auto w-full"
              />
              {image[1] && <figcaption className="sr-only">{image[1]}</figcaption>}
            </figure>
          ) : null;
        }

        if (block.startsWith("## ")) {
          return <h2 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 pt-3">{inlineText(block.slice(3))}</h2>;
        }
        if (block.startsWith("### ")) {
          return <h3 key={index} className="text-xl md:text-2xl font-bold text-slate-900 pt-2">{inlineText(block.slice(4))}</h3>;
        }

        return (
          <p key={index}>
            {block.split("\n").map((line, lineIndex) => (
              <span key={lineIndex}>
                {inlineText(line)}
                {lineIndex < block.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
