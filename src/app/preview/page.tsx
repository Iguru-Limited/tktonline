"use client";

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar as CustomAvatar } from "@/components/ui/Avatar/Avatar";
import { Spinner } from "@/components/ui/spinner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";

export default function PreviewPage() {
  // Block access in production
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">UI Components Preview</h1>
        <p className="text-muted-foreground">Development-only preview of all shadcn/ui components</p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Button</CardTitle>
          <CardDescription>src/components/ui/button.tsx</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badge</CardTitle>
          <CardDescription>src/components/ui/badge.tsx</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </CardContent>
      </Card>

      {/* Input & Label */}
      <Card>
        <CardHeader>
          <CardTitle>Input & Label</CardTitle>
          <CardDescription>src/components/ui/input.tsx, src/components/ui/label.tsx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="email@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled</Label>
            <Input id="disabled" disabled placeholder="Disabled input" />
          </div>
        </CardContent>
      </Card>

      {/* Checkbox */}
      <Card>
        <CardHeader>
          <CardTitle>Checkbox</CardTitle>
          <CardDescription>src/components/ui/checkbox.tsx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="disabled" disabled />
            <Label htmlFor="disabled">Disabled checkbox</Label>
          </div>
        </CardContent>
      </Card>

      {/* Radio Group */}
      <Card>
        <CardHeader>
          <CardTitle>Radio Group</CardTitle>
          <CardDescription>src/components/ui/radio-group.tsx</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Option Two</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-three" id="option-three" />
              <Label htmlFor="option-three">Option Three</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>src/components/ui/tabs.tsx</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="space-y-2">
              <p>Account tab content</p>
            </TabsContent>
            <TabsContent value="password" className="space-y-2">
              <p>Password tab content</p>
            </TabsContent>
            <TabsContent value="settings" className="space-y-2">
              <p>Settings tab content</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>src/components/ui/calendar.tsx</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
        </CardContent>
      </Card>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>src/components/ui/avatar.tsx</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
        </CardContent>
      </Card>

      {/* Custom Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Avatar</CardTitle>
          <CardDescription>src/components/ui/Avatar/Avatar.tsx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Variants</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="John Doe" variant="primary" />
                <span className="text-xs text-muted-foreground">Primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Jane Smith" variant="secondary" />
                <span className="text-xs text-muted-foreground">Secondary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Alice Green" variant="success" />
                <span className="text-xs text-muted-foreground">Success</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Bob Red" variant="danger" />
                <span className="text-xs text-muted-foreground">Danger</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Charlie Yellow" variant="warning" />
                <span className="text-xs text-muted-foreground">Warning</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Small" size="sm" />
                <span className="text-xs text-muted-foreground">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Medium" size="md" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Large" size="lg" />
                <span className="text-xs text-muted-foreground">Large</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">States</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="No Profile" />
                <span className="text-xs text-muted-foreground">Default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Disabled User" disabled />
                <span className="text-xs text-muted-foreground">Disabled</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar />
                <span className="text-xs text-muted-foreground">No Text</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Combinations</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Success Large" variant="success" size="lg" />
                <span className="text-xs text-muted-foreground">Success Large</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Danger Small" variant="danger" size="sm" />
                <span className="text-xs text-muted-foreground">Danger Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CustomAvatar text="Warning Medium" variant="warning" size="md" />
                <span className="text-xs text-muted-foreground">Warning Medium</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spinner */}
      <Card>
        <CardHeader>
          <CardTitle>Spinner</CardTitle>
          <CardDescription>src/components/ui/spinner.tsx</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-4">Variants</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="primary" />
                <span className="text-xs text-muted-foreground">Primary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="secondary" />
                <span className="text-xs text-muted-foreground">Secondary</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="success" />
                <span className="text-xs text-muted-foreground">Success</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="danger" />
                <span className="text-xs text-muted-foreground">Danger</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="warning" />
                <span className="text-xs text-muted-foreground">Warning</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Sizes</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <Spinner size="sm" />
                <span className="text-xs text-muted-foreground">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="md" />
                <span className="text-xs text-muted-foreground">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner size="lg" />
                <span className="text-xs text-muted-foreground">Large</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-4">Combinations</h3>
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="success" size="sm" />
                <span className="text-xs text-muted-foreground">Success Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="danger" size="lg" />
                <span className="text-xs text-muted-foreground">Danger Large</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Spinner variant="warning" size="md" />
                <span className="text-xs text-muted-foreground">Warning Medium</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
          <CardDescription>src/components/ui/accordion.tsx</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is it accessible?</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it styled?</AccordionTrigger>
              <AccordionContent>
                Yes. It comes with default styles that matches the other components&apos; aesthetic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Card */}
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>src/components/ui/card.tsx</CardDescription>
        </CardHeader>
        <CardContent>
          <Card>
            <CardHeader>
              <CardTitle>Nested Card Title</CardTitle>
              <CardDescription>This is a card within a card</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here</p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
