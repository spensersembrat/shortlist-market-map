"use client";

import { createContext, useContext } from "react";
import { Company } from "./types";

interface ViewState {
  heatmapActive: boolean;
  maxFunding: number;
  allCompanies: Company[];
}

export const ViewContext = createContext<ViewState>({
  heatmapActive: false,
  maxFunding: 1,
  allCompanies: [],
});

export function useView() {
  return useContext(ViewContext);
}
