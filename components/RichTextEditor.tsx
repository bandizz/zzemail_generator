"use client";

import dynamic from "next/dynamic";
import type { Dispatch, SetStateAction } from "react";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    const Quill = (RQ as any).Quill;

    if (Quill && typeof Quill.import === "function") {
      const Image = Quill.import("formats/image");

      class MaxWidthImage extends Image {
        static create(value: unknown) {
          const node = super.create(value) as HTMLImageElement;
          node.style.maxWidth = "95%";
          node.style.height = "auto";
          node.style.display = "block";
          node.style.margin = "0 auto";
          return node;
        }
      }

      Quill.register("formats/image", MaxWidthImage, true);
    }

    return RQ;
  },
  { ssr: false }
);

export interface RichTextEditorProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    [{ font: [] }, { size: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div
      style={{
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.15)",
        overflow: "auto",
        background: "rgba(10,10,20,0.9)",
      }}
    >
      {/* ReactQuill injecte son propre contenu HTML, qu'on stocke dans bodyHtml */}
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(html: string) =>
          typeof onChange === "function" ? onChange(html) : undefined
        }
        modules={modules}
      />
    </div>
  );
}
