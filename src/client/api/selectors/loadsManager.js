import { createSelector } from 'reselect'


export const getUploadsCount = state => state.api.loadsManager.uploadsCount
export const getDownloadsCount = state => state.api.loadsManager.downloadsCount
export const getLoadingProgress = state => state.api.loadsManager.loadingProgress

const checkPartKeyPresense = (object, key) => {
  return Object.keys(object).some(objKey => object[objKey] && objKey.includes(key))
}
export const getIsUploadingUrl = (url, comparePart = false) => state => {
  const urls = state.api.loadsManager.uploadUrls
  if (!comparePart) return !!urls[url]
  return checkPartKeyPresense(urls, url)
}
export const getIsDownloadingUrl = (url, comparePart = false) => state => {
  const urls = state.api.loadsManager.downloadUrls
  if (!comparePart) return !!urls[url]
  return checkPartKeyPresense(urls, url)
}
export const getIsLoadingUrl = (url, comparePart = false) => state => {
  return getIsUploadingUrl(url, comparePart)(state) || getIsDownloadingUrl(url, comparePart)(state)
}

export const getIsUploading = createSelector(
  [getUploadsCount],
  uploads => uploads > 0,
)

export const getIsDownloading = createSelector(
  [getDownloadsCount],
  downloads => downloads > 0,
)

export const getIsLoading = createSelector(
  [getIsUploading, getIsDownloading],
  (isUploading, isDownloading) => isUploading || isDownloading,
)
