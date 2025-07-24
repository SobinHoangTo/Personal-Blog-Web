"use client";
import dynamic from "next/dynamic";
import React from "react";

const CKEditorDynamic = dynamic(
  async () => {
    const [CKEditorModule, ClassicEditor] = await Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic"),
    ]);
    return function CKEditorWrapper(props: any) {
      return <CKEditorModule.CKEditor editor={ClassicEditor} {...props} />;
    };
  },
  { ssr: false }
);

export default function CKEditorClient(props: any) {
  return <CKEditorDynamic {...props} />;
} 