import { ToolButton } from "./ToolButton";

import {

  PlusIcon,
  LayoutGridIcon,
  FilterIcon,
  MaximizeIcon,
  MagnetIcon,
} from "lucide-react";

interface TimelineToolsProps  {
    snapToGrid: boolean;
    setSnapToGrid: (v:boolean) => void;
}

export function TimelineTools({snapToGrid,setSnapToGrid}: TimelineToolsProps){

    return(
                  <>
            <ToolButton
              title="Añadir evento"
              onClick={() => console.log("Add Event")}
            >
              <PlusIcon size={13} strokeWidth={1.75} />
              <span>Add Event</span>
            </ToolButton>
            <ToolButton
              title="Auto layout"
              onClick={() => console.log("Auto layout")}
            >
              <LayoutGridIcon size={13} strokeWidth={1.75} />
              <span>Auto layout</span>
            </ToolButton>
            <ToolButton
              title="Mostrar / ocultar filtros"
              onClick={() => console.log("Toggle filters")}
            >
              <FilterIcon size={13} strokeWidth={1.75} />
              <span>Filters</span>
            </ToolButton>
            <ToolButton
              title="Ajustar a pantalla"
              onClick={() => console.log("Fit to screen")}
            >
              <MaximizeIcon size={13} strokeWidth={1.75} />
              <span>Fit</span>
            </ToolButton>
            <ToolButton
              title="Snap to grid"
              active={snapToGrid}
              onClick={() => setSnapToGrid(!snapToGrid)}
            >
              <MagnetIcon size={13} strokeWidth={1.75} />
              <span>Snap</span>
            </ToolButton>
          </>
    );
}