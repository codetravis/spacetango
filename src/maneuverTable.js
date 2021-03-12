const RIGHT = "RIGHT";
const LEFT = "LEFT";
const BANK = "BANK";
const TURN = "TURN";
const STRAIGHT = "STRAIGHT";
const DRIFT = "DRIFT";
const FLIP  = "FLIP";

class ManeuverTable {

    constructor() {
    }

    listManeuvers() {
        return [
                
                { speed: 1, maneuver: TURN, direction: LEFT, agility_required: 5, control_required: 3},
                { speed: 1, maneuver: BANK, direction: LEFT, agility_required: 1, control_required: 1},
                { speed: 1, maneuver: DRIFT, direction: LEFT, agility_required: 0, control_required: 1},
                { speed: 1, maneuver: STRAIGHT, direction: "", agility_required: 0, control_required: 1},
                { speed: 1, maneuver: DRIFT, direction: RIGHT, agility_required: 0, control_required: 1},
                { speed: 1, maneuver: BANK, direction: RIGHT, agility_required: 1, control_required: 1},
                { speed: 1, maneuver: TURN, direction: RIGHT, agility_required: 5, control_required: 3},

                { speed: 2, maneuver: TURN, direction: LEFT, agility_required: 4, control_required: 2},
                { speed: 2, maneuver: BANK, direction: LEFT, agility_required: 1, control_required: 1},
                { speed: 2, maneuver: DRIFT, direction: LEFT, agility_required: 0, control_required: 1},
                { speed: 2, maneuver: STRAIGHT, direction: "", agility_required: 0, control_required: 1},
                { speed: 2, maneuver: DRIFT, direction: RIGHT, agility_required: 0, control_required: 1},
                { speed: 2, maneuver: BANK, direction: RIGHT, agility_required: 1, control_required: 1},
                { speed: 2, maneuver: TURN, direction: RIGHT, agility_required: 4, control_required: 2},

                { speed: 3, maneuver: TURN, direction: LEFT, agility_required: 3, control_required: 3},
                { speed: 3, maneuver: BANK, direction: LEFT, agility_required: 1, control_required: 1},
                { speed: 3, maneuver: DRIFT, direction: LEFT, agility_required: 0, control_required: 1},
                { speed: 3, maneuver: STRAIGHT, direction: "", agility_required: 0, control_required: 1},
                { speed: 3, maneuver: DRIFT, direction: RIGHT, agility_required: 0, control_required: 1},
                { speed: 3, maneuver: BANK, direction: RIGHT, agility_required: 1, control_required: 1},
                { speed: 3, maneuver: TURN, direction: RIGHT, agility_required: 3, control_required: 3},
                { speed: 3, maneuver: FLIP, direction: "", agility_required: 5, control_required: 5},

                { speed: 4, maneuver: FLIP, direction: "", agility_required: 5, control_required: 5},
            ];
    }
}

export default ManeuverTable;