export * from "./components/client/header-section";
export * from "./components/client/step";
export * from "./components/client/code-group";
export * from "./components/client/pre";
export * from "./components/client/h2";
export * from "./components/client/h3";
export * from "./components/client/code-trigger";

export * from "./components/server/alert";
export * from "./components/server/callout";
export * from "./components/server/note";
export * from "./components/server/prerequisites";
export * from "./components/server/badge";
export * from "./components/server/code-block";
export * from "./components/server/h1";
export * from "./components/server/p";
export * from "./components/server/code";
export * from "./components/server/wrapper";

import { Info as LucideInfo } from "lucide-react";
import React from "react";

export const Info = (props: React.ComponentProps<typeof LucideInfo>) => React.createElement(LucideInfo, props);

