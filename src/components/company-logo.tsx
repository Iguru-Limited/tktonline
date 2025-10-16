"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function CompanyLogo({ name, imageUrl, size = "md", className }: CompanyLogoProps) {
  // Generate initials from company name (first 2 letters)
  const getInitials = (companyName: string) => {
    const words = companyName.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return companyName.substring(0, 2).toUpperCase();
  };

  // Generate a consistent color based on the company name
  const getColorFromName = (companyName: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-yellow-500 to-yellow-600",
      "bg-gradient-to-br from-red-500 to-red-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-teal-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-cyan-500 to-cyan-600",
    ];

    // Use the first character's char code to select a color
    const charCode = companyName.charCodeAt(0);
    const colorIndex = charCode % colors.length;
    return colors[colorIndex];
  };

  const sizeClasses = {
    sm: "h-10 w-10 text-xs",
    md: "h-16 w-16 text-sm",
    lg: "h-24 w-24 text-lg",
  };

  const initials = getInitials(name);
  const gradientColor = getColorFromName(name);

  return (
    <div
      className={cn(
        "relative rounded-lg overflow-hidden shrink-0 flex items-center justify-center shadow-md",
        sizeClasses[size],
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      ) : (
        <div className={cn("w-full h-full flex items-center justify-center", gradientColor)}>
          <span className="font-bold text-white drop-shadow-lg">{initials}</span>
        </div>
      )}
    </div>
  );
}
