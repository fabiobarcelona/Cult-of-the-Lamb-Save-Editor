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

export const constructFollowerPreviewUrl = (
  follower: any,
  headOnly = false
): string => {
  const url = new URL(
    `https://cotl.xl0.org/v1/follower/${follower.SkinName}${
      follower.SkinVariation > 1 ? follower.SkinVariation : ""
    }`
  );

  url.searchParams.append("colour_set", follower.SkinColour);

  let illnessThreshold = 50;
  if (follower.Traits.includes(20)) illnessThreshold = 20;
  else if (follower.Traits.includes(15)) illnessThreshold = 75;

  // TODO: Figure out how illness works
  // const isIll = follower.Illness >= illnessThreshold;
  const isIll = false;
  const isStraving = follower.Starvation >= 30;
  const isTired = follower.Exhaustion >= 20;
  const isDissenting = follower.DissentDuration > 0 || follower.Dissent >= 80;
  const isAngry = 25 > follower.Happiness;
  const isVeryAngry = 10 > follower.Happiness;
  const isBrainwashed = follower.BrainwashDuration > 0;
  const isOld = follower.OldAge || follower.Outfit === 7;
  const isGhost = follower.Outfit === 9;

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

    if (follower.Outfit !== 7 && outfitMap.get(follower.Outfit) != null)
      url.searchParams.append("add_skin", outfitMap.get(follower.Outfit)!);

    if (follower.Necklace > 0)
      url.searchParams.append(
        "add_skin",
        `Necklaces/Necklace_${necklaceMap.get(follower.Necklace) ?? 0}`
      );

    if (follower.TaxEnforcer)
      url.searchParams.append("add_skin", "Hats/Enforcer");

    if (follower.FaithEnforcer)
      url.searchParams.append("add_skin", "Hats/FaithEnforcer");
  }

  return url.toString();
};
