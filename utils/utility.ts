export const necklaceMap = new Map([
  [45, 1],
  [46, 2],
  [47, 3],
  [48, 4],
  [49, 5],
]);
/*
  Rags,
  Sherpa,
  Warrior,
  Follower,
  Custom,
  Worshipper,
  Worker,
  Old,
  Holiday,
  HorseTown,
  Ghost,
*/
export const outfitMap = new Map([
  [0, "Clothes/Rags"],
  [1, "Clothes/Sherpa"],
  [2, null],
  [3, null],
  [4, null],
  [5, null],
  [6, null],
  [7, "Other/Old"],
  [8, "Clothes/Holiday"],
  [9, "Other/Ghost"],
]);

/**
 * https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively
 * @param object - the object
 * @param key - the key
 * @return value
 */
export const getPropertyCaseInsensitive = (object: any, key: string): any => {
  if (!object) return undefined;

  console.log(object, key);

  const asLowercase = key.toLowerCase();
  return object[
    (Object.keys(object).find((k: string) => k.toLowerCase() === asLowercase) ??
      key) as string
  ];
};

/**
 * https://stackoverflow.com/questions/12484386/access-javascript-property-case-insensitively
 * @param object - the object
 * @param key - the key
 * @param value - the value
 */
export const setPropertyCaseInsensitive = (
  object: any,
  key: string,
  value: any
): any => {
  if (!object) return undefined;

  const asLowercase = key.toLowerCase();
  object[
    Object.keys(object).find((k: string) => k.toLowerCase() === asLowercase) ??
      key
  ] = value;
};

export const generateObjectInsensitiveComputed = (
  objFunc: () => any,
  property: string
) =>
  computed({
    get() {
      return getPropertyCaseInsensitive(objFunc(), property);
    },
    set(value) {
      setPropertyCaseInsensitive(objFunc(), property, value);
    },
  });

export const constructFollowerPreviewUrl = (
  follower: any,
  headOnly = false
): string => {
  const url = new URL(
    `https://cotl.xl0.org/v1/follower/${getPropertyCaseInsensitive(
      follower,
      "SkinName"
    )}`
  );

  url.searchParams.append(
    "colour_set",
    getPropertyCaseInsensitive(follower, "SkinColour")
  );

  let illnessThreshold = 50;
  if (follower.Traits.includes(16)) illnessThreshold = 75;
  else if (follower.Traits.includes(15)) illnessThreshold = 25;

  const isIll = follower.Illness >= illnessThreshold;
  const isStraving = getPropertyCaseInsensitive(follower, "Starvation") >= 30;
  const isTired = getPropertyCaseInsensitive(follower, "Exhaustion") >= 20;
  const isDissenting =
    getPropertyCaseInsensitive(follower, "DissentDuration") > 0 ||
    getPropertyCaseInsensitive(follower, "Dissent") >= 80;
  const isAngry = 25 > getPropertyCaseInsensitive(follower, "Happiness");
  const isVeryAngry = 10 > getPropertyCaseInsensitive(follower, "Happiness");
  const isBrainwashed =
    getPropertyCaseInsensitive(follower, "BrainwashDuration") > 0;
  const isOld =
    getPropertyCaseInsensitive(follower, "OldAge") ||
    getPropertyCaseInsensitive(follower, "Outfit") === 7;
  const isGhost = getPropertyCaseInsensitive(follower, "Outfit") === 9;

  if (isOld) url.searchParams.append("add_skin", "Other/Old");

  if (isBrainwashed) url.searchParams.append("add_skin", "Other/Brainwashed");
  else if (isDissenting) url.searchParams.append("add_skin", "Other/Dissenter");

  let animation = "";
  if (headOnly) {
    if (isIll) animation = "Avatars/avatar-sick";
    else if (isStraving) animation = "Avatars/avatar-sad";
    else if (isTired) animation = "Avatars/avatar-tired";
    else if (isAngry) animation = "Avatars/avatar-unhappy";
    else if (isVeryAngry) animation = "Avatars/avatar-angry";
    else animation = "Avatars/avatar-normal";
  } else {
    if (isGhost) animation = "Ghost/idle-ghost";
    else if (isIll) animation = "Sick/idle-sick";
    else if (isStraving) animation = "Hungry/idle-hungry";
    else if (isTired) animation = "Fatigued/idle-fatigued";
    else animation = "idle";
  }
  url.searchParams.append("animation", animation);

  if (headOnly) {
    url.searchParams.append("start_time", "0");
    url.searchParams.append("format", "png");
    url.searchParams.append("only_head", "true");
  } else {
    url.searchParams.append("format", "apng");
    url.searchParams.append("fps", "60");

    if (
      getPropertyCaseInsensitive(follower, "Outfit") !== 7 &&
      outfitMap.get(getPropertyCaseInsensitive(follower, "Outfit")) != null
    )
      url.searchParams.append(
        "add_skin",
        outfitMap.get(getPropertyCaseInsensitive(follower, "Outfit"))!
      );

    if (getPropertyCaseInsensitive(follower, "Necklace") > 0)
      url.searchParams.append(
        "add_skin",
        `Necklaces/Necklace_${
          necklaceMap.get(getPropertyCaseInsensitive(follower, "Necklace")) ?? 0
        }`
      );

    if (getPropertyCaseInsensitive(follower, "TaxEnforcer"))
      url.searchParams.append("add_skin", "Hats/Enforcer");

    if (getPropertyCaseInsensitive(follower, "FaithEnforcer"))
      url.searchParams.append("add_skin", "Hats/FaithEnforcer");
  }

  return url.toString();
};
