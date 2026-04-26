import { useRef } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import type { Language } from "@/lib/types";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  height?: string | number;
}

const LANGUAGE_MAP: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  cpp: "cpp",
  java: "java",
};

export const CodeEditor = ({ value, onChange, language, height = 360 }: CodeEditorProps) => {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define a dark theme that matches our design tokens
    monaco.editor.defineTheme("dsa-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#0b1020",
        "editor.foreground": "#e2e8f0",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#94a3b8",
        "editor.selectionBackground": "#1e40af66",
        "editor.lineHighlightBackground": "#11172a",
        "editorCursor.foreground": "#60a5fa",
        "editorIndentGuide.background": "#1e293b",
        "editorIndentGuide.activeBackground": "#334155",
      },
    });
    monaco.editor.setTheme("dsa-dark");

    // Ensure Tab inserts spaces (not focus change)
    editor.updateOptions({
      tabSize: language === "python" ? 4 : 2,
      insertSpaces: true,
      detectIndentation: false,
    });
  };

  const handleChange: OnChange = (val) => {
    onChange(val ?? "");
  };

  return (
    <div className="overflow-hidden h-full w-full rounded-md border border-border/60 bg-[#0b1020]">
      <Editor
        height={height}
        language={LANGUAGE_MAP[language]}
        value={value}
        onMount={handleMount}
        onChange={handleChange}
        theme="dsa-dark"
        options={{
          fontSize: 13,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontLigatures: true,
          lineNumbers: "on",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          automaticLayout: true,
          tabSize: language === "python" ? 4 : 2,
          insertSpaces: true,
          detectIndentation: false,
          autoIndent: "full",
          formatOnPaste: true,
          formatOnType: true,
          wordWrap: "on",
          bracketPairColorization: { enabled: true },
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          padding: { top: 12, bottom: 12 },
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          renderLineHighlight: "line",
          suggestOnTriggerCharacters: true,
          quickSuggestions: { other: true, comments: false, strings: false },
        }}
        loading={
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            Loading editor…
          </div>
        }
      />
    </div>
  );
};
