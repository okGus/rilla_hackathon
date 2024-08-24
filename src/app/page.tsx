"use client";

import { SignedIn, SignedOut } from "@clerk/nextjs";
import LandingPage from "./component/LandingPage";
import TranscriptManagementPage from "./component/TranscriptManagementPage";

export default function Home() {

  return (
    <main>
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <TranscriptManagementPage />
      </SignedIn>
    </main>
  );
}
