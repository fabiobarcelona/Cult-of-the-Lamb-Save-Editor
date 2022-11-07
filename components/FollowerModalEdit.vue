<template>
    <div ref="followerModalElement" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ props.followerData.Name }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col">
                            <label>Follower ID:</label>
                            <input type="number" class="form-control" v-model="props.followerData.ID">
                            <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can
                                corrupt your save file, back up your save first.</span><br>

                            <label>Follower Level:</label>
                            <input type="number" class="form-control" v-model="props.followerData.XPLevel"><br>

                            <label>Follower Age:</label>
                            <input type="number" class="form-control" v-model="props.followerData.Age"><br>

                            <label>Follower Life Expectancy:</label>
                            <input type="number" class="form-control" v-model="props.followerData.LifeExpectancy"><br>
                        </div>
                        <div class="col">
                            <label>Follower Name:</label>
                            <input type="text" class="form-control" v-model="props.followerData.Name"><br>

                            <label>Day Joined:</label>
                            <input type="number" class="form-control" v-model="props.followerData.DayJoined"><br>

                            <label>Days in your Cult:</label>
                            <input type="number" class="form-control" v-model="props.followerData.MemberDuration"><br>

                            <label>Sacrificial Value:</label>
                            <input type="number" class="form-control" v-model="props.followerData.SacrificialValue"><br>
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <!-- TODO: Replace with actual stuff -->
                        <!-- <div class="col">
                            <label for="FollowerOutfit_1">Follower Outfit: <span class="text-muted"
                                    style="font-size:12px;">If the outfit isn't visible after editing, reload your
                                    game.</span></label>
                            <select class="form-select" id="FollowerOutfit_1"
                                onchange="document.getElementById('FollowerOutfitPreview_1').src = 'assets/Outfit_Preview/' + this.value + '.png' ">
                                <option value="0">Pre Indoctrination clothes</option>
                                <option value="1">Mission Backpack</option>
                                <option value="2">Warrior Armor and Sword</option>
                                <option value="3" selected="false">Indoctrinated Clothes</option>
                                <option value="7">Elderly Clothes</option>
                                <option value="8">Holiday Shirt</option>
                            </select>

                            <br>
                            <p>Outfit Preview:</p>
                            <img id="FollowerOutfitPreview_1" class="mx-auto d-block" src="assets/Outfit_Preview/3.png"
                                alt="Outfit Preview not available">

                            <hr>

                            <label for="FollowerSkinName_1">Follower Skin:</label>
                            <select class="form-select" id="FollowerSkinName_1"
                                onchange="document.getElementById('FollowerSkinNamePreview_1').src = 'assets/Follower_Forms/' + this.value + '.webp' ">
                                <option value="Cat">Cat</option>
                                <option value="Dog">Dog</option>
                                <option value="Pig">Pig</option>
                                <option value="Deer">Deer</option>
                                <option value="Fox" selected="">Fox</option>
                                <option value="Deer_ritual">Deer_ritual</option>
                                <option value="Boss Mama Worm">Boss Mama Worm</option>
                                <option value="Rabbit">Rabbit</option>
                                <option value="Boss Mama Maggot">Boss Mama Maggot</option>
                                <option value="Boss Burrow Worm">Boss Burrow Worm</option>
                                <option value="Cow">Cow</option>
                            </select>

                            <br>
                            <p>Skin Preview:</p>
                            <img id="FollowerSkinNamePreview_1" class="mx-auto d-block"
                                src="assets/Follower_Forms/Fox.webp" alt="Form Preview not available">
                        </div>
                        <div class="col">
                            <label for="FollowerNecklace_1">Follower Necklace: </label>
                            <select class="form-select" id="FollowerNecklace_1"
                                onchange="document.getElementById('FollowerNecklacePreview_1').src = 'assets/Necklace_Preview/' + this.value + '.png';
                                    document.getElementById('FollowerNecklacePreviewText_1').innerHTML = necklaceDescriptionsMap.get(this.value)">
                                <option value="0" selected="">-- None --</option>
                                <option value="45">Flower Necklace</option>
                                <option value="46">Feather Necklace</option>
                                <option value="47">Skull Necklace</option>
                                <option value="48">Natures Necklace</option>
                                <option value="49">Moon Necklace</option>
                            </select>

                            <br>
                            <p>Necklace Preview:</p>
                            <img id="FollowerNecklacePreview_1" class="mx-auto d-block"
                                src="assets/Necklace_Preview/0.png" alt="Necklace Preview not available" width="70px"
                                height="80px">
                            <div class="text-center mt-4">
                                <span id="FollowerNecklacePreviewText_1" class="text-muted mb-3"></span>
                            </div>
                        </div> -->
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col">
                            <input type="checkbox" class="form-check-input" name="FollowerIsStarving"
                                id="FollowerIsStarving_1">
                            <label class="form-check-label" for="FollowerIsStarving_1">Starving Indicator</label><br>

                            <input type="checkbox" class="form-check-input" name="FollowerMarriedToLeader"
                                id="FollowerMarriedToLeader_1">
                            <label class="form-check-label" for="FollowerMarriedToLeader_1">Married to
                                Leader</label><br>
                        </div>
                        <div class="col">
                            <input type="checkbox" class="form-check-input" name="FollowerTaxEnforcer"
                                id="FollowerTaxEnforcer_1">
                            <label class="form-check-label" for="FollowerTaxEnforcer_1">Tax Enforcer</label><br>

                            <input type="checkbox" class="form-check-input" name="FollowerFaithEnforcer"
                                id="FollowerFaithEnforcer_1">
                            <label class="form-check-label" for="FollowerFaithEnforcer_1">Faith Enforcer</label><br>
                        </div>
                    </div>

                    <br>

                    <div class="row">
                        <div class="col">
                            <h4>Follower Traits</h4>
                            <hr>
                            <table class="table">
                                <thead>
                                    <tr class="d-flex">
                                        <th class="col-1">Unlocked?</th>
                                        <th class="col-1">Image</th>
                                        <th class="col-1">Effect</th>
                                        <th class="col-3">Name</th>
                                        <th class="col-6">Description</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <!-- TODO: v-for -->
                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_123" value="23">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/23.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label"
                                                for="FollowerTraits_123">Coprophiliac</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_123">Gain 10 Faith when
                                                falling ill.</label>
                                        </td>
                                    </tr>
                                    <!-- 
                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_121" value="21">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/21.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_121">Gullible</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_121">15% easier to level
                                                up.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_111" value="11">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/11.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_111">Faithful</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_111">Generates Devotion
                                                15% faster.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_124" value="24">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/24.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_124">Industrious</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_124">Increased work
                                                speed by 15%.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_118" value="18">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/18.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label"
                                                for="FollowerTraits_118">Materialistic</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_118">Gain Faith when
                                                building better sleeping quarters.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_12" value="2">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/2.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_12">Naturally
                                                Obedient</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_12">On recruiting this
                                                Follower immediately gain 10 Faith.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_116" value="16">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/16.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_116">Strong
                                                Constitution</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_116">Heals 15% faster
                                                when sick and in bed rest.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_117" value="17">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/17.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_117">Zealous</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_117">Ignores dissenters
                                                when they preach.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_132" value="32">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/32.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-success">Positive</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_132">Immortal</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_132">Will never reach
                                                old age.</label>
                                        </td>
                                    </tr>



                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_120" value="20">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/20.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_120">Cynical</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_120">15% harder to level
                                                up.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_112" value="12">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/12.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_112">Faithless</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_112">Generates Devotion
                                                15% slower.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_122" value="22">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/22.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_122">Germaphobe</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_122">Lose 10 Faith when
                                                falling ill.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_11" value="1">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/1.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_11">Natural
                                                Skeptic</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_11">On recruiting
                                                Follower immediately lose 10 Faith.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_115" value="15">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/15.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_115">Sickly</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_115">Heals 15% slower
                                                when sick and in bed rest.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_125" value="25">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/25.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_125">Sloth</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_125">Work and devotion
                                                generation speed reduced by 10%.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_14" value="4">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/4.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_14">Terrified of
                                                Death</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_14">Lose -5 Faith
                                                whenever another Follower dies.</label>
                                        </td>
                                    </tr>

                                    <tr class="d-flex">
                                        <td class="col-1">
                                            <input type="checkbox" class="form-check-input" name="FollowerTraits_1"
                                                id="FollowerTraits_110" value="10">
                                        </td>
                                        <td class="col-1" style="background-color:black;">
                                            <img src="assets/Traits/10.png" alt="Trait Preview not available">
                                        </td>
                                        <td class="col-1">
                                            <span class="text-danger">Negative</span>
                                        </td>
                                        <td class="col-3">
                                            <label class="form-check-label" for="FollowerTraits_110">Against
                                                Sacrifice</label>
                                        </td>
                                        <td class="col-6">
                                            <label class="form-check-label" for="FollowerTraits_110">-5 Faith when a
                                                Follower is Sacrificed.</label>
                                        </td>
                                    </tr> -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col">
                            <label for="FollowerAdoration_1">Adoration (XP to next level): </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerAdoration_1"
                                value="10" oninput="$('#FollowerAdorationRange_1').html($(this).val())">
                            <p id="FollowerAdorationRange_1">10</p>

                            <label for="FollowerFaith_1">Faith: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerFaith_1"
                                value="50" oninput="$('#FollowerFaithRange_1').html($(this).val())">
                            <p id="FollowerFaithRange_1">50</p>

                            <label for="FollowerHappiness_1">Happiness: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerHappiness_1"
                                value="72" oninput="$('#FollowerHappinessRange_1').html($(this).val())">
                            <p id="FollowerHappinessRange_1">72</p>

                            <label for="FollowerIllness_1">Illness: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerIllness_1"
                                value="0" oninput="$('#FollowerIllnessRange_1').html($(this).val())">
                            <p id="FollowerIllnessRange_1">0</p>

                            <label for="FollowerReeducation_1">Reeducation: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerReeducation_1"
                                value="64" oninput="$('#FollowerReeducationRange_1').html($(this).val())">
                            <p id="FollowerReeducationRange_1">64</p>
                        </div>
                        <div class="col">
                            <label for="FollowerExhaustion_1">Exhaustion: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerExhaustion_1"
                                value="0" oninput="$('#FollowerExhaustionRange_1').html($(this).val())">
                            <p id="FollowerExhaustionRange_1">0</p>

                            <label for="FollowerRest_1">Rest: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerRest_1"
                                value="22" oninput="$('#FollowerRestRange_1').html($(this).val())">
                            <p id="FollowerRestRange_1">22</p>

                            <label for="FollowerStarvation_1">Starvation: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerStarvation_1"
                                value="0" oninput="$('#FollowerStarvationRange_1').html($(this).val())">
                            <p id="FollowerStarvationRange_1">0</p>

                            <label for="FollowerSatiation_1">Satiation: </label>
                            <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerSatiation_1"
                                value="29" oninput="$('#FollowerSatiationRange_1').html($(this).val())">
                            <p id="FollowerSatiationRange_1">29</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Modal } from "bootstrap";

const followerModalElement = ref<HTMLElement>();
const followerModal = ref<Modal>();

onMounted(() => {
    if (!followerModalElement.value) return;

    followerModal.value = new Modal(followerModalElement.value, {
        keyboard: false
    });
});

const props = defineProps<{ followerData: any }>();

defineExpose({
    modal: followerModal
});
</script>