import type { HTMLAttributes } from "react";
import "../../styles/ui.css";
/** Painel básico; o dashboard demonstrativo mantém seus estilos específicos. */
export function ElusCard({className="",...props}:HTMLAttributes<HTMLElement>){
 return <section {...props} className={["elus-card",className].filter(Boolean).join(" ")}/>;
}
