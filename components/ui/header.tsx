import { ThemeContext } from "@/contexts/ThemeContext";
import Image from "next/image";
import { useContext } from "react";
import { Switch } from "./switch";
import { Label } from "@radix-ui/react-label";

export const Header = () => {
  const { theme, updateTheme } = useContext(ThemeContext) as ThemeContextType;

  const handleThemeChange = () => {
    if (theme === "Light Mode") updateTheme("Dark Mode");
    else updateTheme("Light Mode");
  };

  return (
    <header className="w-screen h-[80px] border-b-1 flex flex-row justify-between items-center">
      <div className="ml-4 flex items-center">
        <Image src="/logo.svg" width={80} height={80} alt="logo" />
        <h3 className="ml-2 text-2xl font-bold select-none">
          Youtube Downloader
        </h3>
      </div>
      <div className="mr-4">
        <Label className="mr-2">{theme}</Label>
        <Switch
          onCheckedChange={handleThemeChange}
          className="cursor-pointer"
        />
      </div>
    </header>
  );
};
