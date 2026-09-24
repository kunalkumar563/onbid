import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type WishlistItem = {
  id: string;
  title: string;
  category: string;
  price: string;
  time: string;
  urgent: boolean;
  label: string;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeFromWishlist: (id: string) => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('onbid_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse wishlist', e);
      }
    }
  }, []);

  const saveWishlist = (newList: WishlistItem[]) => {
    setWishlist(newList);
    localStorage.setItem('onbid_wishlist', JSON.stringify(newList));
  };

  const toggleWishlist = (item: WishlistItem) => {
    const exists = wishlist.some(w => w.id === item.id);
    if (exists) {
      saveWishlist(wishlist.filter(w => w.id !== item.id));
    } else {
      saveWishlist([...wishlist, item]);
    }
  };

  const removeFromWishlist = (id: string) => {
    saveWishlist(wishlist.filter(w => w.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlist.some(w => w.id === id);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
