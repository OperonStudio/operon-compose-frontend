import { appConfigContentOptions } from "#/common/api/content-api";
import {
  ThemeProvider as OperonThemeProvider,
  darkTheme,
  lightTheme,
} from "@operonstudio/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type ReactNode, createContext, useContext, useState } from "react";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
  const { data: themeConfig = {} } = useSuspenseQuery(appConfigContentOptions);

  const { theme } = themeConfig as any;
  const { defaultMode = "light" } = theme || {};

  const [isDark, setIsDark] = useState(defaultMode === "dark");

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <OperonThemeProvider theme={isDark ? darkTheme : lightTheme}>
        {children}
      </OperonThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
