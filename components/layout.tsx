import { ReactNode, useContext } from "react";
import { Header } from "./ui/header";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Footer } from "./ui/footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { theme, updateTheme } = useContext(ThemeContext) as ThemeContextType;

  return (
    <div
      className={
        "w-screen h-screen flex flex-col justify-between " +
        (theme === "Dark Mode" ? " text-white bg-gray-700" : "")
      }
    >
      <Header />
      {children}
      <Footer />
    </div>
  );
};
