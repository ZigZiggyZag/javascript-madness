# javascript-madness
Reposity containing a few small projects using javascript

Currently contains two projects, a very incomplete rpg game, and a simple asteroids clone.
There is an associated Github Page that links to (one of) these projects.

## RPG Game
Very incomplete and not reachable in the Github page.
- Currently contains a few assets and simple logic for room movement and collision.

## Asteroids Clone
Fully featured Asteroids clone, with implemented inertial movement, sounds effects, graphics, etc.
- All graphics (including text and particles) are drawn using the Path functions included in javascript
  * Decided to use Path drawing for everything to emulate the vector graphics of the original
- Sounds effects were created in-house, and are managed by the external library Howler
- Basic movement physics based on vector math
  * Potential in the future to include true collision physics
  * Also takes into account the frametime; physics acts the same at any fps.
