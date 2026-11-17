"use client";

import { useEffect, useState } from "react";
import type { Unsubscribe } from "firebase/firestore";

/** Canlı koleksiyon aboneliği (onSnapshot) — liste ekranları için */
export function useCollection<T>(subscribe: (onData: (items: T[]) => void, onError: (m: string) => void) => Unsubscribe) {
  const [items, setItems] = useState<T[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => subscribe(setItems, setError), [subscribe]);
  return { items, error };
}
