"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, CopyPlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deletePage, duplicatePage } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface PageCardDropdownProps {
  pageId: string;
  slug: string;
  username: string;
}

export function PageCardDropdown({ pageId, slug, username }: PageCardDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this page?")) {
      startTransition(async () => {
        await deletePage(pageId);
      });
    }
  };

  const handleDuplicate = () => {
    startTransition(async () => {
      await duplicatePage(pageId);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          disabled={isPending}
          className={cn(
            "text-slate-400 hover:text-slate-600 transition-colors outline-none",
            isPending && "opacity-50 cursor-not-allowed"
          )}
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/${username}/${slug === 'main' ? '' : slug}`} target="_blank" className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-500" />
            View Page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/editor/${pageId}`} className="flex items-center gap-2">
            <Edit className="w-4 h-4 text-slate-500" />
            Edit Page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleDuplicate}
        >
          <CopyPlus className="w-4 h-4 text-slate-500" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
          Delete Page
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
