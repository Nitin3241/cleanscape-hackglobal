/**
 * Figma icons on the Earthy chat screens (F9v2) that the line-icon set draws differently.
 * Each takes its stroke colour so it follows the theme.
 */

/** icon/speaker (18): a small speaker with one wave, on the newest Earthy answer. */
export const speakerIconXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 6.75C12.3192 7.03153 12.5749 7.37775 12.75 7.76569C12.9251 8.15362 13.0157 8.57437 13.0157 9C13.0157 9.42563 12.9251 9.84638 12.75 10.2343C12.5749 10.6222 12.3192 10.9685 12 11.25M3.75 7.5V10.5H6L9 13.5V4.5L6 7.5H3.75Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** icon/lens (20): scan corners round a circle, Earthy Lens in the composer. */
export const lensIconXml = (
  stroke: string,
) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33333 6.66667V4.16667H5.83333M16.6667 6.66667V4.16667H14.1667M3.33333 13.3333V15.8333H5.83333M16.6667 13.3333V15.8333H14.1667M10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;
