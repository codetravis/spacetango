# README

To run locally with simple python http server
`python3 -m http.server`

## Flavor and Inspiration
Game is inspired by turn based dogfight simulations such as Steam Birds, X-Wing miniature game, Sid Meier's Ace Patrol, and Aeronatica Imperialis

Basic Gameplay Loop:
Select a new throttle setting (Depends on ship Accelleration and Braking)
Select a maneuver to perform (Depends on ship Agility and Piloting skill)
Select an action to focus on (Aiming, Evasion, Awareness, Repair, Aquire Lock, Drop Explosive)
Once all of these are selected for each ship, all ships move simultaneously.
Ships will attempt to attack any enemies that enter their attack arcs.
Gunners on ships will attempt to attack any enemies that enter their attack arc.
