import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "~/env";
import type { SocialFeedItemNode } from "~/types/social-feed";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSocialImageUri(node: SocialFeedItemNode) {
  const { thumbnail_src } = node;

  if (!thumbnail_src) return;

  return `${env.SOCIAL_FEED_URL}/imageproxy/${btoa(thumbnail_src)}`;
}
