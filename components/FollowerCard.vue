<template>
    <div class="col">
        <div class="card" style="width: 16rem;">
            <img src="assets/Follower_Forms/${getFollowerSkinName(result.SkinName)}.webp"
                onerror="this.src='assets/Follower_Forms/Unknown.png'" class="card-img-top"
                id="FollowerPortrait_${result.ID}" height="224px" width="120px" alt="Picture not available">
            <div class="card-body">
                <h5 class="card-title">
                    ${result.Name}
                </h5>
                <p class="card-text">
                    Level: <b>${result.XPLevel}</b>
                </p>
                <div class="row">
                    <div class="col">
                        <button type="button" class="btn btn-danger" id="FollowerDeleteButton_${result.ID}"
                            data-bs-toggle="modal" data-bs-target="#ID_DELETE${result.ID}">
                            Delete
                        </button>
                    </div>
                    <div class="col text-end">
                        <button type="button" class="btn btn-primary" id="FollowerEditButton_${result.ID}"
                            data-bs-toggle="modal" data-bs-target="#ID${result.ID}">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="ID_DELETE${result.ID}" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="Label_Delete${result.ID}" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="Label_Delete${result.ID}">Confirm action</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to <b>permanently</b> delete this Follower?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                        onclick="deleteFollower(${result.ID})">Yes</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="ID${result.ID}" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="Label_${result.ID}" aria-hidden="true">
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="Label_${result.ID}">${result.Name}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="row">
                            <div class="col">
                                <label for="FollowerID_${result.ID}">Follower ID:</label>
                                <input type="number" class="form-control" id="FollowerID_${result.ID}"
                                    value="${result.ID}">
                                <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and
                                    can corrupt your save file, back up your save first.</span><br />

                                <label for="FollowerLevel_${result.ID}">Follower Level:</label>
                                <input type="text" class="form-control" id="FollowerLevel_${result.ID}"
                                    value="${result.XPLevel}"><br />

                                <label for="FollowerAge_${result.ID}">Follower Age:</label>
                                <input type="text" class="form-control" id="FollowerAge_${result.ID}"
                                    value="${result.Age}"><br />

                                <label for="FollowerLifeExpectancy_${result.ID}">Follower Life Expectancy:</label>
                                <input type="text" class="form-control" id="FollowerLifeExpectancy_${result.ID}"
                                    value="${result.LifeExpectancy}"><br />
                            </div>
                            <div class="col">
                                <label for="FollowerName_${result.ID}">Follower Name:</label>
                                <input type="text" class="form-control" id="FollowerName_${result.ID}"
                                    value="${result.Name}"><br />

                                <label for="FollowerDayJoined_${result.ID}">Day Joined:</label>
                                <input type="text" class="form-control" id="FollowerDayJoined_${result.ID}"
                                    value="${result.DayJoined}"><br />

                                <label for="FollowerMemberDuration_${result.ID}">Days in your Cult:</label>
                                <input type="text" class="form-control" id="FollowerMemberDuration_${result.ID}"
                                    value="${result.MemberDuration}"><br />

                                <label for="FollowerSacrificialValue_${result.ID}">Sacrificial Value:</label>
                                <input type="text" class="form-control" id="FollowerSacrificialValue_${result.ID}"
                                    value="${result.SacrificialValue}"><br />
                            </div>
                        </div>

                        <hr />

                        <div class="row">
                            <div class="col">
                                <label for="FollowerOutfit_${result.ID}">Follower Outfit: <span class="text-muted"
                                        style="font-size:12px;">If the outfit isn't visible after editing, reload your
                                        game.</span></label>
                                <select class="form-select" id="FollowerOutfit_${result.ID}"
                                    onchange="document.getElementById('FollowerOutfitPreview_${result.ID}').src = 'assets/Outfit_Preview/' + this.value + '.png' ">
                                    <option value="0" ${result.Outfit==0 ? 'selected' : '' }>Pre Indoctrination clothes
                                    </option>
                                    <option value="1" ${result.Outfit==1 ? 'selected' : '' }>Mission Backpack</option>
                                    <option value="2" ${result.Outfit==2 ? 'selected' : '' }>Warrior Armor and Sword
                                    </option>
                                    <option value="3" ${result.Outfit==3 ? 'selected' : '' }>Indoctrinated Clothes
                                    </option>
                                    <option value="7" ${result.Outfit==7 ? 'selected' : '' }>Elderly Clothes</option>
                                    <option value="8" ${result.Outfit==8 ? 'selected' : '' }>Holiday Shirt</option>
                                </select>

                                <br />
                                <p>Outfit Preview:</p>
                                <image id="FollowerOutfitPreview_${result.ID}" class="mx-auto d-block"
                                    src="assets/Outfit_Preview/${result.Outfit}.png" alt="Outfit Preview not available">

                                    <hr />

                                    <label for="FollowerSkinName_${result.ID}">Follower Skin:</label>
                                    <select class="form-select" id="FollowerSkinName_${result.ID}"
                                        onchange="document.getElementById('FollowerSkinNamePreview_${result.ID}').src = 'assets/Follower_Forms/' + this.value + '.webp' ">
</template>