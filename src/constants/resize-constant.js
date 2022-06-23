const sizeMap = {
  seatPhoto: {
    xs: {
      resizeOption: {
        width: 160,
        withoutEnlargement: true,
      },
      format: 'webp',
      formatOption: { quality: 50 },
    },
    sm: {
      resizeOption: {
        width: 320,
        withoutEnlargement: true,
      },
      format: 'webp',
      formatOption: { quality: 70 },
    },
    md: {
      resizeOption: {
        width: 640,
        withoutEnlargement: true,
      },
      format: 'webp',
      formatOption: { quality: 70 },
    },
    lg: {
      resizeOption: {
        width: 1280,
        withoutEnlargement: true,
      },
      format: 'jpeg',
      formatOption: { quality: 90 },
    },
  },
};

module.exports = { sizeMap };
