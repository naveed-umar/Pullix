import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  size?: number;
  showText?: boolean;
  href?: string;
}

export function Logo({
  className,
  imageClassName,
  size = 32,
  showText = true,
  href,
}: LogoProps) {
  const content = (
    <div className={cn("flex items-center gap-2.5 font-bold tracking-tight", className)}>
      <div className="relative flex items-center justify-center shrink-0">
        <Image
          src="/logo.png"
          alt="PulliX Logo"
          width={size}
          height={size}
          className={cn("object-contain rounded-md transition-transform duration-200 hover:scale-105", imageClassName)}
          priority
        />
      </div>
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text">
          PulliX
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
