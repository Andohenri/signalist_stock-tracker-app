'use client';
import React, { useEffect, useState, } from 'react';
import { CommandDialog, CommandEmpty, CommandInput, CommandList, } from '@/components/ui/command';
import { Button } from './ui/button';
import { Loader2, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchCommand({ renderAs = 'button', label, initialStocks }: SearchCommandProps) {
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
    if(!isSearchMode) {
      setStocks(initialStocks);
      return;
    }
    setLoading(true);
    try {
      const results = await searchStocks(searchTerm.trim());
      setStocks(results);
    } catch (error) {
      setStocks([]);
    }finally {
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
    setStocks([]);
  };

  return (
    <>
      {renderAs === 'text' ? (
        <span onClick={() => setOpen(true)} className='search-text'>{label}</span>
      ) : (
        <Button onClick={() => setOpen(true)} className='search-btn'>{label}</Button>
      )}
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
                <li key={stock.symbol} className="search-item">
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
                    <Star />
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