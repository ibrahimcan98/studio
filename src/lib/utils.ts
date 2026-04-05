import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCountryFromPhone(phone: string | undefined | null) {
  let cleanPhone = (phone || "").replace(/[\s-()]/g, "");
  if (cleanPhone.startsWith('00')) cleanPhone = '+' + cleanPhone.substring(2);
  else if (!cleanPhone.startsWith('+')) {
     if (cleanPhone.length === 10 && cleanPhone.startsWith('5')) cleanPhone = '+90' + cleanPhone;
     else cleanPhone = '+' + cleanPhone;
  }

  if (cleanPhone.startsWith("+90")) return "🇹🇷 Türkiye";
  if (cleanPhone.startsWith("+49")) return "🇩🇪 Almanya";
  if (cleanPhone.startsWith("+44")) return "🇬🇧 İngiltere";
  if (cleanPhone.startsWith("+1")) return "🇺🇸/🇨🇦 ABD/Kanada";
  if (cleanPhone.startsWith("+62")) return "🇮🇩 Endonezya";
  if (cleanPhone.startsWith("+353")) return "🇮🇪 İrlanda";
  if (cleanPhone.startsWith("+33")) return "🇫🇷 Fransa";
  if (cleanPhone.startsWith("+31")) return "🇳🇱 Hollanda";
  if (cleanPhone.startsWith("+32")) return "🇧🇪 Belçika";
  if (cleanPhone.startsWith("+43")) return "🇦🇹 Avusturya";
  if (cleanPhone.startsWith("+41")) return "🇨🇭 İsviçre";
  if (cleanPhone.startsWith("+46")) return "🇸🇪 İsveç";
  if (cleanPhone.startsWith("+45")) return "🇩🇰 Danimarka";
  if (cleanPhone.startsWith("+47")) return "🇳🇴 Norveç";
  if (cleanPhone.startsWith("+358")) return "🇫🇮 Finlandiya";
  if (cleanPhone.startsWith("+39")) return "🇮🇹 İtalya";
  if (cleanPhone.startsWith("+34")) return "🇪🇸 İspanya";
  if (cleanPhone.startsWith("+30")) return "🇬🇷 Yunanistan";
  if (cleanPhone.startsWith("+359")) return "🇧🇬 Bulgaristan";
  if (cleanPhone.startsWith("+61")) return "🇦🇺 Avustralya";
  if (cleanPhone.startsWith("+971")) return "🇦🇪 B.A.E";
  if (cleanPhone.startsWith("+974")) return "🇶🇦 Katar";
  if (cleanPhone.startsWith("+966")) return "🇸🇦 Suudi Arabistan";
  if (cleanPhone.startsWith("+994")) return "🇦🇿 Azerbaycan";
  if (cleanPhone.startsWith("+7")) return "🇷🇺/🇰🇿 Rusya/Kazakistan";

  // Provide a generic fallback with the first 4 characters of the area code
  return "🌍 Diğer (" + cleanPhone.substring(0, 4) + "..)";
}
