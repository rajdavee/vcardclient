export const getImageSrc = (profileImage: string | FileList | undefined): string => {
  if (typeof profileImage === 'string' && profileImage.length > 0) {
    if (profileImage.startsWith('data:image')) {
      return profileImage; // This will handle the cropped image data URL
    } else if (profileImage.startsWith('http') || profileImage.startsWith('https')) {
      return profileImage; // This will handle Cloudinary URLs
    } else {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api$/, '');
      return `${baseUrl}/uploads/${profileImage.split('/').pop()}`;
    }
  } else if (profileImage instanceof FileList && profileImage.length > 0) {
    return URL.createObjectURL(profileImage[0]);
  }
  return '/images/default-profile-image.png';
};
