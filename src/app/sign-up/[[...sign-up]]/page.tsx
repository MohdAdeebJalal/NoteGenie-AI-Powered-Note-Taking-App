import React from "react";
import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "NoteGenie SignUp",
};
const SignUpPage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignUp appearance={{ variables: { colorPrimary: "#0F1724" } }} />
    </div>
  );
};

export default SignUpPage;
