# Naruto 5e Character Sheet Testing Guide

This guide will help you test the character sheet functionality of the Naruto 5e module.

## Prerequisites

1. **Foundry VTT v13** or later installed
2. **D&D 5e System** (v4.0.0 or later) installed
3. The **Naruto 5e module** installed and enabled in your world

## Installation

1. Copy the `naruto5e` folder to your Foundry VTT modules directory:
   - **Windows**: `%localappdata%/FoundryVTT/Data/modules/`
   - **macOS**: `~/Library/Application Support/FoundryVTT/Data/modules/`
   - **Linux**: `~/.local/share/FoundryVTT/Data/modules/`

2. Launch Foundry VTT and create or open a world using the **D&D 5e** system

3. Go to **Game Settings** → **Manage Modules** and enable **Naruto 5e**

4. Save and reload your world

## Testing the Character Sheet

### Step 1: Create a Test Character

1. Click **Actors Directory** → **Create Actor**
2. Set **Type** to **Character**
3. Name it "Test Ninja" or any name you prefer
4. Click **Create**

### Step 2: Verify Module is Loaded

1. Open the character sheet for your new character
2. Open the browser's **Developer Console** (F12)
3. Look for console messages starting with `naruto5e |`
4. You should see:
   ```
   naruto5e | Initializing Naruto 5e Module
   naruto5e | Naruto 5e Module Initialized
   naruto5e | Naruto 5e Module Ready
   naruto5e | Rendering character sheet for Test Ninja
   naruto5e | Injecting ninja class section
   naruto5e | Injecting jutsu section
   naruto5e | Character sheet modifications complete
   ```

### Step 3: Check the Clan Section

The character sheet should have a **Clan** section in the Details/Biography tab with:

- **Clan Name**: Text input for clan name (e.g., Uchiha, Hyuga)
- **Kekkei Genkai**: Text input for bloodline ability
- **Clan Description**: Textarea for clan history and details

**Test Actions:**
1. Navigate to the **Details** or **Biography** tab
2. You should see the Clan section at the top with earth-tone styling
3. Fill in the fields:
   - **Clan Name**: "Uchiha"
   - **Kekkei Genkai**: "Sharingan"
   - **Clan Description**: "The Uchiha clan was known for their powerful Sharingan..."
4. Close and reopen the character sheet
5. Values should be persisted

### Step 4: Check the Ninja Background Section

Below the Clan section, you should see a **Ninja Background** section with:

- **Ambition**: What drives your character to greatness
- **Drive**: What motivates your character day-to-day
- **Goals**: What your character hopes to achieve
- **Fears**: What your character fears most

**Test Actions:**
1. Still in the Details/Biography tab, scroll down to the Background section
2. Fill in the narrative fields:
   - **Ambition**: "To become the strongest shinobi in the village"
   - **Drive**: "To prove myself worthy of my clan's legacy"
   - **Goals**: "Master all fire release techniques and awaken the Mangekyo Sharingan"
   - **Fears**: "Losing my loved ones and failing to protect the village"
3. Close and reopen the character sheet
4. Values should be saved

### Step 5: Check the Ninja Class Section

The character sheet should now have a **Ninja Class** section in the Features tab, which should include:

- **Class Selection**: Dropdown to select ninja class (e.g., Ninjutsu Specialist)
- **Subclass Selection**: Dropdown to select subclass (e.g., Lightning Breaker)
- **Elemental Affinity**: Dropdown to select chakra nature affinity
- **Chakra Display**: Inputs for current/max chakra with a visual bar

**Test Actions:**
1. Select "Ninjutsu Specialist" from the class dropdown
2. The subclass dropdown should enable and show available subclasses
3. Select "Lightning Breaker" from the subclass dropdown
4. You should see the subclass description and features appear
5. Select an elemental affinity (e.g., "Lightning Release")
6. Set the chakra values (e.g., Current: 10, Max: 20)
7. The chakra bar should fill proportionally

### Step 6: Check the Known Jutsu Section

The character sheet should have a **Known Jutsu** section with:

- **Add Jutsu** button - Opens a dialog to create a new jutsu
- **Browse Compendium** button - Opens jutsu compendiums
- **Jutsu Lists** - Organized by classification (Ninjutsu, Taijutsu, etc.)

**Test Actions:**
1. Click **Add Jutsu** button
2. A dialog should appear with fields:
   - Jutsu Name
   - Classification (Ninjutsu, Taijutsu, etc.)
   - Jutsu Rank (E-Rank through S-Rank)
   - Chakra Nature
   - Chakra Cost
   - Description
3. Fill in the form:
   - **Name**: "Fire Release: Fireball Jutsu"
   - **Classification**: Ninjutsu
   - **Rank**: C-Rank
   - **Chakra Nature**: Fire Release
   - **Chakra Cost**: 5
   - **Description**: "The user exhales a large ball of fire"
4. Click **Create**
5. The jutsu should appear in the "Ninjutsu" section of the Known Jutsu list
6. It should display:
   - Jutsu icon
   - Jutsu name
   - Rank badge (blue for C-Rank)
   - Chakra nature tag (red/orange gradient for Fire)
   - Chakra cost (5 CP)
   - Use button (hand sparkles icon)

### Step 7: Test Jutsu Interaction

1. Click on the jutsu item (not the use button) - It should open the jutsu's item sheet
2. Click the **use button** (hand sparkles icon) - It should attempt to cast the jutsu (using the DND5e spell system)

### Step 8: Verify Styling

The character sheet should have:

- **Orange accent colors** throughout
- **Gradient backgrounds** on chakra nature tags
- **Color-coded jutsu ranks**:
  - E-Rank: Gray
  - D-Rank: Green
  - C-Rank: Blue
  - B-Rank: Purple
  - A-Rank: Orange
  - S-Rank: Red
- **Smooth hover effects** on buttons and jutsu items

## Troubleshooting

### Module Not Loading

**Issue**: No console messages or character sheet modifications

**Solutions**:
1. Verify the module is enabled in **Manage Modules**
2. Check that you're using the D&D 5e system (not a different system)
3. Reload the world (F5)
4. Check the console for JavaScript errors

### Character Sheet Sections Not Appearing

**Issue**: Ninja Class or Jutsu sections are missing

**Solutions**:
1. Check the console for warning messages like:
   ```
   naruto5e | Could not find features tab or sheet body
   ```
2. This means the DOM selectors don't match your character sheet
3. The module looks for:
   - `.tab[data-tab="features"]` for the class section
   - `.tab[data-tab="spells"]` for the jutsu section
4. If using a different character sheet application, the selectors may need adjustment

### Chakra System Not Working

**Issue**: No character sheet modifications at all

**Solutions**:
1. Go to **Game Settings** → **Module Settings**
2. Look for "Naruto 5e" settings
3. Ensure **"Use Chakra System"** is enabled
4. If the setting doesn't exist, there may be an initialization issue

### Data Not Persisting

**Issue**: Class/jutsu selections don't save

**Solutions**:
1. Check browser console for errors during save operations
2. Verify you have edit permissions for the character
3. Try closing and reopening the character sheet
4. Check if the actor flags are being set:
   ```javascript
   // In console:
   game.actors.getName("Test Ninja").getFlag("naruto5e", "ninjaData")
   ```

## Expected Console Output

When everything is working correctly, you should see:

```
naruto5e | Initializing Naruto 5e Module
naruto5e | Naruto 5e Module Initialized
naruto5e | Naruto 5e Module Ready
naruto5e | Rendering character sheet for Test Ninja
naruto5e | Injecting clan section
naruto5e | Injecting background section
naruto5e | Injecting ninja class section
naruto5e | Injecting jutsu section
naruto5e | Character sheet modifications complete
```

## Next Steps

Once the character sheet is working, you can:

1. **Import jutsu from compendiums** (when they're populated)
2. **Create multiple test characters** with different classes/subclasses
3. **Test chakra costs** and resource tracking
4. **Verify class features** are properly displayed
5. **Test jutsu casting** in combat scenarios

## Known Limitations (Current State)

- Jutsu compendiums are empty (need to be populated)
- Chakra spending is not yet automated
- Class features are displayed but not mechanically implemented
- Item sheet modifications for jutsu are minimal
- No automated chakra pool calculations based on level/Intelligence

## Reporting Issues

If you encounter issues:

1. Check the browser console for errors
2. Note which step in this guide failed
3. Capture any error messages
4. Take screenshots if visual issues occur
5. Report with full details for debugging
