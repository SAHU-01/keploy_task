"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTutorialStore } from "../store/useTutorialStore";
import { ChevronDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type HeaderButtonProps = {
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const HeaderButton = ({
  label,
  isActive,
  disabled,
  onClick,
}: HeaderButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-0.5 text-[12px] font-medium transition-all duration-200 whitespace-nowrap",
        isActive
          ? "border-2 border-accent text-accent bg-transparent"
          : "border border-border text-muted-foreground hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95",
        disabled && "opacity-30 cursor-not-allowed hover:border-border active:scale-100"
      )}
    >
      {label}
    </button>
  );
};

const HeaderSelect = ({ 
  label, 
  value, 
  options, 
  onChange 
}: { 
  label: string; 
  value: string; 
  options: { id: string; label: string; disabled?: boolean }[]; 
  onChange: (val: string) => void;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight whitespace-nowrap">
        {label}:
      </span>
      <div className="relative group min-w-[90px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-background border border-border rounded-md pl-2 pr-7 py-0.5 text-[12px] font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all cursor-pointer text-foreground"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id} disabled={opt.disabled} className="bg-background text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-1.5 pointer-events-none text-muted-foreground">
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export const TutorialHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { language, env, setLanguage, setEnv, isSidebarCollapsed } = useTutorialStore();
  const currentQuickstart = searchParams.get("quickstart") || "mux-postgres";

  useEffect(() => {
    const lang = searchParams.get("lang");
    const environment = searchParams.get("env");
    if (lang) setLanguage(lang);
    if (environment) setEnv(environment);
  }, [searchParams, setLanguage, setEnv]);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      if (key === "lang") setLanguage(value);
      if (key === "env") setEnv(value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, setLanguage, setEnv]
  );

  const languages = [
    { id: "go", label: "Go", disabled: false },
    { id: "python", label: "Python", disabled: true },
    { id: "java", label: "Java", disabled: true },
  ];

  const environments = [
    { id: "docker", label: "Docker", disabled: false },
    { id: "local", label: "Local", disabled: true },
  ];

  const quickstarts = [
    { id: "mux-postgres", label: "Mux + Postgres" },
    { id: "echo-sql", label: "Echo + SQL" },
    { id: "gin-redis", label: "Gin + Redis" },
  ];

  return (
    <div className="flex items-center gap-x-6 gap-y-2 py-3 border-b border-border bg-sidebar/50 backdrop-blur-sm px-4 mb-8 rounded-lg overflow-x-auto no-scrollbar">
      {!isSidebarCollapsed ? (
        <>
          <HeaderSelect label="Language" value={language} options={languages} onChange={(v) => updateParam("lang", v)} />
          <HeaderSelect label="Env" value={env} options={environments} onChange={(v) => updateParam("env", v)} />
          <HeaderSelect label="Quickstart" value={currentQuickstart} options={quickstarts} onChange={(v) => updateParam("quickstart", v)} />
        </>
      ) : (
        <div className="flex items-center gap-x-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Language:</span>
            <div className="flex gap-1.5">
              {languages.map((l) => (
                <HeaderButton key={l.id} label={l.label} isActive={language === l.id} disabled={l.disabled} onClick={() => updateParam("lang", l.id)} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Env:</span>
            <div className="flex gap-1.5">
              {environments.map((e) => (
                <HeaderButton key={e.id} label={e.label} isActive={env === e.id} disabled={e.disabled} onClick={() => updateParam("env", e.id)} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Quickstart:</span>
            <div className="flex gap-1.5">
              {quickstarts.map((q) => (
                <HeaderButton key={q.id} label={q.label} isActive={currentQuickstart === q.id} onClick={() => updateParam("quickstart", q.id)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
