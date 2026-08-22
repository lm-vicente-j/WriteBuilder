
import { ToolButton } from "./ToolButton";
import {
  PilcrowIcon,
  TagsIcon,
} from "lucide-react";

interface WriteToolsProps {
    showNumbering: boolean;
    setShowNumbering: (v:boolean) => void;
}

export function WriteTools({showNumbering, setShowNumbering}: WriteToolsProps) {
    return (
        <>
            <ToolButton
                title="Mostrar / ocultar números de línea"
                active={showNumbering}
                onClick={() => setShowNumbering(!showNumbering)}
            >
                <PilcrowIcon size={13} strokeWidth={1.75} />
                <span>Líneas</span>
            </ToolButton>
            <ToolButton
                title="Etiquetas"
                onClick={() => console.log("Abrir panel de tagging")}
            >
                <TagsIcon size={13} strokeWidth={1.75} />
                <span>Tagging</span>
            </ToolButton>
        </>
    );
}