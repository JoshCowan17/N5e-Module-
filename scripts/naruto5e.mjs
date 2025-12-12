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
 * Ninja Classes - Main character class archetypes
 */
const NINJA_CLASSES = {
  "ninjutsuSpecialist": {
    id: "ninjutsuSpecialist",
    label: "Ninjutsu Specialist",
    description: "A ninja who has dedicated their training to mastering ninjutsu techniques. They excel at manipulating chakra to perform powerful elemental and non-elemental jutsu.",
    hitDie: "d8",
    primaryAbility: "intelligence",
    savingThrows: ["intelligence", "wisdom"],
    skillChoices: 3,
    skillOptions: ["arcana", "history", "insight", "investigation", "nature", "perception"],
    features: {
      1: ["chakraPool", "elementalAffinity", "jutsuCasting"],
      2: ["chakraControl"],
      3: ["subclass"],
      5: ["extraJutsu"],
      6: ["subclassFeature"],
      9: ["advancedChakraControl"],
      10: ["subclassFeature"],
      14: ["subclassFeature"],
      18: ["masteryJutsu"],
      20: ["ultimateNinjutsu"]
    },
    subclasses: ["lightningBreaker", "flameWeaver", "aquaMaster", "earthShaper", "windCutter"]
  }
};

/**
 * Ninja Subclasses - Specializations within each class
 */
const NINJA_SUBCLASSES = {
  "lightningBreaker": {
    id: "lightningBreaker",
    label: "Lightning Breaker",
    parentClass: "ninjutsuSpecialist",
    description: "Lightning Breakers harness the raw power of Raiton (Lightning Release) to devastating effect. They specialize in high-speed attacks and can channel electricity through their bodies to enhance their combat abilities.",
    chakraNature: "lightning",
    features: {
      3: [{
        name: "Lightning Affinity",
        description: "You gain proficiency with Lightning Release jutsu. When you cast a lightning jutsu, you can add your Intelligence modifier to one damage roll of that jutsu. Additionally, you learn the Lightning Release: Spark cantrip if you don't already know it."
      }],
      6: [{
        name: "Overcharge Mastery",
        description: "When you use the Overcharge special mechanic on a lightning jutsu, you can choose to maximize the additional damage dice instead of rolling them. You can use this feature a number of times equal to your proficiency bonus, regaining all uses on a long rest."
      }],
      10: [{
        name: "Static Shield",
        description: "You can use your reaction when hit by a melee attack to deal 2d8 lightning damage to the attacker. Additionally, you gain resistance to lightning damage."
      }],
      14: [{
        name: "Thunderclap Assault",
        description: "When you hit a creature with a lightning jutsu, you can force it to make a Constitution saving throw against your jutsu save DC. On a failure, the creature is stunned until the end of your next turn. You can use this feature once per short or long rest."
      }]
    },
    bonusJutsu: ["sparkJutsu", "lightningBolt", "chidori"]
  }
};

/**
 * Class feature definitions
 */
const CLASS_FEATURES = {
  "chakraPool": {
    name: "Chakra Pool",
    description: "You have a pool of chakra points that you use to cast jutsu. Your chakra pool equals your class level + your Intelligence modifier (minimum of 1). You regain all spent chakra after a long rest."
  },
  "elementalAffinity": {
    name: "Elemental Affinity",
    description: "Choose a chakra nature (Fire, Water, Wind, Earth, or Lightning). You have advantage on learning jutsu of that element, and those jutsu cost 1 less chakra to cast (minimum 1)."
  },
  "jutsuCasting": {
    name: "Jutsu Casting",
    description: "You can cast jutsu using chakra points. Intelligence is your jutsu casting ability. Your jutsu save DC = 8 + your proficiency bonus + your Intelligence modifier. Your jutsu attack modifier = your proficiency bonus + your Intelligence modifier."
  },
  "chakraControl": {
    name: "Chakra Control",
    description: "You have learned to control your chakra more efficiently. Once per short rest, you can cast a jutsu of D-Rank or lower without spending chakra points."
  },
  "advancedChakraControl": {
    name: "Advanced Chakra Control",
    description: "Your Chakra Control feature now works with C-Rank jutsu or lower, and you can use it twice per short rest."
  },
  "extraJutsu": {
    name: "Extra Jutsu",
    description: "You learn two additional jutsu of your choice from any classification you have access to."
  },
  "masteryJutsu": {
    name: "Jutsu Mastery",
    description: "Choose one D-Rank and one C-Rank jutsu you know. You can cast these jutsu at their base rank without spending chakra."
  },
  "ultimateNinjutsu": {
    name: "Ultimate Ninjutsu",
    description: "You have achieved the pinnacle of ninjutsu mastery. Once per long rest, you can cast any S-Rank jutsu you know without spending chakra, and it deals maximum damage."
  }
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
    chakra: CHAKRA_CONFIG,
    ninjaClasses: NINJA_CLASSES,
    ninjaSubclasses: NINJA_SUBCLASSES,
    classFeatures: CLASS_FEATURES
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
 * Adds chakra display, ninja class info, and jutsu management UI elements
 */
Hooks.on('renderActorSheet', (app, html, data) => {
  try {
    if (!game.settings.get(MODULE_ID, 'useChakraSystem')) {
      console.log(`${MODULE_ID} | Chakra system disabled, skipping character sheet modifications`);
      return;
    }

    const actor = app.actor;
    if (actor.type !== 'character') return;

    console.log(`${MODULE_ID} | Rendering character sheet for ${actor.name}`);

    // Add chakra-themed styling
    html.find('.sheet-header').addClass('naruto5e-header');

    // Get or initialize ninja class data from actor flags
    const ninjaData = actor.getFlag(MODULE_ID, 'ninjaData') || {
      ninjaClass: null,
      subclass: null,
      chakraCurrent: 0,
      chakraMax: 0,
      knownJutsu: [],
      elementalAffinity: null
    };

    // Inject Ninja Class Section into the character sheet
    injectNinjaClassSection(html, actor, ninjaData);

    // Inject Jutsu Management Section
    injectJutsuSection(html, actor, ninjaData);

    console.log(`${MODULE_ID} | Character sheet modifications complete`);
  } catch (error) {
    console.error(`${MODULE_ID} | Error rendering character sheet:`, error);
  }
});

/**
 * Inject ninja class information section into character sheet
 */
function injectNinjaClassSection(html, actor, ninjaData) {
  // Find a good place to insert - after the header or in the features tab
  const featuresTab = html.find('.tab[data-tab="features"], .sheet-body');

  if (featuresTab.length === 0) {
    console.warn(`${MODULE_ID} | Could not find features tab or sheet body to inject ninja class section`);
    return;
  }

  console.log(`${MODULE_ID} | Injecting ninja class section`);

  // Check if section already exists to avoid duplicates
  if (html.find('.naruto5e-class-section').length > 0) {
    console.log(`${MODULE_ID} | Ninja class section already exists, skipping`);
    return;
  }

  // Build class selection dropdown options
  const classOptions = Object.entries(NINJA_CLASSES).map(([key, cls]) =>
    `<option value="${key}" ${ninjaData.ninjaClass === key ? 'selected' : ''}>${cls.label}</option>`
  ).join('');

  // Build subclass dropdown options based on selected class
  let subclassOptions = '<option value="">-- Select Subclass --</option>';
  if (ninjaData.ninjaClass && NINJA_CLASSES[ninjaData.ninjaClass]) {
    const availableSubclasses = NINJA_CLASSES[ninjaData.ninjaClass].subclasses || [];
    subclassOptions += availableSubclasses.map(subKey => {
      const sub = NINJA_SUBCLASSES[subKey];
      if (!sub) return '';
      return `<option value="${subKey}" ${ninjaData.subclass === subKey ? 'selected' : ''}>${sub.label}</option>`;
    }).join('');
  }

  // Build elemental affinity dropdown
  const affinityOptions = Object.entries(CHAKRA_NATURES).map(([key, nature]) =>
    `<option value="${key}" ${ninjaData.elementalAffinity === key ? 'selected' : ''}>${nature.label}</option>`
  ).join('');

  // Get class and subclass descriptions
  const selectedClass = NINJA_CLASSES[ninjaData.ninjaClass];
  const selectedSubclass = NINJA_SUBCLASSES[ninjaData.subclass];

  const classSection = `
    <section class="naruto5e-class-section">
      <h3 class="section-title">
        <i class="fas fa-bolt"></i>
        ${game.i18n.localize('NARUTO5E.NinjaClass')}
      </h3>
      <div class="naruto5e-class-content">
        <div class="naruto5e-class-row">
          <label>${game.i18n.localize('NARUTO5E.ClassSelect')}:</label>
          <select class="ninja-class-select" data-field="ninjaClass">
            <option value="">-- ${game.i18n.localize('NARUTO5E.SelectClass')} --</option>
            ${classOptions}
          </select>
        </div>
        ${selectedClass ? `
          <div class="naruto5e-class-description">
            <p><em>${selectedClass.description}</em></p>
            <p><strong>${game.i18n.localize('NARUTO5E.HitDie')}:</strong> ${selectedClass.hitDie}</p>
          </div>
        ` : ''}
        <div class="naruto5e-class-row">
          <label>${game.i18n.localize('NARUTO5E.SubclassSelect')}:</label>
          <select class="ninja-subclass-select" data-field="subclass" ${!ninjaData.ninjaClass ? 'disabled' : ''}>
            ${subclassOptions}
          </select>
        </div>
        ${selectedSubclass ? `
          <div class="naruto5e-subclass-description">
            <p><em>${selectedSubclass.description}</em></p>
            <div class="subclass-features">
              <strong>${game.i18n.localize('NARUTO5E.SubclassFeatures')}:</strong>
              <ul>
                ${Object.entries(selectedSubclass.features).map(([level, features]) =>
                  features.map(f => `<li><strong>Lv ${level}:</strong> ${f.name}</li>`).join('')
                ).join('')}
              </ul>
            </div>
          </div>
        ` : ''}
        <div class="naruto5e-class-row">
          <label>${game.i18n.localize('NARUTO5E.ElementalAffinity')}:</label>
          <select class="ninja-affinity-select" data-field="elementalAffinity">
            <option value="">-- ${game.i18n.localize('NARUTO5E.SelectAffinity')} --</option>
            ${affinityOptions}
          </select>
        </div>
        <div class="naruto5e-chakra-display">
          <label>${game.i18n.localize('NARUTO5E.Chakra')}:</label>
          <div class="chakra-inputs">
            <input type="number" class="chakra-current" value="${ninjaData.chakraCurrent}" min="0" data-field="chakraCurrent" placeholder="Current">
            <span>/</span>
            <input type="number" class="chakra-max" value="${ninjaData.chakraMax}" min="0" data-field="chakraMax" placeholder="Max">
          </div>
          <div class="chakra-resource">
            <div class="chakra-bar">
              <div class="chakra-bar-fill" style="width: ${ninjaData.chakraMax > 0 ? (ninjaData.chakraCurrent / ninjaData.chakraMax * 100) : 0}%"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  // Insert at the beginning of features tab or sheet body
  featuresTab.first().prepend(classSection);

  // Add event listeners for the class/subclass selectors
  html.find('.ninja-class-select').on('change', async (event) => {
    const newClass = event.target.value;
    await actor.setFlag(MODULE_ID, 'ninjaData', {
      ...ninjaData,
      ninjaClass: newClass || null,
      subclass: null // Reset subclass when class changes
    });
  });

  html.find('.ninja-subclass-select').on('change', async (event) => {
    const newSubclass = event.target.value;
    await actor.setFlag(MODULE_ID, 'ninjaData', {
      ...ninjaData,
      subclass: newSubclass || null
    });
  });

  html.find('.ninja-affinity-select').on('change', async (event) => {
    const newAffinity = event.target.value;
    await actor.setFlag(MODULE_ID, 'ninjaData', {
      ...ninjaData,
      elementalAffinity: newAffinity || null
    });
  });

  html.find('.chakra-current, .chakra-max').on('change', async (event) => {
    const field = event.target.dataset.field;
    const value = parseInt(event.target.value) || 0;
    await actor.setFlag(MODULE_ID, 'ninjaData', {
      ...ninjaData,
      [field]: value
    });
  });
}

/**
 * Inject jutsu management section into character sheet
 */
function injectJutsuSection(html, actor, ninjaData) {
  // Find spells/features section to add jutsu display
  const spellsTab = html.find('.tab[data-tab="spells"], .spellbook, .sheet-body');

  if (spellsTab.length === 0) {
    console.warn(`${MODULE_ID} | Could not find spells tab or sheet body to inject jutsu section`);
    return;
  }

  console.log(`${MODULE_ID} | Injecting jutsu section`);

  // Check if section already exists to avoid duplicates
  if (html.find('.naruto5e-jutsu-section').length > 0) {
    console.log(`${MODULE_ID} | Jutsu section already exists, skipping`);
    return;
  }

  // Get actor's spell items that have naruto5e flags (these are jutsu)
  const jutsuItems = actor.items.filter(item =>
    item.type === 'spell' && item.getFlag(MODULE_ID, 'classification')
  );

  // Group jutsu by classification
  const jutsuByClass = {};
  for (const jutsu of jutsuItems) {
    const classification = jutsu.getFlag(MODULE_ID, 'classification') || 'ninjutsu';
    if (!jutsuByClass[classification]) {
      jutsuByClass[classification] = [];
    }
    jutsuByClass[classification].push(jutsu);
  }

  // Build jutsu list HTML
  const jutsuListHtml = Object.entries(JUTSU_CLASSIFICATIONS).map(([classKey, classData]) => {
    const jutsuInClass = jutsuByClass[classKey] || [];
    return `
      <div class="jutsu-classification-group">
        <h4 class="jutsu-classification-header ${classKey}">
          ${classData.label}
          <span class="jutsu-count">(${jutsuInClass.length})</span>
        </h4>
        <ul class="jutsu-list">
          ${jutsuInClass.length > 0 ? jutsuInClass.map(jutsu => {
            const rank = jutsu.getFlag(MODULE_ID, 'rank') || 'e';
            const nature = jutsu.getFlag(MODULE_ID, 'chakraNature') || 'non-elemental';
            const chakraCost = jutsu.getFlag(MODULE_ID, 'chakraCost') || 0;
            return `
              <li class="jutsu-item" data-item-id="${jutsu.id}">
                <div class="jutsu-item-name">
                  <img src="${jutsu.img}" class="jutsu-icon" alt="${jutsu.name}">
                  <span>${jutsu.name}</span>
                </div>
                <span class="jutsu-rank rank-${rank}">${JUTSU_RANKS[rank]?.label || rank}</span>
                <span class="chakra-nature ${nature}">${CHAKRA_NATURES[nature]?.label || nature}</span>
                <span class="jutsu-cost">${chakraCost} CP</span>
                <button class="jutsu-use-btn" data-item-id="${jutsu.id}" title="${game.i18n.localize('NARUTO5E.ActionCast')}">
                  <i class="fas fa-hand-sparkles"></i>
                </button>
              </li>
            `;
          }).join('') : `<li class="no-jutsu">${game.i18n.localize('NARUTO5E.NoJutsuLearned')}</li>`}
        </ul>
      </div>
    `;
  }).join('');

  const jutsuSection = `
    <section class="naruto5e-jutsu-section">
      <h3 class="section-title">
        <i class="fas fa-fire"></i>
        ${game.i18n.localize('NARUTO5E.KnownJutsu')}
      </h3>
      <div class="jutsu-actions">
        <button class="add-jutsu-btn">
          <i class="fas fa-plus"></i>
          ${game.i18n.localize('NARUTO5E.AddJutsu')}
        </button>
        <button class="open-compendium-btn">
          <i class="fas fa-book"></i>
          ${game.i18n.localize('NARUTO5E.BrowseJutsu')}
        </button>
      </div>
      <div class="jutsu-list-container">
        ${jutsuListHtml}
      </div>
    </section>
  `;

  // Insert jutsu section
  spellsTab.first().prepend(jutsuSection);

  // Event listeners for jutsu actions
  html.find('.jutsu-use-btn').on('click', async (event) => {
    event.preventDefault();
    const itemId = event.currentTarget.dataset.itemId;
    const item = actor.items.get(itemId);
    if (item) {
      // Use the item (cast the jutsu)
      item.use();
    }
  });

  html.find('.jutsu-item').on('click', (event) => {
    if (event.target.closest('.jutsu-use-btn')) return;
    const itemId = event.currentTarget.dataset.itemId;
    const item = actor.items.get(itemId);
    if (item) {
      item.sheet.render(true);
    }
  });

  html.find('.add-jutsu-btn').on('click', async (event) => {
    event.preventDefault();
    // Open dialog to create a new jutsu
    openJutsuCreationDialog(actor);
  });

  html.find('.open-compendium-btn').on('click', async (event) => {
    event.preventDefault();
    // Open the jutsu compendium browser
    openJutsuCompendiumBrowser();
  });
}

/**
 * Open a dialog to create a new jutsu for the actor
 */
async function openJutsuCreationDialog(actor) {
  // Build classification options
  const classificationOptions = Object.entries(JUTSU_CLASSIFICATIONS)
    .map(([key, cls]) => `<option value="${key}">${cls.label}</option>`).join('');

  // Build rank options
  const rankOptions = Object.entries(JUTSU_RANKS)
    .map(([key, rank]) => `<option value="${key}">${rank.label}</option>`).join('');

  // Build nature options
  const natureOptions = Object.entries(CHAKRA_NATURES)
    .map(([key, nature]) => `<option value="${key}">${nature.label}</option>`).join('');

  const content = `
    <form class="naruto5e-jutsu-form">
      <div class="form-group">
        <label>${game.i18n.localize('NARUTO5E.JutsuName')}:</label>
        <input type="text" name="name" required placeholder="e.g., Fire Release: Fireball Jutsu">
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('NARUTO5E.JutsuClassification')}:</label>
        <select name="classification">${classificationOptions}</select>
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('NARUTO5E.JutsuRank')}:</label>
        <select name="rank">${rankOptions}</select>
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('NARUTO5E.ChakraNature')}:</label>
        <select name="chakraNature">${natureOptions}</select>
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('NARUTO5E.ChakraCost')}:</label>
        <input type="number" name="chakraCost" value="0" min="0">
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('NARUTO5E.Description')}:</label>
        <textarea name="description" rows="4" placeholder="Describe the jutsu's effects..."></textarea>
      </div>
    </form>
  `;

  const result = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize('NARUTO5E.CreateJutsu') },
    content: content,
    ok: {
      label: game.i18n.localize('NARUTO5E.Create'),
      icon: 'fas fa-check',
      callback: (event, button, dialog) => {
        const form = dialog.querySelector('form');
        const formData = new FormData(form);
        return Object.fromEntries(formData.entries());
      }
    }
  });

  if (result && result.name) {
    // Create the jutsu item
    const rank = result.rank || 'e';
    const jutsuData = {
      name: result.name,
      type: 'spell',
      img: CHAKRA_NATURES[result.chakraNature]?.icon || 'icons/magic/symbols/question-stone-yellow.webp',
      system: {
        level: JUTSU_RANKS[rank]?.level || 0,
        school: 'evo',
        description: {
          value: result.description || ''
        },
        activation: {
          type: 'action',
          cost: 1
        }
      },
      flags: {
        [MODULE_ID]: {
          classification: result.classification || 'ninjutsu',
          rank: rank,
          chakraNature: result.chakraNature || 'non-elemental',
          chakraCost: parseInt(result.chakraCost) || JUTSU_RANKS[rank]?.baseCost || 0,
          components: ['HS', 'CM'],
          keywords: []
        }
      }
    };

    await actor.createEmbeddedDocuments('Item', [jutsuData]);
    ui.notifications.info(`${game.i18n.localize('NARUTO5E.JutsuCreated')}: ${result.name}`);
  }
}

/**
 * Open the jutsu compendium browser
 */
function openJutsuCompendiumBrowser() {
  // Try to open the compendium browser filtered to jutsu packs
  const packs = game.packs.filter(p =>
    p.metadata.system === 'dnd5e' &&
    p.metadata.packageName === MODULE_ID &&
    p.metadata.type === 'Item'
  );

  if (packs.length > 0) {
    // Open the first jutsu pack
    packs[0].render(true);
  } else {
    ui.notifications.info(game.i18n.localize('NARUTO5E.NoCompendiumsAvailable'));
  }
}

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
  NINJA_CLASSES,
  NINJA_SUBCLASSES,
  CLASS_FEATURES,
  getSpecialMechanic,
  calculateChakraCost,
  formatJutsuChat,
  openJutsuCreationDialog,
  openJutsuCompendiumBrowser
};
