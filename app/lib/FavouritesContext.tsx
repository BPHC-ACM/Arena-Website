'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SportId } from './sports';

const FAVORITES_KEY = 'arena-favorite-sports';

interface FavouritesContextType {
  favourites: SportId[];
  toggleFavourite: (id: SportId) => void;
  isFavourite: (id: SportId) => boolean;
  isLoaded: boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<SportId[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavourites(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse favorites from localStorage', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favourites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favourites));
    }
  }, [favourites, isLoaded]);

  const toggleFavourite = useCallback((id: SportId) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  }, []);

  const isFavourite = useCallback((id: SportId) => favourites.includes(id), [favourites]);

  const value = useMemo(() => ({
    favourites,
    toggleFavourite,
    isFavourite,
    isLoaded
  }), [favourites, toggleFavourite, isFavourite, isLoaded]);

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
}
