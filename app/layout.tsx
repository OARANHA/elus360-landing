import type { Metadata } from 'next';
export const metadata: Metadata={title:'ELUS 360 — CRM, atendimento, automações e IA',description:'Organize seu comercial com CRM, atendimento, automações e IA integrados.',icons:{icon:'/brand/elus-vertical.png'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body style={{margin:0}}>{children}</body></html>}
