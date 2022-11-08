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
  [0, null],
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
      follower.SkinVariation > 0 ? follower.SkinVariation : ""
    }`
  );

  url.searchParams.append("colour_set", follower.SkinColour);

  if (follower.OldAge || follower.Outfit === 7) url.searchParams.append("add_skin", "Other/Old");

  if (follower.BrainwashedUntil > 0)
    url.searchParams.append("add_skin", "Other/Brainwashed");
  else if (follower.DissentDuration > 0)
    url.searchParams.append("add_skin", "Other/Dissenter");

  if (headOnly) {
    url.searchParams.append("start_time", "0");
    url.searchParams.append("format", "png");
    url.searchParams.append("only_head", "true");
    url.searchParams.append("animation", "Avatars/avatar-normal");
  } else {
    url.searchParams.append("format", "apng");
    url.searchParams.append("fps", "60");
    url.searchParams.append(
      "animation",
      follower.IsStarving > 0 ? "Hungry/idle-hungry" : "Avatars/idle"
    );

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
