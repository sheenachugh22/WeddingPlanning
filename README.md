# WeddingPlanning

North Indian Wedding Planning Application that helps manage every function in detail:

- Engagement
- Haldi
- Mehndi
- Sangeet
- Wedding
- Any custom function you add

It tracks:

- Guest list and group-based invite selection
- Event-wise invited guests
- Tasks and owners
- Materials and procurement status
- Food menu and catering
- Decor planning and status
- DJ/performance schedule
- Party favors (including the Mehndi/Sangeet scenario)
- Event and overall cost summary

## Key Behaviors

- Data persists automatically with `localStorage` (survives refresh).
- "Copy Share Link" creates a URL containing the plan state.
- Opening the link on another device/browser loads the same plan.
- Import/export JSON is supported for backups and handoff.

## Run

No build tools are required.

1. Open `index.html` in any modern browser.
2. Start editing guest list, events, and trackers.
3. Use "Copy Share Link" to share the full plan.

## Scenario Included

Template data includes:

- Mehndi with girlfriends invited from the guest list
- Sangeet with earrings configured as party favors

You can re-apply this logic anytime using:

- `Apply Mehndi + Sangeet Scenario` button