import React from "react";
import Link from "next/link";
import SignIn from "./sign-in";
import { auth } from "@/auth";
import { SignOut } from "./sign-out-server";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="bg-white  sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="dancing-script text-4xl">CliniCall</h1>
            </Link>
          </div>
          <div className="flex items-center">
            {!session ? (
              <>
                <span>
                  <SignIn />
                </span>
              </>
            ) : (
              <div className="flex flex-row items-center justify-center gap-4 text-base text-black">
                <Link href="/home" className="m-8">
                  Home
                </Link>
                <SignOut />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
