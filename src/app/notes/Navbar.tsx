"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "@/assets/logo.png";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddNoteDialog from "@/components/AddEditNoteDialog";
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useTheme } from "next-themes";
import {dark} from '@clerk/themes'
import AIChatButton from "@/components/AIChatButton";

const Navbar = () => {
  const {theme} = useTheme()
  const [showAddEditNoteDailog,setShowAddEditNoteDialog] = useState(false)
  return (
    <>    
      <div className="p-4 shadow">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <Link href="/notes" className="flex items-center gap-1">
            <Image src={logo} alt="NoteGenie Logo" width={40} height={40} />
            <span className="font-bold">NoteGenie</span>
          </Link>
          <div className="flex items-center gap-2">
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme:(theme=== "dark" ? dark: undefined),
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <ThemeToggleButton/>
            <Button onClick={()=> setShowAddEditNoteDialog(true)}>
              <Plus size={20} className="mr-2" />
              Add Notes
            </Button>
            <AIChatButton/>
          </div>
        </div>
      </div>
      <AddNoteDialog open={showAddEditNoteDailog} setOpen={setShowAddEditNoteDialog}/>
    </>

  );
};

export default Navbar;
