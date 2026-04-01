"use client";

import MenuBar from '@/components/MenuBar';


export default function Home() {
  
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <main className="flex flex-1 w-full bg-black">
        
        <MenuBar/>

      </main>
    </div>
  );
}
