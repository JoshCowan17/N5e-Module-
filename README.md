# Naruto 5e Module for Foundry VTT

A Foundry VTT module that converts the D&D 5e system to support the Naruto 5e homebrew ruleset. Includes clans, jutsu, classes, and ninja-themed mechanics.

## Features

- **Jutsu Compendiums**: Organized by classification and element
  - Ninjutsu (Non-Elemental, Fire, Water, Wind, Earth, Lightning)
  - Genjutsu
  - Taijutsu
  - Bukijutsu
  - Summoning Jutsu
- **Clan System**: Clans with unique abilities and kekkei genkai
- **Ninja Tools**: Equipment and consumables for ninja characters
- **Chakra System**: Optional chakra point system to replace spell slots
- **Overcharge Mechanics**: Element-specific power-ups for jutsu
- **Ninja-themed UI**: Custom styling for character sheets and items

## Requirements

- Foundry VTT v13 or higher
- D&D 5e System v4.0.0 or higher

## Installation

### Manual Installation

1. Download the latest release
2. Extract to your Foundry VTT `Data/modules/` directory
3. Rename the folder to `naruto5e`
4. Enable the module in your world

### Manifest URL

```
https://github.com/[your-username]/naruto5e-module/releases/latest/download/module.json
```

## Module Structure

```
naruto5e/
├── module.json              # Module manifest
├── scripts/
│   └── naruto5e.mjs         # Main module script
├── styles/
│   └── naruto5e.css         # Module styling
├── lang/
│   └── en.json              # English translations
├── templates/
│   └── jutsu-examples.json  # Sample jutsu for reference
└── packs/
    ├── ninjutsu-non-elemental/
    ├── ninjutsu-earth/
    ├── ninjutsu-wind/
    ├── ninjutsu-fire/
    ├── ninjutsu-water/
    ├── ninjutsu-lightning/
    ├── summoning-jutsu/
    ├── genjutsu/
    ├── taijutsu/
    ├── bukijutsu/
    ├── clans/
    ├── class-features/
    ├── clan-features/
    └── ninja-tools/
```

## Jutsu System

### Classifications

| Classification | Description |
|---------------|-------------|
| Ninjutsu | Techniques using chakra and hand seals |
| Taijutsu | Physical combat techniques |
| Genjutsu | Illusion techniques |
| Bukijutsu | Weapon techniques |
| Summoning | Techniques to summon creatures |

### Jutsu Ranks

| Rank | Spell Level | Base Chakra Cost |
|------|-------------|------------------|
| E-Rank | Cantrip (0) | 0 |
| D-Rank | 1st Level | 2 |
| C-Rank | 2nd Level | 5 |
| B-Rank | 3rd Level | 8 |
| A-Rank | 4th Level | 11 |
| S-Rank | 5th Level | 14 |

### Special Mechanics

Each jutsu can have a special mechanic slot. Elemental ninjutsu default to their element's mechanic, but any jutsu can override this.

| Element | Default Mechanic |
|---------|------------------|
| Fire (Katon) | Burned |
| Water (Suiton) | Near |
| Wind (Futon) | Swirl |
| Earth (Doton) | Quake Shards |
| Lightning (Raiton) | Overcharge |

**Usage:** Set `specialMechanic` in jutsu flags to:
- `"default"` - Uses element's default mechanic
- `"burned"`, `"near"`, `"swirl"`, `"quake shards"`, `"overcharge"` - Specific mechanic
- `"none"` - No special mechanic (for non-elemental jutsu)

### Components

- **HS** - Hand Seals: Requires performing hand seals
- **CM** - Chakra Molding: Requires molding chakra
- **M** - Material: Requires material components
- **V** - Verbal: Requires speaking the technique name

### Creating Jutsu

Jutsu are created as spell items in Foundry VTT with additional flags for Naruto 5e data. See `templates/jutsu-examples.json` for reference examples including:

- Lightning Release: Chidori (C-Rank Ninjutsu)
- Fire Release: Fireball Jutsu (C-Rank Ninjutsu)
- Shadow Clone Jutsu (B-Rank Ninjutsu)
- Substitution Jutsu (E-Rank Ninjutsu)
- Rasengan (A-Rank Ninjutsu)
- Water Release: Water Dragon Jutsu (B-Rank Ninjutsu)
- Leaf Hurricane (D-Rank Taijutsu)
- Demonic Illusion: Hell Viewing (D-Rank Genjutsu)

## Configuration

The module includes the following settings (found in Module Settings):

- **Use Chakra System**: Toggle the chakra point system on/off
- **Chakra Recovery**: Set when chakra recovers (Short Rest or Long Rest)
- **Show Hand Seals**: Display hand seal sequences on jutsu

## Summoning Animals

The module supports 20 summoning animal types from the sourcebook:
Bear, Boar, Deer, Dog/Wolf, Fox, Hare/Rabbit, Hawk, Insect Swarm, Lizard, Monkey, Ox/Ram, Rat, Shark, Slug, Snake, Spider, Tiger/Lion, Toad, Turtle, Weasel

## License

This is a fan-made module for personal use. Naruto is a trademark of Masashi Kishimoto and Shueisha.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.
