"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function ErrorPage() {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        There was an unexpected error happended. Please try again later!
      </CardContent>
    </Card>
  );
}
