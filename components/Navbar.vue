<template>
    <nav>
        <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <NuxtLink to="/" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link active" id="nav-cult-tab" data-bs-toggle="tab" data-bs-target="#nav-cult"
                    type="button" role="tab" aria-controls="nav-cult" aria-selected="true">
                    Cult &amp; Character
                </button>
            </NuxtLink>
            <NuxtLink to="/inventory-editor" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link" id="nav-inventory-tab" data-bs-toggle="tab" data-bs-target="#nav-inventory"
                    type="button" role="tab" aria-controls="nav-inventory" aria-selected="false">Inventory
                    Editor</button>
            </NuxtLink>
            <NuxtLink to="/tarot-cards" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link" id="nav-tarot-tab" data-bs-toggle="tab" data-bs-target="#nav-tarot"
                    type="button" role="tab" aria-controls="nav-tarot" aria-selected="false">Tarot Cards</button>
            </NuxtLink>
            <NuxtLink to="/followers" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link" id="nav-followers-tab" data-bs-toggle="tab" data-bs-target="#nav-followers"
                    type="button" role="tab" aria-controls="nav-followers" aria-selected="false">Followers</button>
            </NuxtLink>
            <NuxtLink to="/recruiting-followers" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link" id="nav-recruiting-followers-tab" data-bs-toggle="tab"
                    data-bs-target="#nav-recruiting-followers" type="button" role="tab"
                    aria-controls="nav-recruiting-followers" aria-selected="false">Recruiting Followers</button>
            </NuxtLink>
            <NuxtLink to="/dead-followers" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link" id="nav-dead-followers-tab" data-bs-toggle="tab"
                    data-bs-target="#nav-dead-followers" type="button" role="tab" aria-controls="nav-dead-followers"
                    aria-selected="false">Dead Followers</button>
            </NuxtLink>
            <NuxtLink to="/building-unlocks" style="color: inherit; text-decoration: inherit;">
                <button class="nav-link" id="nav-buildings-tab" data-bs-toggle="tab" data-bs-target="#nav-buildings"
                    type="button" role="tab" aria-controls="nav-buildings" aria-selected="false">Building
                    Unlocks</button>
            </NuxtLink>
        </div>
    </nav>
</template>