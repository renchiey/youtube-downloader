type Theme = "Light Mode" | "Dark Mode";

type ThemeContextType = {
  theme: Theme;
  updateTheme: (newTheme: Theme) => void;
};
