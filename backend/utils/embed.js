// utils/embed.js
export function computeIframeUrl({ type, videoUrl, audioUrl, linkUrl }) {
  const url = videoUrl || audioUrl || linkUrl || '';
  if (!url) return { iframeUrl: undefined, provider: null };

  // YouTube
  if (url.includes('youtube.com/watch?v=')) {
    return {
      iframeUrl: url.replace('watch?v=', 'embed/'),
      provider: 'youtube',
    };
  }

  // Vimeo
  if (url.includes('vimeo.com/')) {
    const m = url.match(/vimeo\.com\/(\d+)/);
    if (m) {
      return {
        iframeUrl: `https://player.vimeo.com/video/${m[1]}`,
        provider: 'vimeo',
      };
    }
  }

  // Facebook (puede fallar por CSP/privacidad, pero lo intentamos)
  if (url.includes('facebook.com/share/')) {
    return {
      iframeUrl: url.replace('/share/', '/embed/'),
      provider: 'facebook',
    };
  }

  // Spotify
  if (url.includes('spotify.com/track/')) {
    return {
      iframeUrl: url.replace('/track/', '/embed/track/'),
      provider: 'spotify',
    };
  }
  if (url.includes('spotify.com/episode/')) {
    return {
      iframeUrl: url.replace('/episode/', '/embed/episode/'),
      provider: 'spotify',
    };
  }
  if (url.includes('spotify.com/show/')) {
    return {
      iframeUrl: url.replace('/show/', '/embed/show/'),
      provider: 'spotify',
    };
  }

  // TikTok: SOLO /video/{id}
  if (url.includes('tiktok.com/video/')) {
    const m = url.match(/\/video\/(\d+)/);
    if (m) {
      return {
        iframeUrl: `https://www.tiktok.com/embed/v2/${m[1]}`,
        provider: 'tiktok',
      };
    }
  }
  // TikTok photo / perfil -> no embebible
  if (url.includes('tiktok.com')) {
    return { iframeUrl: undefined, provider: 'tiktok' };
  }

  return { iframeUrl: url, provider: 'custom' };
}

export function detectProvider(url = '') {
  if (url.includes('youtube.com')) return 'youtube';
  if (url.includes('vimeo.com') || url.includes('player.vimeo.com')) return 'vimeo';
  if (url.includes('facebook.com')) return 'facebook';
  if (url.includes('spotify.com')) return 'spotify';
  if (url.includes('tiktok.com')) return 'tiktok';
  return 'custom';
}
