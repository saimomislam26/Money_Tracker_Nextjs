import {
  Utensils, ShoppingCart, Car, Home, Zap, ShoppingBag, Film, Heart, BookOpen, Plane, Tag, Briefcase, Laptop,
  TrendingUp, Gift, Coffee, Music, Gamepad2, Dumbbell, Baby, PawPrint, Wifi, Smartphone, GraduationCap, Wallet,
  Shirt, Fuel, Pill, type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils, "shopping-cart": ShoppingCart, car: Car, home: Home, zap: Zap, "shopping-bag": ShoppingBag,
  film: Film, heart: Heart, book: BookOpen, plane: Plane, tag: Tag, briefcase: Briefcase, laptop: Laptop,
  "trending-up": TrendingUp, gift: Gift, coffee: Coffee, music: Music, gamepad: Gamepad2, dumbbell: Dumbbell,
  baby: Baby, paw: PawPrint, wifi: Wifi, phone: Smartphone, graduation: GraduationCap, wallet: Wallet,
  shirt: Shirt, fuel: Fuel, pill: Pill,
};

export function CategoryIcon({ icon, color, size = 40 }: { icon: string; color: string; size?: number }) {
  const I = ICONS[icon] || Tag;
  return (
    <span className="grid shrink-0 place-items-center rounded-xl" style={{ width: size, height: size, background: `${color}22`, color }}>
      <I size={size * 0.5} strokeWidth={2.2} />
    </span>
  );
}
