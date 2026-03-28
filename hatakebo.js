
    const { useState, Fragment, useEffect, useRef } = React;

/* ══════════════════════════════════════
   ハタケボ — 畑の帳簿
   デザイン: 和紙 × インク × 罫線帳
══════════════════════════════════════ */

const C = {
  paper:    "#f4edd8",   /* 和紙ベージュ */
  paper2:   "#ede4cc",   /* 少し濃い和紙 */
  ink:      "#1c1408",   /* インク色 */
  inkFaint: "#7a6848",   /* 薄いインク */
  inkLine:  "#c8b898",   /* 罫線 */
  inkBorder:"#a09070",   /* 枠線 */
  indigo:   "#2a3468",   /* 藍インク（アクセント） */
  indigoPale:"#dde2f4",  /* 薄藍 */
  red:      "#8a2020",   /* 朱印 */
  redPale:  "#f4e8e8",   /* 薄朱 */
  orange:   "#8a5010",   /* 注意朱 */
  orangePale:"#f4edd8",
  green:    "#2a5428",   /* 緑インク */
  greenPale:"#e4f0e0",
  stamp:    "#c83030",   /* 朱印 */
};
const SERIF  = "'Hiragino Mincho ProN', 'Yu Mincho', 'Noto Serif JP', Georgia, serif";
const SANS   = "'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif";
const HAND   = "'Hiragino Mincho ProN', cursive";

/* ══════════════════════════════════════
   野菜データ
══════════════════════════════════════ */
/* plantMonths: 植え付け適期の月（日本の一般的な目安） */
const VEGGIES = [
  /* ── ナス科 ── */
  { id:"tomato",       name:"トマト",       kana:"とまと",       family:"ナス科",     mark:"🍅", plantMonths:[3,4,5] },
  { id:"cherry_tomato",name:"ミニトマト",   kana:"みにとまと",   family:"ナス科",     mark:"🍅", plantMonths:[3,4,5] },
  { id:"eggplant",     name:"ナス",         kana:"なす",         family:"ナス科",     mark:"🍆", plantMonths:[4,5] },
  { id:"pepper",       name:"ピーマン",     kana:"ぴーまん",     family:"ナス科",     mark:"🫑", plantMonths:[4,5] },
  { id:"paprika",      name:"パプリカ",     kana:"ぱぷりか",     family:"ナス科",     mark:"🌶", plantMonths:[4,5] },
  { id:"chili",        name:"トウガラシ",   kana:"とうがらし",   family:"ナス科",     mark:"🌶", plantMonths:[4,5] },
  { id:"potato",       name:"ジャガイモ",   kana:"じゃがいも",   family:"ナス科",     mark:"🥔", plantMonths:[2,3,4,8,9] },
  /* ── ウリ科 ── */
  { id:"cucumber",     name:"キュウリ",     kana:"きゅうり",     family:"ウリ科",     mark:"🥒", plantMonths:[4,5,6] },
  { id:"pumpkin",      name:"カボチャ",     kana:"かぼちゃ",     family:"ウリ科",     mark:"🎃", plantMonths:[4,5] },
  { id:"watermelon",   name:"スイカ",       kana:"すいか",       family:"ウリ科",     mark:"🍉", plantMonths:[4,5] },
  { id:"zucchini",     name:"ズッキーニ",   kana:"ずっきーに",   family:"ウリ科",     mark:"🥒", plantMonths:[4,5] },
  { id:"bitter_melon", name:"ゴーヤ",       kana:"ごーや",       family:"ウリ科",     mark:"🥬", plantMonths:[4,5,6] },
  /* ── アブラナ科 ── */
  { id:"cabbage",      name:"キャベツ",     kana:"きゃべつ",     family:"アブラナ科", mark:"🥬", plantMonths:[3,4,8,9] },
  { id:"hakusai",      name:"ハクサイ",     kana:"はくさい",     family:"アブラナ科", mark:"🥬", plantMonths:[8,9] },
  { id:"broccoli",     name:"ブロッコリー", kana:"ぶろっこりー", family:"アブラナ科", mark:"🥦", plantMonths:[3,4,7,8] },
  { id:"cauliflower",  name:"カリフラワー", kana:"かりふらわー", family:"アブラナ科", mark:"🌸", plantMonths:[3,4,7,8] },
  { id:"komatsuna",    name:"コマツナ",     kana:"こまつな",     family:"アブラナ科", mark:"🌿", plantMonths:[3,4,5,9,10] },
  { id:"chingensai",   name:"チンゲンサイ", kana:"ちんげんさい", family:"アブラナ科", mark:"🥬", plantMonths:[4,5,8,9,10] },
  { id:"daikon",       name:"ダイコン",     kana:"だいこん",     family:"アブラナ科", mark:"🌿", plantMonths:[3,4,8,9,10] },
  { id:"turnip",       name:"カブ",         kana:"かぶ",         family:"アブラナ科", mark:"🌿", plantMonths:[3,4,5,8,9,10] },
  { id:"rocket",       name:"ルッコラ",     kana:"るっこら",     family:"アブラナ科", mark:"🌿", plantMonths:[3,4,5,8,9,10] },
  /* ── セリ科 ── */
  { id:"carrot",       name:"ニンジン",     kana:"にんじん",     family:"セリ科",     mark:"🥕", plantMonths:[3,4,7,8,9] },
  { id:"parsley",      name:"パセリ",       kana:"ぱせり",       family:"セリ科",     mark:"🌿", plantMonths:[3,4,5,8,9] },
  { id:"mitsuba",      name:"ミツバ",       kana:"みつば",       family:"セリ科",     mark:"🌿", plantMonths:[3,4,8,9] },
  /* ── ユリ科 ── */
  { id:"onion",        name:"タマネギ",     kana:"たまねぎ",     family:"ユリ科",     mark:"🧅", plantMonths:[9,10,11] },
  { id:"garlic",       name:"ニンニク",     kana:"にんにく",     family:"ユリ科",     mark:"🧄", plantMonths:[10,11] },
  { id:"negi",         name:"ネギ",         kana:"ねぎ",         family:"ユリ科",     mark:"🌿", plantMonths:[3,4,5,8,9] },
  { id:"nira",         name:"ニラ",         kana:"にら",         family:"ユリ科",     mark:"🌿", plantMonths:[3,4] },
  { id:"asparagus",    name:"アスパラガス", kana:"あすぱらがす", family:"ユリ科",     mark:"🌿", plantMonths:[3,4] },
  /* ── マメ科 ── */
  { id:"edamame",      name:"エダマメ",     kana:"えだまめ",     family:"マメ科",     mark:"🫘", plantMonths:[4,5,6] },
  { id:"green_bean",   name:"インゲン",     kana:"いんげん",     family:"マメ科",     mark:"🫘", plantMonths:[4,5,6] },
  { id:"broad_bean",   name:"ソラマメ",     kana:"そらまめ",     family:"マメ科",     mark:"🫘", plantMonths:[10,11] },
  { id:"snap_pea",     name:"スナップエンドウ",kana:"すなっぷえんどう",family:"マメ科",mark:"🫘",plantMonths:[10,11] },
  /* ── その他 ── */
  { id:"corn",         name:"トウモロコシ", kana:"とうもろこし", family:"イネ科",     mark:"🌽", plantMonths:[4,5,6] },
  { id:"lettuce",      name:"レタス",       kana:"れたす",       family:"キク科",     mark:"🥗", plantMonths:[3,4,5,8,9,10] },
  { id:"shungiku",     name:"シュンギク",   kana:"しゅんぎく",   family:"キク科",     mark:"🌿", plantMonths:[3,4,5,8,9,10] },
  { id:"sweetpotato",  name:"サツマイモ",   kana:"さつまいも",   family:"ヒルガオ科", mark:"🍠", plantMonths:[4,5,6] },
  { id:"strawberry",   name:"イチゴ",       kana:"いちご",       family:"バラ科",     mark:"🍓", plantMonths:[9,10,11] },
  { id:"basil",        name:"バジル",       kana:"ばじる",       family:"シソ科",     mark:"🌿", plantMonths:[4,5,6] },
  { id:"shiso",        name:"シソ",         kana:"しそ",         family:"シソ科",     mark:"🌿", plantMonths:[4,5] },
  { id:"taro",         name:"サトイモ",     kana:"さといも",     family:"サトイモ科", mark:"🥔", plantMonths:[4,5] },
  { id:"spinach",      name:"ホウレンソウ", kana:"ほうれんそう", family:"ヒユ科",     mark:"🌿", plantMonths:[3,4,9,10] },
];
const VM = Object.fromEntries(VEGGIES.map(function(v){ return [v.id, v]; }));

/* ══════════════════════════════════════
   野菜スタンプ SVG（インク画風）
══════════════════════════════════════ */
function VeggieStamp({ id, size }) {
  const s = size || 48;
  const v = VM[id];
  if (!v) return null;

  if (id === "tomato") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M14 10 Q12 6 10 8 Q12 10 14 13" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M22 8 Q22 4 22 2 Q24 6 24 11" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M32 10 Q34 6 36 8 Q34 10 32 13" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <ellipse cx="11" cy="13" rx="5" ry="2.5" fill="#4a8818" opacity="0.7" transform="rotate(-25 11 13)"/>
      <ellipse cx="24" cy="11" rx="5" ry="2.5" fill="#4a8818" opacity="0.7"/>
      <ellipse cx="37" cy="13" rx="5" ry="2.5" fill="#4a8818" opacity="0.7" transform="rotate(25 37 13)"/>
      <circle cx="24" cy="31" r="14" fill="#b82010" opacity="0.85"/>
      <circle cx="24" cy="31" r="14" fill="none" stroke="#881808" strokeWidth="1.5"/>
      <ellipse cx="18" cy="25" rx="4" ry="3" fill="rgba(255,255,255,0.22)" transform="rotate(-20 18 25)"/>
    </svg>
  );
  if (id === "eggplant") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M16 8 Q14 4 16 2 Q18 6 18 10" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <ellipse cx="13" cy="11" rx="5" ry="2.5" fill="#4a8818" opacity="0.7" transform="rotate(-20 13 11)"/>
      <ellipse cx="24" cy="9" rx="5" ry="2.5" fill="#4a8818" opacity="0.7"/>
      <ellipse cx="35" cy="11" rx="5" ry="2.5" fill="#4a8818" opacity="0.7" transform="rotate(20 35 11)"/>
      <ellipse cx="24" cy="32" rx="12" ry="14" fill="#5820a0" opacity="0.85"/>
      <ellipse cx="24" cy="32" rx="12" ry="14" fill="none" stroke="#3810a0" strokeWidth="1.5"/>
      <ellipse cx="18" cy="25" rx="3" ry="5" fill="rgba(255,255,255,0.18)" transform="rotate(-10 18 25)"/>
    </svg>
  );
  if (id === "pepper") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M24 6 Q24 3 24 1 Q25 4 24 7" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <ellipse cx="18" cy="9" rx="5" ry="2.5" fill="#4a8818" opacity="0.7" transform="rotate(-15 18 9)"/>
      <ellipse cx="30" cy="9" rx="5" ry="2.5" fill="#4a8818" opacity="0.7" transform="rotate(15 30 9)"/>
      <path d="M14 15 Q10 24 12 34 Q15 42 21 43 Q28 43 32 34 Q34 24 30 15 Q26 9 20 9 Q16 9 14 15Z" fill="#309020" opacity="0.85"/>
      <path d="M14 15 Q10 24 12 34 Q15 42 21 43 Q28 43 32 34 Q34 24 30 15 Q26 9 20 9 Q16 9 14 15Z" fill="none" stroke="#208010" strokeWidth="1.5"/>
      <ellipse cx="16" cy="24" rx="2" ry="5" fill="rgba(255,255,255,0.18)" transform="rotate(-10 16 24)"/>
    </svg>
  );
  if (id === "carrot") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M20 14 Q16 8 12 10 Q14 14 18 16" fill="#4a9818" opacity="0.8"/>
      <path d="M22 12 Q22 5 22 2 Q24 7 24 13" fill="#5aaa20" opacity="0.8"/>
      <path d="M26 14 Q30 8 34 10 Q32 14 28 16" fill="#4a9818" opacity="0.8"/>
      <path d="M16 18 Q12 26 16 36 Q19 44 24 46 Q29 44 32 36 Q36 26 32 18 Q28 12 24 12 Q20 12 16 18Z" fill="#e06010" opacity="0.9"/>
      <path d="M16 18 Q12 26 16 36 Q19 44 24 46 Q29 44 32 36 Q36 26 32 18 Q28 12 24 12 Q20 12 16 18Z" fill="none" stroke="#b04808" strokeWidth="1.5"/>
      <path d="M16 24 Q24 22 32 24" stroke="#b04808" strokeWidth="1" opacity="0.4"/>
      <path d="M15 31 Q24 29 33 31" stroke="#b04808" strokeWidth="1" opacity="0.4"/>
    </svg>
  );
  if (id === "onion") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M16 22 Q14 12 16 4" stroke="#4a9818" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M24 20 Q24 10 24 2" stroke="#5aaa20" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M32 22 Q34 12 32 4" stroke="#4a9818" strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d="M10 30 Q8 20 16 16 Q20 13 24 13 Q28 13 32 16 Q40 20 38 30 Q36 42 24 44 Q12 42 10 30Z" fill="#c8a010" opacity="0.9"/>
      <path d="M10 30 Q8 20 16 16 Q20 13 24 13 Q28 13 32 16 Q40 20 38 30 Q36 42 24 44 Q12 42 10 30Z" fill="none" stroke="#988008" strokeWidth="1.5"/>
      <ellipse cx="17" cy="25" rx="4" ry="6" fill="rgba(255,255,255,0.22)" transform="rotate(-15 17 25)"/>
    </svg>
  );
  if (id === "cucumber") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <circle cx="38" cy="12" r="5" fill="#e8c810" opacity="0.9"/>
      <circle cx="38" cy="12" r="5" fill="none" stroke="#c0a008" strokeWidth="1"/>
      <circle cx="38" cy="12" r="2" fill="#c0a008" opacity="0.7"/>
      <rect x="4" y="16" width="30" height="14" rx="7" fill="#3a9820" opacity="0.85" transform="rotate(-20 19 23)"/>
      <rect x="4" y="16" width="30" height="14" rx="7" fill="none" stroke="#289010" strokeWidth="1.5" transform="rotate(-20 19 23)"/>
      <ellipse cx="8" cy="20" rx="3" ry="5" fill="rgba(255,255,255,0.18)" transform="rotate(-20 8 20)"/>
    </svg>
  );
  if (id === "pumpkin") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M24 10 Q22 5 20 3 Q22 7 23 11" fill="#4a9818" opacity="0.8"/>
      <path d="M24 10 Q26 5 28 3 Q26 7 25 11" fill="#5aaa20" opacity="0.8"/>
      <ellipse cx="8" cy="30" rx="7" ry="9" fill="#c06010" opacity="0.8"/>
      <ellipse cx="18" cy="27" rx="9" ry="11" fill="#e07018" opacity="0.9"/>
      <ellipse cx="30" cy="27" rx="9" ry="11" fill="#e07018" opacity="0.9"/>
      <ellipse cx="40" cy="30" rx="7" ry="9" fill="#c06010" opacity="0.8"/>
      <ellipse cx="18" cy="27" rx="9" ry="11" fill="none" stroke="#a04808" strokeWidth="1.5"/>
      <ellipse cx="30" cy="27" rx="9" ry="11" fill="none" stroke="#a04808" strokeWidth="1.5"/>
      <line x1="18" y1="16" x2="18" y2="38" stroke="#a04808" strokeWidth="1.2" opacity="0.5"/>
      <line x1="30" y1="16" x2="30" y2="38" stroke="#a04808" strokeWidth="1.2" opacity="0.5"/>
    </svg>
  );
  if (id === "cabbage") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="14" cy="42" rx="12" ry="7" fill="#58a828" opacity="0.6" transform="rotate(-10 14 42)"/>
      <ellipse cx="34" cy="42" rx="12" ry="7" fill="#50a020" opacity="0.6" transform="rotate(10 34 42)"/>
      <circle cx="24" cy="30" r="14" fill="#80c850" opacity="0.85"/>
      <circle cx="24" cy="29" r="10" fill="#a0e068" opacity="0.9"/>
      <circle cx="24" cy="28" r="7" fill="#c0f080" opacity="0.9"/>
      <circle cx="24" cy="30" r="14" fill="none" stroke="#409820" strokeWidth="1.5"/>
      <path d="M24 17 Q21 24 20 33" stroke="#58a828" strokeWidth="1" opacity="0.5"/>
      <path d="M24 17 Q27 24 28 33" stroke="#58a828" strokeWidth="1" opacity="0.5"/>
    </svg>
  );
  if (id === "lettuce") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M2 33 Q0 20 10 14 Q18 9 24 12 Q30 9 38 14 Q48 20 46 33 Q42 46 24 47 Q6 46 2 33Z" fill="#88c848" opacity="0.85"/>
      <path d="M4 33 Q4 22 12 16 Q18 11 24 14 Q30 11 36 16 Q44 22 44 33 Q40 44 24 45 Q8 44 4 33Z" fill="#b0e068" opacity="0.9"/>
      <path d="M2 33 Q6 26 2 20 Q0 14 4 10" stroke="#68a828" strokeWidth="1.8" fill="none"/>
      <path d="M46 33 Q42 26 46 20 Q48 14 44 10" stroke="#68a828" strokeWidth="1.8" fill="none"/>
      <circle cx="24" cy="32" r="9" fill="#d8f898" opacity="0.9"/>
      <path d="M2 33 Q0 20 10 14 Q18 9 24 12 Q30 9 38 14 Q48 20 46 33 Q42 46 24 47 Q6 46 2 33Z" fill="none" stroke="#489018" strokeWidth="1.5"/>
    </svg>
  );
  if (id === "corn") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M16 36 Q6 22 8 10 Q10 4 15 6 Q13 18 16 32" fill="#68b020" opacity="0.8"/>
      <path d="M32 36 Q42 22 40 10 Q38 4 33 6 Q35 18 32 32" fill="#58a018" opacity="0.8"/>
      <rect x="12" y="8" width="13" height="26" rx="6.5" fill="#e8c010" opacity="0.9"/>
      <rect x="12" y="8" width="13" height="26" rx="6.5" fill="none" stroke="#b09008" strokeWidth="1.5"/>
      <circle cx="15" cy="13" r="1.5" fill="#c09008"/><circle cx="19" cy="13" r="1.5" fill="#c09008"/><circle cx="22" cy="13" r="1.5" fill="#c09008"/>
      <circle cx="15" cy="17" r="1.5" fill="#c09008"/><circle cx="19" cy="17" r="1.5" fill="#c09008"/><circle cx="22" cy="17" r="1.5" fill="#c09008"/>
      <circle cx="15" cy="21" r="1.5" fill="#c09008"/><circle cx="19" cy="21" r="1.5" fill="#c09008"/><circle cx="22" cy="21" r="1.5" fill="#c09008"/>
      <circle cx="15" cy="25" r="1.5" fill="#c09008"/><circle cx="19" cy="25" r="1.5" fill="#c09008"/><circle cx="22" cy="25" r="1.5" fill="#c09008"/>
      <rect x="27" y="8" width="12" height="26" rx="6" fill="#d8b808" opacity="0.9"/>
      <rect x="27" y="8" width="12" height="26" rx="6" fill="none" stroke="#b09008" strokeWidth="1.5"/>
      <circle cx="30" cy="13" r="1.4" fill="#b09008"/><circle cx="34" cy="13" r="1.4" fill="#b09008"/>
      <circle cx="30" cy="17" r="1.4" fill="#b09008"/><circle cx="34" cy="17" r="1.4" fill="#b09008"/>
      <circle cx="30" cy="21" r="1.4" fill="#b09008"/><circle cx="34" cy="21" r="1.4" fill="#b09008"/>
      <circle cx="30" cy="25" r="1.4" fill="#b09008"/><circle cx="34" cy="25" r="1.4" fill="#b09008"/>
    </svg>
  );
  if (id === "strawberry") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <ellipse cx="11" cy="15" rx="8" ry="4" fill="#4a9818" opacity="0.8" transform="rotate(-20 11 15)"/>
      <ellipse cx="24" cy="11" rx="7" ry="3.5" fill="#5aaa20" opacity="0.8"/>
      <ellipse cx="37" cy="15" rx="8" ry="4" fill="#4a9818" opacity="0.8" transform="rotate(20 37 15)"/>
      <path d="M12 20 Q10 28 13 37 Q17 45 24 46 Q31 45 35 37 Q38 28 36 20 Q32 13 24 13 Q16 13 12 20Z" fill="#c02020" opacity="0.9"/>
      <path d="M12 20 Q10 28 13 37 Q17 45 24 46 Q31 45 35 37 Q38 28 36 20 Q32 13 24 13 Q16 13 12 20Z" fill="none" stroke="#901010" strokeWidth="1.5"/>
      <ellipse cx="16" cy="24" rx="1.2" ry="1.8" fill="#f0d880"/>
      <ellipse cx="22" cy="20" rx="1.2" ry="1.8" fill="#f0d880"/>
      <ellipse cx="30" cy="21" rx="1.2" ry="1.8" fill="#f0d880"/>
      <ellipse cx="33" cy="28" rx="1.2" ry="1.8" fill="#f0d880"/>
      <ellipse cx="24" cy="34" rx="1.2" ry="1.8" fill="#f0d880"/>
      <ellipse cx="17" cy="32" rx="1.2" ry="1.8" fill="#f0d880"/>
      <ellipse cx="14" cy="26" rx="3" ry="4" fill="rgba(255,255,255,0.2)" transform="rotate(-15 14 26)"/>
    </svg>
  );
  if (id === "potato") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M14 18 Q10 10 13 4 Q15 10 17 16" fill="#5aaa20" opacity="0.8"/>
      <path d="M22 16 Q22 8 24 3 Q26 9 26 15" fill="#4a9818" opacity="0.8"/>
      <path d="M32 18 Q36 10 33 4 Q31 10 29 16" fill="#5aaa20" opacity="0.8"/>
      <ellipse cx="18" cy="36" rx="13" ry="9" fill="#b89830" opacity="0.9" transform="rotate(-10 18 36)"/>
      <ellipse cx="18" cy="36" rx="13" ry="9" fill="none" stroke="#887818" strokeWidth="1.5" transform="rotate(-10 18 36)"/>
      <circle cx="14" cy="31" r="1.5" fill="rgba(0,0,0,0.18)"/>
      <circle cx="22" cy="39" r="1.5" fill="rgba(0,0,0,0.18)"/>
      <ellipse cx="12" cy="31" rx="4" ry="3" fill="rgba(255,255,255,0.18)" transform="rotate(-15 12 31)"/>
      <ellipse cx="36" cy="36" rx="10" ry="7.5" fill="#a88828" opacity="0.9" transform="rotate(8 36 36)"/>
      <ellipse cx="36" cy="36" rx="10" ry="7.5" fill="none" stroke="#887818" strokeWidth="1.5" transform="rotate(8 36 36)"/>
    </svg>
  );
  if (id === "sweetpotato") return (
    <svg width={s} height={s} viewBox="0 0 48 48" fill="none">
      <path d="M14 14 Q12 8 16 4 Q18 8 17 13" fill="#5aaa20" opacity="0.8"/>
      <path d="M24 12 Q24 5 24 2 Q26 7 26 12" fill="#4a9818" opacity="0.8"/>
      <path d="M34 14 Q36 8 32 4 Q30 8 31 13" fill="#5aaa20" opacity="0.8"/>
      <path d="M6 19 Q16 16 24 15 Q32 15 42 19" stroke="#4a9818" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <ellipse cx="17" cy="36" rx="13" ry="8.5" fill="#a85830" opacity="0.9" transform="rotate(-8 17 36)"/>
      <ellipse cx="17" cy="36" rx="13" ry="8.5" fill="none" stroke="#784020" strokeWidth="1.5" transform="rotate(-8 17 36)"/>
      <path d="M6 34 Q13 31 19 34" stroke="#784020" strokeWidth="1" opacity="0.5"/>
      <ellipse cx="35" cy="36" rx="11" ry="7.5" fill="#985028" opacity="0.9" transform="rotate(6 35 36)"/>
      <ellipse cx="35" cy="36" rx="11" ry="7.5" fill="none" stroke="#784020" strokeWidth="1.5" transform="rotate(6 35 36)"/>
    </svg>
  );
  /* fallback: 絵文字 */
  return <span style={{ fontSize:s * 0.65, lineHeight:1 }}>{v.mark}</span>;
}

/* ══════════════════════════════════════
   帳簿スタンプ（朱印スタイル）
══════════════════════════════════════ */
function Hanko({ text, sub, color }) {
  const clr = color || C.stamp;
  return (
    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      width:52, height:52, borderRadius:"50%",
      border:"2.5px solid " + clr, color:clr,
      fontFamily:SERIF, lineHeight:1.1, textAlign:"center",
      padding:4, flexShrink:0,
      boxShadow:"inset 0 0 0 1px " + clr + "40",
    }}>
      <div style={{ fontSize:11, fontWeight:"bold", letterSpacing:1 }}>{text}</div>
      {sub && <div style={{ fontSize:8, marginTop:1, opacity:.8 }}>{sub}</div>}
    </div>
  );
}

/* ══════════════════════════════════════
   ヘルパー
══════════════════════════════════════ */
function makeGrid(rows, cols, fn) {
  const f = fn || function(){ return true; };
  return Array.from({length:rows}, function(_,r){
    return Array.from({length:cols}, function(_,c){ return f(r,c); });
  });
}
/* rec は文字列 or {vid,month,day} の両方に対応 */
function extractVid(rec) {
  if (!rec) return null;
  return typeof rec === "object" ? rec.vid : rec;
}
/* ridgeIdをキーとして連作チェック（新方式：ridges[farmId][ridgeId]） */
function ridgeBBox(r){var RW=RWIDTH;return r.orientation==="H"?{xa:r.gx-r.gl/2,xb:r.gx+r.gl/2,ya:r.gy-RW/2,yb:r.gy+RW/2}:{xa:r.gx-RW/2,xb:r.gx+RW/2,ya:r.gy-r.gl/2,yb:r.gy+r.gl/2};}
function ridgesOverlap(a,b){var A=ridgeBBox(a),B=ridgeBBox(b);return A.xa<B.xb&&A.xb>B.xa&&A.ya<B.yb&&A.yb>B.ya;}
function ridgeIntersect(a,b){var A=ridgeBBox(a),B=ridgeBBox(b);var xa=Math.max(A.xa,B.xa),xb=Math.min(A.xb,B.xb),ya=Math.max(A.ya,B.ya),yb=Math.min(A.yb,B.yb);return(xa<xb&&ya<yb)?{xa,xb,ya,yb}:null;}
function getSoilVid(fid,ridgeId,year,pls,soil,fRidges){
  var direct=extractVid(pls[fid]&&pls[fid][year]&&pls[fid][year][ridgeId]);
  if(direct) return direct;
  var ridge=fRidges&&fRidges[ridgeId];
  if(!ridge||!soil||!soil[fid]) return null;
  var rec=(soil[fid]||[]).find(function(s){return s.year===year&&ridgesOverlap(ridge,s);});
  return rec?rec.vid:null;
}
function checkRot(fid,ridgeId,year,pls,soil,fRidges){
  var id=getSoilVid(fid,ridgeId,year,pls,soil,fRidges);
  if(!id) return null;
  var fam=VM[id]&&VM[id].family; if(!fam) return null;
  var n=1;
  for(var y=1;y<=2;y++){var p=getSoilVid(fid,ridgeId,year-y,pls,soil,fRidges);if(p&&VM[p]&&VM[p].family===fam)n++;else break;}
  return n>=3?"danger":n>=2?"caution":null;
}
function checkPrev(fid,ridgeId,vid,year,pls,soil,fRidges){
  if(!vid) return null;
  var fam=VM[vid]&&VM[vid].family; if(!fam) return null;
  var n=1;
  for(var y=1;y<=2;y++){var p=getSoilVid(fid,ridgeId,year-y,pls,soil,fRidges);if(p&&VM[p]&&VM[p].family===fam)n++;else break;}
  return n>=3?"danger":n>=2?"caution":null;
}
function daysInMonth(y, m) { return new Date(y, m, 0).getDate(); }

/* ══════════════════════════════════════
   共通UI
══════════════════════════════════════ */
function RuledLine({ mb }) {
  return <div style={{ height:1, background:C.inkLine, marginBottom:mb||16, opacity:.6 }}/>;
}
function SectionTitle({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:14 }}>
      <span style={{ fontSize:11, color:C.inkFaint, letterSpacing:3, fontFamily:HAND }}>◇</span>
      <span style={{ fontSize:12, color:C.ink, letterSpacing:2, fontFamily:HAND }}>{children}</span>
      <div style={{ flex:1, height:1, background:C.inkLine, opacity:.5 }}/>
    </div>
  );
}
function InkBtn({ children, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      background: primary ? C.ink : "transparent",
      color: primary ? C.paper : C.ink,
      border: "1.5px solid " + C.ink,
      borderRadius:2, padding:"12px 20px",
      fontSize:14, letterSpacing:2, cursor:"pointer",
      fontFamily:SERIF, width:"100%",
      boxShadow: primary ? "2px 2px 0 " + C.inkFaint : "none",
    }}>{children}</button>
  );
}
function OutlineBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background:"transparent", color:C.inkFaint,
      border:"1px solid " + C.inkLine, borderRadius:2,
      padding:"11px 20px", fontSize:13, letterSpacing:1,
      cursor:"pointer", fontFamily:SERIF, width:"100%",
    }}>{children}</button>
  );
}
function LedgerRow({ label, value }) {
  return (
    <div style={{ display:"flex", gap:16, padding:"9px 0", borderBottom:"1px solid " + C.inkLine }}>
      <span style={{ fontSize:11, color:C.inkFaint, width:72, flexShrink:0, fontFamily:HAND, letterSpacing:1 }}>{label}</span>
      <span style={{ fontSize:13, color:C.ink, fontFamily:SERIF }}>{value}</span>
    </div>
  );
}
function NumControl({ label, value, min, max, onChange }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:11, color:C.inkFaint, letterSpacing:2, fontFamily:HAND }}>{label}</span>
        <span style={{ fontSize:14, color:C.ink, fontFamily:SERIF, minWidth:24, textAlign:"right" }}>{value}</span>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <button onClick={function(){ if(value>min) onChange(value-1); }}
          style={{ width:34, height:34, border:"1px solid " + C.inkBorder, borderRadius:2, background:C.paper2,
            fontSize:16, color:value>min?C.ink:C.inkLine, cursor:value>min?"pointer":"default",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:SERIF }}>－</button>
        <div style={{ flex:1, height:6, background:C.paper2, border:"1px solid " + C.inkLine, borderRadius:1, position:"relative" }}>
          <div style={{ position:"absolute", left:0, top:0, bottom:0, borderRadius:1,
            width:((value-min)/(max-min)*100)+"%", background:C.inkFaint }}/>
        </div>
        <button onClick={function(){ if(value<max) onChange(value+1); }}
          style={{ width:34, height:34, border:"1px solid " + C.inkBorder, borderRadius:2, background:C.paper2,
            fontSize:16, color:value<max?C.ink:C.inkLine, cursor:value<max?"pointer":"default",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:SERIF }}>＋</button>
      </div>
    </div>
  );
}

/* ミニプレビュー */
function GridPreview({ rows, cols, grid, size, gap }) {
  const sz = size || 20;
  const gp = gap  || 2;
  return (
    <div style={{ display:"inline-flex", flexDirection:"column", gap:gp,
      border:"1px solid " + C.inkBorder, padding:gp, background:C.paper2 }}>
      {Array.from({length:rows}, function(_,r){
        return (
          <div key={r} style={{ display:"flex", gap:gp }}>
            {Array.from({length:cols}, function(_,c){
              const a = grid[r] && grid[r][c];
              return (
                <div key={c} style={{ width:sz, height:sz, flexShrink:0,
                  background: a ? C.inkFaint : "transparent",
                  border:"1px solid " + C.inkLine, opacity: a ? 1 : .5 }}/>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════
   ルート
══════════════════════════════════════ */
function HatakeApp() {
  /* ── localStorage からデータを読み込む（初回のみ） ── */
  const [screen, setScreen] = useState(function(){
    try {
      const saved = localStorage.getItem("hatakebo_data");
      if (saved) {
        const d = JSON.parse(saved);
        if (d.farms && d.farms.length > 0) return "map";
      }
    } catch(e) {}
    return "setup";
  });
  const [farms, setFarms] = useState(function(){
    try {
      const saved = localStorage.getItem("hatakebo_data");
      if (saved) { const d = JSON.parse(saved); return d.farms || []; }
    } catch(e) {}
    return [];
  });
  const [plantings, setPlantings] = useState(function(){
    try {
      const saved = localStorage.getItem("hatakebo_data");
      if (saved) { const d = JSON.parse(saved); return d.plantings || {}; }
    } catch(e) {}
    return {};
  });
  const [ridges, setRidges] = useState(function(){
    try {
      const saved = localStorage.getItem("hatakebo_data");
      if (saved) {
        const d = JSON.parse(saved);
        const raw = d.ridges || {};
        /* マイグレーション: 旧形式(ridges[farmId][year][ridgeId])を検出・破棄 */
        const migrated = {};
        Object.keys(raw).forEach(function(fid) {
          const farmRidges = raw[fid] || {};
          const keys = Object.keys(farmRidges);
          const isOld = keys.length > 0 && !keys[0].startsWith("ridge_");
          migrated[fid] = isOld ? {} : farmRidges;
        });
        return migrated;
      }
    } catch(e) {}
    return {};
  });

  const [snapshots, setSnapshots] = useState(function(){
    try {
      const saved = localStorage.getItem("hatakebo_data");
      if (saved) { const d = JSON.parse(saved); return d.snapshots || {}; }
    } catch(e) {}
    return {};
  });
  const [soil, setSoil] = useState(function(){
    try {
      const saved = localStorage.getItem("hatakebo_data");
      if (saved) { const d = JSON.parse(saved); return d.soil || {}; }
    } catch(e) {}
    return {};
  });

  /* ── データが変わるたびに自動保存 ── */
  useEffect(function(){
    try {
      localStorage.setItem("hatakebo_data", JSON.stringify({ farms:farms, plantings:plantings, ridges:ridges, snapshots:snapshots, soil:soil }));
    } catch(e) {}
  }, [farms, plantings, ridges, snapshots, soil]);

  /* ── バックアップ：JSONファイルとしてダウンロード ── */
  function exportData() {
    const data = JSON.stringify({ farms:farms, plantings:plantings, ridges:ridges, snapshots:snapshots }, null, 2);
    const blob = new Blob([data], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = "hatakebo_backup_" + new Date().toISOString().slice(0,10) + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── 復元：JSONファイルを読み込む ── */
  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.farms) { alert("このファイルはハタケボのバックアップではありません"); return; }
        setFarms(d.farms || []);
        setPlantings(d.plantings || {});
        setRidges(d.ridges || {});
        setSnapshots(d.snapshots || {});
        if (d.farms && d.farms.length > 0) setScreen("map");
        alert("データを読み込みました！");
      } catch(err) {
        alert("ファイルの読み込みに失敗しました");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function onComplete(farm) {
    setFarms(function(prev){
      const ex = prev.find(function(f){ return f.id===farm.id; });
      if (ex) return prev.map(function(f){ return f.id===farm.id?farm:f; });
      return [...prev, farm];
    });
    setScreen("map");
  }

  const [showFaq, setShowFaq] = useState(false);

  if (screen === "setup") {
    return <FarmSetup farms={farms} onComplete={onComplete} onSkip={farms.length>0?function(){setScreen("map");}:null}/>;
  }
  return (
    <React.Fragment>
      <FarmMap farms={farms} plantings={plantings} setPlantings={setPlantings} ridges={ridges} setRidges={setRidges}
        snapshots={snapshots} setSnapshots={setSnapshots} soil={soil} setSoil={setSoil}
        onRenameFarm={function(fid, name){ setFarms(function(prev){ return prev.map(function(f){ return f.id===fid ? Object.assign({},f,{name:name}) : f; }); }); }}
        onAddFarm={function(){setScreen("setup");}}
        onDeleteFarm={function(fid){
          setFarms(function(prev){ return prev.filter(function(f){ return f.id!==fid; }); });
          setPlantings(function(prev){ const n=Object.assign({},prev); delete n[fid]; return n; });
          setRidges(function(prev){ const n=Object.assign({},prev); delete n[fid]; return n; });
          setSnapshots(function(prev){ const n=Object.assign({},prev); delete n[fid]; return n; });
        }}
        onExport={exportData} onImport={importData}
        onShowFaq={function(){setShowFaq(true);}}/>
      {showFaq && <FAQScreen onClose={function(){setShowFaq(false);}}/>}
    </React.Fragment>
  );
}

/* HatakeApp の showFaq state をグローバル化せずに済むよう
   一時的なトップレベルラッパーを設ける */
function HatakeRoot() {
  const [showFaq, setShowFaq] = useState(false);
}

/* ══════════════════════════════════════
   畑登録（セットアップ）
══════════════════════════════════════ */
const SETUP_STEPS = ["welcome","size","shape","landmarks","name","done"];

const LM_TYPES = [
  { id:"tree",     icon:"🌳", label:"木・林"       },
  { id:"building", icon:"🏠", label:"建物・塀"      },
  { id:"road",     icon:"🛤️", label:"道"           },
  { id:"water",    icon:"💧", label:"水路・池"      },
  { id:"fence",    icon:"🪵", label:"垣根・柵"      },
  { id:"other",    icon:"📌", label:"その他"        },
];
const DIRS8 = [
  { id:"N",  label:"北" }, { id:"NE", label:"北東" },
  { id:"E",  label:"東" }, { id:"SE", label:"南東" },
  { id:"S",  label:"南" }, { id:"SW", label:"南西" },
  { id:"W",  label:"西" }, { id:"NW", label:"北西" },
];
const PRESETS = [
  { label:"よこ長",  rows:3, cols:6 },
  { label:"たて長",  rows:6, cols:3 },
  { label:"正方形",  rows:4, cols:4 },
  { label:"L字型",   rows:4, cols:4, cells:function(r,c){ return !(r<2&&c>=2); } },
];

/* ══════════════════════════════════════
   目印エディタ
══════════════════════════════════════ */
function LandmarkEditor({ rows, cols, grid, landmarks, setLandmarks, selType, lmTypes, editLM, setEditLM }) {
  const BS = 28;
  const CS = 28;
  const GAP = 3;
  function getType(id) { return lmTypes.find(function(t){ return t.id===id; }); }
  function tapKey(key) {
    if (landmarks[key]) {
      setEditLM({ key:key, memo:landmarks[key].memo||"" });
    } else {
      var t = getType(selType);
      setLandmarks(function(prev){ return Object.assign({},prev,{[key]:{ id:t.id, icon:t.icon, label:t.label, memo:"" }}); });
    }
  }
  function BorderBtn({ lmKey }) {
    var lm = landmarks[lmKey];
    return (
      <div onClick={function(){ tapKey(lmKey); }}
        style={{ width:BS, height:BS, flexShrink:0, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          border:"1px solid " + (lm?C.inkBorder:C.inkLine),
          background:lm?C.paper2:"transparent",
          fontSize:lm?14:10, borderRadius:2 }}>
        {lm ? lm.icon : <span style={{ fontSize:8, color:C.inkLine }}>＋</span>}
      </div>
    );
  }
  function InnerCell({ r, c }) {
    var active = grid[r] && grid[r][c];
    var key = "inner-" + r + "-" + c;
    var lm = landmarks[key];
    return (
      <div onClick={active?null:function(){ tapKey(key); }}
        style={{ width:CS, height:CS, flexShrink:0,
          border:"1px solid " + (active?C.inkFaint:C.inkLine),
          background:active?C.inkFaint:lm?C.paper2:"transparent",
          cursor:active?"default":"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:12, opacity:active?0.6:1, borderRadius:1 }}>
        {!active && (lm ? lm.icon : <span style={{ color:C.inkLine, fontSize:8 }}>＋</span>)}
      </div>
    );
  }
  return (
    <div style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", gap:GAP }}>
      <div style={{ display:"flex", gap:GAP, marginLeft:BS+GAP }}>
        {Array.from({length:cols}, function(_,c){ return <BorderBtn key={c} lmKey={"top-"+c}/>; })}
      </div>
      <div style={{ display:"flex", gap:GAP }}>
        <div style={{ display:"flex", flexDirection:"column", gap:GAP }}>
          {Array.from({length:rows}, function(_,r){ return <BorderBtn key={r} lmKey={"lft-"+r}/>; })}
        </div>
        <div style={{ border:"1.5px solid " + C.ink, display:"inline-flex", flexDirection:"column", gap:1, background:C.inkLine+"30" }}>
          {Array.from({length:rows}, function(_,r){
            return (
              <div key={r} style={{ display:"flex", gap:1 }}>
                {Array.from({length:cols}, function(_,c){ return <InnerCell key={c} r={r} c={c}/>; })}
              </div>
            );
          })}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:GAP }}>
          {Array.from({length:rows}, function(_,r){ return <BorderBtn key={r} lmKey={"rgt-"+r}/>; })}
        </div>
      </div>
      <div style={{ display:"flex", gap:GAP, marginLeft:BS+GAP }}>
        {Array.from({length:cols}, function(_,c){ return <BorderBtn key={c} lmKey={"bot-"+c}/>; })}
      </div>
      {Object.keys(landmarks).length > 0 && (
        <div style={{ marginTop:10, width:"100%" }}>
          <div style={{ fontSize:9, color:C.inkFaint, letterSpacing:2, marginBottom:6, fontFamily:HAND }}>設置済み目印</div>
          {Object.entries(landmarks).map(function(e){
            var lm = e[1];
            return (
              <div key={e[0]} onClick={function(){ setEditLM({key:e[0], memo:lm.memo||""}); }}
                style={{ display:"flex", alignItems:"center", gap:10, padding:"5px 0", borderBottom:"1px solid " + C.inkLine, cursor:"pointer" }}>
                <span style={{ fontSize:14 }}>{lm.icon}</span>
                <span style={{ fontSize:11, color:C.inkFaint, fontFamily:HAND }}>{lm.label}</span>
                {lm.memo && <span style={{ fontSize:11, color:C.ink }}>— {lm.memo}</span>}
                <span style={{ fontSize:9, color:C.inkLine, marginLeft:"auto", fontFamily:HAND }}>タップで編集</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FarmSetup({ farms, onComplete, onSkip }) {
  const [step, setStep]   = useState(0);
  const [rows, setRows]   = useState(4);
  const [cols, setCols]   = useState(5);
  const [grid, setGrid]   = useState(function(){ return makeGrid(4,5); });
  const [name, setName]   = useState("");
  const [sqm, setSqm]     = useState(1);
  const [northDir,  setNorthDir]  = useState("N");
  const [landmarks, setLandmarks] = useState({});
  const [selLMType, setSelLMType] = useState("tree");
  const [editLM,    setEditLM]    = useState(null); /* { key, label } */
  const sn = SETUP_STEPS[step];
  const ac = grid.flat().filter(Boolean).length;
  const cs = Math.min(40, Math.floor(240/cols));

  function tg(r, c) {
    setGrid(function(prev){
      const n = prev.map(function(row){ return [...row]; });
      n[r][c] = !n[r][c];
      return n;
    });
  }
  function applyPreset(p) {
    const fn = p.cells || function(){ return true; };
    setRows(p.rows); setCols(p.cols);
    setGrid(makeGrid(p.rows, p.cols, fn));
    setStep(2);
  }
  function done() {
    onComplete({ id:"farm_"+Date.now(), name:name||("畑"+(farms.length+1)), rows:rows, cols:cols, grid:grid, sqmPerCell:sqm, northDir:northDir, landmarks:landmarks });
  }

  /* 帳簿風の外枠スタイル */
  const pageStyle = {
    minHeight:"100vh", background:C.paper,
    fontFamily:SERIF, color:C.ink,
    backgroundImage:"repeating-linear-gradient(transparent, transparent 27px, " + C.inkLine + "40 27px, " + C.inkLine + "40 28px)",
  };

  return (
    <div style={pageStyle}>
      {/* 表紙バー */}
      <div style={{ borderBottom:"2px solid " + C.ink, background:C.paper2, padding:"0 20px", position:"sticky", top:0, zIndex:20 }}>
        <div style={{ display:"flex", alignItems:"center", height:54, gap:12 }}>
          {step > 0 && <button onClick={function(){ setStep(function(s){ return s-1; }); }}
            style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:C.inkFaint, fontFamily:SERIF, padding:"0 4px" }}>‹</button>}
          {/* ロゴ */}
          <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
            <span style={{ fontSize:20, fontWeight:"bold", letterSpacing:4, color:C.ink }}>ハタケボ</span>
            <span style={{ fontSize:10, color:C.inkFaint, letterSpacing:2 }}>植え付け記録</span>
          </div>
          <div style={{ flex:1 }}/>
          {onSkip && step === 0 && (
            <button onClick={onSkip} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.inkFaint, fontFamily:SERIF }}>とじる</button>
          )}
          {step > 0 && step < SETUP_STEPS.length-1 && (
            <span style={{ fontSize:11, color:C.inkFaint, fontFamily:SANS }}>
              {step} / {SETUP_STEPS.length-2}
            </span>
          )}
        </div>
        {/* 進捗罫線 */}
        {step > 0 && step < SETUP_STEPS.length-1 && (
          <div style={{ height:2, background:C.inkLine, position:"relative" }}>
            <div style={{ position:"absolute", left:0, top:0, bottom:0,
              width:((step/(SETUP_STEPS.length-2))*100)+"%",
              background:C.ink, transition:"width .3s" }}/>
          </div>
        )}
      </div>

      <div style={{ maxWidth:520, margin:"0 auto", padding:"36px 24px 80px" }}>

        {/* ━━ 表紙 ━━ */}
        {sn === "welcome" && (
          <div>
            {/* 帳簿表紙風 */}
            <div style={{ textAlign:"center", padding:"32px 0 40px" }}>
              <div style={{ display:"inline-block", border:"3px solid " + C.ink, padding:"28px 40px",
                marginBottom:32, position:"relative",
                boxShadow:"4px 4px 0 " + C.inkFaint }}>
                <div style={{ position:"absolute", top:4, left:4, right:4, bottom:4, border:"1px solid " + C.inkFaint, pointerEvents:"none" }}/>
                <div style={{ fontSize:32, fontWeight:"bold", letterSpacing:8, marginBottom:8 }}>ハタケボ</div>
                <div style={{ fontSize:12, letterSpacing:6, color:C.inkFaint }}>植え付け記録</div>
                <div style={{marginTop:16,display:"flex",justifyContent:"center",alignItems:"flex-end",gap:12}}><img src="data:image/png;base64,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" alt="ニンジン" style={{width:32,height:"auto"}}/><img src="data:image/png;base64,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" alt="トマト" style={{width:32,height:"auto"}}/><img src="data:image/png;base64,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" alt="ナス" style={{width:32,height:"auto"}}/></div>
              </div>
              <p style={{ fontSize:13, color:C.inkFaint, lineHeight:2.4, letterSpacing:1 }}>
                畑のレイアウトを年ごとに記録し<br/>
                連作障害を防ぐための帳簿です
              </p>
            </div>
            <RuledLine/>
            {[["▷","畑の区画マップを作成"],["▷","年ごとの作付け記録"],["▷","連作障害の自動チェック"],["▷","畝の管理"]].map(function(item){
              return (
                <div key={item[1]} style={{ display:"flex", gap:14, padding:"11px 0", borderBottom:"1px solid " + C.inkLine + "80" }}>
                  <span style={{ color:C.inkFaint, fontSize:12, flexShrink:0, fontFamily:HAND }}>{item[0]}</span>
                  <span style={{ fontSize:13, letterSpacing:1 }}>{item[1]}</span>
                </div>
              );
            })}
            <div style={{ marginTop:36 }}><InkBtn onClick={function(){ setStep(1); }} primary={true}>新しい畑を登録する</InkBtn></div>
          </div>
        )}

        {/* ━━ おおきさ ━━ */}
        {sn === "size" && (
          <div>
            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:11, color:C.inkFaint, letterSpacing:3, marginBottom:4, fontFamily:HAND }}>第一記 —</div>
              <h2 style={{ fontSize:22, fontWeight:"normal", letterSpacing:4, marginBottom:8 }}>区画の大きさ</h2>
            </div>
            <SectionTitle>プリセット</SectionTitle>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:24 }}>
              {PRESETS.map(function(p){
                return (
                  <button key={p.label} onClick={function(){ applyPreset(p); }}
                    style={{ padding:"14px", border:"1px solid " + C.inkBorder, borderRadius:2,
                      background:C.paper, cursor:"pointer", fontFamily:SERIF, textAlign:"left",
                      boxShadow:"2px 2px 0 " + C.inkLine }}>
                    <span style={{ fontSize:14, letterSpacing:1 }}>{p.label}</span>
                    <span style={{ fontSize:11, color:C.inkFaint, marginLeft:8 }}>{p.rows}×{p.cols}</span>
                  </button>
                );
              })}
            </div>
            <SectionTitle>手動で入力</SectionTitle>
            <NumControl label="よこ（列）" value={cols} min={2} max={8} onChange={function(v){ setCols(v); setGrid(makeGrid(rows,v)); }}/>
            <NumControl label="たて（行）" value={rows} min={2} max={8} onChange={function(v){ setRows(v); setGrid(makeGrid(v,cols)); }}/>
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:24 }}>
              <span style={{ fontSize:11, color:C.inkFaint, letterSpacing:2, fontFamily:HAND }}>1区画</span>
              <select value={sqm} onChange={function(e){ setSqm(Number(e.target.value)); }}
                style={{ padding:"8px 12px", fontSize:13, border:"1px solid " + C.inkBorder, borderRadius:2,
                  background:C.paper, fontFamily:SERIF, outline:"none", color:C.ink }}>
                {[0.5,1,1.5,2,3,5].map(function(v){ return <option key={v} value={v}>{v} ㎡</option>; })}
              </select>
            </div>
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <GridPreview rows={rows} cols={cols} grid={grid} size={Math.min(28,Math.floor(220/cols))} gap={2}/>
            </div>
            <div style={{ textAlign:"center", fontSize:12, color:C.inkFaint, marginBottom:24, letterSpacing:1 }}>
              {cols}列 × {rows}行　= {ac} 区画　≈ {(ac*sqm).toFixed(1)} ㎡
            </div>
            <InkBtn onClick={function(){ setStep(2); }} primary={true}>次へ</InkBtn>
          </div>
        )}

        {/* ━━ かたち ━━ */}
        {sn === "shape" && (
          <div>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, color:C.inkFaint, letterSpacing:3, marginBottom:4, fontFamily:HAND }}>第二記 —</div>
              <h2 style={{ fontSize:22, fontWeight:"normal", letterSpacing:4, marginBottom:8 }}>区画の形</h2>
              <p style={{ fontSize:12, color:C.inkFaint, lineHeight:1.8 }}>使わない区画をタップして除外できます</p>
            </div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
              <div style={{ display:"inline-flex", flexDirection:"column", gap:3, border:"2px solid " + C.ink, padding:6, background:C.paper2, boxShadow:"4px 4px 0 " + C.inkLine }}>
                {Array.from({length:rows}, function(_,r){
                  return (
                    <div key={r} style={{ display:"flex", gap:3 }}>
                      {Array.from({length:cols}, function(_,c){
                        const a = grid[r] && grid[r][c];
                        return (
                          <div key={c} onClick={function(){ tg(r,c); }}
                            style={{ width:cs, height:cs, flexShrink:0, cursor:"pointer",
                              background: a ? C.inkFaint : "transparent",
                              border:"1px solid " + (a?C.ink:C.inkLine),
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                            {!a && <span style={{ fontSize:cs*.25, color:C.inkLine }}>✕</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ textAlign:"center", fontSize:12, color:C.inkFaint, marginBottom:24, letterSpacing:1 }}>{ac} 区画 有効</div>
            <OutlineBtn onClick={function(){ setGrid(makeGrid(rows,cols)); }}>すべて有効に戻す</OutlineBtn>
            <div style={{ marginTop:10 }}><InkBtn onClick={function(){ setStep(3); }} primary={true}>次へ</InkBtn></div>
          </div>
        )}

        {/* ━━ 名前 ━━ */}
        {/* ━━ 目印 ━━ */}
        {sn === "landmarks" && (
          <div>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, color:C.inkFaint, letterSpacing:3, marginBottom:4, fontFamily:HAND }}>第二記（補） —</div>
              <h2 style={{ fontSize:22, fontWeight:"normal", letterSpacing:4, marginBottom:8 }}>周囲の目印</h2>
              <p style={{ fontSize:12, color:C.inkFaint, lineHeight:1.9 }}>方角と周りの目印を記録します（省略可）</p>
            </div>

            {/* 方角 */}
            <SectionTitle>北の方角</SectionTitle>
            <div style={{ display:"flex", gap:20, alignItems:"flex-start", marginBottom:28 }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:4, width:154, flexShrink:0 }}>
                {[
                  {id:"NW",label:"北西"},{id:"N",label:"北"},{id:"NE",label:"北東"},
                  {id:"W", label:"西"}, {id:null,label:null},{id:"E",label:"東"},
                  {id:"SW",label:"南西"},{id:"S",label:"南"},{id:"SE",label:"南東"},
                ].map(function(d, i) {
                  if (!d.id) return (
                    <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:18 }}>🌾</span>
                    </div>
                  );
                  const sel = northDir === d.id;
                  return (
                    <button key={d.id} onClick={function(){ setNorthDir(d.id); }}
                      style={{ padding:"8px 0", border:"1px solid " + (sel?C.ink:C.inkLine),
                        background:sel?C.ink:"transparent", color:sel?C.paper:C.inkFaint,
                        fontSize:10, cursor:"pointer", fontFamily:HAND, letterSpacing:1 }}>
                      {d.label}
                    </button>
                  );
                })}
              </div>
              {/* コンパスプレビュー */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                {(function(){
                  const di = DIRS8.findIndex(function(d){ return d.id===northDir; });
                  const ge = function(offset){ return DIRS8[(di+offset+8)%8].label; };
                  const ms = { fontSize:9, color:C.indigo, background:C.indigoPale, border:"1px solid " + C.inkBorder, padding:"2px 8px", letterSpacing:1, fontFamily:HAND, whiteSpace:"nowrap" };
                  return (
                    <Fragment>
                      <div style={ms}>↑ {ge(0)}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                        <div style={Object.assign({},ms,{writingMode:"vertical-rl"})}>← {ge(6)}</div>
                        <GridPreview rows={rows} cols={cols} grid={grid} size={Math.min(16,Math.floor(72/cols))} gap={2}/>
                        <div style={Object.assign({},ms,{writingMode:"vertical-rl"})}>→ {ge(2)}</div>
                      </div>
                      <div style={ms}>↓ {ge(4)}</div>
                    </Fragment>
                  );
                })()}
              </div>
            </div>

            {/* 目印タイプ選択 */}
            <SectionTitle>目印の種類</SectionTitle>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap", marginBottom:16 }}>
              {LM_TYPES.map(function(t){
                const sel = selLMType === t.id;
                return (
                  <button key={t.id} onClick={function(){ setSelLMType(t.id); }}
                    style={{ padding:"6px 11px", border:"1px solid " + (sel?C.ink:C.inkLine),
                      background:sel?C.ink:"transparent", color:sel?C.paper:C.inkFaint,
                      fontSize:11, cursor:"pointer", fontFamily:SERIF, display:"flex", alignItems:"center", gap:5 }}>
                    <span>{t.icon}</span><span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 目印マップ */}
            <SectionTitle>配置（周囲と内部）</SectionTitle>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
              <LandmarkEditor
                rows={rows} cols={cols} grid={grid}
                landmarks={landmarks} setLandmarks={setLandmarks}
                selType={selLMType} lmTypes={LM_TYPES}
                editLM={editLM} setEditLM={setEditLM}/>
            </div>
            <p style={{ fontSize:11, color:C.inkFaint, letterSpacing:.5, fontFamily:HAND, marginBottom:16, lineHeight:1.8 }}>
              枠外の升 → 周囲の目印　／　枠内の空き升 → 畑内の目印
            </p>

            {Object.keys(landmarks).length > 0 && (
              <OutlineBtn onClick={function(){ setLandmarks({}); }}>目印をすべて消す</OutlineBtn>
            )}

            {/* 目印ラベル編集モーダル */}
            {editLM && (function(){
              const lm = landmarks[editLM.key];
              if (!lm) return null;
              return (
                <div style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(28,20,8,0.5)", display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
                  onClick={function(){ setEditLM(null); }}>
                  <div onClick={function(e){ e.stopPropagation(); }}
                    style={{ background:C.paper, border:"2px solid " + C.ink, padding:"28px 24px", width:"100%", maxWidth:340, boxShadow:"4px 4px 0 " + C.inkFaint }}>
                    <div style={{ textAlign:"center", marginBottom:20 }}>
                      <div style={{ fontSize:36, marginBottom:6 }}>{lm.icon}</div>
                      <div style={{ fontSize:12, color:C.inkFaint, fontFamily:HAND }}>{lm.label}</div>
                    </div>
                    <div style={{ fontSize:10, color:C.inkFaint, letterSpacing:2, marginBottom:6, fontFamily:HAND }}>メモ（任意）</div>
                    <input autoFocus value={editLM.memo||""} onChange={function(e){ setEditLM(function(p){ return Object.assign({},p,{memo:e.target.value.slice(0,20)}); }); }}
                      placeholder="例：大きなケヤキ"
                      style={{ width:"100%", padding:"10px 0 8px", fontSize:15, border:"none", borderBottom:"1.5px solid " + C.ink,
                        outline:"none", fontFamily:SERIF, background:"transparent", color:C.ink, boxSizing:"border-box", marginBottom:20 }}/>
                    <div style={{ display:"flex", gap:8 }}>
                      <button onClick={function(){ setLandmarks(function(p){ const n=Object.assign({},p); delete n[editLM.key]; return n; }); setEditLM(null); }}
                        style={{ flex:1, padding:"10px", border:"1px solid " + C.inkBorder, background:"transparent", color:C.red, fontSize:12, cursor:"pointer", fontFamily:SERIF }}>削除</button>
                      <button onClick={function(){
                        setLandmarks(function(p){ return Object.assign({},p,{[editLM.key]:Object.assign({},p[editLM.key],{memo:editLM.memo||""})}); });
                        setEditLM(null);
                      }} style={{ flex:2, padding:"10px", border:"2px solid " + C.ink, background:C.ink, color:C.paper, fontSize:12, cursor:"pointer", fontFamily:SERIF }}>保存</button>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div style={{ marginTop:16 }}><InkBtn onClick={function(){ setStep(4); }} primary={true}>次へ</InkBtn></div>
          </div>
        )}

        {sn === "name" && (
          <div>
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:11, color:C.inkFaint, letterSpacing:3, marginBottom:4, fontFamily:HAND }}>第三記 —</div>
              <h2 style={{ fontSize:22, fontWeight:"normal", letterSpacing:4, marginBottom:8 }}>畑の名称</h2>
            </div>

            {/* 畑の名称 */}
            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:C.inkFaint, letterSpacing:3, marginBottom:6, fontFamily:HAND }}>畑の名称</div>
              <input value={name} onChange={function(e){ setName(e.target.value.slice(0,15)); }} placeholder="例：南の畑"
                style={{ width:"100%", padding:"14px 0 10px", fontSize:18, borderRadius:0, outline:"none",
                  fontFamily:SERIF, boxSizing:"border-box", letterSpacing:2, color:C.ink,
                  background:"transparent", border:"none", borderBottom:"2px solid " + C.ink }}/>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:10 }}>
                {["南の畑","北の畑","家の裏","第一圃場","ばあちゃんの畑"].map(function(n){
                  return (
                    <button key={n} onClick={function(){ setName(n); }}
                      style={{ padding:"5px 12px", border:"1px solid " + (name===n?C.ink:C.inkLine),
                        background:name===n?C.ink:"transparent", color:name===n?C.paper:C.inkFaint,
                        fontSize:12, cursor:"pointer", fontFamily:SERIF, letterSpacing:1 }}>{n}</button>
                  );
                })}
              </div>
            </div>

            <RuledLine mb={16}/>
            <LedgerRow label="名称" value={name||"（未入力）"}/>
            <LedgerRow label="区画数" value={cols+"列×"+rows+"行（"+ac+"区画　≈ "+(ac*sqm).toFixed(1)+"㎡）"}/>
            <LedgerRow label="北の方角" value={DIRS8.find(function(d){return d.id===northDir;})?.label || northDir}/>
            {Object.keys(landmarks).length > 0 && <LedgerRow label="目印" value={Object.keys(landmarks).length+"件"}/>}
            <div style={{ marginTop:24 }}><InkBtn onClick={function(){ setStep(5); }} primary={true}>帳簿に登録する</InkBtn></div>
          </div>
        )}

        {/* ━━ 完了 ━━ */}
        {sn === "done" && (
          <div style={{ textAlign:"center" }}>
            <div style={{ padding:"36px 0 28px" }}>
              <div style={{ display:"inline-block", marginBottom:24 }}>
                <Hanko text="登録" sub="済" color={C.indigo}/>
              </div>
              <h2 style={{ fontSize:20, fontWeight:"normal", letterSpacing:4, marginBottom:10 }}>
                {name||"畑"} を登録しました
              </h2>
              <p style={{ fontSize:12, color:C.inkFaint, letterSpacing:1 }}>{cols}列×{rows}行　{ac}区画</p>
              {Object.keys(landmarks).length > 0 && <p style={{ fontSize:12, color:C.inkFaint, marginTop:4, letterSpacing:1 }}>目印 {Object.keys(landmarks).length}件　北：{DIRS8.find(function(d){return d.id===northDir;})?.label}</p>}
            </div>
            <RuledLine mb={24}/>
            <OutlineBtn onClick={function(){ setStep(1); setRows(4); setCols(5); setGrid(makeGrid(4,5)); setName(""); setLandmarks({}); setNorthDir("N"); }}>
              ＋ もう一つ登録する
            </OutlineBtn>
            <div style={{ marginTop:10 }}><InkBtn onClick={done} primary={true}>ハタケボをひらく</InkBtn></div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SVGフィールド（グリッドなし）
══════════════════════════════════════ */
var CS = 72; /* 1グリッド単位のピクセル */
var RWIDTH = 0.46; /* 畝の幅（グリッド単位） */

function getRect(ridge) {
  if (ridge.orientation === "H") {
    return { x:(ridge.gx-ridge.gl/2)*CS, y:(ridge.gy-RWIDTH/2)*CS, w:ridge.gl*CS, h:RWIDTH*CS };
  }
  return { x:(ridge.gx-RWIDTH/2)*CS, y:(ridge.gy-ridge.gl/2)*CS, w:RWIDTH*CS, h:ridge.gl*CS };
}

function FarmField({ farm, farmRidges, farmPlant, s1, hov, onLongPressStart, onTap, onMove, onRidgeTap, selRid, onZoomChange, zoom, soil, fid, year, onPressChange }) {
  var W = farm.cols * CS;
  var H = farm.rows * CS;
  var svgRef = useRef(null);
  var lpTimer = useRef(null);
  var lpActive = useRef(false);
  var lpStart = useRef(null);
  var [isPressing, setIsPressing] = useState(false);
  function setPress(v){ setIsPressing(v); if(onPressChange) onPressChange(v); }
  var lm = farm.landmarks || {};
  var hasLm = Object.keys(lm).length > 0;

  /* 目印マージン（目印がある辺だけ余白） */
  var PAD = 52;
  var padT = 0, padB = 0, padL = 0, padR = 0;
  if (hasLm) {
    for (var c2=0; c2<farm.cols; c2++) { if(lm["top-"+c2]){padT=PAD;break;} }
    for (var c2=0; c2<farm.cols; c2++) { if(lm["bot-"+c2]){padB=PAD;break;} }
    for (var r2=0; r2<farm.rows; r2++) { if(lm["lft-"+r2]){padL=PAD;break;} }
    for (var r2=0; r2<farm.rows; r2++) { if(lm["rgt-"+r2]){padR=PAD;break;} }
  }
  var SVG_W = padL + W + padR;
  var SVG_H = padT + H + padB;

  function getSvgPt(cx, cy) {
    var el = svgRef.current; if (!el) return null;
    var rect = el.getBoundingClientRect();
    var scaleX = SVG_W / rect.width, scaleY = SVG_H / rect.height;
    return { x:((cx-rect.left)*scaleX-padL)/CS, y:((cy-rect.top)*scaleY-padT)/CS };
  }
  function cancelLP() { clearTimeout(lpTimer.current); lpActive.current=false; lpStart.current=null; }
  function calcZoom(cx, cy) {
    var vw=window.innerWidth, vh=window.innerHeight;
    var ex=Math.min(cx, vw-cx)/(vw*0.25);
    var ey=Math.min(cy, vh-cy)/(vh*0.25);
    return Math.max(0.52, 1-Math.max(0, 1-Math.min(ex,ey))*0.44);
  }
  function onPD(e) {
    setPress(true);
    lpStart.current={x:e.clientX, y:e.clientY};
    lpActive.current=false;
    clearTimeout(lpTimer.current);
    /* マウス操作はクリックで即始点 */
    if(e.pointerType==="mouse"){
      lpActive.current=true;
      var pt=getSvgPt(lpStart.current.x, lpStart.current.y);
      if(pt) onLongPressStart(pt);
    } else {
      lpTimer.current=setTimeout(function(){
        lpActive.current=true;
        var pt=getSvgPt(lpStart.current.x, lpStart.current.y);
        if (pt) { onLongPressStart(pt); if(navigator.vibrate) navigator.vibrate(25); }
      }, 450);
    }
  }
  function onPM(e) {
    if (!lpStart.current) return;
    var dx=e.clientX-lpStart.current.x, dy=e.clientY-lpStart.current.y;
    if (!lpActive.current) { if(Math.sqrt(dx*dx+dy*dy)>15) cancelLP(); return; }
    var pt=getSvgPt(e.clientX, e.clientY);
    if (pt) onMove(pt);
    if(e.pointerType!=="mouse") onZoomChange(calcZoom(e.clientX, e.clientY));
  }
  function onPU(e) {
    clearTimeout(lpTimer.current);
    if (lpActive.current && s1) { var pt=getSvgPt(e.clientX,e.clientY); if(pt) onTap(pt); }
    lpActive.current=false; lpStart.current=null;
    setPress(false);
    onZoomChange(1);
  }

  var draftRect = null;
  if (s1 && hov) {
    var ddx = Math.abs(hov.x-s1.x), ddy = Math.abs(hov.y-s1.y);
    var dori = ddx >= ddy ? "H" : "V";
    var dgx = (s1.x+hov.x)/2, dgy = (s1.y+hov.y)/2;
    var dgl = Math.max(dori==="H"?ddx:ddy, 0.5);
    draftRect = dori==="H"
      ? {x:padL+(dgx-dgl/2)*CS, y:padT+(dgy-RWIDTH/2)*CS, w:dgl*CS, h:RWIDTH*CS}
      : {x:padL+(dgx-RWIDTH/2)*CS, y:padT+(dgy-dgl/2)*CS, w:RWIDTH*CS, h:dgl*CS};
  }

  var LM_FS = Math.min(PAD * 0.45, 22);
  var LM_LABEL_FS = Math.min(PAD * 0.16, 9);

  return (
    <div style={{transition:"transform 0.12s ease-out", transform:"scale("+zoom+")", transformOrigin:"50% 30%", display:"inline-block"}}>
      <svg ref={svgRef}
        viewBox={"0 0 "+SVG_W+" "+SVG_H} width={SVG_W} height={SVG_H}
        onPointerDown={onPD}
        onPointerMove={onPM}
        onPointerUp={onPU}
        onPointerCancel={function(){cancelLP();setPress(false);onZoomChange(1);}}
        onContextMenu={function(e){e.preventDefault();}}
        style={{display:"block",maxWidth:"100%",cursor:s1?"crosshair":"default",touchAction:"none",userSelect:"none"}}>

      {/* 背景（目印エリア含む） */}
      <rect width={SVG_W} height={SVG_H} fill={C.paper2}/>

      {/* 土壌ハッチパターン定義 */}
      <defs>
        <pattern id="soilHatch" patternUnits="userSpaceOnUse" width={8} height={8} patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={8} stroke={C.orange} strokeWidth={2.5} opacity={0.55}/>
        </pattern>
      </defs>

      {/* 畑フィールドの土 */}
      <rect x={padL} y={padT} width={W} height={H} fill="#d4c89c"/>

      {/* ポインターイベント受け取り用の透明rect */}
      <rect x={padL} y={padT} width={W} height={H} fill="transparent"
        style={{cursor:s1?"crosshair":"default"}}/>

      {/* 非活性区画のマスク */}
      {farm.grid.flatMap(function(row,r){
        return row.map(function(active,c){
          if (active) return null;
          return <rect key={"m"+r+"-"+c} x={padL+c*CS} y={padT+r*CS} width={CS} height={CS} fill={C.paper} opacity={0.88}/>;
        });
      }).filter(Boolean)}

      {/* 非活性区画の目印（inner-r-c） */}
      {farm.grid.flatMap(function(row,r){
        return row.map(function(active,c){
          if (active) return null;
          var item = lm["inner-"+r+"-"+c];
          if (!item) return null;
          var cx2 = padL+c*CS+CS/2, cy2 = padT+r*CS+CS/2;
          var fs = Math.min(CS*0.52, 24);
          return (
            <g key={"lmI"+r+"-"+c} style={{pointerEvents:"none"}}>
              <text x={cx2} y={cy2-1} textAnchor="middle" dominantBaseline="middle" fontSize={fs}>{item.icon}</text>
              <text x={cx2} y={cy2+fs*0.62} textAnchor="middle" fontSize={Math.min(CS*0.18,9)} fill={C.inkFaint} fontFamily={SERIF}>{item.memo||item.label}</text>
            </g>
          );
        });
      }).filter(Boolean)}

      {/* 外周境界線 */}
      {farm.grid.flatMap(function(row,r){
        var lines = [];
        row.forEach(function(active,c){
          if (!active) return;
          var x1=padL+c*CS, y1=padT+r*CS, x2=padL+(c+1)*CS, y2=padT+(r+1)*CS;
          if (r===0||!farm.grid[r-1][c])           lines.push(<line key={"t"+r+"-"+c} x1={x1} y1={y1} x2={x2} y2={y1} stroke={C.inkBorder} strokeWidth={2}/>);
          if (r===farm.rows-1||!farm.grid[r+1]||!farm.grid[r+1][c]) lines.push(<line key={"b"+r+"-"+c} x1={x1} y1={y2} x2={x2} y2={y2} stroke={C.inkBorder} strokeWidth={2}/>);
          if (c===0||!farm.grid[r][c-1])            lines.push(<line key={"l"+r+"-"+c} x1={x1} y1={y1} x2={x1} y2={y2} stroke={C.inkBorder} strokeWidth={2}/>);
          if (c===farm.cols-1||!farm.grid[r][c+1])  lines.push(<line key={"r"+r+"-"+c} x1={x2} y1={y1} x2={x2} y2={y2} stroke={C.inkBorder} strokeWidth={2}/>);
        });
        return lines;
      }).flat().filter(Boolean)}

      {/* 畝 */}
      {Object.values(farmRidges).map(function(ridge){
        var rr = getRect(ridge);
        var rx = rr.x+padL, ry = rr.y+padT;
        var pl = farmPlant[ridge.id];
        var vid = pl && pl.vid;
        var vg = vid ? VM[vid] : null;
        var isSel = selRid === ridge.id;
        var cx = rx+rr.w/2, cy = ry+rr.h/2;
        var sz = Math.min(rr.w, rr.h);
        return (
          <g key={ridge.id}
            style={{cursor:s1?"crosshair":"pointer"}}
            onPointerDown={function(e){ if(!s1 && e.pointerType==="mouse") e.stopPropagation(); }}
            onClick={function(e){ if(!s1){e.stopPropagation();onRidgeTap(ridge.id);} }}>
            <rect x={rx} y={ry} width={rr.w} height={rr.h}
              fill={isSel?"#b8ccec":"#e0d4a8"} stroke={isSel?C.indigo:C.inkBorder}
              strokeWidth={isSel?2.5:1.5} rx={3}/>
            {/* 土壌重なり（連作由来）ハッチ表示 */}
            {(soil&&soil[fid]||[]).filter(function(s){return s.year<year&&ridgesOverlap(ridge,s);}).map(function(s,i){
              var ix=ridgeIntersect(ridge,s); if(!ix) return null;
              return <rect key={"soil"+i} x={padL+ix.xa*CS} y={padT+ix.ya*CS} width={(ix.xb-ix.xa)*CS} height={(ix.yb-ix.ya)*CS} fill="url(#soilHatch)" rx={2} style={{pointerEvents:"none"}}/>;
            })}
            {vg && sz > 20 && (
              <text x={cx} y={cy-3} textAnchor="middle"
                fontSize={Math.min(sz*1.2,18)} fill={C.ink} style={{pointerEvents:"none"}}>
                {vg.mark}
              </text>
            )}
            <text x={cx} y={cy+(vg&&sz>20?10:4)} textAnchor="middle"
              fontSize={Math.min(sz*0.65,9)} fill={isSel?C.indigo:C.inkFaint}
              fontFamily={SERIF} style={{pointerEvents:"none"}}>
              {vg ? vg.name : ridge.name}
            </text>
          </g>
        );
      })}

      {/* ドラフトプレビュー */}
      {draftRect && (
        <rect x={draftRect.x} y={draftRect.y} width={draftRect.w} height={draftRect.h}
          fill={C.indigoPale} stroke={C.indigo} strokeWidth={1.5}
          strokeDasharray="5 3" opacity={0.85} rx={3}/>
      )}

      {/* 始点マーカー */}
      {s1 && (
        <circle cx={padL+s1.x*CS} cy={padT+s1.y*CS} r={9}
          fill={C.indigo} opacity={0.85} stroke={C.paper} strokeWidth={2.5}/>
      )}

      {/* ══ 目印：上 ══ */}
      {padT > 0 && Array.from({length:farm.cols}, function(_,c){
        var item = lm["top-"+c];
        if (!item) return null;
        var cx2 = padL + c*CS + CS/2;
        var cy2 = padT/2;
        return (
          <g key={"lmT"+c}>
            <text x={cx2} y={cy2-2} textAnchor="middle" dominantBaseline="middle" fontSize={LM_FS} style={{pointerEvents:"none"}}>{item.icon}</text>
            <text x={cx2} y={cy2+LM_FS*0.6} textAnchor="middle" fontSize={LM_LABEL_FS} fill={C.inkFaint} fontFamily={SERIF} style={{pointerEvents:"none"}}>{item.memo||item.label}</text>
          </g>
        );
      }).filter(Boolean)}

      {/* ══ 目印：下 ══ */}
      {padB > 0 && Array.from({length:farm.cols}, function(_,c){
        var item = lm["bot-"+c];
        if (!item) return null;
        var cx2 = padL + c*CS + CS/2;
        var cy2 = padT + H + padB/2;
        return (
          <g key={"lmB"+c}>
            <text x={cx2} y={cy2-2} textAnchor="middle" dominantBaseline="middle" fontSize={LM_FS} style={{pointerEvents:"none"}}>{item.icon}</text>
            <text x={cx2} y={cy2+LM_FS*0.6} textAnchor="middle" fontSize={LM_LABEL_FS} fill={C.inkFaint} fontFamily={SERIF} style={{pointerEvents:"none"}}>{item.memo||item.label}</text>
          </g>
        );
      }).filter(Boolean)}

      {/* ══ 目印：左 ══ */}
      {padL > 0 && Array.from({length:farm.rows}, function(_,r){
        var item = lm["lft-"+r];
        if (!item) return null;
        var cx2 = padL/2;
        var cy2 = padT + r*CS + CS/2;
        return (
          <g key={"lmL"+r}>
            <text x={cx2} y={cy2-2} textAnchor="middle" dominantBaseline="middle" fontSize={LM_FS} style={{pointerEvents:"none"}}>{item.icon}</text>
            <text x={cx2} y={cy2+LM_FS*0.6} textAnchor="middle" fontSize={LM_LABEL_FS} fill={C.inkFaint} fontFamily={SERIF} style={{pointerEvents:"none"}}>{item.memo||item.label}</text>
          </g>
        );
      }).filter(Boolean)}

      {/* ══ 目印：右 ══ */}
      {padR > 0 && Array.from({length:farm.rows}, function(_,r){
        var item = lm["rgt-"+r];
        if (!item) return null;
        var cx2 = padL + W + padR/2;
        var cy2 = padT + r*CS + CS/2;
        return (
          <g key={"lmR"+r}>
            <text x={cx2} y={cy2-2} textAnchor="middle" dominantBaseline="middle" fontSize={LM_FS} style={{pointerEvents:"none"}}>{item.icon}</text>
            <text x={cx2} y={cy2+LM_FS*0.6} textAnchor="middle" fontSize={LM_LABEL_FS} fill={C.inkFaint} fontFamily={SERIF} style={{pointerEvents:"none"}}>{item.memo||item.label}</text>
          </g>
        );
      }).filter(Boolean)}

      {/* ══ 目印の区切り線 ══ */}
      {padT > 0 && <line x1={padL} y1={padT} x2={padL+W} y2={padT} stroke={C.inkLine} strokeWidth={1} strokeDasharray="4 3"/>}
      {padB > 0 && <line x1={padL} y1={padT+H} x2={padL+W} y2={padT+H} stroke={C.inkLine} strokeWidth={1} strokeDasharray="4 3"/>}
      {padL > 0 && <line x1={padL} y1={padT} x2={padL} y2={padT+H} stroke={C.inkLine} strokeWidth={1} strokeDasharray="4 3"/>}
      {padR > 0 && <line x1={padL+W} y1={padT} x2={padL+W} y2={padT+H} stroke={C.inkLine} strokeWidth={1} strokeDasharray="4 3"/>}
    </svg>
    </div>
  );
}

/* ══════════════════════════════════════
   畑マップ（畝ベース）
══════════════════════════════════════ */
function FarmMap({ farms, plantings, setPlantings, ridges, setRidges, snapshots, setSnapshots, soil, setSoil, onAddFarm, onDeleteFarm, onRenameFarm, onExport, onImport, onShowFaq }) {
  const cy = new Date().getFullYear();
  const [fid, setFid]       = useState(farms[0]?farms[0].id:"");
  const [year, setYear]     = useState(cy);
  const [selRid, setSelRid] = useState(null);
  const [tab, setTab]       = useState("plant");
  const [s1, setS1]         = useState(null);
  const [hov, setHov]       = useState(null);
  const [zoom, setZoom]     = useState(1);
  const [isPressing, setIsPressing] = useState(false);
  const [showPrint, setShowPrint] = useState(false);
  const [printSnap, setPrintSnap] = useState(null); /* null=通常印刷, snap=変遷印刷 */
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [mainTab, setMainTab] = useState("map"); /* "map" | "history" */
  const [snapMsg, setSnapMsg] = useState(null);
  const [sharedMonth, setSharedMonth] = useState(null);
  const [sharedDay,   setSharedDay]   = useState(null);

  const farm       = farms.find(function(f){ return f.id===fid; }) || farms[0];
  const farmRidges = (function(){
    const all = ridges[fid] || {};
    const res = {};
    Object.keys(all).forEach(function(rid){
      var r = all[rid];
      var fromOk = !r.addedFrom || r.addedFrom <= year;
      var delOk  = !r.deletedFrom || r.deletedFrom > year;
      if (fromOk && delOk) res[rid] = r;
    });
    return res;
  })();
  const farmPlant  = (plantings[fid]&&plantings[fid][year]) || {};

  function gp(rid){ return farmPlant[rid] || null; }

  function sp(rid, vid, plantYear, month, day){
    const yr = plantYear || year;
    setPlantings(function(prev){
      const fd=prev[fid]||{}, fy=fd[yr]||{};
      return Object.assign({},prev,{[fid]:Object.assign({},fd,{[yr]:Object.assign({},fy,{[rid]:{vid:vid,month:month||null,day:day||null}})})});
    });
  }

  function cp(rid){
    setPlantings(function(prev){
      const fd=prev[fid]||{}, fy=Object.assign({},fd[year]||{});
      delete fy[rid];
      return Object.assign({},prev,{[fid]:Object.assign({},fd,{[year]:fy})});
    });
  }

  function gh(rid){
    const fd=plantings[fid]||{};
    return Object.entries(fd)
      .filter(function(e){ return parseInt(e[0])!==year; })
      .sort(function(a,b){ return b[0]-a[0]; })
      .map(function(e){
        const rec=e[1][rid];
        const vid=extractVid(rec);
        const full=(rec&&typeof rec==="object")?rec:{vid:vid,month:null,day:null};
        return {year:parseInt(e[0]),veggieId:vid,month:full.month,day:full.day};
      })
      .filter(function(h){ return h.veggieId; });
  }

  function clampPt(pt){
    return { x: Math.max(0, Math.min(farm.cols, pt.x)), y: Math.max(0, Math.min(farm.rows, pt.y)) };
  }
  function ridgeOnInactiveCell(nr){
    /* 畝のbboxが非活性マス（grid=false）と重なる場合はtrue */
    var bb = ridgeBBox(nr);
    var c1=Math.floor(bb.xa), c2=Math.ceil(bb.xb);
    var r1=Math.floor(bb.ya), r2=Math.ceil(bb.yb);
    for(var r=r1;r<r2;r++){
      for(var c=c1;c<c2;c++){
        if(farm.grid[r]&&farm.grid[r][c]===false) return true;
        if(!farm.grid[r]||farm.grid[r][c]===undefined) return true;
      }
    }
    return false;
  }
  function handleFieldTap(pt){
    pt = clampPt(pt);
    if (!s1) { setS1(pt); return; }
    const dx=Math.abs(pt.x-s1.x), dy=Math.abs(pt.y-s1.y);
    const dist=Math.sqrt(dx*dx+dy*dy);
    if (dist < 0.25) { setS1(null); setHov(null); return; }
    const orientation = dx >= dy ? "H" : "V";
    const gx=(s1.x+pt.x)/2, gy=(s1.y+pt.y)/2;
    const gl=Math.max(orientation==="H"?dx:dy, 0.5);
    const id="ridge_"+Date.now();
    const n=Object.keys(farmRidges).length+1;
    const nr={id:id,gx:gx,gy:gy,gl:gl,orientation:orientation,name:n+"番畝",addedFrom:year};
    if(ridgeOnInactiveCell(nr)){ setS1(null); setHov(null); return; }
    setRidges(function(prev){
      const fd=prev[fid]||{};
      return Object.assign({},prev,{[fid]:Object.assign({},fd,{[id]:nr})});
    });
    setS1(null); setHov(null);
  }

  function renameRidge(rid, name){
    setRidges(function(prev){
      const fd=prev[fid]||{};
      const r=fd[rid];
      if (!r) return prev;
      return Object.assign({},prev,{[fid]:Object.assign({},fd,{[rid]:Object.assign({},r,{name:name})})});
    });
  }

  function delRidge(rid){
    const ridge = farmRidges[rid];
    if (ridge) {
      /* plantings履歴をsoilに転記 */
      const allPls = plantings[fid] || {};
      const recs = [];
      Object.keys(allPls).forEach(function(yr){
        const vid = extractVid(allPls[yr]&&allPls[yr][rid]);
        if (vid) recs.push({gx:ridge.gx,gy:ridge.gy,gl:ridge.gl,orientation:ridge.orientation,year:parseInt(yr),vid:vid});
      });
      if (recs.length > 0) setSoil(function(prev){
        return Object.assign({},prev,{[fid]:(prev[fid]||[]).concat(recs)});
      });
      /* 物理削除せずdeletedFromをマーク（過去年の表示を維持） */
      setRidges(function(prev){
        const fd=Object.assign({},prev[fid]||{});
        fd[rid]=Object.assign({},ridge,{deletedFrom:year});
        return Object.assign({},prev,{[fid]:fd});
      });
    }
    setSelRid(null);
  }

  function closeSheet(){ setSelRid(null); setTab("plant"); }

  function saveSnapshot(note) {
    const snap = {
      id: "snap_"+Date.now(),
      ts: Date.now(),
      year: year,
      note: note || "",
      ridges: Object.assign({}, farmRidges),
      plantings: Object.assign({}, (plantings[fid]&&plantings[fid][year]) ? plantings[fid][year] : {})
    };
    setSnapshots(function(prev){
      const fd = prev[fid] || [];
      return Object.assign({}, prev, {[fid]: [snap].concat(fd)});
    });
    setSnapMsg("記録しました！");
    setTimeout(function(){ setSnapMsg(null); }, 2000);
  }

  /* 最新スナップと現在の状態が同じかどうか判定 */
  const isSameAsLastSnap = (function(){
    var snaps = snapshots[fid] || [];
    if (snaps.length === 0) return false;
    var last = snaps[0];
    if (last.year !== year) return false;
    /* 畝の比較（id・位置・方向・名前） */
    var curRidgeIds = Object.keys(farmRidges).sort();
    var lastRidgeIds = Object.keys(last.ridges || {}).sort();
    if (JSON.stringify(curRidgeIds) !== JSON.stringify(lastRidgeIds)) return false;
    for (var i=0; i<curRidgeIds.length; i++) {
      var rid = curRidgeIds[i];
      var cr = farmRidges[rid], lr = last.ridges[rid];
      if (!lr) return false;
      if (cr.gx!==lr.gx||cr.gy!==lr.gy||cr.gl!==lr.gl||cr.orientation!==lr.orientation||cr.name!==lr.name) return false;
    }
    /* 作付けの比較 */
    var curP = (plantings[fid]&&plantings[fid][year]) || {};
    var lastP = last.plantings || {};
    var curPIds = Object.keys(curP).sort();
    var lastPIds = Object.keys(lastP).sort();
    if (JSON.stringify(curPIds) !== JSON.stringify(lastPIds)) return false;
    for (var j=0; j<curPIds.length; j++) {
      var pid = curPIds[j];
      var cp = curP[pid], lp = lastP[pid];
      if (!lp) return false;
      if (cp.vid!==lp.vid||cp.month!==lp.month||cp.day!==lp.day) return false;
    }
    return true;
  })();

  function delSnapshot(sid) {
    setSnapshots(function(prev){
      const fd = (prev[fid] || []).filter(function(s){ return s.id !== sid; });
      return Object.assign({}, prev, {[fid]: fd});
    });
  }

  const ridgeCount = Object.keys(farmRidges).length;
  const plantedN   = Object.values(farmRidges).filter(function(r){ return farmPlant[r.id]&&farmPlant[r.id].vid; }).length;
  const selRidgeObj = selRid ? farmRidges[selRid] : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [renamingFarm, setRenamingFarm] = useState(false);
  const [renameVal, setRenameVal] = useState("");

  const pageLines = {
    backgroundImage:"repeating-linear-gradient(transparent,transparent 27px,"+C.inkLine+"30 27px,"+C.inkLine+"30 28px)",
  };

  /* ── ボトムバーの高さ（畝モード時は高くなる） ── */
  var bottomBarH = s1 ? 120 : 80;

  return (
    <div style={Object.assign({minHeight:"100vh",background:C.paper,fontFamily:SERIF,color:C.ink,userSelect:"none"},pageLines)}
      onClick={function(){ closeSheet(); if(s1){setS1(null);setHov(null);} setMenuOpen(false); }}>

      {/* ══ ヘッダー（シンプル） ══ */}
      <div style={{position:"sticky",top:0,background:C.paper2,zIndex:20,borderBottom:"2px solid "+C.ink}}>

        {/* 畑タブ行 */}
        <div style={{display:"flex",alignItems:"stretch",overflowX:"auto",borderBottom:"1px solid "+C.inkLine}}>
          {farms.map(function(f){
            const active=fid===f.id;
            return (
              <button key={f.id}
                onClick={function(e){e.stopPropagation();setFid(f.id);closeSheet();setS1(null);setHov(null);setConfirmDelete(false);setMenuOpen(false);}}
                style={{background:active?C.paper:"transparent",border:"none",borderRight:"1px solid "+C.inkLine,cursor:"pointer",padding:"11px 20px",fontSize:14,fontFamily:SERIF,color:active?C.ink:C.inkFaint,letterSpacing:1,flexShrink:0,fontWeight:active?"bold":"normal",boxShadow:active?"inset 0 -2px 0 "+C.ink:"none"}}>
                {f.name}
              </button>
            );
          })}
          <button onClick={function(e){e.stopPropagation();onAddFarm();}}
            style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:C.indigo,fontFamily:SERIF,padding:"11px 16px",flexShrink:0,marginLeft:"auto",letterSpacing:1}}>
            ＋ 畑を追加
          </button>
        </div>

        {/* 年ナビ + メニュー */}
        <div style={{display:"flex",alignItems:"center",padding:"10px 16px",gap:12}}>

          {/* マップ／変遷 セグメント */}
          <div style={{display:"flex",border:"1px solid "+C.inkLine,borderRadius:3,overflow:"hidden",flexShrink:0}}>
            {[{id:"map",label:"地図"},{id:"history",label:"変遷"}].map(function(t){
              const active=mainTab===t.id;
              return (
                <button key={t.id}
                  onClick={function(e){e.stopPropagation();setMainTab(t.id);closeSheet();setS1(null);setHov(null);}}
                  style={{padding:"6px 14px",border:"none",background:active?C.ink:"transparent",color:active?C.paper:C.inkFaint,fontSize:12,cursor:"pointer",fontFamily:SERIF,letterSpacing:1}}>
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* 年ナビ */}
          <div style={{display:"flex",alignItems:"center",gap:6,marginLeft:"auto"}}>
            <button onClick={function(e){e.stopPropagation();setYear(function(y){return y-1;});}}
              style={{background:"none",border:"1px solid "+C.inkBorder,width:28,height:28,cursor:"pointer",fontSize:14,color:C.inkFaint,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SERIF}}>‹</button>
            <div style={{minWidth:60,textAlign:"center"}}>
              <span style={{fontSize:15,letterSpacing:3,fontFamily:HAND}}>{year}</span>
              <span style={{fontSize:10,color:C.inkFaint,marginLeft:2,fontFamily:HAND}}>年</span>
            </div>
            <button onClick={function(e){e.stopPropagation();setYear(function(y){return y+1;});}} 
              style={{background:"none",border:"1px solid "+C.inkBorder,width:28,height:28,cursor:"pointer",fontSize:14,color:C.inkFaint,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SERIF,opacity:year>=cy?.3:1}}>›</button>
          </div>

          {/* … メニュー */}
          <div style={{position:"relative",flexShrink:0}}>
            <button onClick={function(e){e.stopPropagation();setMenuOpen(function(v){return !v;});closeSheet();}}
              style={{background:menuOpen?C.ink:"none",color:menuOpen?C.paper:C.inkFaint,border:"1px solid "+(menuOpen?C.ink:C.inkBorder),width:32,height:32,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:SERIF,letterSpacing:0}}>
              ⋯
            </button>
            {menuOpen && (
              <div onClick={function(e){e.stopPropagation();}} style={{position:"absolute",top:38,right:0,background:C.paper,border:"1.5px solid "+C.ink,boxShadow:"4px 4px 0 "+C.inkFaint,zIndex:50,minWidth:160,fontFamily:SERIF}}>
                <button onClick={function(e){e.stopPropagation();onShowFaq();setMenuOpen(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:C.ink,borderBottom:"1px solid "+C.inkLine,textAlign:"left"}}>
                  <span>❓</span> よくある質問
                </button>
                <button onClick={function(e){e.stopPropagation();setRenameVal(farm.name);setRenamingFarm(true);setMenuOpen(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:C.ink,borderBottom:"1px solid "+C.inkLine,textAlign:"left"}}>
                  <span>✎</span> 畑名を変更
                </button>
                <button onClick={function(e){e.stopPropagation();setShowPrint(true);setPrintSnap(null);setMenuOpen(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:C.ink,borderBottom:"1px solid "+C.inkLine,textAlign:"left"}}>
                  <span>🖨</span> 印刷する
                </button>
                <button onClick={function(e){e.stopPropagation();onExport();setMenuOpen(false);}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:C.ink,borderBottom:"1px solid "+C.inkLine,textAlign:"left"}}>
                  <span>💾</span> バックアップ
                </button>
                <label style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",cursor:"pointer",fontSize:13,color:C.ink,borderBottom:"1px solid "+C.inkLine}}>
                  <span>📂</span> データを読込む
                  <input type="file" accept=".json" onChange={function(e){e.stopPropagation();onImport(e);setMenuOpen(false);}} style={{display:"none"}}/>
                </label>
                <button onClick={function(e){e.stopPropagation();setConfirmDelete(function(v){return !v;});setMenuOpen(false);closeSheet();}}
                  style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 16px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,color:C.red,textAlign:"left"}}>
                  <span>🗑</span> この畑を削除
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 削除確認バー */}
        {confirmDelete && farm && (
          <div onClick={function(e){e.stopPropagation();}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:C.redPale,borderTop:"1px solid "+C.red}}>
            <span style={{flex:1,fontSize:12,color:C.red,fontFamily:HAND}}>「{farm.name}」を削除しますか？　元に戻せません。</span>
            <button onClick={function(e){e.stopPropagation();setConfirmDelete(false);}} style={{padding:"6px 14px",border:"1px solid "+C.inkBorder,background:"transparent",fontSize:12,cursor:"pointer",fontFamily:SERIF,color:C.inkFaint}}>やめる</button>
            <button onClick={function(e){e.stopPropagation();const rem=farms.filter(function(f){return f.id!==fid;});onDeleteFarm(fid);setConfirmDelete(false);if(rem.length>0)setFid(rem[0].id);}}
              style={{padding:"6px 14px",border:"1px solid "+C.red,background:C.red,color:"#fff",fontSize:12,cursor:"pointer",fontFamily:SERIF}}>削除する</button>
          </div>
        )}

        {/* 畑名変更バー */}
        {renamingFarm && farm && (
          <div onClick={function(e){e.stopPropagation();}} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",background:C.indigoPale,borderTop:"1px solid "+C.indigo}}>
            <input value={renameVal} onChange={function(e){setRenameVal(e.target.value);}} autoFocus
              style={{flex:1,padding:"6px 10px",border:"1px solid "+C.indigo,background:C.paper,fontSize:13,fontFamily:SERIF,letterSpacing:1,outline:"none"}}/>
            <button onClick={function(e){e.stopPropagation();setRenamingFarm(false);}}
              style={{padding:"6px 12px",border:"1px solid "+C.inkBorder,background:"transparent",fontSize:12,cursor:"pointer",fontFamily:SERIF,color:C.inkFaint}}>やめる</button>
            <button onClick={function(e){e.stopPropagation();if(!renameVal.trim())return;onRenameFarm(fid,renameVal.trim());setRenamingFarm(false);}}
              style={{padding:"6px 12px",border:"1px solid "+C.indigo,background:C.indigo,color:C.paper,fontSize:12,cursor:"pointer",fontFamily:SERIF}}>変更</button>
          </div>
        )}
      </div>

      {/* ══ コンテンツエリア ══ */}
      <div style={{padding:"20px 16px",paddingBottom:(bottomBarH+24)+"px",overflowX:"auto",touchAction:(s1||isPressing)?"none":"auto"}} onClick={function(e){e.stopPropagation();}}>

        {/* ── マップビュー ── */}
        {farm && mainTab === "map" && (
          <div style={{display:"inline-block",minWidth:"fit-content"}}>

            {/* フィールドヘッダー */}
            <div style={{marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
              {(function(){
                const northAngles={N:0,NE:45,E:90,SE:135,S:180,SW:225,W:270,NW:315};
                const angle=northAngles[farm.northDir]||0;
                return (
                  <span style={{fontSize:18,display:"inline-block",transform:"rotate("+angle+"deg)",lineHeight:1,color:C.indigo}}>↑</span>
                );
              })()}
              <span style={{fontSize:11,color:C.indigo,fontFamily:HAND,letterSpacing:2}}>北</span>
              <span style={{fontSize:12,color:C.inkFaint,fontFamily:HAND,marginLeft:8}}>{farm.name}　{year}年</span>
              {ridgeCount > 0 && (
                <span style={{fontSize:11,color:C.inkFaint,fontFamily:HAND,marginLeft:4}}>{plantedN}/{ridgeCount}畝 設定済み</span>
              )}
            </div>

            {/* SVGフィールド */}
            <div style={{border:"2px solid "+C.ink,boxShadow:"4px 4px 0 "+C.inkLine,display:"inline-block",overflowX:"auto",maxWidth:"100%"}}>
              <FarmField
                farm={farm} farmRidges={farmRidges} farmPlant={farmPlant}
                s1={s1} hov={hov} zoom={zoom}
                soil={soil} fid={fid} year={year}
                onLongPressStart={function(pt){ setS1(clampPt(pt)); closeSheet(); }}
                onTap={handleFieldTap}
                onMove={function(pt){ if(s1) setHov(clampPt(pt)); }}
                onZoomChange={setZoom}
                onPressChange={setIsPressing}
                onRidgeTap={function(rid){ if(!s1){setSelRid(rid);setTab("plant");} }}
                selRid={selRid}
              />
            </div>

            {/* 畝が0のヒント */}
            {ridgeCount===0 && !s1 && (
              <div style={{marginTop:14,padding:"14px 16px",border:"1px dashed "+C.inkLine,background:C.paper2,fontSize:12,color:C.inkFaint,fontFamily:HAND,letterSpacing:1,lineHeight:2}}>
                まだ畝がありません<br/>畑の上を<strong>長押し→ドラッグ</strong>して畝を引きましょう
              </div>
            )}

            {/* 畝一覧 */}
            {ridgeCount > 0 && (
              <div style={{marginTop:20,maxWidth:500}}>
                <SectionTitle>畝一覧</SectionTitle>
                {Object.values(farmRidges).map(function(ridge){
                  const pl=farmPlant[ridge.id];
                  const vg=pl&&pl.vid?VM[pl.vid]:null;
                  const warn=checkRot(fid,ridge.id,year,plantings,soil,farmRidges);
                  const isSel=selRid===ridge.id;
                  return (
                    <div key={ridge.id}
                      onClick={function(e){e.stopPropagation();setSelRid(isSel?null:ridge.id);setTab("plant");}}
                      style={{display:"flex",alignItems:"center",gap:12,padding:"11px 10px",marginBottom:4,cursor:"pointer",background:isSel?C.indigoPale:C.paper2,border:"1px solid "+(isSel?C.indigo:C.inkLine),borderRadius:3,transition:"all .1s"}}>
                      <div style={{width:38,height:38,border:"1px solid "+(vg?C.inkLine:C.inkLine),background:C.paper,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,borderRadius:2}}>
                        {vg ? <VeggieStamp id={vg.id} size={30}/> : <span style={{fontSize:18,color:C.inkLine}}>＋</span>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:13,letterSpacing:1,color:isSel?C.indigo:C.ink}}>{ridge.name}</div>
                        <div style={{fontSize:11,color:vg?C.indigo:C.inkFaint,fontFamily:HAND,marginTop:2}}>
                          {vg ? (vg.name+"　"+vg.family+(pl.month?"　"+pl.month+"月植付":"")) : "タップして野菜を設定"}
                        </div>
                      </div>
                      {warn && (
                        <div style={{flexShrink:0,padding:"3px 7px",border:"1px solid "+(warn==="danger"?C.red:C.orange),color:warn==="danger"?C.red:C.orange,fontSize:10,fontFamily:HAND}}>
                          {warn==="danger"?"連作":"注意"}
                        </div>
                      )}
                      <button onClick={function(e){e.stopPropagation();delRidge(ridge.id);}}
                        style={{padding:"4px 10px",border:"1px solid "+C.inkLine,background:"transparent",color:C.inkFaint,fontSize:11,cursor:"pointer",fontFamily:SERIF,flexShrink:0}}>
                        削除
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── 変遷ビュー ── */}
        {farm && mainTab === "history" && (
          <div style={{maxWidth:560}}>
            <div style={{marginBottom:20,padding:"14px 16px",background:C.paper2,border:"1px solid "+C.inkLine,borderRadius:3}}>
              <div style={{fontSize:12,color:C.inkFaint,fontFamily:HAND,letterSpacing:1,marginBottom:4}}>変遷の記録について</div>
              <div style={{fontSize:12,color:C.ink,fontFamily:HAND,lineHeight:1.9}}>
                下の「📸 記録する」ボタンを押すと、そのときの畑の状態が保存されます。
              </div>
            </div>

            {(snapshots[fid]||[]).length === 0 ? (
              <div style={{padding:"40px 16px",textAlign:"center",border:"1px dashed "+C.inkLine,color:C.inkFaint,fontSize:12,fontFamily:HAND,letterSpacing:1,lineHeight:2.5}}>
                まだ記録がありません<br/>
                <span style={{fontSize:22}}>📸</span><br/>
                下の「記録する」ボタンを押して<br/>今の状態を保存しましょう
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {(snapshots[fid]||[]).map(function(snap){
                  const d=new Date(snap.ts);
                  const dateStr=d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日";
                  const timeStr=d.getHours()+":"+(d.getMinutes()<10?"0":"")+d.getMinutes();
                  const ridgeList=Object.values(snap.ridges||{});
                  return (
                    <div key={snap.id} style={{border:"1px solid "+C.inkLine,background:C.paper2,borderRadius:3,overflow:"hidden"}}>
                      <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderBottom:"1px solid "+C.inkLine,background:C.paper}}>
                        <div style={{flex:1}}>
                          <div style={{fontSize:14,letterSpacing:1,fontFamily:HAND}}>{dateStr}　{timeStr}</div>
                          <div style={{fontSize:11,color:C.inkFaint,fontFamily:HAND,marginTop:2}}>
                            {snap.year}年の記録　畝{ridgeList.length}本
                          </div>
                        </div>
                        <button onClick={function(e){e.stopPropagation();setPrintSnap(snap);setShowPrint(true);}}
                          style={{padding:"4px 12px",border:"1px solid "+C.inkLine,background:"transparent",color:C.inkFaint,fontSize:11,cursor:"pointer",fontFamily:SERIF,display:"flex",alignItems:"center",gap:4}}>
                          <span>🖨</span> 印刷
                        </button>
                        <button onClick={function(e){e.stopPropagation();delSnapshot(snap.id);}}
                          style={{padding:"4px 12px",border:"1px solid "+C.inkLine,background:"transparent",color:C.inkFaint,fontSize:11,cursor:"pointer",fontFamily:SERIF}}>
                          削除
                        </button>
                      </div>
                      <div style={{padding:"12px 14px",overflowX:"auto"}}>
                        <SnapMiniMap farm={farm} ridges={snap.ridges||{}} plantings={snap.plantings||{}}/>
                      </div>
                      {ridgeList.length > 0 && (
                        <div style={{padding:"0 14px 12px",display:"flex",flexWrap:"wrap",gap:5}}>
                          {ridgeList.map(function(ridge){
                            const pl=snap.plantings&&snap.plantings[ridge.id];
                            const vg=pl&&pl.vid?VM[pl.vid]:null;
                            return (
                              <div key={ridge.id} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",border:"1px solid "+C.inkLine,fontSize:11,fontFamily:HAND,borderRadius:2,background:C.paper}}>
                                {vg&&<span>{vg.mark}</span>}
                                <span style={{color:C.inkFaint}}>{ridge.name}</span>
                                {vg?<span style={{color:C.ink}}>{vg.name}</span>:<span style={{color:C.inkLine}}>未設定</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ フローティングボトムバー ══ */}
      {mainTab === "map" && (
        <div onClick={function(e){e.stopPropagation();}} style={{position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:C.paper,borderTop:"2px solid "+C.ink,boxShadow:"0 -4px 20px rgba(28,20,8,0.12)"}}>

          {/* 畝引き中の案内 */}
          {s1 && (
            <div style={{padding:"10px 20px",background:C.indigoPale,borderBottom:"1px solid "+C.inkLine,display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:C.indigo,color:C.paper,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:"bold",flexShrink:0}}>2</div>
              <span style={{fontSize:13,color:C.indigo,fontFamily:HAND,letterSpacing:1,flex:1}}>
                そのまま指をスライドして終点で離す
              </span>
              <button onClick={function(e){e.stopPropagation();setS1(null);setHov(null);setZoom(1);}}
                style={{padding:"5px 14px",border:"1px solid "+C.indigo,background:"transparent",color:C.indigo,fontSize:12,cursor:"pointer",fontFamily:SERIF,flexShrink:0}}>
                やり直す
              </button>
            </div>
          )}

          {/* メインボタン行 */}
          <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px"}}>

            {/* 畝引きヒント */}
            <div style={{flex:1,padding:"14px 0",border:"2px solid "+C.inkBorder,background:"transparent",color:C.ink,fontSize:13,fontFamily:HAND,letterSpacing:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"2px 2px 0 "+C.inkLine,borderRadius:3}}>
              <span style={{fontSize:16}}>✏️</span>
              <span>畑を<strong>クリック/長押し→ドラッグ</strong>で畝を引く</span>
            </div>

            {/* 区切り */}
            <div style={{width:1,height:36,background:C.inkLine}}/>

            {/* 記録する */}
            <button
              onClick={function(e){e.stopPropagation();if(!isSameAsLastSnap)saveSnapshot();}}
              disabled={isSameAsLastSnap}
              style={{
                flex:1, padding:"14px 0",
                border:"2px solid "+(snapMsg?C.green:isSameAsLastSnap?C.inkLine:C.inkBorder),
                background:snapMsg?C.greenPale:"transparent",
                color:snapMsg?C.green:isSameAsLastSnap?C.inkLine:C.ink,
                fontSize:14, cursor:isSameAsLastSnap?"default":"pointer", fontFamily:SERIF, letterSpacing:2,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:"2px 2px 0 "+C.inkLine,
                borderRadius:3, transition:"all .25s",
                opacity:isSameAsLastSnap?0.45:1,
              }}>
              <span style={{fontSize:18}}>📸</span>
              <span>{snapMsg ? "記録しました！" : isSameAsLastSnap ? "変化なし" : "記録する"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 変遷タブ用ボトムバー */}
      {mainTab === "history" && (
        <div onClick={function(e){e.stopPropagation();}} style={{position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:C.paper,borderTop:"2px solid "+C.ink,padding:"12px 16px",boxShadow:"0 -4px 20px rgba(28,20,8,0.12)"}}>
          <button onClick={function(e){e.stopPropagation();if(!isSameAsLastSnap)saveSnapshot();}}
            disabled={isSameAsLastSnap}
            style={{width:"100%",padding:"14px 0",border:"2px solid "+(snapMsg?C.green:isSameAsLastSnap?C.inkLine:C.ink),background:snapMsg?C.greenPale:isSameAsLastSnap?"transparent":C.ink,color:snapMsg?C.green:isSameAsLastSnap?C.inkLine:C.paper,fontSize:14,cursor:isSameAsLastSnap?"default":"pointer",fontFamily:SERIF,letterSpacing:2,display:"flex",alignItems:"center",justifyContent:"center",gap:10,borderRadius:3,transition:"all .25s",opacity:isSameAsLastSnap?0.45:1}}>
            <span style={{fontSize:18}}>📸</span>
            <span>{snapMsg ? "記録しました！" : isSameAsLastSnap ? "変化なし（記録済み）" : "今の状態を記録する"}</span>
          </button>
        </div>
      )}

      {/* 畝ボトムシート */}
      {selRid && selRidgeObj && (
        <RidgeSheet
          ridge={selRidgeObj} year={year} farmId={fid} plantings={plantings}
          soil={soil} farmRidges={farmRidges}
          planting={gp(selRid)} history={gh(selRid)}
          warning={checkRot(fid,selRid,year,plantings,soil,farmRidges)}
          tab={tab} onTabChange={setTab}
          initMonth={sharedMonth} initDay={sharedDay}
          onRename={function(n){ renameRidge(selRid,n); }}
          onSelect={function(vid,plantYear,month,day){
            sp(selRid,vid,plantYear,month,day);
            setSharedMonth(month||null); setSharedDay(day||null);
            closeSheet();
          }}
          onClear={function(){ cp(selRid); closeSheet(); }}
          onDelete={function(){ delRidge(selRid); }}
          onClose={closeSheet}
        />
      )}

      {showPrint && farm && (
        <PrintModal farm={farm} year={year} farms={farms} plantings={plantings} ridges={ridges}
          soil={soil}
          snapOverride={printSnap}
          onClose={function(){ setShowPrint(false); setPrintSnap(null); }}/>
      )}
    </div>
  );
}


/* ══════════════════════════════════════
   よくある質問
══════════════════════════════════════ */
const FAQ_DATA = [
  { cat: "データの保存・プライバシーについて", items: [
    { q: "入力したデータはどこに保存されますか？",
      a: ["このアプリはインターネットに接続して使いますが、入力した作付けの記録はすべてお使いの端末（スマートフォン・PCなど）のブラウザ内に保存されます。外部のサーバーや第三者にデータが送られることは一切ありません。",
         {type:"note", text:"データはブラウザの「ローカルストレージ」という仕組みで端末内に保存されます。オフライン環境でもご利用いただけます。"}] },
    { q: "スマートフォンを機種変更すると、データは引き継げますか？",
      a: ["端末を替えたり、ブラウザのデータを消去（キャッシュクリア）したりすると、記録が失われる場合があります。大切なデータは「⋯」メニューから「💾 バックアップ」を選び、ファイルとして書き出しておくことをお勧めします。",
         "新しい端末では同じ手順でアプリを開き、「⋯」メニュー →「📂 データを読込む」から保存したファイルを選択することで記録を復元できます。",
         {type:"warn", text:"バックアップファイルを作成していない場合、データの復元はできません。こまめな書き出しをお勧めします。"}] },
    { q: "PCとスマートフォンで同じデータを使いたい",
      a: ["現在のところ、端末間でのデータの自動同期機能はありません。バックアップファイルを経由して手動で移行する方法をお試しください。",
         {type:"ol", items:["移行元の端末でバックアップファイルを書き出す（「💾 バックアップ」）","そのファイルをメールやAirDrop・クラウドストレージなどで移行先に送る","移行先の端末でハタケボを開き「📂 データを読込む」で読み込む"]}] },
    { q: "誤ってデータを消してしまいました。復元できますか？",
      a: ["バックアップファイルを書き出していた場合は、「📂 データを読込む」から復元できます。バックアップがない場合の復元は残念ながらできません。",
         {type:"warn", text:"畝の削除や畑の削除は即時反映されます。操作の前によくご確認ください。"}] },
  ]},
  { cat: "畑・畝の設定について", items: [
    { q: "畝の引き方がわかりません",
      a: ["畝引きは、畑の上を長押し→そのままドラッグする操作で行います。",
         {type:"ol", items:["畑フィールドを指で長押し（約0.5秒）すると始点が確定します（振動でお知らせ）","そのまま指を目的地まで引きずります","指が画面端に近づくほど地図が自動でズームアウトし、広い範囲が見えます","目的の位置で指を離すと畝が確定します"]},
         {type:"note", text:"縦方向に引くと縦畝、横方向に引くと横畝になります。始点と終点の距離が長い方向に自動判定されます。"}] },
    { q: "畝に名前をつけたり変更したりできますか？",
      a: ["畝をタップすると画面下から詳細パネルが開きます。畝名の横にある「✎」アイコンをタップすると名前を編集できます。"] },
    { q: "畝を削除するにはどうすればいいですか？",
      a: ["2つの方法があります。",
         {type:"ul", items:["畝一覧の各行右端にある「削除」ボタンをタップする","畝をタップして詳細パネルを開き、下部の「畝を削除」ボタンをタップする（確認ステップあり）"]},
         {type:"warn", text:"削除すると、その畝のすべての年の作付け記録も同時に削除されます。"}] },
    { q: "目印（石・木・水路など）を設定したのに地図に表示されません",
      a: ["目印は、畑の設定（セットアップ）の「目印」ステップで設定します。設定した目印はメインの地図・変遷記録・印刷のすべてに反映されます。",
         "目印には2種類の設置場所があります：畑の外周（上下左右の辺）と、使わない区画の中（L字形の畑の角など）。外周の目印はその辺に余白が生まれてアイコンが表示され、区画内の目印はそのマスの中央に表示されます。",
         {type:"note", text:"セットアップ完了後の目印の編集は現在サポートされていません。"}] },
    { q: "複数の畑を登録できますか？",
      a: ["はい、何面でも登録できます。画面上部の「＋ 畑を追加」から新しい畑のセットアップを開始してください。各畑はタブで切り替えて管理できます。"] },
  ]},
  { cat: "作付け・連作チェックについて", items: [
    { q: "選べる野菜の種類を教えてください",
      a: ["トマト・ナス・キュウリ・キャベツ・ニンジンなど、家庭菜園でよく育てられる野菜を41種類収録しています。ナス科・ウリ科・アブラナ科・マメ科など主要な科を幅広くカバーしています。",
         "野菜を選ぶ画面には「🌸春／☀️夏／🍂秋／❄️冬」の季節フィルターがあり、その季節に植え付け適期を迎える野菜を絞り込んで表示できます。アプリを開いた時点の季節が自動で選択されます。",
         {type:"note", text:"各野菜カードの左下に緑の点が付いているものが、今月植え付け適期の野菜です。"}] },
    { q: "「⚠ 連作」と表示されました。何ですか？",
      a: ["連作とは、同じ畝に同じ科の野菜を続けて植えることです。多くの野菜は連作すると病気や生育不良が起こりやすくなります。",
         "ハタケボでは過去の作付け履歴をもとに自動でチェックし、連作の懸念がある場合は「⚠ 連作」（赤・同科の場合）または「⚡ 注意」（橙・近縁の場合）を表示します。あくまでも目安としてご参照ください。"] },
    { q: "作付けを間違えて記入しました。修正できますか？",
      a: ["畝をタップして詳細パネルを開き、「記入を消す」ボタンでその年の記録を削除できます。削除後は改めて野菜を選択し直してください。"] },
    { q: "年をまたいで過去の記録を見たい",
      a: ["ヘッダーの「‹ 年 ›」ナビで過去の年に切り替えると、その年に記録した作付け内容を確認できます。また、各畝の詳細パネルの「記録」タブからも、その畝の作付け歴を一覧で確認できます。"] },
  ]},
  { cat: "変遷記録について", items: [
    { q: "「📸 記録する」ボタンは何をするものですか？",
      a: ["ボタンを押したその瞬間の畑の状態（畝の配置・作付け内容）をスナップショットとして保存する機能です。季節ごとや作業の節目に記録しておくことで、畑がどのように変化してきたかを振り返ることができます。",
         "記録は「変遷」タブで一覧表示されます。各記録から印刷もできます。不要な記録は個別に削除できます。",
         {type:"note", text:"前回の記録から畝の配置や作付けに変化がない場合、ボタンは「変化なし」となり押せません。変更を加えると自動的に押せるようになります。"}] },
    { q: "変遷記録はいつ押せばよいですか？",
      a: ["特に決まりはありませんが、以下のタイミングがおすすめです。",
         {type:"ul", items:["春の植付けが完了したとき","夏野菜から秋野菜に切り替えたとき","畝の配置を大きく変えたとき","収穫が終わり、次のシーズンに向けて整理したとき"]}] },
  ]},
  { cat: "印刷・動作環境・その他", items: [
    { q: "印刷機能はありますか？",
      a: ["あります。「⋯」メニューから「🖨 印刷する」を選ぶと、畑の地図（目印・畝・作物を含む図）と畝一覧テーブルを印刷できます。",
         "変遷タブに保存した過去の記録も、各カードの「🖨 印刷」ボタンからそのときの畑の状態を印刷できます。",
         {type:"note", text:"スマートフォンでもブラウザの印刷・PDF保存機能をご利用いただけます。"}] },
    { q: "どのブラウザ・端末で使えますか？",
      a: ["以下の環境での動作を確認しています。",
         {type:"ul", items:["Safari（iPhone・iPad・Mac）","Chrome（Android・Windows・Mac）","Firefox（Windows・Mac）","Edge（Windows）"]},
         "古いバージョンのブラウザや一部の特殊な環境では正常に動作しない場合があります。"] },
    { q: "オフラインでも使えますか？",
      a: ["ハタケボはHTMLファイルとして配布されています。一度ダウンロードしたファイルをブラウザで開けば、インターネット接続がなくてもすべての機能をお使いいただけます。"] },
  ]},
];

function FaqBlock({ item }) {
  var [open, setOpen] = useState(false);
  return (
    <div style={{border:"1px solid "+C.inkLine,background:C.paper2,marginBottom:8,borderRadius:2,overflow:"hidden"}}>
      <button onClick={function(e){e.stopPropagation();setOpen(function(v){return !v;});}}
        style={{width:"100%",textAlign:"left",background:open?C.indigoPale:"transparent",border:"none",cursor:"pointer",padding:"15px 16px",display:"flex",alignItems:"flex-start",gap:12,fontFamily:SERIF,transition:"background .15s"}}>
        <div style={{flexShrink:0,width:24,height:24,borderRadius:"50%",background:C.indigo,color:C.paper,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:HAND,marginTop:1}}>Q</div>
        <span style={{flex:1,fontSize:14,letterSpacing:"0.06em",color:C.ink,lineHeight:1.7,fontWeight:500}}>{item.q}</span>
        <span style={{flexShrink:0,fontSize:12,color:C.inkFaint,transition:"transform .2s",display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)",marginTop:4}}>▼</span>
      </button>
      {open && (
        <div style={{padding:"14px 16px 16px 52px",borderTop:"1px solid "+C.inkLine,fontFamily:HAND,fontSize:13,color:C.ink,lineHeight:2}}>
          {item.a.map(function(block, i){
            if (typeof block === "string") return <p key={i} style={{marginBottom:10}}>{block}</p>;
            if (block.type === "note") return (
              <div key={i} style={{display:"flex",gap:8,padding:"10px 12px",background:C.greenPale,borderLeft:"3px solid "+C.green,marginTop:8,fontSize:12,color:C.green,lineHeight:1.8}}>
                {"💡 "+block.text}
              </div>
            );
            if (block.type === "warn") return (
              <div key={i} style={{display:"flex",gap:8,padding:"10px 12px",background:"#fdf2e0",borderLeft:"3px solid #c06000",marginTop:8,fontSize:12,color:"#7a4000",lineHeight:1.8}}>
                {"⚠️ "+block.text}
              </div>
            );
            if (block.type === "ol") return (
              <ol key={i} style={{paddingLeft:18,marginBottom:10}}>
                {block.items.map(function(it,j){return <li key={j} style={{marginBottom:4}}>{it}</li>;})}
              </ol>
            );
            if (block.type === "ul") return (
              <ul key={i} style={{paddingLeft:18,marginBottom:10}}>
                {block.items.map(function(it,j){return <li key={j} style={{marginBottom:4}}>{it}</li>;})}
              </ul>
            );
            return null;
          })}
        </div>
      )}
    </div>
  );
}

function FAQScreen({ onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:C.paper,zIndex:200,overflowY:"auto",fontFamily:SERIF,color:C.ink,
      backgroundImage:"repeating-linear-gradient(transparent,transparent 27px,"+C.inkLine+"28 27px,"+C.inkLine+"28 28px)"}}
      onClick={function(e){e.stopPropagation();}}>

      {/* ヘッダー */}
      <div style={{position:"sticky",top:0,background:C.paper2,borderBottom:"2px solid "+C.ink,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",padding:"12px 16px",gap:14}}>
          <button onClick={onClose}
            style={{background:"none",border:"1px solid "+C.inkBorder,cursor:"pointer",width:34,height:34,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,color:C.inkFaint,flexShrink:0}}>
            ‹
          </button>
          <div>
            <div style={{fontSize:16,letterSpacing:3,fontWeight:"bold"}}>よくある質問</div>
            <div style={{fontSize:10,color:C.inkFaint,letterSpacing:2,fontFamily:HAND}}>ハタケボ 畑の帳簿</div>
          </div>
        </div>
      </div>

      {/* コンテンツ */}
      <div style={{maxWidth:680,margin:"0 auto",padding:"32px 16px 60px"}}>
        {FAQ_DATA.map(function(cat, ci){
          return (
            <div key={ci} style={{marginBottom:40}}>
              <div style={{fontSize:13,fontWeight:"bold",letterSpacing:3,color:C.indigo,marginBottom:14,padding:"8px 0 8px 12px",borderLeft:"3px solid "+C.indigo,fontFamily:HAND}}>
                {cat.cat}
              </div>
              {cat.items.map(function(item, ii){
                return <FaqBlock key={ii} item={item}/>;
              })}
            </div>
          );
        })}
      </div>

      {/* フッター */}
      <div style={{borderTop:"1px solid "+C.inkLine,padding:"32px 24px",textAlign:"center",background:C.paper2}}>
        {/* ▼▼▼ お問い合わせフォームのURLをここに設定 ▼▼▼ */}
        {(function(){
          var FORM_URL = "https://forms.google.com/XXXX-ここをGoogleフォームのURLに書き換えてください";
          return (
            <div style={{marginBottom:24}}>
              <div style={{fontSize:13,color:C.ink,fontFamily:SERIF,letterSpacing:2,marginBottom:6}}>
                お問い合わせ・ご要望
              </div>
              <div style={{fontSize:11,color:C.inkFaint,fontFamily:HAND,letterSpacing:1,marginBottom:14,lineHeight:1.9}}>
                不具合・使い方のご質問はもちろん、<br/>
                「この野菜を追加してほしい」「こんな機能があると便利」<br/>
                といったご要望もお気軽にどうぞ。
              </div>
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer"
                style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",border:"2px solid "+C.ink,background:C.ink,color:C.paper,fontSize:13,fontFamily:SERIF,letterSpacing:2,textDecoration:"none",boxShadow:"3px 3px 0 "+C.inkFaint}}>
                <span>✉</span>
                <span>お問い合わせ</span>
              </a>
            </div>
          );
        })()}
        {/* ▲▲▲ */}
        <div style={{fontSize:11,color:C.inkFaint,fontFamily:HAND,letterSpacing:1}}>
          ハタケボ — 畑の帳簿
        </div>
        <a href="./disclaimer.html" target="_blank" rel="noopener noreferrer"
          style={{display:"inline-block",marginTop:10,fontSize:11,color:C.inkFaint,fontFamily:HAND,letterSpacing:1,textDecoration:"underline"}}>
          免責事項
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   スナップショット用ミニマップ
══════════════════════════════════════ */
function SnapMiniMap({ farm, ridges, plantings }) {
  var miniCS = Math.min(32, Math.floor(240 / farm.cols));
  var lm = farm.landmarks || {};
  var PAD = Math.round(miniCS * 0.7);
  var padT=0, padB=0, padL=0, padR=0;
  for (var c=0; c<farm.cols; c++) { if(lm["top-"+c]){padT=PAD;break;} }
  for (var c=0; c<farm.cols; c++) { if(lm["bot-"+c]){padB=PAD;break;} }
  for (var r=0; r<farm.rows; r++) { if(lm["lft-"+r]){padL=PAD;break;} }
  for (var r=0; r<farm.rows; r++) { if(lm["rgt-"+r]){padR=PAD;break;} }
  var W = farm.cols * miniCS;
  var H = farm.rows * miniCS;
  var SVG_W = padL + W + padR;
  var SVG_H = padT + H + padB;
  var LF = Math.min(PAD * 0.55, 16);
  var LLF = Math.min(PAD * 0.22, 7);
  return (
    <svg viewBox={"0 0 "+SVG_W+" "+SVG_H} width={SVG_W} height={SVG_H} style={{display:"block"}}>
      <rect width={SVG_W} height={SVG_H} fill={C.paper2}/>
      <rect x={padL} y={padT} width={W} height={H} fill="#d4c89c"/>
      {farm.grid.flatMap(function(row,r){
        return row.map(function(active,c){
          if (active) return null;
          return <rect key={"m"+r+"-"+c} x={padL+c*miniCS} y={padT+r*miniCS} width={miniCS} height={miniCS} fill={C.paper} opacity={0.88}/>;
        });
      }).filter(Boolean)}
      {/* 非活性区画の目印 */}
      {farm.grid.flatMap(function(row,r){
        return row.map(function(active,c){
          if(active) return null;
          var it=lm["inner-"+r+"-"+c]; if(!it) return null;
          var cx2=padL+c*miniCS+miniCS/2, cy2=padT+r*miniCS+miniCS/2;
          return <text key={"lmI"+r+"-"+c} x={cx2} y={cy2} textAnchor="middle" dominantBaseline="middle" fontSize={Math.min(miniCS*0.6,18)}>{it.icon}</text>;
        });
      }).filter(Boolean)}
      {farm.grid.flatMap(function(row,r){
        var lines=[];
        row.forEach(function(active,c){
          if(!active) return;
          var x1=padL+c*miniCS,y1=padT+r*miniCS,x2=padL+(c+1)*miniCS,y2=padT+(r+1)*miniCS;
          if(r===0||!farm.grid[r-1][c]) lines.push(<line key={"t"+r+"-"+c} x1={x1} y1={y1} x2={x2} y2={y1} stroke={C.inkBorder} strokeWidth={1.5}/>);
          if(r===farm.rows-1||!farm.grid[r+1]||!farm.grid[r+1][c]) lines.push(<line key={"b"+r+"-"+c} x1={x1} y1={y2} x2={x2} y2={y2} stroke={C.inkBorder} strokeWidth={1.5}/>);
          if(c===0||!farm.grid[r][c-1]) lines.push(<line key={"l"+r+"-"+c} x1={x1} y1={y1} x2={x1} y2={y2} stroke={C.inkBorder} strokeWidth={1.5}/>);
          if(c===farm.cols-1||!farm.grid[r][c+1]) lines.push(<line key={"r"+r+"-"+c} x1={x2} y1={y1} x2={x2} y2={y2} stroke={C.inkBorder} strokeWidth={1.5}/>);
        });
        return lines;
      }).flat().filter(Boolean)}
      {Object.values(ridges).map(function(ridge){
        var rr;
        if(ridge.orientation==="H"){
          rr={x:padL+(ridge.gx-ridge.gl/2)*miniCS,y:padT+(ridge.gy-RWIDTH/2)*miniCS,w:ridge.gl*miniCS,h:RWIDTH*miniCS};
        } else {
          rr={x:padL+(ridge.gx-RWIDTH/2)*miniCS,y:padT+(ridge.gy-ridge.gl/2)*miniCS,w:RWIDTH*miniCS,h:ridge.gl*miniCS};
        }
        var pl=plantings[ridge.id];
        var vg=pl&&pl.vid?VM[pl.vid]:null;
        var cx=rr.x+rr.w/2, cy=rr.y+rr.h/2;
        return (
          <g key={ridge.id}>
            <rect x={rr.x} y={rr.y} width={rr.w} height={rr.h} fill="#e0d4a8" stroke={C.inkBorder} strokeWidth={1} rx={2}/>
            {vg && <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle" fontSize={Math.min(rr.w,rr.h)*0.7}>{vg.mark}</text>}
          </g>
        );
      })}
      {/* 外周目印 */}
      {padT>0&&Array.from({length:farm.cols},function(_,c){var it=lm["top-"+c];if(!it)return null;var cx2=padL+c*miniCS+miniCS/2;return(<g key={"lmT"+c}><text x={cx2} y={padT/2} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text>{LLF>5&&<text x={cx2} y={padT/2+LF*0.62} textAnchor="middle" fontSize={LLF} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text>}</g>);}).filter(Boolean)}
      {padB>0&&Array.from({length:farm.cols},function(_,c){var it=lm["bot-"+c];if(!it)return null;var cx2=padL+c*miniCS+miniCS/2,cy2=padT+H+padB/2;return(<g key={"lmB"+c}><text x={cx2} y={cy2} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text>{LLF>5&&<text x={cx2} y={cy2+LF*0.62} textAnchor="middle" fontSize={LLF} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text>}</g>);}).filter(Boolean)}
      {padL>0&&Array.from({length:farm.rows},function(_,r){var it=lm["lft-"+r];if(!it)return null;var cy2=padT+r*miniCS+miniCS/2;return(<g key={"lmL"+r}><text x={padL/2} y={cy2} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text>{LLF>5&&<text x={padL/2} y={cy2+LF*0.62} textAnchor="middle" fontSize={LLF} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text>}</g>);}).filter(Boolean)}
      {padR>0&&Array.from({length:farm.rows},function(_,r){var it=lm["rgt-"+r];if(!it)return null;var cx2=padL+W+padR/2,cy2=padT+r*miniCS+miniCS/2;return(<g key={"lmR"+r}><text x={cx2} y={cy2} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text>{LLF>5&&<text x={cx2} y={cy2+LF*0.62} textAnchor="middle" fontSize={LLF} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text>}</g>);}).filter(Boolean)}
      {/* 区切り線 */}
      {padT>0&&<line x1={padL} y1={padT} x2={padL+W} y2={padT} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
      {padB>0&&<line x1={padL} y1={padT+H} x2={padL+W} y2={padT+H} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
      {padL>0&&<line x1={padL} y1={padT} x2={padL} y2={padT+H} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
      {padR>0&&<line x1={padL+W} y1={padT} x2={padL+W} y2={padT+H} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
    </svg>
  );
}

/* ══════════════════════════════════════
   畝ボトムシート
══════════════════════════════════════ */
function RidgeSheet({ ridge, year, farmId, plantings, soil, farmRidges, planting, history, warning, tab, onTabChange, initMonth, initDay, onRename, onSelect, onClear, onDelete, onClose }) {
  const vg = planting && planting.vid ? VM[planting.vid] : null;
  const [editName,  setEditName]  = useState(false);
  const [nameVal,   setNameVal]   = useState(ridge.name);
  const [pendingVid,setPendingVid]= useState(null);
  const [cfmClear,  setCfmClear]  = useState(false);
  const [cfmDel,    setCfmDel]    = useState(false);
  const [seasFilter, setSeasFilter] = useState(function(){
    var m = new Date().getMonth()+1;
    if(m>=3&&m<=5) return "haru";
    if(m>=6&&m<=8) return "natsu";
    if(m>=9&&m<=11) return "aki";
    return "fuyu";
  });
  const [selMonth,  setSelMonth]  = useState(function(){
    if(planting&&planting.month) return planting.month;
    return initMonth||null;
  });
  const [selDay,    setSelDay]    = useState(function(){
    if(planting&&planting.day) return planting.day;
    return initDay||null;
  });

  return (
    <div onClick={function(e){e.stopPropagation();}}
      style={{position:"fixed",bottom:0,left:0,right:0,zIndex:40,background:C.paper,borderTop:"3px solid "+C.ink,borderRadius:"14px 14px 0 0",boxShadow:"0 -8px 40px rgba(28,20,8,0.18)",maxHeight:"78vh",display:"flex",flexDirection:"column",fontFamily:SERIF,backgroundImage:"repeating-linear-gradient(transparent,transparent 27px,"+C.inkLine+"28 27px,"+C.inkLine+"28 28px)"}}>

      <div style={{padding:"12px 24px 0"}}>
        <div style={{width:36,height:3,background:C.inkLine,borderRadius:2,margin:"0 auto 14px"}}/>

        {/* 畝名＋野菜ヘッダー */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            {vg ? (
              <div style={{width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid "+C.inkLine,background:C.paper2}}>
                <VeggieStamp id={vg.id} size={44}/>
              </div>
            ) : (
              <div style={{width:52,height:52,display:"flex",alignItems:"center",justifyContent:"center",border:"1px dashed "+C.inkLine,color:C.inkFaint,fontSize:22}}>空</div>
            )}
            <div>
              {editName ? (
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <input autoFocus value={nameVal} onChange={function(e){setNameVal(e.target.value.slice(0,12));}}
                    style={{fontSize:15,border:"none",borderBottom:"1.5px solid "+C.ink,outline:"none",fontFamily:SERIF,background:"transparent",color:C.ink,width:120,padding:"2px 0"}}/>
                  <button onClick={function(){onRename(nameVal);setEditName(false);}}
                    style={{padding:"3px 10px",border:"1px solid "+C.ink,background:C.ink,color:C.paper,fontSize:11,cursor:"pointer",fontFamily:SERIF}}>保存</button>
                </div>
              ) : (
                <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={function(){setEditName(true);}}>
                  <div style={{fontSize:16,letterSpacing:2,fontFamily:HAND}}>{ridge.name}</div>
                  <span style={{fontSize:10,color:C.inkLine}}>✎</span>
                </div>
              )}
              <div style={{fontSize:12,color:C.inkFaint,marginTop:3,fontFamily:HAND}}>
                {vg ? vg.name+"（"+vg.family+"）" : "未設定"}
              </div>
              {vg && planting && planting.month && (
                <div style={{fontSize:11,color:C.indigo,marginTop:2,fontFamily:HAND,letterSpacing:1}}>
                  {year}年{planting.month}月{planting.day?planting.day+"日":""}植付
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:20,color:C.inkFaint,lineHeight:1}}>×</button>
            {!cfmDel ? (
              <button onClick={function(){setCfmDel(true);}}
                style={{padding:"4px 10px",border:"1px solid "+C.red,background:"transparent",color:C.red,fontSize:11,cursor:"pointer",fontFamily:SERIF,letterSpacing:1,whiteSpace:"nowrap"}}>
                畝を削除
              </button>
            ) : (
              <div style={{display:"flex",gap:5,alignItems:"center"}}>
                <span style={{fontSize:10,color:C.red,fontFamily:HAND}}>本当に削除？</span>
                <button onClick={function(){setCfmDel(false);}} style={{padding:"4px 8px",border:"1px solid "+C.inkBorder,background:"transparent",fontSize:10,cursor:"pointer",fontFamily:SERIF}}>やめる</button>
                <button onClick={onDelete} style={{padding:"4px 8px",border:"1px solid "+C.red,background:C.red,color:"#fff",fontSize:10,cursor:"pointer",fontFamily:SERIF,fontWeight:"bold"}}>削除</button>
              </div>
            )}
          </div>
        </div>

        {/* 連作警告 */}
        {warning && (
          <div style={{display:"flex",gap:10,alignItems:"center",padding:"9px 14px",marginBottom:10,borderLeft:"4px solid "+(warning==="danger"?C.red:C.orange),background:warning==="danger"?C.redPale:C.orangePale}}>
            <Hanko text={warning==="danger"?"危":"注"} color={warning==="danger"?C.red:C.orange}/>
            <div>
              <div style={{fontSize:12,fontWeight:"bold",color:warning==="danger"?C.red:C.orange,fontFamily:HAND,letterSpacing:1}}>
                {warning==="danger"?"連作障害 危険":"連作障害 注意"}
              </div>
              <div style={{fontSize:11,color:C.inkFaint,marginTop:2,fontFamily:HAND}}>
                {warning==="danger"?"3年以上同じ科が連続しています":"前年と同じ科の野菜です"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* タブ */}
      <div style={{display:"flex",borderBottom:"2px solid "+C.ink,padding:"0 24px"}}>
        {[{id:"plant",label:"作物を設定"},{id:"history",label:"記録"}].map(function(t){
          return (
            <button key={t.id} onClick={function(){onTabChange(t.id);}}
              style={{padding:"8px 0",marginRight:24,border:"none",background:"none",cursor:"pointer",fontFamily:SERIF,fontSize:12,letterSpacing:2,color:tab===t.id?C.ink:C.inkFaint,borderBottom:tab===t.id?"3px solid "+C.ink:"3px solid transparent"}}>
              {t.label}
            </button>
          );
        })}
      </div>

      <div style={{overflowY:"auto",flex:1,padding:"14px 24px 24px"}}>

        {/* 作物設定タブ */}
        {tab === "plant" && (
          <div>
            <SectionTitle>{year}年の作物を選ぶ</SectionTitle>

            {/* 季節フィルター */}
            {(function(){
              var curM = new Date().getMonth()+1;
              var seasons = [
                { id:"all",  label:"全て",  months:[] },
                { id:"haru", label:"🌸 春", months:[3,4,5] },
                { id:"natsu",label:"☀️ 夏", months:[6,7,8] },
                { id:"aki",  label:"🍂 秋", months:[9,10,11] },
                { id:"fuyu", label:"❄️ 冬", months:[12,1,2] },
              ];
              var curSeas = seasons.find(function(s){ return s.months.includes(curM); }) || seasons[0];
              return (
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
                    {seasons.map(function(s){
                      var isCur = s.id === seasFilter;
                      var isNow = s.id === curSeas.id && s.id !== "all";
                      return (
                        <button key={s.id} onClick={function(){setSeasFilter(s.id);}}
                          style={{padding:"4px 10px",border:"1px solid "+(isCur?C.indigo:C.inkLine),background:isCur?C.indigo:"transparent",color:isCur?C.paper:C.inkFaint,fontSize:11,cursor:"pointer",fontFamily:HAND,borderRadius:2,position:"relative"}}>
                          {s.label}
                          {isNow&&<span style={{position:"absolute",top:-4,right:-4,width:7,height:7,borderRadius:"50%",background:C.green}}/>}
                        </button>
                      );
                    })}
                  </div>
                  {seasFilter!=="all" && (
                    <div style={{fontSize:10,color:C.inkFaint,fontFamily:HAND,letterSpacing:1}}>
                      {(function(){
                        var s=seasons.find(function(s){return s.id===seasFilter;});
                        return s?s.months.join("・")+"月が植え付け適期の野菜を表示":"";
                      })()}
                    </div>
                  )}
                </div>
              );
            })()}

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:16}}>
              {(function(){
                var curM = new Date().getMonth()+1;
                var seasMonths = {haru:[3,4,5],natsu:[6,7,8],aki:[9,10,11],fuyu:[12,1,2]};
                var filterMs = seasFilter==="all" ? null : seasMonths[seasFilter];
                return VEGGIES.filter(function(v){
                  if(!filterMs) return true;
                  return v.plantMonths && v.plantMonths.some(function(m){ return filterMs.includes(m); });
                }).map(function(v){
                  var wP=checkPrev(farmId,ridge.id,v.id,year,plantings,soil,farmRidges);
                  var isCur=planting&&planting.vid===v.id;
                  var isPend=pendingVid===v.id;
                  var isNowMonth = v.plantMonths && v.plantMonths.includes(curM);
                  return (
                    <button key={v.id} onClick={function(){setPendingVid(isPend?null:v.id);}}
                      style={{border:"1.5px solid "+(isPend?C.indigo:isCur?C.ink:C.inkLine),background:isPend?C.indigoPale:isCur?C.paper2:"transparent",padding:"8px 4px 6px",cursor:"pointer",fontFamily:SERIF,display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative",minHeight:80,boxShadow:isPend?"0 0 0 2px "+C.indigo:isCur?"2px 2px 0 "+C.inkFaint:"none"}}>
                      <VeggieStamp id={v.id} size={42}/>
                      <span style={{fontSize:9,color:isPend?C.indigo:isCur?C.ink:C.inkFaint,textAlign:"center",lineHeight:1.3,letterSpacing:.5,fontFamily:HAND}}>{v.name}</span>
                      <span style={{fontSize:7,color:C.inkLine,fontFamily:HAND}}>{v.family}</span>
                      {wP && <span style={{position:"absolute",top:2,right:2,width:14,height:14,border:"2px solid "+(wP==="danger"?C.red:C.orange),color:wP==="danger"?C.red:C.orange,borderRadius:"50%",fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:"bold",background:wP==="danger"?C.redPale:C.orangePale}}>!</span>}
                      {isCur&&!isPend&&<span style={{position:"absolute",top:2,left:2,background:C.ink,color:C.paper,padding:"1px 3px",fontSize:7,fontFamily:HAND}}>記入済</span>}
                      {isPend&&<span style={{position:"absolute",top:2,left:2,background:C.indigo,color:C.paper,padding:"1px 3px",fontSize:7,fontFamily:HAND}}>選択中</span>}
                      {!isCur&&!isPend&&isNowMonth&&<span style={{position:"absolute",bottom:2,left:2,width:5,height:5,borderRadius:"50%",background:C.green}}/>}
                    </button>
                  );
                });
              })()}
            </div>

            {/* 植え付け日入力 */}
            {pendingVid && (
              <div style={{marginBottom:16,padding:"14px 14px 12px",background:C.paper2,border:"2px solid "+C.indigo,borderRadius:2}}>
                <div style={{fontSize:10,color:C.indigo,letterSpacing:3,marginBottom:12,fontFamily:HAND,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:16}}>{VM[pendingVid]&&VM[pendingVid].mark}</span>
                  {VM[pendingVid]&&VM[pendingVid].name}　植え付け日
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:9,color:C.inkFaint,letterSpacing:2,marginBottom:5,fontFamily:HAND}}>月（任意）</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {Array.from({length:12},function(_,i){var m=i+1;return(
                      <button key={m} onClick={function(){setSelMonth(selMonth===m?null:m);if(selMonth!==m)setSelDay(null);}}
                        style={{width:28,height:26,border:"1px solid "+(selMonth===m?C.indigo:C.inkLine),background:selMonth===m?C.indigo:"transparent",color:selMonth===m?C.paper:C.inkFaint,fontSize:10,cursor:"pointer",fontFamily:HAND}}>{m}</button>
                    );})}
                  </div>
                </div>
                {selMonth && (
                  <div style={{marginBottom:12}}>
                    <div style={{fontSize:9,color:C.inkFaint,letterSpacing:2,marginBottom:5,fontFamily:HAND}}>日（任意）</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                      {Array.from({length:daysInMonth(year,selMonth)},function(_,i){var d=i+1;return(
                        <button key={d} onClick={function(){setSelDay(selDay===d?null:d);}}
                          style={{width:28,height:26,border:"1px solid "+(selDay===d?C.indigo:C.inkLine),background:selDay===d?C.indigo:"transparent",color:selDay===d?C.paper:C.inkFaint,fontSize:10,cursor:"pointer",fontFamily:HAND}}>{d}</button>
                      );})}
                    </div>
                  </div>
                )}
                <div style={{fontSize:12,color:C.indigo,fontFamily:HAND,letterSpacing:1,marginBottom:12,paddingTop:8,borderTop:"1px solid "+C.inkLine}}>
                  {year}年{selMonth?selMonth+"月":"　月未選択"}{selMonth&&selDay?selDay+"日":""}
                </div>
                <button onClick={function(){onSelect(pendingVid,year,selMonth,selDay);}}
                  style={{width:"100%",padding:"12px",border:"2px solid "+C.indigo,background:C.indigo,color:C.paper,fontSize:13,cursor:"pointer",fontFamily:SERIF,letterSpacing:2,boxShadow:"3px 3px 0 "+C.inkFaint}}>
                  植え付ける
                </button>
              </div>
            )}

            {/* 記入を消すボタン */}
            {planting&&planting.vid&&!cfmClear && (
              <button onClick={function(){setCfmClear(true);}}
                style={{width:"100%",marginTop:8,padding:"11px",background:"transparent",color:C.red,border:"1px solid "+C.red,fontSize:13,cursor:"pointer",fontFamily:SERIF,letterSpacing:1}}>
                記入を消す
              </button>
            )}
            {planting&&planting.vid&&cfmClear && (
              <div style={{marginTop:8,border:"1px solid "+C.inkBorder,padding:"10px 14px",display:"flex",gap:8,alignItems:"center"}}>
                <span style={{fontSize:12,flex:1,fontFamily:HAND}}>今年の記入を削除？</span>
                <button onClick={function(){setCfmClear(false);}} style={{padding:"6px 10px",border:"1px solid "+C.inkBorder,background:"transparent",fontSize:11,cursor:"pointer",fontFamily:SERIF}}>やめる</button>
                <button onClick={onClear} style={{padding:"6px 10px",border:"1px solid "+C.red,background:C.red,color:"#fff",fontSize:11,cursor:"pointer",fontFamily:SERIF}}>削除</button>
              </div>
            )}
          </div>
        )}

        {/* 記録タブ */}
        {tab === "history" && (
          <div>
            <SectionTitle>{ridge.name}　作付け歴</SectionTitle>
            {planting&&planting.vid&&<HistRow year={year} month={planting.month} day={planting.day} veggieId={planting.vid} isCurrent={true}/>}
            {history.length>0
              ? history.map(function(h){return <HistRow key={h.year} year={h.year} month={h.month} day={h.day} veggieId={h.veggieId} isCurrent={false}/>;})
              : <div style={{color:C.inkFaint,fontSize:12,padding:"16px 0",fontFamily:HAND,letterSpacing:1}}>過去の記録はありません</div>}
            {(planting&&planting.vid||history.length>0)&&<RotSummary year={year} veggieId={planting&&planting.vid} history={history}/>}
          </div>
        )}
      </div>
    </div>
  );
}

function HistRow({ year, month, day, veggieId, isCurrent }) {
  const v = veggieId ? VM[veggieId] : null;
  const dateStr = month ? (year+"年"+month+"月"+(day?day+"日":"")) : (year+"年");
  return (
    <div style={{display:"flex",alignItems:"center",gap:14,padding:"10px 0",borderBottom:"1px solid "+C.inkLine}}>
      <div style={{width:72,flexShrink:0}}>
        <div style={{fontSize:13,color:isCurrent?C.indigo:C.inkFaint,fontFamily:HAND,letterSpacing:1}}>{dateStr}</div>
        {isCurrent && <span style={{fontSize:8,background:C.indigo,color:"#fff",padding:"1px 4px",fontFamily:HAND}}>本年</span>}
      </div>
      {v ? (
        <Fragment>
          <div style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid "+C.inkLine}}>
            <VeggieStamp id={v.id} size={32}/>
          </div>
          <div>
            <div style={{fontSize:14,letterSpacing:1}}>{v.name}</div>
            <div style={{fontSize:10,color:C.inkFaint,fontFamily:HAND}}>{v.family}</div>
          </div>
        </Fragment>
      ) : (
        <span style={{fontSize:12,color:C.inkFaint,fontFamily:HAND}}>— 記録なし</span>
      )}
    </div>
  );
}

function RotSummary({ year, veggieId, history }) {
  const entries=(veggieId?[{year:year,veggieId:veggieId}]:[]).concat(history).sort(function(a,b){return b.year-a.year;});
  const fams=entries.map(function(e){return VM[e.veggieId]&&VM[e.veggieId].family;}).filter(Boolean);
  let maxC=1,cur=1;
  for(let i=1;i<fams.length;i++){
    if(fams[i]===fams[i-1]){cur++;if(cur>maxC)maxC=cur;}else cur=1;
  }
  if(entries.length<2) return null;
  return (
    <div style={{marginTop:16,padding:"14px 16px",borderLeft:"4px solid "+(maxC>=3?C.red:maxC>=2?C.orange:C.green),background:maxC>=3?C.redPale:maxC>=2?C.orangePale:C.greenPale}}>
      <div style={{fontSize:11,color:C.inkFaint,letterSpacing:3,marginBottom:6,fontFamily:HAND}}>連作チェック</div>
      {maxC>=3&&<div style={{fontSize:13,color:C.red,fontFamily:HAND,letterSpacing:.5}}>同じ科が{maxC}年連続。土の休養が必要です。</div>}
      {maxC===2&&<div style={{fontSize:13,color:C.orange,fontFamily:HAND,letterSpacing:.5}}>2年連続。来年は別の科をお勧めします。</div>}
      {maxC<2&&<div style={{fontSize:13,color:C.green,fontFamily:HAND,letterSpacing:.5}}>連作の問題はありません。</div>}
    </div>
  );
}

/* ══════════════════════════════════════
   印刷モーダル（畝テーブル方式）
══════════════════════════════════════ */
function PrintModal({ farm, year, farms, plantings, ridges, soil, snapOverride, onClose }) {
  const [selYear, setSelYear] = useState(snapOverride ? snapOverride.year : year);

  /* snapOverride があれば固定、なければ年選択 */
  var isSnap = !!snapOverride;
  var activeRidges = isSnap ? (snapOverride.ridges || {}) : (ridges[farm.id] || {});
  var activePlantings = isSnap ? (snapOverride.plantings || {}) : ((plantings[farm.id] && plantings[farm.id][selYear]) || {});
  var activeYear = isSnap ? snapOverride.year : selYear;

  /* スナップの記録日表示用 */
  var snapDateStr = "";
  if (isSnap) {
    var sd = new Date(snapOverride.ts);
    snapDateStr = sd.getFullYear()+"年"+(sd.getMonth()+1)+"月"+sd.getDate()+"日 記録";
  }

  const allYears = (function(){
    const ys = new Set();
    farms.forEach(function(f){
      const fd = plantings[f.id] || {};
      Object.keys(fd).forEach(function(y){ ys.add(parseInt(y)); });
    });
    ys.add(year);
    return Array.from(ys).sort(function(a,b){ return b-a; });
  })();

  const fid = farm.id;
  const ridgeList = Object.values(activeRidges);
  const yp = activePlantings;

  /* SVGフィールドを文字列で組み立て（印刷用） */
  function buildSVG() {
    var CS2 = 54; /* 印刷用グリッドサイズ（px） */
    var RW2 = RWIDTH;
    var lm = farm.landmarks || {};
    var PAD = 42;
    var padT=0, padB=0, padL=0, padR=0;
    for (var c=0; c<farm.cols; c++) { if(lm["top-"+c]){padT=PAD;break;} }
    for (var c=0; c<farm.cols; c++) { if(lm["bot-"+c]){padB=PAD;break;} }
    for (var r=0; r<farm.rows; r++) { if(lm["lft-"+r]){padL=PAD;break;} }
    for (var r=0; r<farm.rows; r++) { if(lm["rgt-"+r]){padR=PAD;break;} }
    var W = farm.cols * CS2, H = farm.rows * CS2;
    var SVG_W = padL + W + padR, SVG_H = padT + H + padB;

    var parts = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+SVG_W+' '+SVG_H+'" width="'+SVG_W+'" height="'+SVG_H+'">'];
    /* 背景 */
    parts.push('<rect width="'+SVG_W+'" height="'+SVG_H+'" fill="#f2edd8"/>');
    /* 土 */
    parts.push('<rect x="'+padL+'" y="'+padT+'" width="'+W+'" height="'+H+'" fill="#d4c89c"/>');
    /* 非活性マスク */
    farm.grid.forEach(function(row,r){
      row.forEach(function(active,c){
        if(!active) parts.push('<rect x="'+(padL+c*CS2)+'" y="'+(padT+r*CS2)+'" width="'+CS2+'" height="'+CS2+'" fill="#f2edd8" opacity="0.9"/>');
      });
    });
    /* 非活性区画の目印（inner-r-c） */
    farm.grid.forEach(function(row,r){
      row.forEach(function(active,c){
        if(active) return;
        var it = lm["inner-"+r+"-"+c];
        if(!it) return;
        var cx2=padL+c*CS2+CS2/2, cy2=padT+r*CS2+CS2/2;
        var fs=Math.min(CS2*0.52,24);
        parts.push('<text x="'+cx2+'" y="'+(cy2)+'" text-anchor="middle" dominant-baseline="middle" font-size="'+fs+'">'+it.icon+'</text>');
        parts.push('<text x="'+cx2+'" y="'+(cy2+fs*0.62)+'" text-anchor="middle" font-size="'+Math.min(CS2*0.18,8)+'" fill="#8a7a60" font-family="serif">'+(it.memo||it.label)+'</text>');
      });
    });
    /* 外周境界線 */
    farm.grid.forEach(function(row,r){
      row.forEach(function(active,c){
        if(!active) return;
        var x1=padL+c*CS2, y1=padT+r*CS2, x2=padL+(c+1)*CS2, y2=padT+(r+1)*CS2;
        if(r===0||!farm.grid[r-1][c])                           parts.push('<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y1+'" stroke="#1c1408" stroke-width="1.5"/>');
        if(r===farm.rows-1||!farm.grid[r+1]||!farm.grid[r+1][c]) parts.push('<line x1="'+x1+'" y1="'+y2+'" x2="'+x2+'" y2="'+y2+'" stroke="#1c1408" stroke-width="1.5"/>');
        if(c===0||!farm.grid[r][c-1])                           parts.push('<line x1="'+x1+'" y1="'+y1+'" x2="'+x1+'" y2="'+y2+'" stroke="#1c1408" stroke-width="1.5"/>');
        if(c===farm.cols-1||!farm.grid[r][c+1])                 parts.push('<line x1="'+x2+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="#1c1408" stroke-width="1.5"/>');
      });
    });
    /* 畝 */
    ridgeList.forEach(function(ridge){
      var pl = yp[ridge.id], vid = pl&&pl.vid, vg = vid?VM[vid]:null;
      var rr;
      if(ridge.orientation==="H") rr={x:padL+(ridge.gx-ridge.gl/2)*CS2, y:padT+(ridge.gy-RW2/2)*CS2, w:ridge.gl*CS2, h:RW2*CS2};
      else rr={x:padL+(ridge.gx-RW2/2)*CS2, y:padT+(ridge.gy-ridge.gl/2)*CS2, w:RW2*CS2, h:ridge.gl*CS2};
      var cx=rr.x+rr.w/2, cy=rr.y+rr.h/2;
      var sz=Math.min(rr.w,rr.h);
      parts.push('<rect x="'+rr.x+'" y="'+rr.y+'" width="'+rr.w+'" height="'+rr.h+'" fill="#e0d4a8" stroke="#1c1408" stroke-width="1" rx="2"/>');
      if(vg) {
        var nameFontSize = Math.min(sz*0.28, 9);
        var nameText = vg.name;
        /* 野菜名：中央に白背景付きで黒文字。モノクロ印刷でも読みやすい */
        var nameW = nameText.length * nameFontSize * 0.72 + 4;
        var nameH = nameFontSize + 3;
        parts.push('<rect x="'+(cx-nameW/2)+'" y="'+(cy-nameH/2)+'" width="'+nameW+'" height="'+nameH+'" fill="white" opacity="0.85" rx="1"/>');
        parts.push('<text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central" font-size="'+nameFontSize+'" fill="#1c1408" font-family="serif" font-weight="bold">'+nameText+'</text>');
        /* 絵文字は小さく左上隅に添える */
        if(sz > 22) {
          var emFs = Math.min(sz*0.28, 11);
          parts.push('<text x="'+(rr.x+3)+'" y="'+(rr.y+3)+'" dominant-baseline="hanging" font-size="'+emFs+'" opacity="0.7">'+vg.mark+'</text>');
        }
      } else {
        /* 野菜未設定の畝名 */
        var ridgeNameFs = Math.min(sz*0.25, 8);
        parts.push('<text x="'+cx+'" y="'+cy+'" text-anchor="middle" dominant-baseline="central" font-size="'+ridgeNameFs+'" fill="#7a6848" font-family="serif">'+ridge.name+'</text>');
      }
    });
    /* 目印 */
    var LF = Math.min(PAD*0.5, 18);
    var LLF = Math.min(PAD*0.18, 8);
    function lmCell(item, cx, cy) {
      parts.push('<text x="'+cx+'" y="'+(cy-2)+'" text-anchor="middle" dominant-baseline="middle" font-size="'+LF+'">'+item.icon+'</text>');
      parts.push('<text x="'+cx+'" y="'+(cy+LF*0.6)+'" text-anchor="middle" font-size="'+LLF+'" fill="#8a7a60" font-family="serif">'+(item.memo||item.label)+'</text>');
    }
    if(padT>0) { for(var c=0;c<farm.cols;c++){var it=lm["top-"+c];if(it)lmCell(it,padL+c*CS2+CS2/2,padT/2);} }
    if(padB>0) { for(var c=0;c<farm.cols;c++){var it=lm["bot-"+c];if(it)lmCell(it,padL+c*CS2+CS2/2,padT+H+padB/2);} }
    if(padL>0) { for(var r=0;r<farm.rows;r++){var it=lm["lft-"+r];if(it)lmCell(it,padL/2,padT+r*CS2+CS2/2);} }
    if(padR>0) { for(var r=0;r<farm.rows;r++){var it=lm["rgt-"+r];if(it)lmCell(it,padL+W+padR/2,padT+r*CS2+CS2/2);} }
    /* 目印区切り線 */
    if(padT>0) parts.push('<line x1="'+padL+'" y1="'+padT+'" x2="'+(padL+W)+'" y2="'+padT+'" stroke="#c8b888" stroke-width="0.8" stroke-dasharray="3 2"/>');
    if(padB>0) parts.push('<line x1="'+padL+'" y1="'+(padT+H)+'" x2="'+(padL+W)+'" y2="'+(padT+H)+'" stroke="#c8b888" stroke-width="0.8" stroke-dasharray="3 2"/>');
    if(padL>0) parts.push('<line x1="'+padL+'" y1="'+padT+'" x2="'+padL+'" y2="'+(padT+H)+'" stroke="#c8b888" stroke-width="0.8" stroke-dasharray="3 2"/>');
    if(padR>0) parts.push('<line x1="'+(padL+W)+'" y1="'+padT+'" x2="'+(padL+W)+'" y2="'+(padT+H)+'" stroke="#c8b888" stroke-width="0.8" stroke-dasharray="3 2"/>');

    parts.push('</svg>');
    return parts.join('');
  }

  function doPrint() {
    var northAngles = {N:0,NE:45,E:90,SE:135,S:180,SW:225,W:270,NW:315};
    var angle = northAngles[farm.northDir] || 0;
    var svgStr = buildSVG();

    /* 畝テーブルHTML */
    var tableRows = ridgeList.map(function(ridge){
      var pl=yp[ridge.id], vid=pl&&pl.vid, vg=vid?VM[vid]:null;
      var warn = checkRot(fid, ridge.id, activeYear, plantings, soil, activeRidges);
      var warnTd = warn==="danger" ? '<td class="wd">連作注意</td>' : warn==="caution" ? '<td class="wc">要注意</td>' : '<td>—</td>';
      return '<tr><td>'+ridge.name+'</td><td>'+(vg?vg.mark+' '+vg.name:'—')+'</td><td>'+(vg?vg.family:'')+'</td><td>'+(pl&&pl.month?pl.month+'月'+(pl.day?pl.day+'日':''):'—')+'</td>'+warnTd+'</tr>';
    }).join('');

    var titleRight = isSnap
      ? ('ハタケボ 作付け帳　　'+activeYear+'年　　変遷記録：'+snapDateStr)
      : ('ハタケボ 作付け帳　　'+activeYear+'年　　印刷日：'+new Date().toLocaleDateString('ja-JP'));

    var w = window.open('','_blank','width=900,height=700');
    w.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>ハタケボ — '+farm.name+'</title>');
    w.document.write('<style>');
    w.document.write('*{box-sizing:border-box;margin:0;padding:0;}');
    w.document.write('body{font-family:"Hiragino Mincho ProN","Yu Mincho",Georgia,serif;color:#1c1408;background:#fff;font-size:10pt;}');
    w.document.write('@page{size:A4;margin:16mm 14mm;}');
    w.document.write('.page{width:100%;max-width:178mm;margin:0 auto;}');
    w.document.write('header{display:flex;align-items:baseline;justify-content:space-between;border-bottom:2pt solid #1c1408;padding-bottom:8pt;margin-bottom:14pt;}');
    w.document.write('header h1{font-size:20pt;letter-spacing:6pt;font-weight:normal;}');
    w.document.write('header .meta{font-size:9pt;color:#7a6848;letter-spacing:1pt;}');
    w.document.write('.field-area{display:flex;align-items:flex-start;gap:16pt;margin-bottom:14pt;}');
    w.document.write('.north{font-size:8pt;color:#3d4f8c;letter-spacing:2pt;margin-bottom:6pt;display:flex;align-items:center;gap:4pt;}');
    w.document.write('.north .arrow{font-size:16pt;display:inline-block;transform:rotate('+angle+'deg);line-height:1;}');
    w.document.write('table{width:100%;border-collapse:collapse;font-size:9pt;}');
    w.document.write('th{text-align:left;border-bottom:1pt solid #1c1408;padding:4pt 6pt;font-size:8pt;letter-spacing:1pt;color:#7a6848;font-weight:normal;}');
    w.document.write('td{padding:5pt 6pt;border-bottom:0.5pt solid #c8b898;vertical-align:middle;}');
    w.document.write('td.wd{color:#8c2a2a;font-weight:bold;}td.wc{color:#8a5010;}');
    w.document.write('.section-title{font-size:11pt;letter-spacing:3pt;font-weight:normal;margin:0 0 8pt;padding-bottom:4pt;border-bottom:0.5pt solid #c8b898;}');
    w.document.write('footer{margin-top:14pt;border-top:0.5pt solid #c8b898;padding-top:5pt;font-size:7pt;color:#b09060;display:flex;justify-content:space-between;}');
    w.document.write('</style></head><body>');
    w.document.write('<div class="page">');
    w.document.write('<header><h1>'+farm.name+'</h1><div class="meta">'+titleRight+'</div></header>');
    w.document.write('<div class="north"><span class="arrow">↑</span><span>北</span></div>');
    w.document.write('<div class="field-area">');
    w.document.write('<div>'+svgStr+'</div>');
    w.document.write('</div>');
    if(ridgeList.length > 0){
      w.document.write('<p class="section-title">畝一覧</p>');
      w.document.write('<table><thead><tr><th>畝名</th><th>作物</th><th>科</th><th>植付日</th><th>連作</th></tr></thead><tbody>'+tableRows+'</tbody></table>');
    }
    w.document.write('<footer><span>ハタケボ 畑の帳簿'+(isSnap?' — 変遷記録':'')+'</span><span>'+farm.name+'　'+activeYear+'年</span></footer>');
    w.document.write('</div></body></html>');
    w.document.close();
    setTimeout(function(){ w.print(); }, 400);
  }

  /* プレビュー用SVG（React版） */
  function PreviewField() {
    var CS2 = 48;
    var RW2 = RWIDTH;
    var lm = farm.landmarks || {};
    var PAD = 36;
    var padT=0, padB=0, padL=0, padR=0;
    for (var c=0; c<farm.cols; c++) { if(lm["top-"+c]){padT=PAD;break;} }
    for (var c=0; c<farm.cols; c++) { if(lm["bot-"+c]){padB=PAD;break;} }
    for (var r=0; r<farm.rows; r++) { if(lm["lft-"+r]){padL=PAD;break;} }
    for (var r=0; r<farm.rows; r++) { if(lm["rgt-"+r]){padR=PAD;break;} }
    var W = farm.cols*CS2, H = farm.rows*CS2;
    var SVG_W = padL+W+padR, SVG_H = padT+H+padB;
    var LF = Math.min(PAD*0.5,16);

    return (
      <svg viewBox={"0 0 "+SVG_W+" "+SVG_H} width={SVG_W} height={SVG_H} style={{display:"block",maxWidth:"100%"}}>
        <rect width={SVG_W} height={SVG_H} fill={C.paper2}/>
        <rect x={padL} y={padT} width={W} height={H} fill="#d4c89c"/>
        {farm.grid.flatMap(function(row,r){ return row.map(function(active,c){
          if(active) return null;
          return <rect key={"m"+r+c} x={padL+c*CS2} y={padT+r*CS2} width={CS2} height={CS2} fill={C.paper} opacity={0.9}/>;
        }).filter(Boolean); })}
        {/* 非活性区画の目印 */}
        {farm.grid.flatMap(function(row,r){ return row.map(function(active,c){
          if(active) return null;
          var it=lm["inner-"+r+"-"+c]; if(!it) return null;
          var cx2=padL+c*CS2+CS2/2,cy2=padT+r*CS2+CS2/2,fs=Math.min(CS2*0.52,22);
          return (<g key={"lmI"+r+c}><text x={cx2} y={cy2} textAnchor="middle" dominantBaseline="middle" fontSize={fs}>{it.icon}</text><text x={cx2} y={cy2+fs*0.62} textAnchor="middle" fontSize={Math.min(CS2*0.18,8)} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text></g>);
        }).filter(Boolean); })}
        {farm.grid.flatMap(function(row,r){ var ls=[]; row.forEach(function(active,c){
          if(!active) return;
          var x1=padL+c*CS2,y1=padT+r*CS2,x2=padL+(c+1)*CS2,y2=padT+(r+1)*CS2;
          if(r===0||!farm.grid[r-1][c]) ls.push(<line key={"t"+r+c} x1={x1} y1={y1} x2={x2} y2={y1} stroke={C.ink} strokeWidth={1.5}/>);
          if(r===farm.rows-1||!farm.grid[r+1]||!farm.grid[r+1][c]) ls.push(<line key={"b"+r+c} x1={x1} y1={y2} x2={x2} y2={y2} stroke={C.ink} strokeWidth={1.5}/>);
          if(c===0||!farm.grid[r][c-1]) ls.push(<line key={"l"+r+c} x1={x1} y1={y1} x2={x1} y2={y2} stroke={C.ink} strokeWidth={1.5}/>);
          if(c===farm.cols-1||!farm.grid[r][c+1]) ls.push(<line key={"r"+r+c} x1={x2} y1={y1} x2={x2} y2={y2} stroke={C.ink} strokeWidth={1.5}/>);
        }); return ls; }).flat().filter(Boolean)}
        {ridgeList.map(function(ridge){
          var pl=yp[ridge.id],vid=pl&&pl.vid,vg=vid?VM[vid]:null;
          var rr;
          if(ridge.orientation==="H") rr={x:padL+(ridge.gx-ridge.gl/2)*CS2,y:padT+(ridge.gy-RW2/2)*CS2,w:ridge.gl*CS2,h:RW2*CS2};
          else rr={x:padL+(ridge.gx-RW2/2)*CS2,y:padT+(ridge.gy-ridge.gl/2)*CS2,w:RW2*CS2,h:ridge.gl*CS2};
          var cx=rr.x+rr.w/2,cy=rr.y+rr.h/2,sz=Math.min(rr.w,rr.h);
          var nameFontSize = Math.min(sz*0.28, 9);
          var nameText = vg ? vg.name : ridge.name;
          var nameW = nameText.length * nameFontSize * 0.75 + 4;
          var nameH = nameFontSize + 3;
          return (
            <g key={ridge.id}>
              <rect x={rr.x} y={rr.y} width={rr.w} height={rr.h} fill="#e0d4a8" stroke={C.inkBorder} strokeWidth={1} rx={2}/>
              {/* 野菜名：白背景付き黒文字でモノクロ対応 */}
              <rect x={cx-nameW/2} y={cy-nameH/2} width={nameW} height={nameH} fill="white" opacity={0.85} rx={1}/>
              <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={nameFontSize} fill={C.ink} fontFamily={SERIF} fontWeight="bold">{nameText}</text>
              {/* 絵文字は小さく左上隅に */}
              {vg&&sz>22&&<text x={rr.x+3} y={rr.y+3} dominantBaseline="hanging" fontSize={Math.min(sz*0.28,11)} opacity={0.7}>{vg.mark}</text>}
            </g>
          );
        })}
        {/* 目印 */}
        {padT>0&&Array.from({length:farm.cols},function(_,c){var it=lm["top-"+c];if(!it)return null;var cx=padL+c*CS2+CS2/2;return(<g key={c}><text x={cx} y={padT/2} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text><text x={cx} y={padT/2+LF*0.6} textAnchor="middle" fontSize={Math.min(PAD*0.17,7)} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text></g>);}).filter(Boolean)}
        {padB>0&&Array.from({length:farm.cols},function(_,c){var it=lm["bot-"+c];if(!it)return null;var cx=padL+c*CS2+CS2/2,cy=padT+H+PAD/2;return(<g key={c}><text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text><text x={cx} y={cy+LF*0.6} textAnchor="middle" fontSize={Math.min(PAD*0.17,7)} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text></g>);}).filter(Boolean)}
        {padL>0&&Array.from({length:farm.rows},function(_,r){var it=lm["lft-"+r];if(!it)return null;var cy=padT+r*CS2+CS2/2;return(<g key={r}><text x={padL/2} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text><text x={padL/2} y={cy+LF*0.6} textAnchor="middle" fontSize={Math.min(PAD*0.17,7)} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text></g>);}).filter(Boolean)}
        {padR>0&&Array.from({length:farm.rows},function(_,r){var it=lm["rgt-"+r];if(!it)return null;var cy=padT+r*CS2+CS2/2,cx=padL+W+PAD/2;return(<g key={r}><text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={LF}>{it.icon}</text><text x={cx} y={cy+LF*0.6} textAnchor="middle" fontSize={Math.min(PAD*0.17,7)} fill={C.inkFaint} fontFamily={SERIF}>{it.memo||it.label}</text></g>);}).filter(Boolean)}
        {padT>0&&<line x1={padL} y1={padT} x2={padL+W} y2={padT} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
        {padB>0&&<line x1={padL} y1={padT+H} x2={padL+W} y2={padT+H} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
        {padL>0&&<line x1={padL} y1={padT} x2={padL} y2={padT+H} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
        {padR>0&&<line x1={padL+W} y1={padT} x2={padL+W} y2={padT+H} stroke={C.inkLine} strokeWidth={0.8} strokeDasharray="3 2"/>}
      </svg>
    );
  }

  var northAngles = {N:0,NE:45,E:90,SE:135,S:180,SW:225,W:270,NW:315};
  var northAngle = northAngles[farm.northDir] || 0;

  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(28,20,8,0.55)",display:"flex",alignItems:"flex-start",justifyContent:"center",overflowY:"auto",padding:"24px 16px"}}
      onClick={onClose}>
      <div style={{background:C.paper,border:"2px solid "+C.ink,width:"100%",maxWidth:680,boxShadow:"6px 6px 0 "+C.inkFaint,display:"flex",flexDirection:"column",maxHeight:"92vh"}}
        onClick={function(e){e.stopPropagation();}}>

        {/* ヘッダー */}
        <div style={{padding:"16px 20px",borderBottom:"2px solid "+C.ink,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <div style={{flex:1}}>
            <div style={{fontSize:11,color:C.inkFaint,letterSpacing:3,fontFamily:HAND}}>
              {isSnap ? "変遷記録 — 印刷プレビュー" : "印刷プレビュー"}
            </div>
            <div style={{fontSize:17,letterSpacing:3,marginTop:2}}>{farm.name}</div>
            {isSnap && (
              <div style={{fontSize:11,color:C.indigo,fontFamily:HAND,marginTop:3,letterSpacing:1}}>
                {snapDateStr}　{activeYear}年
              </div>
            )}
          </div>
          {/* 年選択（通常印刷のみ） */}
          {!isSnap && (
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {allYears.map(function(y){
                var sel = selYear === y;
                return (
                  <button key={y} onClick={function(){setSelYear(y);}}
                    style={{padding:"5px 12px",border:"1px solid "+(sel?C.ink:C.inkLine),background:sel?C.ink:"transparent",color:sel?C.paper:C.inkFaint,fontSize:12,cursor:"pointer",fontFamily:SERIF}}>
                    {y}年
                  </button>
                );
              })}
            </div>
          )}
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:C.inkFaint,flexShrink:0}}>×</button>
        </div>

        {/* プレビュー本体 */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 20px 0"}}>

          {/* 北矢印 */}
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
            <span style={{fontSize:16,display:"inline-block",transform:"rotate("+northAngle+"deg)",lineHeight:1,color:C.indigo}}>↑</span>
            <span style={{fontSize:10,color:C.indigo,fontFamily:HAND,letterSpacing:2}}>北</span>
            <span style={{fontSize:11,color:C.inkFaint,fontFamily:HAND,marginLeft:10}}>{activeYear}年の作付け</span>
          </div>

          {/* 畑の図 */}
          <div style={{border:"1.5px solid "+C.ink,display:"inline-block",overflowX:"auto",maxWidth:"100%",marginBottom:16}}>
            <PreviewField/>
          </div>

          {/* 畝一覧テーブル */}
          {ridgeList.length > 0 && (
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,letterSpacing:3,color:C.inkFaint,fontFamily:HAND,marginBottom:8,borderBottom:"1px solid "+C.inkLine,paddingBottom:4}}>畝一覧</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:HAND}}>
                <thead>
                  <tr>
                    {["畝名","作物","科","植付日","連作"].map(function(h){
                      return <th key={h} style={{textAlign:"left",padding:"5px 8px",borderBottom:"1px solid "+C.ink,fontSize:10,color:C.inkFaint,letterSpacing:1,fontWeight:"normal"}}>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {ridgeList.map(function(ridge){
                    var pl=yp[ridge.id],vid=pl&&pl.vid,vg=vid?VM[vid]:null;
                    var warn=checkRot(fid,ridge.id,activeYear,plantings,soil,activeRidges);
                    return (
                      <tr key={ridge.id}>
                        <td style={{padding:"5px 8px",borderBottom:"1px solid "+C.inkLine}}>{ridge.name}</td>
                        <td style={{padding:"5px 8px",borderBottom:"1px solid "+C.inkLine}}>{vg?vg.mark+" "+vg.name:"—"}</td>
                        <td style={{padding:"5px 8px",borderBottom:"1px solid "+C.inkLine,color:C.inkFaint}}>{vg?vg.family:""}</td>
                        <td style={{padding:"5px 8px",borderBottom:"1px solid "+C.inkLine}}>{pl&&pl.month?pl.month+"月"+(pl.day?pl.day+"日":""):"—"}</td>
                        <td style={{padding:"5px 8px",borderBottom:"1px solid "+C.inkLine,color:warn==="danger"?C.red:warn==="caution"?C.orange:"",fontWeight:warn?"bold":"normal"}}>
                          {warn==="danger"?"連作注意":warn==="caution"?"要注意":"—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* フッターボタン */}
        <div style={{borderTop:"1px solid "+C.inkLine,display:"flex",gap:10,padding:"14px 20px",flexShrink:0}}>
          <button onClick={onClose}
            style={{flex:1,padding:"12px",border:"1px solid "+C.inkBorder,background:"transparent",color:C.inkFaint,fontSize:13,cursor:"pointer",fontFamily:SERIF,letterSpacing:1}}>
            とじる
          </button>
          <button onClick={doPrint}
            style={{flex:2,padding:"12px",border:"2px solid "+C.ink,background:C.ink,color:C.paper,fontSize:14,cursor:"pointer",fontFamily:SERIF,letterSpacing:2,boxShadow:"3px 3px 0 "+C.inkFaint,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span>🖨</span> 印刷する
          </button>
        </div>
      </div>
    </div>
  );
}


    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<HatakeApp />);
  