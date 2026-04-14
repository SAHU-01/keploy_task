"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useTutorialStore } from "@/features/tutorial-core/store/use-tutorial-store";
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

  return (
    <div className="h-full flex flex-col bg-[#0A0A0A] overflow-hidden group/pane font-sans">
      {/* Tab-based Header */}
      <div className="flex flex-col border-b border-zinc-800 bg-[#111]">
        {/* Workspace info */}
        <div className="flex items-center justify-between px-4 py-1.5 border-b border-zinc-800/50">
          <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
            <Box className="w-3 h-3" />
            Workspace
            {currentFile && (
              <>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-zinc-300">{currentFile}</span>
              </>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="p-1 rounded-md text-zinc-500 hover:text-[#FF914D] hover:bg-zinc-800 transition-all opacity-0 group-hover/pane:opacity-100"
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex overflow-x-auto no-scrollbar bg-[#0D0D0D]">
          {fileList.map((f) => (
            <button
              key={f}
              onClick={() => setActiveCode(f)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-xs transition-all border-r border-zinc-800 min-w-fit relative",
                currentFile === f 
                  ? "bg-[#0A0A0A] text-orange-400 font-bold" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
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
             <div className="flex items-center gap-2 px-4 py-2 text-xs text-orange-400 font-bold bg-[#0A0A0A] border-r border-zinc-800 relative">
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
          className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar bg-[#0A0A0A]"
        >
          {fileList.length === 0 && !activeCodeSnippet ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-4 p-8 text-center">
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-zinc-800 flex items-center justify-center">
                <FileCode className="w-6 h-6 opacity-20" />
              </div>
              <p className="text-sm font-medium">Select a step to view code snippets</p>
            </div>
          ) : (
            <Highlight
              theme={themes.vsDark}
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
                        <span className="select-none pr-6 text-right text-zinc-700 w-12 shrink-0">
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