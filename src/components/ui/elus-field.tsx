import {forwardRef,type InputHTMLAttributes} from "react";
import "../../styles/ui.css";
export type ElusFieldProps=InputHTMLAttributes<HTMLInputElement>;
/** Campo de formulário sem lógica de envio: integração de leads permanece pendente. */
export const ElusField=forwardRef<HTMLInputElement,ElusFieldProps>(function ElusField({className="",...props},ref){
 return <input {...props} ref={ref} className={["elus-field",className].filter(Boolean).join(" ")}/>;
});
