"use client";

import dynamic from "next/dynamic";
import type { Dispatch, SetStateAction } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export interface RichTextEditorProps {
  value: string;
  onChange: Dispatch<SetStateAction<string>> | ((value: string) => void);
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ align: [] }],
    ["clean"]
  ]
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  return (
    <div
      style={{
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.15)",
        overflow: "hidden",
        background: "rgba(10,10,20,0.9)"
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


