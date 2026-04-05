"use client";
import { useState, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import EditorCanvas from '@/components/EditorCanvcas';

export default function TimeLine() {


  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <main className="flex flex-1 w-full bg-black">


        <div style={{ width: '100vw', height: '100vh'}}>
          <EditorCanvas/>
        </div>
      </main>
    </div>
  );
}
