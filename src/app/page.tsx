"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import LandingPage from "./component/LandingPage";
import HomePage from "./component/HomePage";

export default function Home() {
  return (
    <main>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <HomePage />
      </SignedIn>
    </main>
  );
}
