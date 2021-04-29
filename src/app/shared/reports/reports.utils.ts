import { arrayBufferToBase64 } from '@papx/utils';

export const getPapelLogo = async (): Promise<string> => {
  const jpgImageBytes = await fetch(
    'assets/images/papel-logo.jpg'
  ).then((res) => res.arrayBuffer());
  const base64 = arrayBufferToBase64(jpgImageBytes);
  const res = 'data:image/jpg;base64,' + base64;
  return res;
};
