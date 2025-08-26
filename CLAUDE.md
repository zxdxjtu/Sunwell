# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sunwell is a Canvas-based high quality Hearthstone card renderer written in TypeScript. It can render Hearthstone cards both in the browser (using HTML5 Canvas) and in Node.js (using node-canvas). The library supports all card types (minions, spells, weapons, heroes, hero powers) with full visual fidelity including proper fonts, assets, and premium (golden) versions.

## Build Commands

- `yarn build` - Build both Node.js and web versions using Rollup
- `yarn dev` - Watch mode for TypeScript compilation
- `yarn format` - Format code using Prettier
- `yarn lint` - Check code formatting with Prettier
- `yarn qa` - Run TSLint checks

## Development Setup

1. Install dependencies: `yarn install`
2. For development with watch mode: `yarn dev`
3. For production builds: `yarn build`

The build process creates:
- `dist/sunwell.node.js` - Node.js version
- `dist/sunwell.web.js` - Browser/UMD version
- Minified versions when `NODE_ENV=production`

## Architecture

### Core Components

- **Sunwell.ts** - Main library entry point and renderer engine
- **Card.ts** - Abstract base class for all card types
- **CardDef.ts** - Card data definition and properties
- **Enums.ts** - Game enums (CardType, CardClass, Rarity, etc.)

### Card Type Implementations

Each card type has both regular and premium (golden) versions:
- `HeroCard.ts` / `HeroCardPremium.ts`
- `MinionCard.ts` / `MinionCardPremium.ts`
- `SpellCard.ts` / `SpellCardPremium.ts`
- `WeaponCard.ts` / `WeaponCardPremium.ts`
- `HeroPowerCard.ts` / `HeroPowerCardPremium.ts`

### Component System

The `Components/` directory contains modular rendering components:
- `AttackGem.ts`, `HealthGem.ts`, `CostGem.ts` - Stat gems
- `BodyText.ts` - Card description text rendering
- `CardArt.ts` - Card artwork handling
- `CardFrame.ts` - Card frame/border rendering
- `NameBanner.ts` - Card name display
- `RaceBanner.ts` - Race/tribe indicators
- `RarityGem.ts` - Rarity indicators
- `Watermark.ts` - Set watermarks
- `EliteDragon.ts` - Elite (legendary) dragon decoration
- `MultiClassBanner.ts` - Multi-class group indicators

### Platform Abstraction

- `platforms/IPlatform.ts` - Platform interface
- `platforms/WebPlatform.ts` - Browser implementation
- `platforms/NodePlatform.ts` - Node.js implementation

## Key Technical Details

### Build System
- Uses Rollup for bundling with platform-specific builds
- TypeScript compilation with ES5 target
- Platform-specific code uses `/*#if _PLATFORM == "node"` preprocessing
- External modules handled differently for web vs Node.js builds

### Asset Management
- Assets loaded from `assets/` folder (PNG files)
- Asynchronous asset loading with Promise-based system
- Asset caching and preloading support
- Different asset sets for regular vs premium cards

### Rendering Pipeline
1. Card instantiation based on type and premium status
2. Asset dependency collection
3. Asynchronous asset loading
4. Component-based rendering to Canvas
5. Optional skeleton caching for performance

### Card Data Format
Cards use HearthstoneJSON-compatible format with properties like:
- Basic: `name`, `text`, `type`, `cardClass`, `rarity`
- Stats: `cost`, `attack`, `health`, `durability`
- Special: `race`, `multiClassGroup`, `elite`, `silenced`

## Code Style

- Uses Prettier for formatting (tabs, 100 char width)
- TSLint with modified tslint:recommended rules
- Allows bitwise operations and conditional assignments
- Disabled strict formatting rules for flexibility

## Testing

- HTML test files in `tests/` directory
- Demo files: `demo_minion_card.html`, `card_generator.html`, `ai_generator.html`
- Manual testing through browser examples

## Assets and Fonts

- All visual assets in `assets/` directory
- Requires Belwe and Franklin Gothic fonts for authentic rendering
- Fallback fonts supported for development
- Chinese font support included (经典隶变简)

## Platform Differences

- **Web**: UMD build, excludes Node.js-specific modules
- **Node.js**: CommonJS build, includes all dependencies
- Canvas implementation differs between platforms
- Font loading handled differently per platform