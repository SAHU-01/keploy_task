"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";
import { useTheme } from "next-themes";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  FileCode, FileText, FileJson, Copy, Check,
  ChevronRight, Box, TestTube, Database
} from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FileIcon = ({ filename, className }: { filename: string; className?: string }) => {
  if (filename.endsWith(".go")) return <FileCode className={cn("text-blue-400", className)} />;
  if (filename.endsWith(".yml") || filename.endsWith(".yaml")) {
    if (filename.includes("test")) return <TestTube className={cn("text-orange-400", className)} />;
    if (filename.includes("mock")) return <Database className={cn("text-purple-400", className)} />;
    return <FileText className={cn("text-zinc-400", className)} />;
  }
  return <FileJson className={cn("text-zinc-400", className)} />;
};

export const CodePane = () => {
  const activeFile = useTutorialStore(state => state.activeFile);
  const activeLineRange = useTutorialStore(state => state.activeLineRange);
  const activeCodeSnippet = useTutorialStore(state => state.activeCodeSnippet);
  const files = useTutorialStore(state => state.files);
  const setActiveCode = useTutorialStore(state => state.setActiveCode);
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const fileList = useMemo(() => Object.keys(files).sort(), [files]);
  const currentFile = activeFile || fileList[0] || "";

  const code = useMemo(() => {
    if (files[currentFile]) return files[currentFile];
    return activeCodeSnippet || "// No code snippet selected";
  }, [currentFile, files, activeCodeSnippet]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const language = useMemo(() => {
    if (currentFile.endsWith(".go")) return "go";
    if (currentFile.endsWith(".yml") || currentFile.endsWith(".yaml")) return "yaml";
    return "javascript";
  }, [currentFile]);

  useEffect(() => {
    if (activeLineRange && activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLineRange, activeFile]);

  const highlightTheme = isDark ? themes.vsDark : themes.vsLight;

  return (
    <div className={cn(
      "h-full flex flex-col overflow-hidden group/pane font-sans",
      isDark ? "bg-[#0A0A0A]" : "bg-white"
    )}>
      {/* Tab-based Header */}
      <div className={cn(
        "flex flex-col border-b",
        isDark ? "border-zinc-800 bg-[#111]" : "border-zinc-200 bg-zinc-50"
      )}>
        {/* Workspace info */}
        <div className={cn(
          "flex items-center justify-between px-4 py-1.5 border-b",
          isDark ? "border-zinc-800/50" : "border-zinc-200/50"
        )}>
          <div className={cn(
            "flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
            isDark ? "text-zinc-500" : "text-zinc-400"
          )}>
            <Box className="w-3 h-3" />
            Workspace
            {currentFile && (
              <>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className={isDark ? "text-zinc-300" : "text-zinc-700"}>{currentFile}</span>
              </>
            )}
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "p-1 rounded-md transition-all opacity-0 group-hover/pane:opacity-100 hover:text-[#FF914D]",
              isDark ? "text-zinc-500 hover:bg-zinc-800" : "text-zinc-400 hover:bg-zinc-100"
            )}
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* File Tabs */}
        <div className={cn(
          "flex overflow-x-auto no-scrollbar",
          isDark ? "bg-[#0D0D0D]" : "bg-zinc-100/50"
        )}>
          {fileList.map((f) => (
            <button
              key={f}
              onClick={() => setActiveCode(f)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs transition-all border-r min-w-fit relative",
                isDark ? "border-zinc-800" : "border-zinc-200",
                currentFile === f
                  ? cn(
                      "text-orange-500 font-bold",
                      isDark ? "bg-[#0A0A0A]" : "bg-white"
                    )
                  : cn(
                      isDark
                        ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                        : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
                    )
              )}
            >
              {currentFile === f && (
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-orange-500" />
              )}
              <FileIcon filename={f} className="w-3.5 h-3.5" />
              {f}
            </button>
          ))}
          {fileList.length === 0 && activeCodeSnippet && (
             <div className={cn(
               "flex items-center gap-2 px-4 py-2 text-xs text-orange-400 font-bold border-r relative",
               isDark ? "bg-[#0A0A0A] border-zinc-800" : "bg-white border-zinc-200"
             )}>
               <div className="absolute top-0 left-0 right-0 h-[2px] bg-orange-500" />
               <FileCode className="w-3.5 h-3.5" />
               Snippet
             </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Code Content Area */}
        <div
          ref={scrollContainerRef}
          className={cn(
            "flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar",
            isDark ? "bg-[#0A0A0A]" : "bg-white"
          )}
        >
          {fileList.length === 0 && !activeCodeSnippet ? (
            <div className={cn(
              "flex flex-col items-center justify-center h-full gap-4 p-8 text-center",
              isDark ? "text-zinc-600" : "text-zinc-400"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-2xl border-2 border-dashed flex items-center justify-center",
                isDark ? "border-zinc-800" : "border-zinc-200"
              )}>
                <FileCode className="w-6 h-6 opacity-20" />
              </div>
              <p className="text-sm font-medium">Select a step to view code snippets</p>
            </div>
          ) : (
            <Highlight
              theme={highlightTheme}
              code={code}
              language={language}
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={cn(className, "bg-transparent py-6 m-0 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-words")} style={style}>
                  {tokens.map((line, i) => {
                    const lineNumber = i + 1;
                    const isActive = activeLineRange && currentFile === activeFile
                      ? lineNumber >= activeLineRange[0] && lineNumber <= activeLineRange[1]
                      : false;

                    const isFirstActiveLine = activeLineRange && lineNumber === activeLineRange[0];

                    // Detect diff lines
                    const lineText = line.map(t => t.content).join("");
                    const isRemoval = lineText.startsWith("-");
                    const isAddition = lineText.startsWith("+");

                    return (
                      <div
                        key={i}
                        {...getLineProps({ line })}
                        ref={isFirstActiveLine ? activeLineRef : null}
                        className={cn(
                          "flex px-6 py-0.5 transition-colors duration-200 border-l-2",
                          isActive ? "bg-orange-500/10 border-[#FF914D]" : "border-transparent",
                          isRemoval && "bg-red-500/15 border-red-500 diff-remove",
                          isAddition && "bg-green-500/15 border-green-500 diff-add"
                        )}
                      >
                        <span className={cn(
                          "select-none pr-6 text-right w-12 shrink-0",
                          isDark ? "text-zinc-700" : "text-zinc-300"
                        )}>
                          {lineNumber}
                        </span>
                        <span className="whitespace-pre-wrap break-all flex items-start">
                          {(isRemoval || isAddition) && (
                            <span className="diff-symbol shrink-0 font-bold mr-2">
                              {isRemoval ? "-" : "+"}
                            </span>
                          )}
                          <span className="flex-1">
                            {line.map((token, key) => {
                              if (key === 0 && (isRemoval || isAddition)) {
                                const content = token.content.substring(1);
                                return <span key={key} {...getTokenProps({ token: { ...token, content } })} />;
                              }
                              return <span key={key} {...getTokenProps({ token })} />;
                            })}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </pre>
              )}
            </Highlight>
          )}
        </div>
      </div>
    </div>
  );
};
