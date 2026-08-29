"use client";

import { useRef, useState } from "react";
import { Bold, Heading2, Heading3, ImagePlus, Italic } from "lucide-react";
import ImageUploadField from "./ImageUploadField";

type ArticleEditorProps = {
  value: string;
  onChange: (value: string) => void;
  language: string;
};

export default function ArticleEditor({ value, onChange, language }: ArticleEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imageUrl, setImageUrl] = useState("");

  const updateSelection = (nextValue: string, cursorStart: number, cursorEnd = cursorStart) => {
    onChange(nextValue);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const wrapSelection = (before: string, after: string, placeholder: string) => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end) || placeholder;
    const nextValue = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`;
    updateSelection(nextValue, start + before.length, start + before.length + selected.length);
  };

  const insertHeading = (prefix: "## " | "### ") => {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const lineStart = value.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
    const nextValue = `${value.slice(0, lineStart)}${prefix}${value.slice(lineStart)}`;
    updateSelection(nextValue, start + prefix.length);
  };

  const insertImage = () => {
    if (!imageUrl) return;
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const markdown = `\n\n![Ảnh minh họa](${imageUrl})\n\n`;
    const nextValue = `${value.slice(0, start)}${markdown}${value.slice(start)}`;
    updateSelection(nextValue, start + markdown.length);
    setImageUrl("");
  };

  return (
    <div className="space-y-3">
      <div
        role="toolbar"
        aria-label="Định dạng nội dung bài viết"
        className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-2"
      >
        <button type="button" onClick={() => wrapSelection("**", "**", "chữ in đậm")} aria-label="In đậm" title="In đậm" className="rounded-md border border-slate-200 p-2 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => wrapSelection("*", "*", "chữ in nghiêng")} aria-label="In nghiêng" title="In nghiêng" className="rounded-md border border-slate-200 p-2 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700">
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => insertHeading("## ")} aria-label="Tiêu đề lớn" title="Tiêu đề lớn" className="rounded-md border border-slate-200 p-2 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700">
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => insertHeading("### ")} aria-label="Tiêu đề nhỏ" title="Tiêu đề nhỏ" className="rounded-md border border-slate-200 p-2 text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700">
          <Heading3 size={16} />
        </button>
      </div>

      <textarea
        ref={textareaRef}
        rows={12}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={`Nhập nội dung bằng ${language}. Dùng thanh công cụ để thêm tiêu đề, in đậm, in nghiêng và ảnh.`}
        className="w-full px-4 py-3 text-sm bg-white rounded-md border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 leading-relaxed font-sans"
      />

      <div className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-3">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-blue-800">
          <ImagePlus size={16} />
          Chèn ảnh vào nội dung bài viết
        </div>
        <ImageUploadField
          label=""
          value={imageUrl}
          onChange={setImageUrl}
          folder="maigo79/posts/content"
          imageHeight="h-36"
          helperText="Tải ảnh lên, sau đó chọn “Chèn ảnh vào nội dung”. Bạn có thể lặp lại để thêm nhiều ảnh."
        />
        {imageUrl && (
          <button
            type="button"
            onClick={insertImage}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <ImagePlus size={15} />
            Chèn ảnh vào nội dung
          </button>
        )}
      </div>
    </div>
  );
}
