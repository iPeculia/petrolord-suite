import { get, set, del } from 'idb-keyval';

const CACHE_PREFIX = 'ss-asset-cache-';

export const getCachedAsset = async (asset) => {
  if (!asset || !asset.id || !asset.updated_at) return null;
  const key = `${CACHE_PREFIX}${asset.id}`;
  const cached = await get(key);
  if (cached && cached.updated_at === asset.updated_at) {
    return cached.data;
  }
  return null;
};

export const setCachedAsset = async (asset, data) => {
  if (!asset || !asset.id || !asset.updated_at) return;
  const key = `${CACHE_PREFIX}${asset.id}`;
  const value = {
    updated_at: asset.updated_at,
    data: data
  };
  await set(key, value);
};

export const deleteCachedAsset = async (assetId) => {
  const key = `${CACHE_PREFIX}${assetId}`;
  await del(key);
};