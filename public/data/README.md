# data

## followerSkin.json

```cs
foreach (WorshipperData.SkinAndData followerSkin in WorshipperData.Instance.Characters)
{
    string str = "";
    foreach (WorshipperData.CharacterSkin skin in followerSkin.Skin)
        str += $"\"{skin.Skin}\", ";

    Log("{\n" + $"\"name\": \"{followerSkin.Title}\",\n\"variant\": [{str}]" + "\n},");
}
```
