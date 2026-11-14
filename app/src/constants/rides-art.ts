/**
 * Figma art for the ride screens (T3–T14), exported from the file. Colours are filled in from the theme.
 */

/** Figma "icon/car" (T11 No seats yet): a 50 px seat outline, 3.15 stroke. */
export const carSeatXml = (
  stroke: string,
) => `<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.6665 33.3331V24.9998L37.4998 14.5831H12.4998L8.33314 24.9998V33.3331M8.33314 33.3331H41.6665M8.33314 33.3331V38.5415M8.33314 24.9998H41.6665M41.6665 33.3331V38.5415" stroke-width="3.15" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma "icon/bell" (T11 Notify me): 18 px, 1.125 stroke. */
export const bellXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 15.375C7.5 15.7728 7.65804 16.1544 7.93934 16.4357C8.22064 16.717 8.60218 16.875 9 16.875C9.39782 16.875 9.77936 16.717 10.0607 16.4357C10.342 16.1544 10.5 15.7728 10.5 15.375M4.5 12V8.25C4.5 7.05653 4.97411 5.91193 5.81802 5.06802C6.66193 4.22411 7.80653 3.75 9 3.75C10.1935 3.75 11.3381 4.22411 12.182 5.06802C13.0259 5.91193 13.5 7.05653 13.5 8.25V12L14.625 13.5H3.375L4.5 12Z" stroke-width="1.125" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma "icon/train" (T11 Metro fallback): 20 px, 1.25 stroke. */
export const trainXml = (
  stroke: string,
) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 2.91667H12.5C13.8807 2.91667 15 4.03595 15 5.41667V12.0833C15 13.464 13.8807 14.5833 12.5 14.5833H7.5C6.11929 14.5833 5 13.464 5 12.0833V5.41667C5 4.03595 6.11929 2.91667 7.5 2.91667Z" stroke-width="1.25" stroke="${stroke}"/>
<path d="M5 9.16667H15M7.5 17.0833L8.75 14.5833M12.5 17.0833L11.25 14.5833M7.5 12.0833H7.50833M12.5 12.0833H12.5083" stroke-width="1.25" stroke-linecap="round" stroke="${stroke}"/>
</svg>`;

/** Figma T4 car tile: a 36 px rounded square with the car outline. */
export const carTileXml = (
  tile: string,
  stroke: string,
) => `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="36" height="36" rx="10" fill="${tile}"/>
<path d="M23 20H26V15L24 9H12L10 15V20H13M23 20H13M23 20V23M13 20V23" stroke-width="2" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma T4 trust badge: a 24 px green circle with a tick. */
export const tickBadgeXml = (
  fill: string,
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="${fill}"/>
<path d="M7 12.25L10.5 15.75L17 8.25" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma T4 privacy badge: a 24 px blue circle with a lock. */
export const lockBadgeXml = (
  fill: string,
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="${fill}"/>
<path d="M9 11.625V8.625C9 5.625 15 5.625 15 8.625V11.625M9 11.625H7V17.625H17V11.625H15M9 11.625H15" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma T5 status rail, done step: a 16 px filled dot with a tick, and the 2 px line on to the next step. */
export const railDoneXml = (
  brand: string,
  tick: string,
  line: boolean,
) => `<svg width="16" height="${line ? 52 : 36}" viewBox="0 0 16 ${line ? 52 : 36}" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="10" r="8" fill="${brand}"/>
<path d="M4.5 10L7 12.5L11.5 7" stroke-width="1.8" stroke-linecap="round" stroke="${tick}"/>
${line ? `<rect x="7" y="20" width="2" height="32" fill="${brand}"/>` : ''}
</svg>`;

/** Figma T5 status rail, current step: a ringed dot in a soft halo (clipped to 16 px as drawn), then a grey line. */
export const railCurrentXml = (
  brand: string,
  card: string,
  rest: string,
) => `<svg width="16" height="52" viewBox="0 0 16 52" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs><clipPath id="c"><rect width="16" height="52"/></clipPath></defs>
<g clip-path="url(#c)">
<circle cx="8" cy="10" r="13" fill="${brand}" fill-opacity="0.1"/>
<circle cx="8" cy="10" r="6.5" fill="${card}" stroke-width="3" stroke="${brand}"/>
<rect x="7" y="20" width="2" height="32" fill="${rest}"/>
</g>
</svg>`;

/** Figma T5 status rail, later step: an empty grey ring. */
export const railTodoXml = (
  card: string,
  ring: string,
) => `<svg width="16" height="36" viewBox="0 0 16 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="10" r="7" fill="${card}" stroke-width="2" stroke="${ring}"/>
</svg>`;

/** Figma T13 cancelled badge: a 20 px red circle with a white edge and a cross. */
export const crossBadgeXml = (
  fill: string,
  edge: string,
) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="1" width="18" height="18" rx="9" fill="${fill}"/>
<rect x="1" y="1" width="18" height="18" rx="9" stroke="${edge}" stroke-width="2"/>
<path d="M7 7L10 10M10 10L13 13M10 10L13 7M10 10L7 13" stroke-width="1.8" stroke-linecap="round" stroke="${edge}"/>
</svg>`;

/** Figma T6 "icon/lock" (privacy banner): 18 px, 1.125 stroke. */
export const lockXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.625 7.875H12.375C13.4105 7.875 14.25 8.71447 14.25 9.75V13.5C14.25 14.5355 13.4105 15.375 12.375 15.375H5.625C4.58947 15.375 3.75 14.5355 3.75 13.5V9.75C3.75 8.71447 4.58947 7.875 5.625 7.875Z" stroke-width="1.125" stroke="${stroke}"/>
<path d="M6 7.875V6C6 5.20435 6.31607 4.44129 6.87868 3.87868C7.44129 3.31607 8.20435 3 9 3C9.79565 3 10.5587 3.31607 11.1213 3.87868C11.6839 4.44129 12 5.20435 12 6V7.875" stroke-width="1.125" stroke="${stroke}"/>
</svg>`;

/** Figma T6 "icon/send" (composer): 18 px, 1.125 stroke. */
export const sendXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 9L15 3L10.5 15L8.625 10.125L3 9Z" stroke-width="1.125" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma T8 "icon/seat": a 22 px car seat; brand at 1.65 stroke when offered, grey at 1.1 when not. */
export const seatXml = (
  stroke: string,
  width: number,
) => `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.6667 12.8333V5.5C14.6667 5.01377 14.4735 4.54745 14.1297 4.20364C13.7859 3.85982 13.3196 3.66667 12.8333 3.66667H6.41667C6.17355 3.66667 5.94039 3.76324 5.76849 3.93515C5.59658 4.10706 5.5 4.34022 5.5 4.58333V11C5.5 11.4862 5.69315 11.9525 6.03697 12.2964C6.38079 12.6402 6.8471 12.8333 7.33333 12.8333M14.6667 12.8333H7.33333M14.6667 12.8333H16.5V15.5833H14.6667M7.33333 12.8333H5.5V15.5833H7.33333M14.6667 15.5833H7.33333M14.6667 15.5833V18.3333M7.33333 15.5833V18.3333" stroke-width="${width}" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma T8 "icon/minus" and "icon/plus": 18 px, 1.125 stroke. */
export const minusXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 9H13.5" stroke-width="1.125" stroke-linecap="round" stroke="${stroke}"/>
</svg>`;
export const plusXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 4.5V9M9 9V13.5M9 9H4.5M9 9H13.5" stroke-width="1.125" stroke-linecap="round" stroke="${stroke}"/>
</svg>`;

/** Figma T9 "icon/scan" (licence art): 28 px corner brackets, 1.75 stroke. */
export const scanXml = (
  stroke: string,
) => `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.66667 9.33333V6.41667C4.66667 5.95254 4.85104 5.50742 5.17923 5.17923C5.50742 4.85104 5.95254 4.66667 6.41667 4.66667H9.33333M18.6667 4.66667H21.5833C22.0475 4.66667 22.4926 4.85104 22.8208 5.17923C23.149 5.50742 23.3333 5.95254 23.3333 6.41667V9.33333M23.3333 18.6667V21.5833C23.3333 22.0475 23.149 22.4926 22.8208 22.8208C22.4926 23.149 22.0475 23.3333 21.5833 23.3333H18.6667M9.33333 23.3333H6.41667C5.95254 23.3333 5.50742 23.149 5.17923 22.8208C4.85104 22.4926 4.66667 22.0475 4.66667 21.5833V18.6667" stroke-width="1.75" stroke-linecap="round" stroke="${stroke}"/>
</svg>`;

/** Figma T10 "Ride published" badge: a 20 px green circle with a tick. */
export const publishedBadgeXml = (
  fill: string,
  tick: string,
) => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="20" height="20" rx="10" fill="${fill}"/>
<path d="M5.5 10.225L8.65 13.375L14.5 6.625" stroke-width="1.62" stroke-linecap="round" stroke-linejoin="round" stroke="${tick}"/>
</svg>`;

/** Figma T10 "What happens next" badges: 24 px pale-blue circles with a tick or a chat bubble. */
export const nextTickXml = (
  fill: string,
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="${fill}"/>
<path d="M6.6 12.27L10.38 16.05L17.4 7.95" stroke-width="1.944" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;
export const nextChatXml = (
  fill: string,
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="24" height="24" rx="12" fill="${fill}"/>
<path d="M6.6 6.98571H17.4V14.7H10.4571L7.37143 17.0143V14.7H6.6V6.98571Z" stroke-width="1.38857" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma F3·9 invite sheet icons: "icon/link" (18 px) and the 24 px share options (msg, qr, share). */
export const linkXml = (
  stroke: string,
) => `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.5 9.75C7.82209 10.1806 8.23302 10.5369 8.70491 10.7947C9.17681 11.0525 9.69863 11.2058 10.235 11.2443C10.7713 11.2827 11.3097 11.2053 11.8135 11.0173C12.3173 10.8294 12.7748 10.5353 13.155 10.155L15.405 7.905C16.0881 7.19774 16.4661 6.25048 16.4575 5.26725C16.449 4.28401 16.0546 3.34346 15.3593 2.64818C14.664 1.9529 13.7235 1.55852 12.7403 1.54997C11.757 1.54143 10.8098 1.91941 10.1025 2.6025L8.8125 3.885" stroke-width="1.3125" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
<path d="M10.5 8.25C10.1779 7.8194 9.76698 7.46311 9.29509 7.2053C8.82319 6.94748 8.30137 6.79416 7.76501 6.75575C7.22865 6.71734 6.69031 6.79472 6.18649 6.98266C5.68267 7.1706 5.22516 7.4647 4.845 7.845L2.595 10.095C1.91191 10.8023 1.53393 11.7495 1.54247 12.7328C1.55102 13.716 1.9454 14.6565 2.64068 15.3518C3.33596 16.0471 4.27651 16.4415 5.25975 16.45C6.24298 16.4586 7.19024 16.0806 7.8975 15.3975L9.18 14.115" stroke-width="1.3125" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;
export const msgXml = (
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.9 20C9.80858 20.9791 12.0041 21.2442 14.0909 20.7478C16.1777 20.2513 18.0186 19.0258 19.2818 17.2922C20.545 15.5585 21.1474 13.4307 20.9806 11.2922C20.8137 9.15361 19.8886 7.14497 18.3718 5.62819C16.855 4.11142 14.8464 3.18625 12.7078 3.01942C10.5693 2.85258 8.44147 3.45505 6.70782 4.71825C4.97417 5.98145 3.74869 7.82231 3.25222 9.90911C2.75575 11.9959 3.02094 14.1914 4 16.1L2 22L7.9 20Z" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;
export const qrXml = (
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 3H7C7.55228 3 8 3.44772 8 4V7C8 7.55228 7.55228 8 7 8H4C3.44772 8 3 7.55228 3 7V4C3 3.44772 3.44772 3 4 3Z" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
<path d="M17 3H20C20.5523 3 21 3.44772 21 4V7C21 7.55228 20.5523 8 20 8H17C16.4477 8 16 7.55228 16 7V4C16 3.44772 16.4477 3 17 3Z" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
<path d="M4 16H7C7.55228 16 8 16.4477 8 17V20C8 20.5523 7.55228 21 7 21H4C3.44772 21 3 20.5523 3 20V17C3 16.4477 3.44772 16 4 16Z" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
<path d="M21 16H18C17.4696 16 16.9609 16.2107 16.5858 16.5858C16.2107 16.9609 16 17.4696 16 18V21M21 21V21.01M12 7V10C12 10.5304 11.7893 11.0391 11.4142 11.4142C11.0391 11.7893 10.5304 12 10 12H7M3 12H3.01M12 3H12.01M12 16V16.01M16 12H17M21 12V12.01M12 21V20" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;
export const shareXml = (
  stroke: string,
) => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2V15M8 6L12 2L16 6M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;

/** Figma T14 "Guardian line" lock: 11.6 × 11.85, 1.6 stroke (drawn at 10 × 10.25 plus its stroke). */
export const guardianLockXml = (
  stroke: string,
) => `<svg width="11.6" height="11.85" viewBox="0 0 11.6 11.85" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.8 5.05V3.05C2.8 0.05 8.8 0.05 8.8 3.05V5.05M2.8 5.05H0.8V11.05H10.8V5.05H8.8M2.8 5.05H8.8" stroke-width="1.6" stroke-linejoin="round" stroke="${stroke}"/>
</svg>`;
