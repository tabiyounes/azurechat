"use client";
import { FC } from "react";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { LucideIcon } from "lucide-react";

interface HomeActionCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
  button_title : string;
}

export const HomeActionCard: FC<HomeActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  href,
  button_title,
}) => {
  return (
    <Card className="p-4 flex flex-col justify-between gap-3 shadow hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <Icon className="w-7 h-7 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {description && <p className="text-sm text-muted-foreground text-center">{description}</p>}
      {onClick ? (
        <Button onClick={onClick} className="mt-auto w-full flex justify-center gap-2">
          {button_title}
        </Button>
      ) : href ? (
        <Button asChild className="mt-auto w-full flex justify-center gap-2">
          <a href={href}>{button_title}</a>
        </Button>
      ) : null}
    </Card>
  );
};