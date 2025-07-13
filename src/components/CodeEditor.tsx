"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  placeholder?: string;
  height?: string;
}

const languageMap: { [key: string]: string } = {
  python: "python",
  javascript: "javascript",
  java: "java",
  cpp: "cpp",
};

const getDefaultCode = (lang: string) => {
  switch (lang) {
    case "python":
      return "# Write your solution here\ndef solution():\n    pass\n\n# Example usage\nprint(solution())";
    case "javascript":
      return "// Write your solution here\nfunction solution() {\n    // Your code here\n}\n\n// Example usage\nconsole.log(solution());";
    case "java":
      return 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello World");\n    }\n}';
    case "cpp":
      return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello World" << endl;\n    return 0;\n}';
    default:
      return "";
  }
};

export default function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  placeholder = "Write your solution here...",
  height = "400px",
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const isInitialized = useRef(false);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    isInitialized.current = true;
  };

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    // Update the editor language
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        // Monaco doesn't support changing language of existing model
        // We need to create a new model with the current content
        const currentValue = model.getValue();
        const newModel = editorRef.current
          .getModel()
          .constructor.createModel(
            currentValue,
            languageMap[newLanguage] || "plaintext"
          );
        editorRef.current.setModel(newModel);
      }
    }
  };

  // Only set initial value, don't update on every value change
  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      const model = editorRef.current.getModel();
      if (model) {
        model.setValue(value);
        isInitialized.current = true;
      }
    }
  }, [value]);

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">Code Editor</CardTitle>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-600">
              <SelectItem
                value="python"
                className="text-white hover:bg-slate-700"
              >
                Python
              </SelectItem>
              <SelectItem
                value="javascript"
                className="text-white hover:bg-slate-700"
              >
                JavaScript
              </SelectItem>
              <SelectItem
                value="java"
                className="text-white hover:bg-slate-700"
              >
                Java
              </SelectItem>
              <SelectItem value="cpp" className="text-white hover:bg-slate-700">
                C++
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border border-slate-700 rounded-lg overflow-hidden">
          <Editor
            height={height}
            defaultLanguage={languageMap[language] || "plaintext"}
            defaultValue={value}
            onChange={(value) => onChange(value || "")}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily:
                "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: "on",
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              glyphMargin: false,
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              overviewRulerLanes: 0,
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
              },
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              parameterHints: {
                enabled: true,
              },
              suggest: {
                showKeywords: true,
                showSnippets: true,
                showFunctions: true,
                showVariables: true,
                showClasses: true,
                showModules: true,
                showProperties: true,
                showEvents: true,
                showOperators: true,
                showUnits: true,
                showValues: true,
                showConstants: true,
                showEnums: true,
                showEnumMembers: true,
                showColors: true,
                showFiles: true,
                showReferences: true,
                showFolders: true,
                showTypeParameters: true,
                showWords: true,
              },
            }}
            beforeMount={(monaco) => {
              // Customize the dark theme
              monaco.editor.defineTheme("vs-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [
                  { token: "comment", foreground: "6A9955" },
                  { token: "keyword", foreground: "569CD6" },
                  { token: "string", foreground: "CE9178" },
                  { token: "number", foreground: "B5CEA8" },
                  { token: "type", foreground: "4EC9B0" },
                  { token: "function", foreground: "DCDCAA" },
                  { token: "variable", foreground: "9CDCFE" },
                  { token: "constant", foreground: "4FC1FF" },
                ],
                colors: {
                  "editor.background": "#0F172A",
                  "editor.foreground": "#E2E8F0",
                  "editor.lineHighlightBackground": "#1E293B",
                  "editor.selectionBackground": "#334155",
                  "editor.inactiveSelectionBackground": "#1E293B",
                  "editorCursor.foreground": "#E2E8F0",
                  "editorWhitespace.foreground": "#475569",
                  "editorIndentGuide.background": "#334155",
                  "editorIndentGuide.activeBackground": "#64748B",
                  "editor.selectionHighlightBorder": "#334155",
                },
              });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
