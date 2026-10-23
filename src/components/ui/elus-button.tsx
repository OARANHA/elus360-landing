import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import "../../styles/ui.css";
type Variant = "primary" | "ghost" | "white";
type Common = {variant?:Variant;children:ReactNode;className?:string};
type ButtonProps = Common & ButtonHTMLAttributes<HTMLButtonElement> & {href?:never};
type LinkProps = Common & AnchorHTMLAttributes<HTMLAnchorElement> & {href:string};
export type ElusButtonProps = ButtonProps | LinkProps;
/** Botão/CTA baseado nas variantes .btn do protótipo Z.Chat. */
export function ElusButton(props:ElusButtonProps){
 const {variant="primary",className="",children,...rest}=props;
 const css=["elus-btn",`elus-btn--${variant}`,className].filter(Boolean).join(" ");
 if(typeof props.href==="string"){
   const {href,...linkRest}=rest as AnchorHTMLAttributes<HTMLAnchorElement>;
   return <a {...linkRest} href={props.href} className={css}>{children}</a>;
 }
 return <button {...rest as ButtonHTMLAttributes<HTMLButtonElement>} className={css}>{children}</button>;
}
