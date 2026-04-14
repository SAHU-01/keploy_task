import { create } from "zustand";

interface TutorialState {
  language: string;
  env: string;
  activeStep: number;
  activeCodeSnippet: string | null;
  activeFile: string;
  activeLineRange: [number, number] | null;
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  rawContent: string;
  title: string;
  searchQuery: string;
  files: Record<string, string>;
  headers: Array<{ id: string; title: string; level: number }>;
  activeSection: string | null;
  expandedSlugs: string[];

  setLanguage: (language: string) => void;
  setEnv: (env: string) => void;
  setActiveStep: (step: number) => void;
  setCode: (snippet: string | null) => void;
  setActiveCode: (file: string, lines?: [number, number]) => void;
  toggleSidebar: () => void;
  toggleMobileSidebar: (open?: boolean) => void;
  setRawContent: (content: string, title: string) => void;
  setSearchQuery: (query: string) => void;
  setFiles: (files: Record<string, string>) => void;
  setHeaders: (headers: Array<{ id: string; title: string; level: number }>) => void;
  setActiveSection: (id: string | null) => void;
  toggleExpandedSlug: (slug: string) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  language: "go",
  env: "docker",
  activeStep: 1,
  activeCodeSnippet: null,
  activeFile: "",
  activeLineRange: null,
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  rawContent: "",
  title: "",
  searchQuery: "",
  files: {},
  headers: [],
  activeSection: null,
  expandedSlugs: [],

  setLanguage: (language) => set({ language }),
  setEnv: (env) => set({ env }),
  setActiveStep: (activeStep) => set({ activeStep }),
  setCode: (activeCodeSnippet) => set({ activeCodeSnippet }),
  setActiveCode: (activeFile, activeLineRange = null) => 
    set({ activeFile, activeLineRange }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  toggleMobileSidebar: (open) => set((state) => ({ 
    isMobileSidebarOpen: open !== undefined ? open : !state.isMobileSidebarOpen 
  })),
  setRawContent: (rawContent, title) => set({ rawContent, title }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFiles: (files) => set({ files }),
  setHeaders: (headers) => set({ headers }),
  setActiveSection: (activeSection) => set({ activeSection }),
  toggleExpandedSlug: (slug) => set((state) => ({
    expandedSlugs: state.expandedSlugs.includes(slug)
      ? state.expandedSlugs.filter((s) => s !== slug)
      : [...state.expandedSlugs, slug]
  })),
}));
