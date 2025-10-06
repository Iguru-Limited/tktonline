"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Link from "next/link";

export default function MobileHeader() {
    return (
        <div className="lg:hidden w-full bg-background border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex flex-col w-full py-3">
                    <div className="flex flex-row items-center justify-between w-full">
                        {/* logo */}
                        <div className="flex flex-row items-center gap-2">
                            <Link href="/" className="flex flex-row items-center">
                                <Image
                                    src={"/icons/icon-512x512.png"}
                                    alt={"icon"}
                                    height={40}
                                    width={40}
                                />
                                <p className="font-bold text-lg">tkt.ke</p>
                            </Link>
                            {process.env.NODE_ENV === "development" && (
                                <Link href="/preview">
                                    <Button variant="ghost" size="sm">Preview</Button>
                                </Link>
                            )}
                        </div>
                        {/* accounts/profile */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex flex-row items-center gap-2">
                                <p className="text-sm">Account</p>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="/images/avatar.jpeg"/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href={"/login"}>Sign In</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>Sign Up</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    {/* ticket search */}
                    <div className="flex flex-row w-full mt-4 gap-2">
                        <Input 
                            autoCapitalize="true" 
                            type="text" 
                            placeholder="Search for tickets" 
                            className="flex-1" 
                        />
                        <Button size="sm">
                            <Search className="h-4 w-4" />
                            <span className="hidden xs:inline">Search</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}