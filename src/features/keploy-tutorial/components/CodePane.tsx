"use client";

import React, { useEffect, useRef, useMemo } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { useTheme } from "next-themes";
import { useTutorialStore } from "../store/useTutorialStore";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileCode, FileText, FileJson } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOCK_FILES: Record<string, string> = {
  "main.go": `package main

import (
    "fmt"
    "log"
    "net/http"
    "os"

    "github.com/gorilla/mux"
    "github.com/keploy/go-sdk/integrations/kmux"
    "github.com/keploy/go-sdk/keploy"
)

func main() {
    k := keploy.New(keploy.Config{
        App: keploy.AppConfig{
            Name: "my-app",
            Host: "localhost",
            Port: "8080",
        },
    })

    r := mux.NewRouter()
    kmux.Instrument(r, k)

    r.HandleFunc("/books", getBooks).Methods("GET")
    
    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Printf("Server starting on port %s", port)
    log.Fatal(http.ListenAndServe(":"+port, r))
}

func getBooks(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Books list")
}`,
  "keploy.yml": `version: api.keploy.io/v1beta1
kind: Config
name: my-app
spec:
  stubs:
    path: ./keploy/stubs
  tests:
    path: ./keploy/tests`,
  "test-1.yml": `version: api.keploy.io/v1beta2
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: /books
    header:
      Content-Type: application/json
    body: '{"name":"The Alchemist","author":"Paulo Coelho"}'
  resp:
    status_code: 201
    header:
      Content-Type: application/json
    body: '{"id":1,"name":"The Alchemist","author":"Paulo Coelho"}'`
};

const FileIcon = ({ filename, className }: { filename: string; className?: string }) => {
  if (filename.endsWith(".go")) return <FileCode className={className} />;
  if (filename.endsWith(".yml") || filename.endsWith(".yaml")) return <FileText className={className} />;
  return <FileJson className={className} />;
};

export const CodePane = () => {
  const { theme } = useTheme();
  const { activeFile, activeLineRange, activeCodeSnippet, setActiveCode } = useTutorialStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const fileList = Object.keys(MOCK_FILES);
  const currentFile = activeFile || fileList[0];

  const code = useMemo(() => {
    // If we have a matching mock file, use it
    if (MOCK_FILES[currentFile]) return MOCK_FILES[currentFile];
    
    // Otherwise fall back to snippet
    return activeCodeSnippet || "// No code snippet selected";
  }, [currentFile, activeCodeSnippet]);

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
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-[#050505] overflow-hidden">
      {/* File Tabs Navigation */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 overflow-x-auto no-scrollbar">
        {fileList.map((fileName) => {
          const isActive = currentFile === fileName;
          return (
            <button
              key={fileName}
              onClick={() => setActiveCode(fileName)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium transition-all whitespace-nowrap",
                isActive 
                  ? "bg-white dark:bg-zinc-800 text-[#FF914D] shadow-sm border border-zinc-200 dark:border-zinc-700" 
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              <FileIcon filename={fileName} className="h-3.5 w-3.5" />
              {fileName}
            </button>
          );
        })}
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-auto custom-scrollbar"
      >
        <Highlight
          theme={theme === "light" ? themes.github : themes.vsDark}
          code={code}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={cn(className, "bg-transparent py-4 m-0 font-mono text-[13px] leading-relaxed")} style={style}>
              {tokens.map((line, i) => {
                const lineNumber = i + 1;
                const isActive = activeLineRange && currentFile === activeFile
                  ? lineNumber >= activeLineRange[0] && lineNumber <= activeLineRange[1]
                  : false;
                
                const isFirstActiveLine = activeLineRange && lineNumber === activeLineRange[0];

                return (
                  <div
                    key={i}
                    {...getLineProps({ line })}
                    ref={isFirstActiveLine ? activeLineRef : null}
                    className={cn(
                      "flex px-4 py-0.5 transition-colors duration-200 border-l-2",
                      isActive ? "bg-orange-500/10 border-[#FF914D]" : "border-transparent"
                    )}
                  >
                    <span className="select-none pr-4 text-right text-zinc-600 dark:text-zinc-700 w-10 shrink-0">
                      {lineNumber}
                    </span>
                    <span className="whitespace-pre-wrap break-all">
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </span>
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  );
};
