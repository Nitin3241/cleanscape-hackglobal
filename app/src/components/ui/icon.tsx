import { I18nManager } from 'react-native';
import Bell from 'lucide-react-native/icons/bell';
import Calendar from 'lucide-react-native/icons/calendar';
import CalendarPlus from 'lucide-react-native/icons/calendar-plus';
import Check from 'lucide-react-native/icons/check';
import ChevronEnd from 'lucide-react-native/icons/chevron-right';
import ChevronStart from 'lucide-react-native/icons/chevron-left';
import Close from 'lucide-react-native/icons/x';
import Expand from 'lucide-react-native/icons/maximize-2';
import MicOff from 'lucide-react-native/icons/mic-off';
import Keyboard from 'lucide-react-native/icons/keyboard';
import ScanEye from 'lucide-react-native/icons/scan-eye';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import Mic from 'lucide-react-native/icons/mic';
import Clock from 'lucide-react-native/icons/clock';
import Timer from 'lucide-react-native/icons/timer';
import Lock from 'lucide-react-native/icons/lock';
import Home from 'lucide-react-native/icons/house';
import Leaf from 'lucide-react-native/icons/leaf';
import Pin from 'lucide-react-native/icons/map-pin';
import Locate from 'lucide-react-native/icons/locate-fixed';
import Pencil from 'lucide-react-native/icons/pencil';
import Flame from 'lucide-react-native/icons/flame';
import Mail from 'lucide-react-native/icons/mail';
import Contact from 'lucide-react-native/icons/contact';
import Eye from 'lucide-react-native/icons/eye';
import BadgeCheck from 'lucide-react-native/icons/badge-check';
import Scan from 'lucide-react-native/icons/scan-line';
import Smile from 'lucide-react-native/icons/smile';
import MapIcon from 'lucide-react-native/icons/map';
import Menu from 'lucide-react-native/icons/menu';
import Waves from 'lucide-react-native/icons/waves';
import Star from 'lucide-react-native/icons/star';
import Minus from 'lucide-react-native/icons/minus';
import Plus from 'lucide-react-native/icons/plus';
import Shield from 'lucide-react-native/icons/shield';
import ShieldCheck from 'lucide-react-native/icons/shield-check';
import Hand from 'lucide-react-native/icons/hand';
import Wallet from 'lucide-react-native/icons/wallet';
import Navigate from 'lucide-react-native/icons/navigation';
import Share from 'lucide-react-native/icons/share';
import Hourglass from 'lucide-react-native/icons/hourglass';
import Info from 'lucide-react-native/icons/info';
import Car from 'lucide-react-native/icons/car';
import Train from 'lucide-react-native/icons/train-front';
import Bus from 'lucide-react-native/icons/bus';
import BusFront from 'lucide-react-native/icons/bus-front';
import CarFront from 'lucide-react-native/icons/car-front';
import Walk from 'lucide-react-native/icons/footprints';
import Parking from 'lucide-react-native/icons/square-parking';
import Chat from 'lucide-react-native/icons/message-circle';
import Send from 'lucide-react-native/icons/send';
import EyeOff from 'lucide-react-native/icons/eye-off';
import WifiOff from 'lucide-react-native/icons/wifi-off';
import Refresh from 'lucide-react-native/icons/refresh-cw';
import ArrowEnd from 'lucide-react-native/icons/arrow-right';
import Licence from 'lucide-react-native/icons/id-card';
import Seat from 'lucide-react-native/icons/armchair';
import User from 'lucide-react-native/icons/user';
import QrCode from 'lucide-react-native/icons/qr-code';
import UserPlus from 'lucide-react-native/icons/user-plus';
import Users from 'lucide-react-native/icons/users';
import AlarmClock from 'lucide-react-native/icons/alarm-clock';
import FileText from 'lucide-react-native/icons/file-text';
import LinkIcon from 'lucide-react-native/icons/link';
import ArrowUpRight from 'lucide-react-native/icons/arrow-up-right';
import Zap from 'lucide-react-native/icons/zap';
import Vending from 'lucide-react-native/icons/refrigerator';
import Sun from 'lucide-react-native/icons/sun';
import Droplet from 'lucide-react-native/icons/droplet';
import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import Search from 'lucide-react-native/icons/search';
import Camera from 'lucide-react-native/icons/camera';
import Phone from 'lucide-react-native/icons/phone';
import List from 'lucide-react-native/icons/list';
import ImageIcon from 'lucide-react-native/icons/image';
import Trees from 'lucide-react-native/icons/trees';
import Cup from 'lucide-react-native/icons/cup-soda';
import Shirt from 'lucide-react-native/icons/shirt';
import Trash from 'lucide-react-native/icons/trash-2';
import Award from 'lucide-react-native/icons/award';
import ThumbsUp from 'lucide-react-native/icons/thumbs-up';
import ThumbsDown from 'lucide-react-native/icons/thumbs-down';
import Copy from 'lucide-react-native/icons/copy';
import Volume from 'lucide-react-native/icons/volume-2';
import History from 'lucide-react-native/icons/history';
import Download from 'lucide-react-native/icons/download';
import Frown from 'lucide-react-native/icons/frown';
import Laugh from 'lucide-react-native/icons/laugh';
import SmilePlus from 'lucide-react-native/icons/smile-plus';
import Play from 'lucide-react-native/icons/play';
import Pause from 'lucide-react-native/icons/pause';
import ArrowUp from 'lucide-react-native/icons/arrow-up';
import Ellipsis from 'lucide-react-native/icons/ellipsis';
import Recycle from 'lucide-react-native/icons/recycle';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import Flag from 'lucide-react-native/icons/flag';
import Layers from 'lucide-react-native/icons/layers';
import ArrowLeftRight from 'lucide-react-native/icons/arrow-left-right';
import AudioLines from 'lucide-react-native/icons/audio-lines';
import GraduationCap from 'lucide-react-native/icons/graduation-cap';
import LifeBuoy from 'lucide-react-native/icons/life-buoy';
import Meh from 'lucide-react-native/icons/meh';
import Moon from 'lucide-react-native/icons/moon';
import Umbrella from 'lucide-react-native/icons/umbrella';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useRtlScope } from '@/state/language';

/**
 * The app's line icons, from lucide (the handoff's icon set). Each icon is imported on its own,
 * so only these ship in the bundle. Names describe the job, not the drawing.
 */
const ICONS = {
  bell: Bell,
  calendar: Calendar,
  'calendar-plus': CalendarPlus,
  check: Check,
  tick: Check,
  'chevron-end': ChevronEnd,
  'chevron-start': ChevronStart,
  close: Close,
  expand: Expand,
  'mic-off': MicOff,
  keyboard: Keyboard,
  'scan-eye': ScanEye,
  'chevron-down': ChevronDown,
  mic: Mic,
  clock: Clock,
  timer: Timer,
  lock: Lock,
  home: Home,
  leaf: Leaf,
  pin: Pin,
  locate: Locate,
  pencil: Pencil,
  flame: Flame,
  mail: Mail,
  contact: Contact,
  eye: Eye,
  'badge-check': BadgeCheck,
  scan: Scan,
  smile: Smile,
  map: MapIcon,
  menu: Menu,
  waves: Waves,
  star: Star,
  minus: Minus,
  plus: Plus,
  shield: Shield,
  'shield-check': ShieldCheck,
  hand: Hand,
  wallet: Wallet,
  navigate: Navigate,
  share: Share,
  hourglass: Hourglass,
  info: Info,
  car: Car,
  train: Train,
  bus: Bus,
  'bus-front': BusFront,
  'car-front': CarFront,
  walk: Walk,
  parking: Parking,
  chat: Chat,
  send: Send,
  'eye-off': EyeOff,
  'wifi-off': WifiOff,
  refresh: Refresh,
  'arrow-end': ArrowEnd,
  licence: Licence,
  seat: Seat,
  user: User,
  qr: QrCode,
  'user-plus': UserPlus,
  users: Users,
  alarm: AlarmClock,
  file: FileText,
  link: LinkIcon,
  'trend-up': ArrowUpRight,
  flash: Zap,
  vending: Vending,
  sun: Sun,
  droplet: Droplet,
  alert: TriangleAlert,
  search: Search,
  camera: Camera,
  phone: Phone,
  list: List,
  image: ImageIcon,
  tree: Trees,
  cup: Cup,
  shirt: Shirt,
  trash: Trash,
  award: Award,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  copy: Copy,
  volume: Volume,
  history: History,
  download: Download,
  layers: Layers,
  swap: ArrowLeftRight,
  frown: Frown,
  laugh: Laugh,
  'smile-plus': SmilePlus,
  play: Play,
  pause: Pause,
  'arrow-up': ArrowUp,
  more: Ellipsis,
  recycle: Recycle,
  bag: ShoppingBag,
  flag: Flag,
  'audio-lines': AudioLines,
  // Event day (F11): prayer room, shade, school hours, the OK rating and the header Help button.
  moon: Moon,
  umbrella: Umbrella,
  school: GraduationCap,
  meh: Meh,
  help: LifeBuoy,
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size: number;
  color: ThemeColor;
  /** Line thickness in screen pixels, whatever the icon size. */
  strokeWidth?: number;
  /** Fills the shape too, for solid marks such as the best-match star. */
  fill?: ThemeColor;
};

/** Line icon. Chevrons and arrows follow the reading direction, so they flip in RTL. */
export function Icon({ name, size, color, strokeWidth = 2, fill }: IconProps) {
  const theme = useTheme();
  const Glyph = ICONS[name];
  const rtl = useRtlScope();
  const mirrored = (name === 'chevron-end' || name === 'chevron-start' || name === 'arrow-end') && (I18nManager.isRTL || rtl);

  return (
    <Glyph
      size={size}
      color={theme[color]}
      strokeWidth={strokeWidth}
      absoluteStrokeWidth
      fill={fill ? theme[fill] : 'none'}
      style={mirrored ? { transform: [{ scaleX: -1 }] } : undefined}
    />
  );
}
