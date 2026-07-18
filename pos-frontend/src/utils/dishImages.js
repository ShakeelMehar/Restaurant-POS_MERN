import beefPulao from "../assets/images/menu/beef_pulao_1784401560663.png";
import chickenBiryani from "../assets/images/menu/chicken_biryani_1784401550527.png";
import internationalDrinks from "../assets/images/menu/international_drinks_1784401578939.png";
import kachumberSalad from "../assets/images/menu/kachumber_salad_1784401588292.png";
import mintRaita from "../assets/images/menu/mint_raita_1784401598077.png";
import pakistaniDrinks from "../assets/images/menu/pakistani_drinks_1784401569732.png";
import shamiTikki from "../assets/images/menu/shami_tikki_1784401606274.png";

// Keyword-matched dish photography. First matching rule wins, so order
// specific dish names before generic category fallbacks.
const NAME_RULES = [
  { image: chickenBiryani, keywords: ["chicken biryani", "biryani"] },
  { image: beefPulao, keywords: ["beef pulao", "beef biryani", "pulao"] },
  { image: mintRaita, keywords: ["raita"] },
  { image: kachumberSalad, keywords: ["salad", "kachumber"] },
  { image: shamiTikki, keywords: ["shami", "tikki", "tikka", "kebab", "kabab"] },
  { image: pakistaniDrinks, keywords: ["next cola", "gourmet", "malta", "lassi"] },
  { image: internationalDrinks, keywords: ["pepsi", "coke", "sprite", "cola", "drink", "juice", "water"] },
];

const CATEGORY_RULES = [
  { image: chickenBiryani, keywords: ["biryani"] },
  { image: beefPulao, keywords: ["pulao"] },
  { image: internationalDrinks, keywords: ["drink", "cold", "beverage"] },
  { image: kachumberSalad, keywords: ["extra", "side"] },
];

const matchRules = (value, rules) => {
  if (!value) return null;
  const haystack = value.toLowerCase();
  for (const rule of rules) {
    if (rule.keywords.some((kw) => haystack.includes(kw))) {
      return rule.image;
    }
  }
  return null;
};

/**
 * Resolve a dish photo from its name (preferred) then category (fallback).
 * Returns null when nothing matches so callers can render a graceful
 * placeholder instead of a broken image.
 */
export const getDishImage = (name, category) =>
  matchRules(name, NAME_RULES) || matchRules(category, CATEGORY_RULES) || null;

export default getDishImage;
