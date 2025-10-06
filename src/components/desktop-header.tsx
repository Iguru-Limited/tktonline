"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function DesktopHeader() {
    return (
        <div className="hidden lg:flex w-full bg-background border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex flex-row items-center justify-between w-full py-4">
                    {/* logo */}
                    <div className="flex flex-row items-center">
                        <Image
                            src={"/icons/icon-512x512.png"}
                            alt={"icon"}
                            height={48}
                            width={48}
                        />
                        <p className="font-bold text-lg">tkt.ke</p>
                    </div>
                    
                    {/* center search */}
                    <div className="flex flex-row items-center gap-2 flex-1 max-w-lg mx-8">
                        <Input 
                            autoCapitalize="true" 
                            type="text" 
                            placeholder="Search for tickets" 
                            className="flex-1" 
                        />
                        <Button size="sm">
                            <Search className="h-4 w-4" />
                            <span className="hidden sm:inline">Search</span>
                        </Button>
                    </div>
                    
                    {/* accounts/profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"outline"} className="border border-amber-500">
                                <p>Account</p>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link href={"/login"}>Sign In</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Sign Up</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}