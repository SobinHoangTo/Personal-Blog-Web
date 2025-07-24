"use client";
import dynamic from "next/dynamic";
import React from "react";

const CKEditorDynamic = dynamic(
  async () => {
    const [{ CKEditor }, ClassicEditorModule] = await Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic"),
    ]);
    const ClassicEditor = ClassicEditorModule.default || ClassicEditorModule;
    return function CKEditorWrapper(props: any) {
      return <CKEditor editor={ClassicEditor} {...props} />;
    };
  },
  { ssr: false }
);

export default function CKEditorClient(props: any) {
  return <CKEditorDynamic {...props} />;
} 