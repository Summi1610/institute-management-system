import api from '../services/api';

const openBlobInNewTab = (blob) => {
  const blobUrl = window.URL.createObjectURL(blob);
  window.open(blobUrl, '_blank', 'noopener,noreferrer');

  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 60000);
};

export const openProtectedFile = async (url) => {
  const response = await api.get(url, { responseType: 'blob' });
  openBlobInNewTab(response.data);
};
