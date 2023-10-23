/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
var obj;
var fileName;
var hasMealBurned = false;
var followersToRemove = [];
var followersToRevive = [];
var necklaceDescriptionsMap = new Map([
    ['0', ''],
    ['45', 'Follower will generate devotion faster'],
    ['46', 'Follower will have increased movement speed'],
    ['47', 'Follower will live an unnaturally long life, double what would be usually expected'],
    ['48', 'Follower will harvest bonus resources'],
    ['49', 'Follower will never sleep']
]);

var DeathCatBeatenWarningModal = new bootstrap.Modal(document.getElementById('DeathCatBeatenWarning'), {
    keyboard: false
});

var fileUploadModal = new bootstrap.Modal(document.getElementById('fileUploadModal'), {
    keyboard: false
});

fileUploadModal.toggle();

document.getElementById('themeChangeButton').addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.querySelector('footer').classList.replace('bg-dark', 'bg-light');
        document.querySelector('#themeChangeContainer label').innerHTML = 'Change to Dark Mode 🌑';
    }
    else {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.querySelector('footer').classList.replace('bg-light', 'bg-dark');
        document.querySelector('#themeChangeContainer label').innerHTML = 'Change to Light Mode 🌞';
    }
});

document.getElementById('file').addEventListener('change', handleFileSelect, false);
document.getElementById('form').addEventListener('submit', handleSubmit);
document.getElementById('DeathCatBeaten').addEventListener('change', function () {
    if (!this.checked) {
        if (sessionStorage.getItem('DeathCatBeatenModalShown') != 'true') {
            DeathCatBeatenWarningModal.toggle();
            sessionStorage.setItem('DeathCatBeatenModalShown', 'true');
        }
    }
});

function populateValues() {
    console.log('Original JSON', obj);

    // Cult Information & Character Stats
    populateCultAndCharacterStats();

    // Inventory items
    populateInventoryItems();

    // Inventory items
    populateTarotCards();

    // Current Indoctrinated Followers
    populateCurrentFollowers();

    // Followers waiting for being Indoctrinated
    populateRecruitingFollowers();

    // Dead Followers
    populateDeadFollowers();
}

function buildJSON() {
    // ! Player Stats
    obj.PLAYER_HEALTH = Number(document.getElementById('PLAYER_HEALTH').value);
    obj.PLAYER_SPIRIT_HEARTS = Number(document.getElementById('PLAYER_SPIRIT_HEARTS').value);
    obj.PLAYER_SPIRIT_TOTAL_HEARTS = Number(document.getElementById('PLAYER_SPIRIT_HEARTS').value);
    obj.PLAYER_BLACK_HEARTS = Number(document.getElementById('PLAYER_BLACK_HEARTS').value);
    obj.PLAYER_BLUE_HEARTS = Number(document.getElementById('PLAYER_BLUE_HEARTS').value);

    // ! Cult Information
    obj.CultName = document.getElementById('CultName').value;
    obj.CurrentDayIndex = Number(document.getElementById('CurrentDayIndex').value);
    obj.DeathCatBeaten = document.getElementById('DeathCatBeaten').checked;
    obj.RatauKilled = document.getElementById('RatauKilled').checked;

    obj.CultTraits = [];
    document.querySelectorAll('input[name="CultTraits"]:checked').forEach(element => obj.CultTraits.push(Number(element.value)));

    obj.UnlockedDungeonDoor = [];
    document.querySelectorAll('input[name="UnlockedDungeonDoor"]:checked').forEach(element => obj.UnlockedDungeonDoor.push(Number(element.value)));

    obj.RecipesDiscovered = [];
    if (hasMealBurned) {
        obj.RecipesDiscovered.push(115);
    }
    document.querySelectorAll('input[name="RecipesDiscovered"]:checked').forEach(element => obj.RecipesDiscovered.push(Number(element.value)));

    // ! Inventory Items
    document.querySelectorAll('input[name="Items"]').forEach(element => {
        let itemIndex = obj.items.findIndex(item => { return item.type == (element.id).match(/\d/g).join(''); });
        if (itemIndex != -1) {
            obj.items[itemIndex].quantity = Number(element.value);
            obj.items[itemIndex].UnreservedQuantity = Number(element.value);
        } else {
            // ? If the item is not present in the inventory and quantity is not 0, we add it
            if (Number(element.value) > 0) {
                obj.items.push({
                    'type': (element.id).match(/\d/g).join(''),
                    'quantity': Number(element.value),
                    'UnreservedQuantity': Number(element.value)
                });
            }
        }
    });

    // ! Tarot Cards
    obj.PlayerFoundTrinkets = [];
    document.querySelectorAll('input[name="TarotCards"]:checked').forEach(element => {
        obj.PlayerFoundTrinkets.push(Number(element.value));
    });

    // ! Remove followers marked for deletion
    followersToRemove.forEach(function (id) {
        // Remove from obj.Followers, obj.Followers_Recruit or obj.Followers_Dead
        obj.Followers = obj.Followers.filter(follower => follower.ID != id);
        obj.Followers_Recruit = obj.Followers_Recruit.filter(follower => follower.ID != id);
        obj.Followers_Dead = obj.Followers_Dead.filter(follower => follower.ID != id);
    });

    // ! Revive followers marked for revival
    followersToRevive.forEach(function (id) {
        // Push revived follower to obj.Followers
        obj.Followers.push(obj.Followers_Dead.find((element) => element.ID == id));
        // Remove from obj.Followers_Dead_IDs
        obj.Followers_Dead_IDs = obj.Followers_Dead_IDs.filter(follower => follower != id);
        // Remove from obj.Followers_Dead
        obj.Followers_Dead = obj.Followers_Dead.filter(follower => follower.ID != id);
    });

    // ! Current Follower Stats
    obj.Followers.forEach((element, index) => {
        // * Text fields
        obj.Followers[index].Name = document.getElementById('FollowerName_' + element.ID).value;

        obj.Followers[index].XPLevel = !isNaN(Number(document.getElementById('FollowerLevel_' + element.ID).value)) &&
            Number(document.getElementById('FollowerLevel_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerLevel_' + element.ID).value) : 1;

        obj.Followers[index].Age = !isNaN(Number(document.getElementById('FollowerAge_' + element.ID).value)) &&
            Number(document.getElementById('FollowerAge_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerAge_' + element.ID).value) : 1;

        obj.Followers[index].DayJoined = !isNaN(Number(document.getElementById('FollowerDayJoined_' + element.ID).value)) &&
            Number(document.getElementById('FollowerDayJoined_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerDayJoined_' + element.ID).value) : 1;

        obj.Followers[index].MemberDuration = !isNaN(Number(document.getElementById('FollowerMemberDuration_' + element.ID).value)) &&
            Number(document.getElementById('FollowerMemberDuration_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerMemberDuration_' + element.ID).value) : 1;

        obj.Followers[index].SacrificialValue = !isNaN(Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value)) &&
            Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value) : 1;

        obj.Followers[index].LifeExpectancy = !isNaN(Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value)) &&
            Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value) : 1;

        // * Dropdown fields
        obj.Followers[index].Outfit = Number(document.getElementById('FollowerOutfit_' + element.ID).value);
        obj.Followers[index].Necklace = Number(document.getElementById('FollowerNecklace_' + element.ID).value);
        obj.Followers[index].SkinName = document.getElementById('FollowerSkinName_' + element.ID).value;

        // * Checkboxes
        obj.Followers[index].IsStarving = document.getElementById('FollowerIsStarving_' + element.ID).checked ? true : false;
        obj.Followers[index].MarriedToLeader = document.getElementById('FollowerMarriedToLeader_' + element.ID).checked ? true : false;
        obj.Followers[index].TaxEnforcer = document.getElementById('FollowerTaxEnforcer_' + element.ID).checked ? true : false;
        obj.Followers[index].FaithEnforcer = document.getElementById('FollowerFaithEnforcer_' + element.ID).checked ? true : false;

        // * Traits
        obj.Followers[index].Traits = [];
        document.querySelectorAll('input[name="FollowerTraits_' + element.ID + '"]:checked').forEach(element => obj.Followers[index].Traits.push(Number(element.value)));

        // * Range Sliders
        obj.Followers[index].Adoration = Number(document.getElementById('FollowerAdoration_' + element.ID).value);
        obj.Followers[index].Faith = Number(document.getElementById('FollowerFaith_' + element.ID).value);
        obj.Followers[index].Happiness = Number(document.getElementById('FollowerHappiness_' + element.ID).value);
        obj.Followers[index].Illness = Number(document.getElementById('FollowerIllness_' + element.ID).value);
        obj.Followers[index].Exhaustion = Number(document.getElementById('FollowerExhaustion_' + element.ID).value);
        obj.Followers[index].Rest = Number(document.getElementById('FollowerRest_' + element.ID).value);
        obj.Followers[index].Starvation = Number(document.getElementById('FollowerStarvation_' + element.ID).value);
        obj.Followers[index].Satiation = Number(document.getElementById('FollowerSatiation_' + element.ID).value);
        obj.Followers[index].Reeducation = Number(document.getElementById('FollowerReeducation_' + element.ID).value);

        // * ID
        obj.Followers[index].ID = Number(document.getElementById('FollowerID_' + element.ID).value);
    });

    // ! Recruit Follower Stats
    obj.Followers_Recruit.forEach((element, index) => {
        // * Text fields
        obj.Followers_Recruit[index].Name = document.getElementById('FollowerName_' + element.ID).value;

        obj.Followers_Recruit[index].XPLevel = isNaN(Number(document.getElementById('FollowerLevel_' + element.ID).value)) &&
            Number(document.getElementById('FollowerLevel_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerLevel_' + element.ID).value) : 1;

        obj.Followers_Recruit[index].Age = isNaN(Number(document.getElementById('FollowerAge_' + element.ID).value)) &&
            Number(document.getElementById('FollowerAge_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerAge_' + element.ID).value) : 1;

        obj.Followers_Recruit[index].DayJoined = isNaN(Number(document.getElementById('FollowerDayJoined_' + element.ID).value)) &&
            Number(document.getElementById('FollowerDayJoined_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerDayJoined_' + element.ID).value) : 1;

        obj.Followers_Recruit[index].MemberDuration = isNaN(Number(document.getElementById('FollowerMemberDuration_' + element.ID).value)) &&
            Number(document.getElementById('FollowerMemberDuration_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerMemberDuration_' + element.ID).value) : 1;

        obj.Followers_Recruit[index].SacrificialValue = isNaN(Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value)) &&
            Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value) : 1;

        obj.Followers_Recruit[index].LifeExpectancy = isNaN(Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value)) &&
            Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value) : 1;

        // * Dropdown fields
        obj.Followers_Recruit[index].Outfit = Number(document.getElementById('FollowerOutfit_' + element.ID).value);
        obj.Followers_Recruit[index].Necklace = Number(document.getElementById('FollowerNecklace_' + element.ID).value);
        obj.Followers_Recruit[index].SkinName = document.getElementById('FollowerSkinName_' + element.ID).value;

        // * Checkboxes
        obj.Followers_Recruit[index].IsStarving = document.getElementById('FollowerIsStarving_' + element.ID).checked ? true : false;
        obj.Followers_Recruit[index].MarriedToLeader = document.getElementById('FollowerMarriedToLeader_' + element.ID).checked ? true : false;
        obj.Followers_Recruit[index].TaxEnforcer = document.getElementById('FollowerTaxEnforcer_' + element.ID).checked ? true : false;
        obj.Followers_Recruit[index].FaithEnforcer = document.getElementById('FollowerFaithEnforcer_' + element.ID).checked ? true : false;

        // * Traits
        obj.Followers_Recruit[index].Traits = [];
        document.querySelectorAll('input[name="FollowerTraits_' + element.ID + '"]:checked').forEach(element => obj.Followers_Recruit[index].Traits.push(Number(element.value)));

        // * Range Sliders
        obj.Followers_Recruit[index].Adoration = Number(document.getElementById('FollowerAdoration_' + element.ID).value);
        obj.Followers_Recruit[index].Faith = Number(document.getElementById('FollowerFaith_' + element.ID).value);
        obj.Followers_Recruit[index].Happiness = Number(document.getElementById('FollowerHappiness_' + element.ID).value);
        obj.Followers_Recruit[index].Illness = Number(document.getElementById('FollowerIllness_' + element.ID).value);
        obj.Followers_Recruit[index].Exhaustion = Number(document.getElementById('FollowerExhaustion_' + element.ID).value);
        obj.Followers_Recruit[index].Rest = Number(document.getElementById('FollowerRest_' + element.ID).value);
        obj.Followers_Recruit[index].Starvation = Number(document.getElementById('FollowerStarvation_' + element.ID).value);
        obj.Followers_Recruit[index].Satiation = Number(document.getElementById('FollowerSatiation_' + element.ID).value);
        obj.Followers_Recruit[index].Reeducation = Number(document.getElementById('FollowerReeducation_' + element.ID).value);

        // * ID
        obj.Followers_Recruit[index].ID = Number(document.getElementById('FollowerID_' + element.ID).value);
    });

    // ! Dead Follower Stats
    obj.Followers_Dead.forEach((element, index) => {
        // * Text fields
        obj.Followers_Dead[index].Name = document.getElementById('FollowerName_' + element.ID).value;

        obj.Followers_Dead[index].XPLevel = isNaN(Number(document.getElementById('FollowerLevel_' + element.ID).value)) &&
            Number(document.getElementById('FollowerLevel_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerLevel_' + element.ID).value) : 1;

        obj.Followers_Dead[index].Age = isNaN(Number(document.getElementById('FollowerAge_' + element.ID).value)) &&
            Number(document.getElementById('FollowerAge_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerAge_' + element.ID).value) : 1;

        obj.Followers_Dead[index].DayJoined = isNaN(Number(document.getElementById('FollowerDayJoined_' + element.ID).value)) &&
            Number(document.getElementById('FollowerDayJoined_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerDayJoined_' + element.ID).value) : 1;

        obj.Followers_Dead[index].MemberDuration = isNaN(Number(document.getElementById('FollowerMemberDuration_' + element.ID).value)) &&
            Number(document.getElementById('FollowerMemberDuration_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerMemberDuration_' + element.ID).value) : 1;

        obj.Followers_Dead[index].SacrificialValue = isNaN(Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value)) &&
            Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerSacrificialValue_' + element.ID).value) : 1;

        obj.Followers_Dead[index].LifeExpectancy = isNaN(Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value)) &&
            Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value) >= 1 ? Number(document.getElementById('FollowerLifeExpectancy_' + element.ID).value) : 1;

        // * Dropdown fields
        obj.Followers_Dead[index].Outfit = Number(document.getElementById('FollowerOutfit_' + element.ID).value);
        obj.Followers_Dead[index].Necklace = Number(document.getElementById('FollowerNecklace_' + element.ID).value);
        obj.Followers_Dead[index].SkinName = document.getElementById('FollowerSkinName_' + element.ID).value;

        // * Checkboxes
        obj.Followers_Dead[index].IsStarving = document.getElementById('FollowerIsStarving_' + element.ID).checked ? true : false;
        obj.Followers_Dead[index].MarriedToLeader = document.getElementById('FollowerMarriedToLeader_' + element.ID).checked ? true : false;
        obj.Followers_Dead[index].TaxEnforcer = document.getElementById('FollowerTaxEnforcer_' + element.ID).checked ? true : false;
        obj.Followers_Dead[index].FaithEnforcer = document.getElementById('FollowerFaithEnforcer_' + element.ID).checked ? true : false;

        // * Traits
        obj.Followers_Dead[index].Traits = [];
        document.querySelectorAll('input[name="FollowerTraits_' + element.ID + '"]:checked').forEach(element => obj.Followers_Dead[index].Traits.push(Number(element.value)));

        // * Range Sliders
        obj.Followers_Dead[index].Adoration = Number(document.getElementById('FollowerAdoration_' + element.ID).value);
        obj.Followers_Dead[index].Faith = Number(document.getElementById('FollowerFaith_' + element.ID).value);
        obj.Followers_Dead[index].Happiness = Number(document.getElementById('FollowerHappiness_' + element.ID).value);
        obj.Followers_Dead[index].Illness = Number(document.getElementById('FollowerIllness_' + element.ID).value);
        obj.Followers_Dead[index].Exhaustion = Number(document.getElementById('FollowerExhaustion_' + element.ID).value);
        obj.Followers_Dead[index].Rest = Number(document.getElementById('FollowerRest_' + element.ID).value);
        obj.Followers_Dead[index].Starvation = Number(document.getElementById('FollowerStarvation_' + element.ID).value);
        obj.Followers_Dead[index].Satiation = Number(document.getElementById('FollowerSatiation_' + element.ID).value);
        obj.Followers_Dead[index].Reeducation = Number(document.getElementById('FollowerReeducation_' + element.ID).value);

        // * ID
        obj.Followers_Dead[index].ID = Number(document.getElementById('FollowerID_' + element.ID).value);
    });

    console.log('FINAL OBJ: ', obj);

    return obj;
}

function reviveFollower(followerId) {

    followersToRevive.push(followerId);

    document.getElementById('FollowerPortrait_' + followerId).src = 'assets/green_check.png';
    document.getElementById('FollowerReviveButton_' + followerId).setAttribute('disabled', 'true');
    document.getElementById('FollowerDeleteButton_' + followerId).setAttribute('disabled', 'true');
}

function deleteFollower(followerId, flag = false) {

    followersToRemove.push(followerId);

    document.getElementById('FollowerPortrait_' + followerId).src = 'assets/Necklace_Preview/0.png';
    document.getElementById('FollowerDeleteButton_' + followerId).setAttribute('disabled', 'true');
    document.getElementById('FollowerEditButton_' + followerId).setAttribute('disabled', 'true');

    // ? If the follower is being deleted from the dead list, we disable the revive button too
    if (flag) {
        document.getElementById('FollowerReviveButton_' + followerId).setAttribute('disabled', 'true');
    }
}

function copyTextToClipboard(field) {
    var copyText = document.getElementById(field);
    copyText.select();

    navigator.clipboard.writeText(copyText.value);

}

function handleSubmit(event) {
    event.preventDefault();
    if (event.submitter.id === 'formSubmitBtn') {
        console.log(event);
        buildJSON();
        var fileToSave = new Blob([JSON.stringify(obj)], {
            type: 'application/json'
        });

        saveAs(fileToSave, fileName);
    }
}

function handleFileSelect(event) {

    /*console.log(event.target.files[0]);
    if (!file.value.length) return;

    let reader = new FileReader();
    reader.readAsText(event.target.files[0]);

    reader.onload = populateValues;*/

    const reader = new FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    fileName = event.target.files[0].name;

    /*function byteArrayToWordArray(ba) {
        var wa = [],
            i;
        for (i = 0; i < ba.length; i++) {
            wa[(i / 4) | 0] |= ba[i] << (24 - 8 * i);
        }

        return CryptoJS.lib.WordArray.create(wa, ba.length);
    }
    function wordToByteArray(word, length) {
        var ba = [],
            i,
            xFF = 0xFF;
        if (length > 0)
            ba.push(word >>> 24);
        if (length > 1)
            ba.push((word >>> 16) & xFF);
        if (length > 2)
            ba.push((word >>> 8) & xFF);
        if (length > 3)
            ba.push(word & xFF);

        return ba;
    }
    function toHexString(byteArray) {
        return Array.from(byteArray, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    function arrayBufferToWordArray(ab) {
        var i8a = new Uint8Array(ab);
        var a = [];
        for (var i = 0; i < i8a.length; i += 4) {
            a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
        }
        return CryptoJS.lib.WordArray.create(a, i8a.length);
    }
    const fromHex = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));*/

    reader.onerror = function (error) {
        console.log(error);
    };
    reader.onload = async function () {
        let enc = new TextDecoder('utf-8');
        let arr = new Uint8Array(reader.result);
        let decodedText = enc.decode(arr);

        //Check if file is already decrypted
        if (decodedText.charAt(0) == '{') {
            obj = JSON.parse(decodedText);
            fileUploadModal.hide();
            populateValues();
        } else {
            let arrayResult = reader.result;
            let bytes = new Uint8Array(arrayResult);

            let keyBytes = bytes.slice(1, 17);
            let IVBytes = bytes.slice(17, 33);

            /*let keyBuffer = arrayResult.slice(1, 17);
            let IVBuffer = arrayResult.slice(17, 33);
            let stringHex = toHexString(bytes);*/

            let newBytes = bytes.slice(1, bytes.length);
            let aesCbc = new aesjs.ModeOfOperation.cbc(keyBytes, IVBytes);
            let decryptedBytes = aesCbc.decrypt(newBytes);

            // Convert our bytes back into text
            let newDecryptedBytes = decryptedBytes.slice(32, decryptedBytes.length);
            let unpaddedBytes = aesjs.padding.pkcs7.strip(newDecryptedBytes);
            let decryptedText = aesjs.utils.utf8.fromBytes(unpaddedBytes);
            obj = JSON.parse(decryptedText);

            // Hide the File Upload Modal
            fileUploadModal.hide();
            // Reading is done, populate input values with the JSON data
            populateValues();
        }
    };
}

function loadTestData() {
    fetch('https://raw.githubusercontent.com/fabiobarcelona/Cult-of-the-Lamb-Save-Editor/main/test_save.json')
        .then(response => response.json())
        .then(function (data) {
            fileName = 'test_save.json';
            obj = data;
            populateValues();
            fileUploadModal.hide();
        })
        .catch(() => alert('Error loading test data'));
}

function populateCultAndCharacterStats() {
    // ! Character Stats
    document.getElementById('PLAYER_HEALTH').value = obj.PLAYER_HEALTH;
    document.getElementById('PLAYER_SPIRIT_HEARTS').value = obj.PLAYER_SPIRIT_HEARTS;
    document.getElementById('PLAYER_BLACK_HEARTS').value = obj.PLAYER_BLACK_HEARTS;
    document.getElementById('PLAYER_BLUE_HEARTS').value = obj.PLAYER_BLUE_HEARTS;

    // ! Cult Information
    document.getElementById('CultName').value = obj.CultName;
    document.getElementById('CurrentDayIndex').value = obj.CurrentDayIndex;
    document.getElementById('DeathCatBeaten').checked = obj.DeathCatBeaten;
    document.getElementById('RatauKilled').checked = obj.RatauKilled;

    obj.CultTraits.forEach(element => document.querySelector('input[name="CultTraits"][value="' + element + '"]').checked = true);
    obj.UnlockedDungeonDoor.forEach(element => document.querySelector('input[name="UnlockedDungeonDoor"][value="' + element + '"]').checked = true);

    // 115 = MEAL_BURNED (unused/not an item)
    // Remove it now to add it back later when we build the JSON
    if (obj.RecipesDiscovered.includes(115)) {
        hasMealBurned = true;
        obj.RecipesDiscovered.splice(obj.RecipesDiscovered.indexOf(115), 1);
    }
    obj.RecipesDiscovered.forEach(function (element) {
        document.querySelector('input[name="RecipesDiscovered"][value="' + element + '"]').checked = true;
    });
}

// ! Inventory Items
function populateInventoryItems() {
    document.querySelectorAll('input[name="Items"]').forEach(function (element) {
        // * element.id = "Items_0" --> We only want the number
        let res = obj.items.find(item => { return item.type == (element.id).match(/\d/g).join(''); });
        element.value = res ? res.quantity : 0;
    });
}

// ! Tarot Cards
function populateTarotCards() {
    obj.PlayerFoundTrinkets.forEach(element => document.querySelector('input[name="TarotCards"][value="' + element + '"]').checked = true);
}

function populateCurrentFollowers() {
    // ! Current Follower Stats
    var container = document.getElementById('nav-followers');
    var content;

    if (obj.Followers.length === 0) {
        content = '<p>No Followers found</p></div>';
        container.insertAdjacentHTML('beforeend', content);
        return;
    }

    obj.Followers.forEach(function (result, i) {
        if (i == 0) {
            content = '<div class="row">';
        }

        if (i != 0 && i % 5 == 0) {
            content += '</div> <div class="row my-5">';
        }

        content +=
            `<div class="col">
                <div class="card" style="width: 16rem;">
                    <img src="assets/Follower_Forms/${result.SkinName}.png" onerror="this.src='assets/Follower_Forms/Unknown.png'" class="card-img-top" id="FollowerPortrait_${result.ID}" alt="Picture not available">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${result.Name}
                        </h5>
                        <p class="card-text">
                            Level: <b>${result.XPLevel}</b>
                        </p>
                        <div class="row">
                            <div class="col">
                                <button type="button" class="btn btn-danger" id="FollowerDeleteButton_${result.ID}" data-bs-toggle="modal" data-bs-target="#ID_DELETE${result.ID}">
                                    Delete
                                </button>
                            </div>
                            <div class="col text-end">
                                <button type="button" class="btn btn-primary" id="FollowerEditButton_${result.ID}" data-bs-toggle="modal" data-bs-target="#ID${result.ID}">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="ID_DELETE${result.ID}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="Label_Delete${result.ID}" aria-hidden="true">
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
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteFollower(${result.ID})">Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="ID${result.ID}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="Label_${result.ID}" aria-hidden="true">
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
                                    <input type="number" class="form-control" id="FollowerID_${result.ID}" value="${result.ID}">
                                    <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can corrupt your save file, back up your save first.</span><br/>

                                    <label for="FollowerLevel_${result.ID}" >Follower Level:</label>
                                    <input type="text" class="form-control" id="FollowerLevel_${result.ID}" value="${result.XPLevel}"><br/>

                                    <label for="FollowerAge_${result.ID}" >Follower Age:</label>
                                    <input type="text" class="form-control" id="FollowerAge_${result.ID}" value="${result.Age}"><br/>

                                    <label for="FollowerLifeExpectancy_${result.ID}" >Follower Life Expectancy:</label>
                                    <input type="text" class="form-control" id="FollowerLifeExpectancy_${result.ID}" value="${result.LifeExpectancy}"><br/>
                                </div>
                                <div class="col">
                                    <label for="FollowerName_${result.ID}">Follower Name:</label>
                                    <input type="text" class="form-control" id="FollowerName_${result.ID}" value="${result.Name}"><br/>

                                    <label for="FollowerDayJoined_${result.ID}" >Day Joined:</label>
                                    <input type="text" class="form-control" id="FollowerDayJoined_${result.ID}" value="${result.DayJoined}"><br/>

                                    <label for="FollowerMemberDuration_${result.ID}" >Days in your Cult:</label>
                                    <input type="text" class="form-control" id="FollowerMemberDuration_${result.ID}" value="${result.MemberDuration}"><br/>

                                    <label for="FollowerSacrificialValue_${result.ID}" >Sacrificial Value:</label>
                                    <input type="text" class="form-control" id="FollowerSacrificialValue_${result.ID}" value="${result.SacrificialValue}"><br/>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <label for="FollowerOutfit_${result.ID}" >Follower Outfit: <span class="text-muted" style="font-size:12px;">If the outfit isn't visible after editing, reload your game.</span></label>
                                    <select class="form-select" id="FollowerOutfit_${result.ID}" onchange="document.getElementById('FollowerOutfitPreview_${result.ID}').src = 'assets/Outfit_Preview/' + this.value + '.png' ">
                                        <option value="0" ${result.Outfit == 0 ? 'selected' : ''}>Pre Indoctrination clothes</option>
                                        <option value="1" ${result.Outfit == 1 ? 'selected' : ''}>Mission Backpack</option>
                                        <option value="2" ${result.Outfit == 2 ? 'selected' : ''}>Warrior Armor and Sword</option>
                                        <option value="3" ${result.Outfit == 3 ? 'selected' : ''}>Indoctrinated Clothes</option>
                                        <option value="7" ${result.Outfit == 7 ? 'selected' : ''}>Elderly Clothes</option>
                                        <option value="8" ${result.Outfit == 8 ? 'selected' : ''}>Holiday Shirt</option>
                                    </select>

                                    <br/>
                                    <p>Outfit Preview:</p>
                                    <image id="FollowerOutfitPreview_${result.ID}" class="mx-auto d-block" src="assets/Outfit_Preview/${result.Outfit}.png" alt="Outfit Preview not available">

                                    <hr/>

                                    <label for="FollowerSkinName_${result.ID}" >Follower Skin:</label>
                                    <select class="form-select" id="FollowerSkinName_${result.ID}" onchange="document.getElementById('FollowerSkinNamePreview_${result.ID}').src = 'assets/Follower_Forms/' + this.value + '.png' ">
                                        `;

        // ! Make sure only unlocked skins are available
        obj.FollowerSkinsUnlocked.forEach((skin) => {
            content += `<option value="${skin}" ${result.SkinName == skin ? 'selected' : ''}>${skin}</option>`;
        });

        content += `
                                    </select>

                                    <br/>
                                    <p>Skin Preview:</p>
                                    <image id="FollowerSkinNamePreview_${result.ID}" class="mx-auto d-block" src="assets/Follower_Forms/${result.SkinName}.png" alt="Form Preview not available">
                                </div>
                                <div class="col">
                                    <label for="FollowerNecklace_${result.ID}" >Follower Necklace: </label>
                                    <select class="form-select" id="FollowerNecklace_${result.ID}"
                                    onchange="document.getElementById('FollowerNecklacePreview_${result.ID}').src = 'assets/Necklace_Preview/' + this.value + '.png';
                                    document.getElementById('FollowerNecklacePreviewText_${result.ID}').innerHTML = necklaceDescriptionsMap.get(this.value)">
                                        <option value="0" ${result.Necklace == 0 ? 'selected' : ''}>-- None --</option>
                                        <option value="45" ${result.Necklace == 45 ? 'selected' : ''}>Flower Necklace</option>
                                        <option value="46" ${result.Necklace == 46 ? 'selected' : ''}>Feather Necklace</option>
                                        <option value="47" ${result.Necklace == 47 ? 'selected' : ''}>Skull Necklace</option>
                                        <option value="48" ${result.Necklace == 48 ? 'selected' : ''}>Natures Necklace</option>
                                        <option value="49" ${result.Necklace == 49 ? 'selected' : ''}>Moon Necklace</option>
                                    </select>

                                    <br/>
                                    <p>Necklace Preview:</p>
                                    <image id="FollowerNecklacePreview_${result.ID}" class="mx-auto d-block" height="80px" width="70px" src="assets/Necklace_Preview/${result.Necklace}.png" alt="Necklace Preview not available">
                                    <div class="text-center mt-4">
                                        <span id="FollowerNecklacePreviewText_${result.ID}" class="text-muted mb-3"></span>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" name="FollowerIsStarving"
                                        id="FollowerIsStarving_${result.ID}" ${result.IsStarving ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerIsStarving_${result.ID}">Starving Indicator</label><br/>

                                    <input type="checkbox" class="form-check-input" name="FollowerMarriedToLeader"
                                        id="FollowerMarriedToLeader_${result.ID}" ${result.MarriedToLeader ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerMarriedToLeader_${result.ID}">Married to Leader</label><br/>
                                </div>
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" name="FollowerTaxEnforcer"
                                            id="FollowerTaxEnforcer_${result.ID}" ${result.TaxEnforcer ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerTaxEnforcer_${result.ID}">Tax Enforcer</label><br/>

                                    <input type="checkbox" class="form-check-input" name="FollowerFaithEnforcer"
                                            id="FollowerFaithEnforcer_${result.ID}" ${result.FaithEnforcer ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerFaithEnforcer_${result.ID}">Faith Enforcer</label><br/>
                                </div>
                            </div>

                            <br/>

                            <div class="row">
                                <div class="col">
                                    <h4>Follower Traits</h4>
                                    <hr/>

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

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}23" value="23">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/23.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}23">Coprophiliac</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}23">Gain 10 Faith when falling ill.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}21" value="21">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/21.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}21">Gullible</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}21">15% easier to level up.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}11" value="11">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/11.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}11">Faithful</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}11">Generates Devotion 15% faster.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}24" value="24">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/24.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}24">Industrious</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}24">Increased work speed by 15%.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}18" value="18">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/18.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}18">Materialistic</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}18">Gain Faith when building better sleeping quarters.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}2" value="2">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/2.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}2">Naturally Obedient</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}2">On recruiting this Follower immediately gain 10 Faith.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}16" value="16">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/16.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}16">Strong Constitution</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}16">Heals 15% faster when sick and in bed rest.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}17" value="17">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/17.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}17">Zealous</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}17">Ignores dissenters when they preach.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}32" value="32">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/32.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}32">Immortal</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}32">Will never reach old age.</label>
                                                </td>
                                            </tr>



                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}20" value="20">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/20.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}20">Cynical</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}20">15% harder to level up.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}12" value="12">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/12.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}12">Faithless</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}12">Generates Devotion 15% slower.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}22" value="22">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/22.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}22">Germaphobe</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}22">Lose 10 Faith when falling ill.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}1" value="1">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/1.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}1">Natural Skeptic</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}1">On recruiting Follower immediately lose 10 Faith.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}15" value="15">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/15.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}15">Sickly</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}15">Heals 15% slower when sick and in bed rest.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}25" value="25">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/25.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}25">Sloth</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}25">Work and devotion generation speed reduced by 10%.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}4" value="4">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/4.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}4">Terrified of Death</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}4">Lose -5 Faith whenever another Follower dies.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}10" value="10">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/10.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}10">Against Sacrifice</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}10">-5 Faith when a Follower is Sacrificed.</label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <label for="FollowerAdoration_${result.ID}">Adoration (XP to next level): </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerAdoration_${result.ID}" value="${result.Adoration}" onInput="$('#FollowerAdorationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerAdorationRange_${result.ID}">${result.Adoration}</p>

                                    <label for="FollowerFaith_${result.ID}">Faith: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerFaith_${result.ID}" value="${result.Faith}" onInput="$('#FollowerFaithRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerFaithRange_${result.ID}">${result.Faith}</p>

                                    <label for="FollowerHappiness_${result.ID}">Happiness: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerHappiness_${result.ID}" value="${result.Happiness}" onInput="$('#FollowerHappinessRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerHappinessRange_${result.ID}">${result.Happiness}</p>

                                    <label for="FollowerIllness_${result.ID}">Illness: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerIllness_${result.ID}" value="${result.Illness}" onInput="$('#FollowerIllnessRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerIllnessRange_${result.ID}">${result.Illness}</p>

                                    <label for="FollowerReeducation_${result.ID}">Reeducation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerReeducation_${result.ID}" value="${result.Reeducation}" onInput="$('#FollowerReeducationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerReeducationRange_${result.ID}">${result.Reeducation}</p>
                                </div>
                                <div class="col">
                                    <label for="FollowerExhaustion_${result.ID}">Exhaustion: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerExhaustion_${result.ID}" value="${result.Exhaustion}" onInput="$('#FollowerExhaustionRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerExhaustionRange_${result.ID}">${result.Exhaustion}</p>

                                    <label for="FollowerRest_${result.ID}">Rest: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerRest_${result.ID}" value="${result.Rest}" onInput="$('#FollowerRestRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerRestRange_${result.ID}">${result.Rest}</p>

                                    <label for="FollowerStarvation_${result.ID}">Starvation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerStarvation_${result.ID}" value="${result.Starvation}" onInput="$('#FollowerStarvationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerStarvationRange_${result.ID}">${result.Starvation}</p>

                                    <label for="FollowerSatiation_${result.ID}">Satiation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerSatiation_${result.ID}" value="${result.Satiation}" onInput="$('#FollowerSatiationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerSatiationRange_${result.ID}">${result.Satiation}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" from="FollowerForm_${result.ID}" data-bs-dismiss="modal" class="btn btn-primary">Save</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>`;
    });
    content += '</div>';
    container.insertAdjacentHTML('beforeend', content);

    // ! Check Follower Traits in Edit Modal
    obj.Followers.forEach(function (follower) {
        follower.Traits.forEach(element => document.querySelector('input[id="FollowerTraits_' + follower.ID + element + '"][value="' + element + '"]').checked = true);
    });
}

function populateRecruitingFollowers() {
    // ! Recruit Follower Stats
    var container = document.getElementById('nav-recruiting-followers');
    var content;

    if (obj.Followers_Recruit.length === 0) {
        content = '<p>No Followers found</p></div>';
        container.insertAdjacentHTML('beforeend', content);
        return;
    }

    obj.Followers_Recruit.forEach(function (result, i) {
        if (i == 0) {
            content = '<div class="row">';
        }

        if (i != 0 && i % 5 == 0) {
            content += '</div> <div class="row my-5">';
        }

        content +=
            `<div class="col">
                <div class="card" style="width: 16rem;">
                    <img src="assets/Follower_Forms/${result.SkinName}.png" onerror="this.src='assets/Follower_Forms/Unknown.png'" class="card-img-top" id="FollowerPortrait_${result.ID}" alt="Picture not available">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${result.Name}
                        </h5>
                        <p class="card-text">
                            Level: <b>${result.XPLevel}</b>
                        </p>
                        <div class="row">
                            <div class="col">
                                <button type="button" class="btn btn-danger" id="FollowerDeleteButton_${result.ID}" data-bs-toggle="modal" data-bs-target="#ID_DELETE${result.ID}">
                                    Delete
                                </button>
                            </div>
                            <div class="col text-end">
                                <button type="button" class="btn btn-primary" id="FollowerEditButton_${result.ID}" data-bs-toggle="modal" data-bs-target="#ID${result.ID}">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="ID_DELETE${result.ID}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="Label_Delete${result.ID}" aria-hidden="true">
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
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteFollower(${result.ID})">Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="ID${result.ID}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="Label_${result.ID}" aria-hidden="true">
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
                                    <input type="number" class="form-control" id="FollowerID_${result.ID}" value="${result.ID}">
                                    <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can corrupt your save file, back up your save first.</span><br/>

                                    <label for="FollowerLevel_${result.ID}" >Follower Level:</label>
                                    <input type="text" class="form-control" id="FollowerLevel_${result.ID}" value="${result.XPLevel}"><br/>

                                    <label for="FollowerAge_${result.ID}" >Follower Age:</label>
                                    <input type="text" class="form-control" id="FollowerAge_${result.ID}" value="${result.Age}"><br/>

                                    <label for="FollowerLifeExpectancy_${result.ID}" >Follower Life Expectancy:</label>
                                    <input type="text" class="form-control" id="FollowerLifeExpectancy_${result.ID}" value="${result.LifeExpectancy}"><br/>
                                </div>
                                <div class="col">
                                    <label for="FollowerName_${result.ID}">Follower Name:</label>
                                    <input type="text" class="form-control" id="FollowerName_${result.ID}" value="${result.Name}"><br/>

                                    <label for="FollowerDayJoined_${result.ID}" >Day Joined:</label>
                                    <input type="text" class="form-control" id="FollowerDayJoined_${result.ID}" value="${result.DayJoined}"><br/>

                                    <label for="FollowerMemberDuration_${result.ID}" >Days in your Cult:</label>
                                    <input type="text" class="form-control" id="FollowerMemberDuration_${result.ID}" value="${result.MemberDuration}"><br/>

                                    <label for="FollowerSacrificialValue_${result.ID}" >Sacrificial Value:</label>
                                    <input type="text" class="form-control" id="FollowerSacrificialValue_${result.ID}" value="${result.SacrificialValue}"><br/>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <label for="FollowerOutfit_${result.ID}" >Follower Outfit: <span class="text-muted" style="font-size:12px;">If the outfit isn't visible after editing, reload your game.</span></label>
                                    <select class="form-select" id="FollowerOutfit_${result.ID}" onchange="document.getElementById('FollowerOutfitPreview_${result.ID}').src = 'assets/Outfit_Preview/' + this.value + '.png' ">
                                        <option value="0" ${result.Outfit == 0 ? 'selected' : ''}>Pre Indoctrination clothes</option>
                                        <option value="1" ${result.Outfit == 1 ? 'selected' : ''}>Mission Backpack</option>
                                        <option value="2" ${result.Outfit == 2 ? 'selected' : ''}>Warrior Armor and Sword</option>
                                        <option value="3" ${result.Outfit == 3 ? 'selected' : ''}>Indoctrinated Clothes</option>
                                        <option value="7" ${result.Outfit == 7 ? 'selected' : ''}>Elderly Clothes</option>
                                        <option value="8" ${result.Outfit == 8 ? 'selected' : ''}>Holiday Shirt</option>
                                    </select>

                                    <br/>
                                    <p>Outfit Preview:</p>
                                    <image id="FollowerOutfitPreview_${result.ID}" class="mx-auto d-block" src="assets/Outfit_Preview/${result.Outfit}.png" alt="Outfit Preview not available">

                                    <hr/>

                                    <label for="FollowerSkinName_${result.ID}" >Follower Skin:</label>
                                    <select class="form-select" id="FollowerSkinName_${result.ID}" onchange="document.getElementById('FollowerSkinNamePreview_${result.ID}').src = 'assets/Follower_Forms/' + this.value + '.png' ">
                                        `;

        // ! Make sure only unlocked skins are available
        obj.FollowerSkinsUnlocked.forEach((skin) => {
            content += `<option value="${skin}" ${result.SkinName == skin ? 'selected' : ''}>${skin}</option>`;
        });

        content += `
                                    </select>

                                    <br/>
                                    <p>Skin Preview:</p>
                                    <image id="FollowerSkinNamePreview_${result.ID}" class="mx-auto d-block" src="assets/Follower_Forms/${result.SkinName}.png" alt="Form Preview not available">
                                </div>
                                <div class="col">
                                    <label for="FollowerNecklace_${result.ID}" >Follower Necklace: </label>
                                    <select class="form-select" id="FollowerNecklace_${result.ID}"
                                    onchange="document.getElementById('FollowerNecklacePreview_${result.ID}').src = 'assets/Necklace_Preview/' + this.value + '.png';
                                    document.getElementById('FollowerNecklacePreviewText_${result.ID}').innerHTML = necklaceDescriptionsMap.get(this.value)">
                                        <option value="0" ${result.Necklace == 0 ? 'selected' : ''}>-- None --</option>
                                        <option value="45" ${result.Necklace == 45 ? 'selected' : ''}>Flower Necklace</option>
                                        <option value="46" ${result.Necklace == 46 ? 'selected' : ''}>Feather Necklace</option>
                                        <option value="47" ${result.Necklace == 47 ? 'selected' : ''}>Skull Necklace</option>
                                        <option value="48" ${result.Necklace == 48 ? 'selected' : ''}>Natures Necklace</option>
                                        <option value="49" ${result.Necklace == 49 ? 'selected' : ''}>Moon Necklace</option>
                                    </select>

                                    <br/>
                                    <p>Necklace Preview:</p>
                                    <image id="FollowerNecklacePreview_${result.ID}" class="mx-auto d-block" height="80px" width="70px" src="assets/Necklace_Preview/${result.Necklace}.png" alt="Necklace Preview not available">
                                    <div class="text-center mt-4">
                                        <span id="FollowerNecklacePreviewText_${result.ID}" class="text-muted mb-3"></span>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" name="FollowerIsStarving"
                                        id="FollowerIsStarving_${result.ID}" ${result.IsStarving ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerIsStarving_${result.ID}">Starving Indicator</label><br/>

                                    <input type="checkbox" class="form-check-input" name="FollowerMarriedToLeader"
                                        id="FollowerMarriedToLeader_${result.ID}" ${result.MarriedToLeader ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerMarriedToLeader_${result.ID}">Married to Leader</label><br/>
                                </div>
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" name="FollowerTaxEnforcer"
                                            id="FollowerTaxEnforcer_${result.ID}" ${result.TaxEnforcer ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerTaxEnforcer_${result.ID}">Tax Enforcer</label><br/>

                                    <input type="checkbox" class="form-check-input" name="FollowerFaithEnforcer"
                                            id="FollowerFaithEnforcer_${result.ID}" ${result.FaithEnforcer ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerFaithEnforcer_${result.ID}">Faith Enforcer</label><br/>
                                </div>
                            </div>

                            <br/>

                            <div class="row">
                                <div class="col">
                                    <h4>Follower Traits</h4>
                                    <hr/>

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

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}23" value="23">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/23.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}23">Coprophiliac</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}23">Gain 10 Faith when falling ill.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}21" value="21">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/21.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}21">Gullible</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}21">15% easier to level up.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}11" value="11">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/11.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}11">Faithful</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}11">Generates Devotion 15% faster.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}24" value="24">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/24.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}24">Industrious</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}24">Increased work speed by 15%.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}18" value="18">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/18.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}18">Materialistic</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}18">Gain Faith when building better sleeping quarters.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}2" value="2">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/2.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}2">Naturally Obedient</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}2">On recruiting this Follower immediately gain 10 Faith.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}16" value="16">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/16.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}16">Strong Constitution</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}16">Heals 15% faster when sick and in bed rest.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}17" value="17">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/17.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}17">Zealous</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}17">Ignores dissenters when they preach.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}32" value="32">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/32.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}32">Immortal</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}32">Will never reach old age.</label>
                                                </td>
                                            </tr>



                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}20" value="20">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/20.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}20">Cynical</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}20">15% harder to level up.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}12" value="12">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/12.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}12">Faithless</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}12">Generates Devotion 15% slower.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}22" value="22">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/22.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}22">Germaphobe</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}22">Lose 10 Faith when falling ill.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}1" value="1">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/1.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}1">Natural Skeptic</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}1">On recruiting Follower immediately lose 10 Faith.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}15" value="15">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/15.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}15">Sickly</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}15">Heals 15% slower when sick and in bed rest.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}25" value="25">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/25.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}25">Sloth</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}25">Work and devotion generation speed reduced by 10%.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}4" value="4">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/4.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}4">Terrified of Death</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}4">Lose -5 Faith whenever another Follower dies.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}10" value="10">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/10.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}10">Against Sacrifice</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}10">-5 Faith when a Follower is Sacrificed.</label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <label for="FollowerAdoration_${result.ID}">Adoration (XP to next level): </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerAdoration_${result.ID}" value="${result.Adoration}" onInput="$('#FollowerAdorationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerAdorationRange_${result.ID}">${result.Adoration}</p>

                                    <label for="FollowerFaith_${result.ID}">Faith: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerFaith_${result.ID}" value="${result.Faith}" onInput="$('#FollowerFaithRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerFaithRange_${result.ID}">${result.Faith}</p>

                                    <label for="FollowerHappiness_${result.ID}">Happiness: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerHappiness_${result.ID}" value="${result.Happiness}" onInput="$('#FollowerHappinessRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerHappinessRange_${result.ID}">${result.Happiness}</p>

                                    <label for="FollowerIllness_${result.ID}">Illness: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerIllness_${result.ID}" value="${result.Illness}" onInput="$('#FollowerIllnessRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerIllnessRange_${result.ID}">${result.Illness}</p>

                                    <label for="FollowerReeducation_${result.ID}">Reeducation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerReeducation_${result.ID}" value="${result.Reeducation}" onInput="$('#FollowerReeducationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerReeducationRange_${result.ID}">${result.Reeducation}</p>
                                </div>
                                <div class="col">
                                    <label for="FollowerExhaustion_${result.ID}">Exhaustion: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerExhaustion_${result.ID}" value="${result.Exhaustion}" onInput="$('#FollowerExhaustionRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerExhaustionRange_${result.ID}">${result.Exhaustion}</p>

                                    <label for="FollowerRest_${result.ID}">Rest: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerRest_${result.ID}" value="${result.Rest}" onInput="$('#FollowerRestRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerRestRange_${result.ID}">${result.Rest}</p>

                                    <label for="FollowerStarvation_${result.ID}">Starvation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerStarvation_${result.ID}" value="${result.Starvation}" onInput="$('#FollowerStarvationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerStarvationRange_${result.ID}">${result.Starvation}</p>

                                    <label for="FollowerSatiation_${result.ID}">Satiation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerSatiation_${result.ID}" value="${result.Satiation}" onInput="$('#FollowerSatiationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerSatiationRange_${result.ID}">${result.Satiation}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" from="FollowerForm_${result.ID}" data-bs-dismiss="modal" class="btn btn-primary">Save</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>`;
    });
    content += '</div>';
    container.insertAdjacentHTML('beforeend', content);

    // ! Check Follower Traits in Edit Modal
    obj.Followers_Recruit.forEach(function (follower) {
        follower.Traits.forEach(element => document.querySelector('input[id="FollowerTraits_' + follower.ID + element + '"][value="' + element + '"]').checked = true);
    });
}

function populateDeadFollowers() {
    // ! Dead Follower Stats
    var container = document.getElementById('nav-dead-followers');
    var content;

    if (obj.Followers_Dead.length == 0) {
        content = '<p>No Followers found</p></div>';
        container.insertAdjacentHTML('beforeend', content);
        return;
    }

    obj.Followers_Dead.forEach(function (result, i) {
        if (i == 0) {
            content = '<div class="row">';
        }

        if (i != 0 && i % 5 == 0) {
            content += '</div> <div class="row my-5">';
        }

        content +=
            `<div class="col">
                <div class="card" style="width: 16rem;">
                    <img src="assets/Follower_Forms/${result.SkinName}.png" onerror="this.src='assets/Follower_Forms/Unknown.png'" class="card-img-top" id="FollowerPortrait_${result.ID}" alt="Picture not available">
                    <div class="card-body">
                        <h5 class="card-title">
                            ${result.Name}
                        </h5>
                        <p class="card-text">
                            Level: <b>${result.XPLevel}</b>
                        </p>
                        <div class="row">
                            <div class="col">
                                <button type="button" class="btn btn-success" id="FollowerReviveButton_${result.ID}" onclick="reviveFollower(${result.ID})">
                                    Revive
                                </button>
                                <button type="button" class="btn btn-danger" id="FollowerDeleteButton_${result.ID}" data-bs-toggle="modal" data-bs-target="#ID_DELETE${result.ID}">
                                    Delete
                                </button>
                                <button type="button" class="btn btn-primary" id="FollowerEditButton_${result.ID}" data-bs-toggle="modal" data-bs-target="#ID${result.ID}">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="ID_DELETE${result.ID}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="Label_Delete${result.ID}" aria-hidden="true">
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
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="deleteFollower(${result.ID}, true)">Yes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="ID${result.ID}" data-bs-keyboard="false" tabindex="-1" aria-labelledby="Label_${result.ID}" aria-hidden="true">
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
                                    <input type="number" class="form-control" id="FollowerID_${result.ID}" value="${result.ID}">
                                    <span class="text-danger fw-bold" style="font-size:14px;">Changing IDs is dangerous and can corrupt your save file, back up your save first.</span><br/>

                                    <label for="FollowerLevel_${result.ID}" >Follower Level:</label>
                                    <input type="text" class="form-control" id="FollowerLevel_${result.ID}" value="${result.XPLevel}"><br/>

                                    <label for="FollowerAge_${result.ID}" >Follower Age:</label>
                                    <input type="text" class="form-control" id="FollowerAge_${result.ID}" value="${result.Age}"><br/>

                                    <label for="FollowerLifeExpectancy_${result.ID}" >Follower Life Expectancy:</label>
                                    <input type="text" class="form-control" id="FollowerLifeExpectancy_${result.ID}" value="${result.LifeExpectancy}"><br/>
                                </div>
                                <div class="col">
                                    <label for="FollowerName_${result.ID}">Follower Name:</label>
                                    <input type="text" class="form-control" id="FollowerName_${result.ID}" value="${result.Name}"><br/>

                                    <label for="FollowerDayJoined_${result.ID}" >Day Joined:</label>
                                    <input type="text" class="form-control" id="FollowerDayJoined_${result.ID}" value="${result.DayJoined}"><br/>

                                    <label for="FollowerMemberDuration_${result.ID}" >Days in your Cult:</label>
                                    <input type="text" class="form-control" id="FollowerMemberDuration_${result.ID}" value="${result.MemberDuration}"><br/>

                                    <label for="FollowerSacrificialValue_${result.ID}" >Sacrificial Value:</label>
                                    <input type="text" class="form-control" id="FollowerSacrificialValue_${result.ID}" value="${result.SacrificialValue}"><br/>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <label for="FollowerOutfit_${result.ID}" >Follower Outfit: <span class="text-muted" style="font-size:12px;">If the outfit isn't visible after editing, reload your game.</span></label>
                                    <select class="form-select" id="FollowerOutfit_${result.ID}" onchange="document.getElementById('FollowerOutfitPreview_${result.ID}').src = 'assets/Outfit_Preview/' + this.value + '.png' ">
                                        <option value="0" ${result.Outfit == 0 ? 'selected' : ''}>Pre Indoctrination clothes</option>
                                        <option value="1" ${result.Outfit == 1 ? 'selected' : ''}>Mission Backpack</option>
                                        <option value="2" ${result.Outfit == 2 ? 'selected' : ''}>Warrior Armor and Sword</option>
                                        <option value="3" ${result.Outfit == 3 ? 'selected' : ''}>Indoctrinated Clothes</option>
                                        <option value="7" ${result.Outfit == 7 ? 'selected' : ''}>Elderly Clothes</option>
                                        <option value="8" ${result.Outfit == 8 ? 'selected' : ''}>Holiday Shirt</option>
                                    </select>

                                    <br/>
                                    <p>Outfit Preview:</p>
                                    <image id="FollowerOutfitPreview_${result.ID}" class="mx-auto d-block" src="assets/Outfit_Preview/${result.Outfit}.png" alt="Outfit Preview not available">

                                    <hr/>

                                    <label for="FollowerSkinName_${result.ID}" >Follower Skin:</label>
                                    <select class="form-select" id="FollowerSkinName_${result.ID}" onchange="document.getElementById('FollowerSkinNamePreview_${result.ID}').src = 'assets/Follower_Forms/' + this.value + '.png' ">
                                        `;

        // ! Make sure only unlocked skins are available
        obj.FollowerSkinsUnlocked.forEach((skin) => {
            content += `<option value="${skin}" ${result.SkinName == skin ? 'selected' : ''}>${skin}</option>`;
        });

        content += `
                                    </select>

                                    <br/>
                                    <p>Skin Preview:</p>
                                    <image id="FollowerSkinNamePreview_${result.ID}" class="mx-auto d-block" src="assets/Follower_Forms/${result.SkinName}.png" alt="Form Preview not available">
                                </div>
                                <div class="col">
                                    <label for="FollowerNecklace_${result.ID}" >Follower Necklace: </label>
                                    <select class="form-select" id="FollowerNecklace_${result.ID}"
                                    onchange="document.getElementById('FollowerNecklacePreview_${result.ID}').src = 'assets/Necklace_Preview/' + this.value + '.png';
                                    document.getElementById('FollowerNecklacePreviewText_${result.ID}').innerHTML = necklaceDescriptionsMap.get(this.value)">
                                        <option value="0" ${result.Necklace == 0 ? 'selected' : ''}>-- None --</option>
                                        <option value="45" ${result.Necklace == 45 ? 'selected' : ''}>Flower Necklace</option>
                                        <option value="46" ${result.Necklace == 46 ? 'selected' : ''}>Feather Necklace</option>
                                        <option value="47" ${result.Necklace == 47 ? 'selected' : ''}>Skull Necklace</option>
                                        <option value="48" ${result.Necklace == 48 ? 'selected' : ''}>Natures Necklace</option>
                                        <option value="49" ${result.Necklace == 49 ? 'selected' : ''}>Moon Necklace</option>
                                    </select>

                                    <br/>
                                    <p>Necklace Preview:</p>
                                    <image id="FollowerNecklacePreview_${result.ID}" class="mx-auto d-block" height="80px" width="70px" src="assets/Necklace_Preview/${result.Necklace}.png" alt="Necklace Preview not available">
                                    <div class="text-center mt-4">
                                        <span id="FollowerNecklacePreviewText_${result.ID}" class="text-muted mb-3"></span>
                                    </div>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" name="FollowerIsStarving"
                                        id="FollowerIsStarving_${result.ID}" ${result.IsStarving ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerIsStarving_${result.ID}">Starving Indicator</label><br/>

                                    <input type="checkbox" class="form-check-input" name="FollowerMarriedToLeader"
                                        id="FollowerMarriedToLeader_${result.ID}" ${result.MarriedToLeader ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerMarriedToLeader_${result.ID}">Married to Leader</label><br/>
                                </div>
                                <div class="col">
                                    <input type="checkbox" class="form-check-input" name="FollowerTaxEnforcer"
                                            id="FollowerTaxEnforcer_${result.ID}" ${result.TaxEnforcer ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerTaxEnforcer_${result.ID}">Tax Enforcer</label><br/>

                                    <input type="checkbox" class="form-check-input" name="FollowerFaithEnforcer"
                                            id="FollowerFaithEnforcer_${result.ID}" ${result.FaithEnforcer ? 'checked' : ''}>
                                    <label class="form-check-label" for="FollowerFaithEnforcer_${result.ID}">Faith Enforcer</label><br/>
                                </div>
                            </div>

                            <br/>

                            <div class="row">
                                <div class="col">
                                    <h4>Follower Traits</h4>
                                    <hr/>

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

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}23" value="23">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/23.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}23">Coprophiliac</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}23">Gain 10 Faith when falling ill.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}21" value="21">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/21.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}21">Gullible</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}21">15% easier to level up.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}11" value="11">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/11.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}11">Faithful</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}11">Generates Devotion 15% faster.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}24" value="24">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/24.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}24">Industrious</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}24">Increased work speed by 15%.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}18" value="18">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/18.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}18">Materialistic</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}18">Gain Faith when building better sleeping quarters.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}2" value="2">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/2.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}2">Naturally Obedient</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}2">On recruiting this Follower immediately gain 10 Faith.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}16" value="16">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/16.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}16">Strong Constitution</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}16">Heals 15% faster when sick and in bed rest.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}17" value="17">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/17.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}17">Zealous</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}17">Ignores dissenters when they preach.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}32" value="32">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/32.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-success">Positive</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}32">Immortal</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}32">Will never reach old age.</label>
                                                </td>
                                            </tr>



                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}20" value="20">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/20.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}20">Cynical</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}20">15% harder to level up.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}12" value="12">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/12.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}12">Faithless</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}12">Generates Devotion 15% slower.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}22" value="22">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/22.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}22">Germaphobe</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}22">Lose 10 Faith when falling ill.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}1" value="1">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/1.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}1">Natural Skeptic</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}1">On recruiting Follower immediately lose 10 Faith.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}15" value="15">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/15.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}15">Sickly</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}15">Heals 15% slower when sick and in bed rest.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}25" value="25">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/25.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}25">Sloth</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}25">Work and devotion generation speed reduced by 10%.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}4" value="4">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/4.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}4">Terrified of Death</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}4">Lose -5 Faith whenever another Follower dies.</label>
                                                </td>
                                            </tr>

                                            <tr class="d-flex">
                                                <td class="col-1">
                                                    <input type="checkbox" class="form-check-input" name="FollowerTraits_${result.ID}"
                                                        id="FollowerTraits_${result.ID}10" value="10">
                                                </td>
                                                <td class="col-1" style="background-color:black;">
                                                    <image src="assets/Traits/10.png" alt="Trait Preview not available">
                                                </td>
                                                <td class="col-1">
                                                    <span class="text-danger">Negative</span>
                                                </td>
                                                <td class="col-3">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}10">Against Sacrifice</label>
                                                </td>
                                                <td class="col-6">
                                                    <label class="form-check-label" for="FollowerTraits_${result.ID}10">-5 Faith when a Follower is Sacrificed.</label>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <hr/>

                            <div class="row">
                                <div class="col">
                                    <label for="FollowerAdoration_${result.ID}">Adoration (XP to next level): </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerAdoration_${result.ID}" value="${result.Adoration}" onInput="$('#FollowerAdorationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerAdorationRange_${result.ID}">${result.Adoration}</p>

                                    <label for="FollowerFaith_${result.ID}">Faith: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerFaith_${result.ID}" value="${result.Faith}" onInput="$('#FollowerFaithRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerFaithRange_${result.ID}">${result.Faith}</p>

                                    <label for="FollowerHappiness_${result.ID}">Happiness: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerHappiness_${result.ID}" value="${result.Happiness}" onInput="$('#FollowerHappinessRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerHappinessRange_${result.ID}">${result.Happiness}</p>

                                    <label for="FollowerIllness_${result.ID}">Illness: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerIllness_${result.ID}" value="${result.Illness}" onInput="$('#FollowerIllnessRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerIllnessRange_${result.ID}">${result.Illness}</p>

                                    <label for="FollowerReeducation_${result.ID}">Reeducation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerReeducation_${result.ID}" value="${result.Reeducation}" onInput="$('#FollowerReeducationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerReeducationRange_${result.ID}">${result.Reeducation}</p>
                                </div>
                                <div class="col">
                                    <label for="FollowerExhaustion_${result.ID}">Exhaustion: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerExhaustion_${result.ID}" value="${result.Exhaustion}" onInput="$('#FollowerExhaustionRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerExhaustionRange_${result.ID}">${result.Exhaustion}</p>

                                    <label for="FollowerRest_${result.ID}">Rest: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerRest_${result.ID}" value="${result.Rest}" onInput="$('#FollowerRestRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerRestRange_${result.ID}">${result.Rest}</p>

                                    <label for="FollowerStarvation_${result.ID}">Starvation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerStarvation_${result.ID}" value="${result.Starvation}" onInput="$('#FollowerStarvationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerStarvationRange_${result.ID}">${result.Starvation}</p>

                                    <label for="FollowerSatiation_${result.ID}">Satiation: </label>
                                    <input type="range" class="form-range" min="0" max="100" step="1" id="FollowerSatiation_${result.ID}" value="${result.Satiation}" onInput="$('#FollowerSatiationRange_${result.ID}').html($(this).val())">
                                    <p id="FollowerSatiationRange_${result.ID}">${result.Satiation}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="submit" from="FollowerForm_${result.ID}" data-bs-dismiss="modal" class="btn btn-primary">Save</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>`;
    });
    content += '</div>';
    container.insertAdjacentHTML('beforeend', content);

    // ! Check Follower Traits in Edit Modal
    obj.Followers_Dead.forEach(function (follower) {
        follower.Traits.forEach(element => document.querySelector('input[id="FollowerTraits_' + follower.ID + element + '"][value="' + element + '"]').checked = true);
    });
}