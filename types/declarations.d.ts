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
  export const Sparkle: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Navigation: LucideIcon;
  export const Plus: LucideIcon;
  export const Image: LucideIcon;
  export const FileText: LucideIcon;
  export const X: LucideIcon;
  export const Phone: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const MessageSquarePlus: LucideIcon;
  export const Trash2: LucideIcon;
  export const History: LucideIcon;
  export const CreditCard: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Clock: LucideIcon;
  export const PackageOpen: LucideIcon;
}

declare module 'react-native-geolocation-service' {
  interface GeoPosition {
    coords: {
      latitude: number;
      longitude: number;
      accuracy: number | null;
      altitude: number | null;
      heading: number | null;
      speed: number | null;
    };
    timestamp: number;
  }

  interface GeoOptions {
    timeout?: number;
    enableHighAccuracy?: boolean;
    maximumAge?: number;
    distanceFilter?: number;
    interval?: number;
  }

  type GeoCallback = (position: GeoPosition) => void;
  type GeoErrorCallback = (error: any) => void;

  export function getCurrentPosition(
    success: GeoCallback,
    error?: GeoErrorCallback,
    options?: GeoOptions,
  ): void;

  export function watchPosition(
    success: GeoCallback,
    error?: GeoErrorCallback,
    options?: GeoOptions,
  ): number;

  export function clearWatch(id: number): void;
}

declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}
