import React, { useState, useMemo } from 'react';

// Eager glob import for any local images placed in src/components/images/
const LOCAL_IMAGES = import.meta.glob('./images/*.{png,jpg,jpeg,webp,svg,PNG,JPG,JPEG,WEBP,SVG}', { eager: true });

// Pre-indexed map of normalized local filenames -> resolved asset URLs
const LOCAL_IMAGE_MAP = {};
Object.keys(LOCAL_IMAGES).forEach((filePath) => {
  const fileName = filePath.split('/').pop().split('.')[0].toLowerCase().replace(/[^a-z0-9]+/g, '');
  const assetUrl = LOCAL_IMAGES[filePath]?.default || LOCAL_IMAGES[filePath];
  if (assetUrl) {
    LOCAL_IMAGE_MAP[fileName] = assetUrl;
  }
});


import { REAL_PLAYER_PHOTOS } from '../data/cricketDatabase.js';


const ROLE_PHOTO_FALLBACKS = {
  "batter": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80",
  "bowler": "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=600&q=80",
  "all-rounder": "https://images.unsplash.com/photo-1508802913482-f3da9e4b5171?auto=format&fit=crop&w=600&q=80",
  "wicketkeeper": "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=600&q=80"
};

export default function PlayerAvatar({ player, className = "w-10 h-10", rounded = "rounded-full" }) {
  // Resolve image source: 1. Local image file in /src/components/images, 2. REAL_PLAYER_PHOTOS, 3. player.avatar
  const resolvedSrc = useMemo(() => {
    if (!player) return ROLE_PHOTO_FALLBACKS.batter;

    const idKey = (player.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const nameKey = (player.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
    const firstName = (player.name || '').split(' ')[0].toLowerCase().replace(/[^a-z0-9]+/g, '');
    const lastName = (player.name || '').split(' ').slice(-1)[0].toLowerCase().replace(/[^a-z0-9]+/g, '');

    // 1. Direct key match
    if (LOCAL_IMAGE_MAP[idKey]) return LOCAL_IMAGE_MAP[idKey];
    if (LOCAL_IMAGE_MAP[nameKey]) return LOCAL_IMAGE_MAP[nameKey];

    // 2. Spelling Aliases (e.g. smrithy -> smriti, harman -> harmanpreet, rohith -> rohit)
    const SPELLING_ALIASES = {
      "smrithy": "smriti",
      "smriti": "smrithy",
      "harman": "harmanpreet",
      "rohith": "rohit",
      "rohit": "rohith"
    };

    if (SPELLING_ALIASES[firstName] && LOCAL_IMAGE_MAP[SPELLING_ALIASES[firstName]]) {
      return LOCAL_IMAGE_MAP[SPELLING_ALIASES[firstName]];
    }

    // 3. First name / last name match (e.g. virat -> virat-kohli, travis -> travis-head, babar -> babar-azam, sanju -> sanju-samson)
    if (firstName && LOCAL_IMAGE_MAP[firstName]) return LOCAL_IMAGE_MAP[firstName];
    if (lastName && LOCAL_IMAGE_MAP[lastName]) return LOCAL_IMAGE_MAP[lastName];

    // 4. Substring search across local image filenames (requires >= 3 characters to avoid false matches like 't' in 'T Natarajan' matching 'rohith')
    const localKeys = Object.keys(LOCAL_IMAGE_MAP);
    for (const key of localKeys) {
      if (key.length >= 3) {
        if (
          (firstName.length >= 3 && (key.includes(firstName) || firstName.includes(key))) ||
          (lastName.length >= 3 && (key.includes(lastName) || lastName.includes(key))) ||
          (idKey.length >= 3 && (key.includes(idKey) || idKey.includes(key)))
        ) {
          return LOCAL_IMAGE_MAP[key];
        }
      }
    }



    // 4. Jersey number match e.g. "18.jpg"
    if (player.jerseyNumber && LOCAL_IMAGE_MAP[String(player.jerseyNumber)]) {
      return LOCAL_IMAGE_MAP[String(player.jerseyNumber)];
    }

    return REAL_PLAYER_PHOTOS[player.id] || player.avatar || ROLE_PHOTO_FALLBACKS.batter;
  }, [player]);

  const [imgSrc, setImgSrc] = useState(resolvedSrc);
  const [hasFailedOnce, setHasFailedOnce] = useState(false);

  // Update state when player prop changes
  React.useEffect(() => {
    setImgSrc(resolvedSrc);
    setHasFailedOnce(false);
  }, [resolvedSrc]);

  const handleError = () => {
    if (!hasFailedOnce) {
      setHasFailedOnce(true);
      const roleKey = player?.role?.toLowerCase() || 'batter';
      if (roleKey.includes('bowler')) setImgSrc(ROLE_PHOTO_FALLBACKS.bowler);
      else if (roleKey.includes('all-rounder')) setImgSrc(ROLE_PHOTO_FALLBACKS["all-rounder"]);
      else if (roleKey.includes('wicketkeeper')) setImgSrc(ROLE_PHOTO_FALLBACKS.wicketkeeper);
      else setImgSrc(ROLE_PHOTO_FALLBACKS.batter);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={player?.name || 'Cricket Player'}
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
      className={`${className} ${rounded} object-cover border border-slate-700/80 shadow-md shrink-0 bg-slate-900`}
    />
  );
}
