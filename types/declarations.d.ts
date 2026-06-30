declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';

  interface IconProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
    absoluteStrokeWidth?: boolean;
  }

  type LucideIcon = ComponentType<IconProps>;

  export const Home: LucideIcon;
  export const MessageCircle: LucideIcon;
  export const Pill: LucideIcon;
  export const User: LucideIcon;
  export const HeartPulse: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const Search: LucideIcon;
  export const MapPin: LucideIcon;
  export const Bell: LucideIcon;
  export const Bot: LucideIcon;
  export const TreeDeciduous: LucideIcon;
  export const Clock: LucideIcon;
  export const Navigation: LucideIcon;
  export const Send: LucideIcon;
  export const AtSign: LucideIcon;
  export const Lock: LucideIcon;
  export const Eye: LucideIcon;
  export const EyeOff: LucideIcon;
  export const Users: LucideIcon;
  export const Check: LucideIcon;
  export const Heart: LucideIcon;
  export const Activity: LucideIcon;
  export const Droplets: LucideIcon;
  export const Moon: LucideIcon;
  export const Settings: LucideIcon;
  export const Shield: LucideIcon;
  export const LogOut: LucideIcon;
  export const Mail: LucideIcon;
}

declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}
