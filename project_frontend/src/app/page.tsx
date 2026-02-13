"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import OffersSection from "@/components/OffersSection";
import NewAndNoteworthy from "@/components/NewAndNoteworthy";
import MostBookedServices from "@/components/MostBookedServices";
import RepairServices from "@/components/RepairServices";
import CleaningServices from "@/components/CleaningServices";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />

      <div className="space-y-4 md:space-y-8 pb-20 pt-6">
        <CleaningServices />
        <RepairServices />
      </div>
    </div>
  );
}
