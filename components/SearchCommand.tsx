'use client';
import React, { useEffect, useState, } from 'react';
import { CommandDialog, CommandEmpty, CommandInput, CommandList, } from '@/components/ui/command';
import { Button } from './ui/button';
import { Loader2, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';
import WatchlistButton from './WatchListButton';

export default function SearchCommand({ label, initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks.slice(0, 10);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSearch = async () => {
    if (!isSearchMode) {
      setStocks(initialStocks);
      return;
    }
    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch (error) {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm('');
    setStocks(initialStocks);
  };

  // Handle watchlist changes status change
  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    setStocks((prev) => {
      const source = prev?.length ? prev : initialStocks;
      return (source ?? []).map((stock) =>
        stock.symbol === symbol ? { ...stock, isInWatchlist: isAdded } : stock
      );
    });
  };

  const isMac = typeof navigator !== 'undefined' &&
    navigator.userAgent.toUpperCase().includes('MAC');

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-between gap-2 text-sm text-muted-foreground w-full sm:w-36"
      >
        <span>{label}</span>
        <kbd className="pointer-events-none inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className='search-dialog'>
        <div className='search-field'>
          <CommandInput className='search-input' placeholder="Search stocks..." value={searchTerm} onValueChange={setSearchTerm} />
          {loading && <Loader2 className='search-loader' />}
        </div>
        <CommandList className='search-list scrollbar-hide-default'>
          {loading ? (
            <CommandEmpty className='search-list-empty'>Loading Stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className='search-list-indicator'>
              {isSearchMode ? 'No results found.' : 'No stocks available.'}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? 'Search results' : 'Popular stocks'}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                <li key={i} className="search-item">
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">
                        {stock.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <WatchlistButton
                      type='icon'
                      symbol={stock.symbol}
                      company={stock.name}
                      isInWatchlist={stock.isInWatchlist}
                      onWatchlistChange={handleWatchlistChange}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}