"use client";
import { useDebounce } from "@/hooks/useDebounce";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { Star, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react"; 
import { toast } from "sonner";
import { Button } from "./ui/button";

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const toggleWatchlist = async () => {
    const result = added ? await removeFromWatchlist(symbol) : await addToWatchlist(symbol, company);
    if(result.success) {
      toast.success(added ? 'Removed from Watchlist' : 'Added to Watchlist', {
        description: `${company} ${
          added ? 'removed from' : 'added to'
        } your watchlist`,
      });
    }
    onWatchlistChange?.(symbol, !added);
  }

  const debouncedToggle = useDebounce(toggleWatchlist, 300);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    setAdded(!added);
    debouncedToggle();
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <Star fill={added ? 'currentColor' : 'none'} />
      </button>
    );
  }

  return (
    <Button
      className={`flex justify-center items-center gap-2 px-3 watchlist-btn ${added ? 'watchlist-remove' : ''}`}
      onClick={handleClick}
    >
      {showTrashIcon && added ? <Trash2 color="currentColor" size={16} /> : null}
      <span>{label}</span>
    </Button>
  );
};

export default WatchlistButton;