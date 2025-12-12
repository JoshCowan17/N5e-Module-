/**
 * Naruto 5e Module for Foundry VTT
 * Converts the D&D 5e system to support the Naruto 5e homebrew ruleset.
 * Includes clans, jutsu, classes, and ninja-themed mechanics.
 */

// Module Constants
const MODULE_ID = 'naruto5e';

/**
 * Chakra resource configuration for the Naruto 5e system
 * Replaces traditional spell slots with chakra points
 */
const CHAKRA_CONFIG = {
  resource: {
    label: "Chakra",
    abbreviation: "CP"
  }
};

/**
 * Jutsu rank configuration
 * Maps jutsu ranks to their equivalent spell levels and base chakra costs
 */
const JUTSU_RANKS = {
  "e": { label: "E-Rank", level: 0, baseCost: 0 },
  "d": { label: "D-Rank", level: 1, baseCost: 2 },
  "c": { label: "C-Rank", level: 2, baseCost: 5 },
  "b": { label: "B-Rank", level: 3, baseCost: 8 },
  "a": { label: "A-Rank", level: 4, baseCost: 11 },
  "s": { label: "S-Rank", level: 5, baseCost: 14 }
};

/**
 * Jutsu classification types
 */
const JUTSU_CLASSIFICATIONS = {
  "ninjutsu": { label: "Ninjutsu", description: "Techniques using chakra and hand seals" },
  "taijutsu": { label: "Taijutsu", description: "Physical combat techniques" },
  "genjutsu": { label: "Genjutsu", description: "Illusion techniques" },
  "bukijutsu": { label: "Bukijutsu", description: "Weapon techniques" },
  "summoning": { label: "Summoning Jutsu", description: "Techniques to summon creatures" }
};

/**
 * Special Mechanics - Element-specific bonus abilities that can be applied to jutsu
 * Each jutsu can have a special mechanic slot that references one of these
 * Use Bonus Action or Reaction to activate when casting the jutsu
 */
const SPECIAL_MECHANICS = {
  // Elemental mechanics (for ninjutsu)
  "burned": {
    id: "ignite",
    label: "Ignite",
    element: "fire",
    description: "A condition that lasts up to a minute. A creature takes 1d8 fire damage for each stack (up to 5) at the start of their turn." // To be filled from sourcebook
  },
  "near": {
    id: "near",
    label: "Near",
    element: "water",
    description: "If near a body of water or an effect subsituting this, you can bolster your jutsu and use it to greater effect." // To be filled from sourcebook
  },
  "swirl;": {
    id: "swirl",
    label: "Swirld",
    element: "wind",
    description: "Some Wind release jutsu will mention that they cause Swirl, when this happens, Creatures who would fail their Saving Throw, spreads all Elemental conditions currently affecting them around to all creatures, excluding the caster within 5 feet of them. Creatures hostile to the caster within 5 feet of the failing one gains 1 rank of all elemental conditions currently affecting it." // To be filled from sourcebook
  },
  "quake shards": {
    id: "quake shards",
    label: "Quake Shards",
    element: "earth",
    description: "Some Earth Release Jutsu create or interact with Quake Shards, gaining unique benefits and allowing for synergy with other Earth Release Jutsu, as long as the Quake Shard was created by you! Also, all structures and Constructs made by a Ninjutsu with the Earth Release Keyword have Resistance to Cold Damage and Vulnerability to Lightning Damage, even if the jutsu does not specifically state this, including creatures that temporarily count as Constructs. While Constructs made to intercept damage also have these Vulnerabilities and Resistances, they only apply to the Construct, any penetrating damage is taken as normal." // To be filled from sourcebook
  },
  "overcharge": {
    id: "overcharge",
    label: "Overcharge",
    element: "lightning",
    description: "The Jutsu can be overcharged to use your bonus action or action. And sometimes add an additional effect." // To be filled from sourcebook
  },
  // Non-elemental / other classification mechanics can be added here
  "none": {
    id: "none",
    label: "None",
    element: null,
    description: ""
  }
};

/**
 * Map chakra natures to their default special mechanic
 */
const NATURE_MECHANIC_MAP = {
  "fire": "ignite",
  "water": "drench",
  "wind": "gale",
  "earth": "fortify",
  "lightning": "overcharge",
  "non-elemental": "none",
  "yin": "none",
  "yang": "none"
};

/**
 * Chakra nature types
 */
const CHAKRA_NATURES = {
  "non-elemental": {
    label: "Non-Elemental",
    icon: "icons/magic/symbols/question-stone-yellow.webp",
    defaultMechanic: "none"
  },
  "fire": {
    label: "Fire Release (Katon)",
    icon: "icons/magic/fire/flame-burning-hand-red.webp",
    defaultMechanic: "ignite"
  },
  "water": {
    label: "Water Release (Suiton)",
    icon: "icons/magic/water/wave-water-blue.webp",
    defaultMechanic: "drench"
  },
  "wind": {
    label: "Wind Release (Futon)",
    icon: "icons/magic/air/wind-swirl-gray.webp",
    defaultMechanic: "gale"
  },
  "earth": {
    label: "Earth Release (Doton)",
    icon: "icons/magic/earth/rock-boulder-brown.webp",
    defaultMechanic: "fortify"
  },
  "lightning": {
    label: "Lightning Release (Raiton)",
    icon: "icons/magic/lightning/bolt-strike-blue.webp",
    defaultMechanic: "overcharge"
  },
  "yin": {
    label: "Yin Release (Inton)",
    icon: "icons/magic/unholy/silhouette-evil-horned-giant.webp",
    defaultMechanic: "none"
  },
  "yang": {
    label: "Yang Release (Yoton)",
    icon: "icons/magic/holy/angel-winged-humanoid-yellow.webp",
    defaultMechanic: "none"
  }
};

/**
 * Jutsu components
 */
const JUTSU_COMPONENTS = {
  "HS": { label: "Hand Seals", description: "Requires performing hand seals to cast" },
  "CM": { label: "Chakra Molding", description: "Requires molding chakra" },
  "M": { label: "Material", description: "Requires material components" },
  "V": { label: "Verbal", description: "Requires speaking or calling out the technique name" }
};

/**
 * Jutsu keywords for special properties
 */
const JUTSU_KEYWORDS = {
  "clash": { label: "Clash", description: "Can be used to contest another jutsu" },
  "concentration": { label: "Concentration", description: "Requires concentration to maintain" },
  "ritual": { label: "Ritual", description: "Can be cast as a ritual" },
  "melee": { label: "Melee", description: "Melee range technique" },
  "ranged": { label: "Ranged", description: "Ranged technique" },
  "aoe": { label: "Area of Effect", description: "Affects an area" }
};

/**
 * Summoning animal types
 */
const SUMMONING_ANIMALS = {
  "bear": "Bear",
  "boar": "Boar",
  "deer": "Deer",
  "dog": "Dog/Wolf",
  "fox": "Fox",
  "hare": "Hare/Rabbit",
  "hawk": "Hawk/Predator Birds",
  "insect": "Insect Swarm",
  "lizard": "Lizard",
  "monkey": "Monkey/Primate",
  "ox": "Ox/Ram",
  "rat": "Rat",
  "shark": "Shark/Predator Fish",
  "slug": "Slug",
  "snake": "Snake",
  "spider": "Spider",
  "tiger": "Tiger/Lion",
  "toad": "Toad",
  "turtle": "Turtle",
  "weasel": "Weasel"
};

/**
 * Ninja ranks for characters
 */
const NINJA_RANKS = {
  "academy": { label: "Academy Student", level: 1 },
  "genin": { label: "Genin", level: 2 },
  "chunin": { label: "Chunin", level: 5 },
  "specialJonin": { label: "Special Jonin", level: 8 },
  "jonin": { label: "Jonin", level: 11 },
  "anbu": { label: "ANBU", level: 13 },
  "kage": { label: "Kage", level: 17 },
  "missingNin": { label: "Missing-nin", level: null }
};

/**
 * Hand seals for jutsu
 */
const HAND_SEALS = {
  "bird": "Bird (Tori)",
  "boar": "Boar (I)",
  "dog": "Dog (Inu)",
  "dragon": "Dragon (Tatsu)",
  "hare": "Hare (U)",
  "horse": "Horse (Uma)",
  "monkey": "Monkey (Saru)",
  "ox": "Ox (Ushi)",
  "ram": "Ram (Hitsuji)",
  "rat": "Rat (Ne)",
  "serpent": "Serpent (Mi)",
  "tiger": "Tiger (Tora)"
};

/**
 * Get the special mechanic for a jutsu based on its element or override
 * @param {Object} jutsuFlags - The naruto5e flags on the jutsu item
 * @returns {Object|null} The special mechanic configuration
 */
function getSpecialMechanic(jutsuFlags) {
  // If jutsu has a specific mechanic override, use that
  if (jutsuFlags.specialMechanic && jutsuFlags.specialMechanic !== "default") {
    return SPECIAL_MECHANICS[jutsuFlags.specialMechanic] || null;
  }

  // Otherwise, get the default mechanic for the element
  const nature = jutsuFlags.chakraNature;
  if (nature && CHAKRA_NATURES[nature]) {
    const defaultMechanic = CHAKRA_NATURES[nature].defaultMechanic;
    return SPECIAL_MECHANICS[defaultMechanic] || null;
  }

  return null;
}

/**
 * Hook that runs when Foundry is initialized
 */
Hooks.once('init', async function() {
  console.log(`${MODULE_ID} | Initializing Naruto 5e Module`);

  // Register module settings
  registerSettings();

  // Add custom config options to the dnd5e system
  CONFIG.DND5E.naruto5e = {
    chakraNatures: CHAKRA_NATURES,
    jutsuRanks: JUTSU_RANKS,
    jutsuClassifications: JUTSU_CLASSIFICATIONS,
    jutsuComponents: JUTSU_COMPONENTS,
    jutsuKeywords: JUTSU_KEYWORDS,
    specialMechanics: SPECIAL_MECHANICS,
    natureMechanicMap: NATURE_MECHANIC_MAP,
    summoningAnimals: SUMMONING_ANIMALS,
    ninjaRanks: NINJA_RANKS,
    handSeals: HAND_SEALS,
    chakra: CHAKRA_CONFIG
  };

  // Register custom Handlebars helpers
  registerHandlebarsHelpers();

  // Register item sheet changes
  registerItemSheetChanges();

  console.log(`${MODULE_ID} | Naruto 5e Module Initialized`);
});

/**
 * Hook that runs when Foundry is ready
 */
Hooks.once('ready', async function() {
  console.log(`${MODULE_ID} | Naruto 5e Module Ready`);

  // Display welcome message on first load
  if (game.user.isGM) {
    const hasShownWelcome = game.settings.get(MODULE_ID, 'hasShownWelcome');
    if (!hasShownWelcome) {
      showWelcomeDialog();
      game.settings.set(MODULE_ID, 'hasShownWelcome', true);
    }
  }
});

/**
 * Register module settings
 */
function registerSettings() {
  game.settings.register(MODULE_ID, 'hasShownWelcome', {
    name: 'Has Shown Welcome',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register(MODULE_ID, 'useChakraSystem', {
    name: 'NARUTO5E.SettingUseChakra',
    hint: 'NARUTO5E.SettingUseChakraHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, 'chakraRecoveryRate', {
    name: 'NARUTO5E.SettingChakraRecovery',
    hint: 'NARUTO5E.SettingChakraRecoveryHint',
    scope: 'world',
    config: true,
    type: String,
    choices: {
      'short': 'NARUTO5E.RecoveryShort',
      'long': 'NARUTO5E.RecoveryLong'
    },
    default: 'long'
  });

  game.settings.register(MODULE_ID, 'showHandSeals', {
    name: 'NARUTO5E.SettingShowHandSeals',
    hint: 'NARUTO5E.SettingShowHandSealsHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });
}

/**
 * Register custom Handlebars helpers
 */
function registerHandlebarsHelpers() {
  Handlebars.registerHelper('jutsuRank', function(rank) {
    return JUTSU_RANKS[rank]?.label || rank;
  });

  Handlebars.registerHelper('chakraNature', function(nature) {
    return CHAKRA_NATURES[nature]?.label || nature;
  });

  Handlebars.registerHelper('jutsuClassification', function(classification) {
    return JUTSU_CLASSIFICATIONS[classification]?.label || classification;
  });

  Handlebars.registerHelper('jutsuComponent', function(component) {
    return JUTSU_COMPONENTS[component]?.label || component;
  });

  Handlebars.registerHelper('handSeal', function(seal) {
    return HAND_SEALS[seal] || seal;
  });

  Handlebars.registerHelper('specialMechanic', function(mechanicId) {
    return SPECIAL_MECHANICS[mechanicId]?.label || mechanicId;
  });
}

/**
 * Register item sheet changes for jutsu
 */
function registerItemSheetChanges() {
  // Add flags for jutsu-specific data
  CONFIG.DND5E.itemProperties = CONFIG.DND5E.itemProperties || {};

  // Add jutsu-related item flags
  if (typeof libWrapper !== 'undefined') {
    // If libWrapper is available, use it for compatibility
    console.log(`${MODULE_ID} | libWrapper detected, using for compatibility`);
  }
}

/**
 * Display welcome dialog to GM
 * Uses ApplicationV2 API (DialogV2) for Foundry VTT v12+
 */
async function showWelcomeDialog() {
  const content = `
    <div class="naruto5e-welcome">
      <h2>${game.i18n.localize('NARUTO5E.WelcomeHeader')}</h2>
      <p>${game.i18n.localize('NARUTO5E.WelcomeMessage')}</p>
      <ul>
        <li><strong>${game.i18n.localize('NARUTO5E.WelcomeFeature1')}</strong></li>
        <li><strong>${game.i18n.localize('NARUTO5E.WelcomeFeature2')}</strong></li>
        <li><strong>${game.i18n.localize('NARUTO5E.WelcomeFeature3')}</strong></li>
        <li><strong>${game.i18n.localize('NARUTO5E.WelcomeFeature4')}</strong></li>
      </ul>
    </div>
  `;

  await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize('NARUTO5E.WelcomeTitle') },
    content: content,
    ok: {
      label: game.i18n.localize('NARUTO5E.WelcomeButton'),
      icon: 'fas fa-check'
    }
  });
}

/**
 * Hook to modify actor sheets
 * Adds chakra display and ninja-specific UI elements
 */
Hooks.on('renderActorSheet', (app, html, data) => {
  if (!game.settings.get(MODULE_ID, 'useChakraSystem')) return;

  const actor = app.actor;
  if (actor.type !== 'character') return;

  // Add chakra-themed styling
  html.find('.sheet-header').addClass('naruto5e-header');
});

/**
 * Hook to modify item sheets
 * Adds jutsu-specific fields for spell items
 */
Hooks.on('renderItemSheet', (app, html, data) => {
  const item = app.item;

  // Check if this is a spell/jutsu item
  if (item.type === 'spell') {
    // Add jutsu rank selector if not present
    const spellDetails = html.find('.spell-details');
    if (spellDetails.length) {
      spellDetails.addClass('jutsu-details');
    }
  }
});

/**
 * Calculate chakra cost for a jutsu at a given rank
 * @param {string} baseRank - The base rank of the jutsu (e, d, c, b, a, s)
 * @param {string} castRank - The rank being cast at
 * @returns {number} The chakra cost
 */
function calculateChakraCost(baseRank, castRank = null) {
  const ranks = ['e', 'd', 'c', 'b', 'a', 's'];
  const targetRank = castRank || baseRank;

  const baseConfig = JUTSU_RANKS[baseRank];
  const targetConfig = JUTSU_RANKS[targetRank];

  if (!baseConfig || !targetConfig) return 0;

  const rankDiff = ranks.indexOf(targetRank) - ranks.indexOf(baseRank);
  if (rankDiff < 0) return baseConfig.baseCost;

  // Each rank above base adds 3 chakra cost
  return baseConfig.baseCost + (rankDiff * 3);
}

/**
 * Format jutsu description for chat message
 * @param {Object} jutsu - The jutsu item data
 * @returns {string} Formatted HTML string
 */
function formatJutsuChat(jutsu) {
  const flags = jutsu.flags?.[MODULE_ID] || {};
  const nature = CHAKRA_NATURES[flags.chakraNature];
  const classification = JUTSU_CLASSIFICATIONS[flags.classification];
  const rank = JUTSU_RANKS[flags.rank];
  const mechanic = getSpecialMechanic(flags);

  return `
    <div class="jutsu-card">
      <div class="jutsu-header">
        <span class="jutsu-name">${jutsu.name}</span>
        <span class="jutsu-rank rank-${flags.rank}">${rank?.label || ''}</span>
      </div>
      <div class="jutsu-body">
        <div class="jutsu-properties">
          ${classification ? `<span class="jutsu-classification">${classification.label}</span>` : ''}
          ${nature ? `<span class="chakra-nature ${flags.chakraNature}">${nature.label}</span>` : ''}
        </div>
        <div class="jutsu-stats">
          <p><strong>Chakra Cost:</strong> ${flags.chakraCost || 0}</p>
          <p><strong>Casting Time:</strong> ${jutsu.system?.activation?.type || '1 Action'}</p>
          <p><strong>Range:</strong> ${jutsu.system?.range?.value || 'Self'} ${jutsu.system?.range?.units || ''}</p>
          <p><strong>Duration:</strong> ${jutsu.system?.duration?.value || 'Instantaneous'} ${jutsu.system?.duration?.units || ''}</p>
        </div>
        <div class="jutsu-description">
          ${jutsu.system?.description?.value || ''}
        </div>
        ${mechanic && mechanic.id !== 'none' ? `
          <div class="jutsu-special-mechanic">
            <strong>${mechanic.label}.</strong> ${mechanic.description || '(Special mechanic effect)'}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// Export for external use
export {
  MODULE_ID,
  CHAKRA_CONFIG,
  JUTSU_RANKS,
  JUTSU_CLASSIFICATIONS,
  CHAKRA_NATURES,
  JUTSU_COMPONENTS,
  JUTSU_KEYWORDS,
  SPECIAL_MECHANICS,
  NATURE_MECHANIC_MAP,
  SUMMONING_ANIMALS,
  NINJA_RANKS,
  HAND_SEALS,
  getSpecialMechanic,
  calculateChakraCost,
  formatJutsuChat
};
