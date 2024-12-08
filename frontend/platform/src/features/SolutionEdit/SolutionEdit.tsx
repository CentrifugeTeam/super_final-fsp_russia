import { SolutionEditCard } from "@/components/SolutionEditCard";
import styles from "./solutionedit.module.scss";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

export const SolutionEdit = () => {
  const [position, setPosition] = useState("bottom");

  return (
    <div className={styles.contet}>
      <div className={styles.header}>
        <h1 className={styles.headerText}>Решения</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="text-black">
              Все регионы
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white text-black border border-gray-200 shadow-md">
            <DropdownMenuLabel className="text-black">
              Все регионы
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-200 h-px my-1" />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem
                value="top"
                className="bg-white text-black hover:bg-gray-100"
              >
                Top
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="bottom"
                className="bg-white text-black hover:bg-gray-100"
              >
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="right"
                className="bg-white text-black hover:bg-gray-100"
              >
                Right
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.profileEditComponenst}>
        <SolutionEditCard />
      </div>
    </div>
  );
};

export default SolutionEdit;
