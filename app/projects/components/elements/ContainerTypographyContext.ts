import { createContext, useContext } from "react";
import type { TypographyProps } from "@/lib/types";

interface ContainerContextValue {
  isInsideContainer: boolean;
  typography?: TypographyProps;
}

export const ContainerTypographyContext = createContext<ContainerContextValue>({
  isInsideContainer: false,
});

export const useContainerTypography = () => useContext(ContainerTypographyContext);