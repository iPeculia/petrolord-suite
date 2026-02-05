import { useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient'; // Using the existing Supabase client

export function useSignedFetch() {
  // The 'supabase' instance is already initialized and imported, no need to recreate it.

  async function getSignedJson(bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
    if (error) throw error;
    const res = await fetch(data.signedUrl);
    return await res.json();
  }

  async function getSignedBlob(bucket, path) {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 300);
    if (error) throw error;
    const res = await fetch(data.signedUrl);
    return await res.blob();
  }

  return { supabase, getSignedJson, getSignedBlob };
}