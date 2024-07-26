// Slip.tsx
"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ReactNode, useState, useEffect } from "react";

interface SlipProps {
  children: ReactNode;
  input: string;
  className?:string;
}

const CursorSVG = () => (
  <svg
    viewBox="8 4 8 16"
    xmlns="http://www.w3.org/2000/svg"
    className="cursor"
  >
    <rect x="10" y="6" width="4" height="12" fill="#fff" />
  </svg>
);

const CursorSVG2 = () => (
    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
</svg>
  );


export default function Slip({ children, input }: SlipProps) {
  const [displayInput, setDisplayInput] = useState("");
  const [completedTyping, setCompletedTyping] = useState(false);

  useEffect(() => {
    setCompletedTyping(false);
  
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayInput(input.slice(0, i));
  
      i++;
  
      if (i > input.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          setCompletedTyping(true);
        }, 1000); // add a 1-second delay before setting completedTyping to true
      }
    }, 100); // adjust the interval to control the typing speed
  
    return () => clearInterval(intervalId);
  }, [input]);

  return (
    <div className=" flex flex-col justify-center">
 <Card className="
bg-black 
text-white 
p-6 
shadow-lg
w-full 
max-w-[422px] 
[background:linear-gradient(45deg,#172033,theme(colors.slate.800)_50%,#172033)_padding-box,conic-gradient(from_var(--border-angle),theme(colors.slate.600/.48)_80%,theme(colors.indigo.500)_86%,theme(colors.indigo.300)_90%,theme(colors.indigo.500)_94%,theme(colors.slate.600/.48))_border-box] 
rounded-2xl 
border-2
border-transparent 
animate-border
transition-all duration-2000 transform scale-105
      "> 

      <CardHeader>
        <CardTitle className="text-2xl  text-white font-bold">Your Mood</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4 text-white">{children}</p>
        <p className="text-white md:text-xl">
          {">" + displayInput}
          {!completedTyping && <CursorSVG />}
        </p>
      </CardContent>
    </Card>
    </div>
  );
}
