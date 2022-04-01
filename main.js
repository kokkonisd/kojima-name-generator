/**
 * Global state object.
 * This object contains all the input data from the main page. This input data will
 * get populated and used to generate the Kojima names.
 **/
let NAME_DATA = {
    "DICE_SETS": null,
    "SECTION_2_3": {
        "input-1": null,
        "input-2a": null,
        "input-3": null,
        "input-4a": null,
        "input-5": null,
        "input-6": null,
        "input-7": null,
        "input-8": null,
        "input-9": null,
        "input-10": null,
        "input-11": null,
        "input-12": null,
        "input-13": null,
        "input-14": null,
        "input-15": null,
        "input-16": null,
        "input-17": null,
        "input-18": null,
        "input-19": null,
        "input-20": null,
        "input-21a": null,
    },
    "SECTION_4": {
        "SUBSECTION_1": {
            "DICE_SET_1": null,
            "DICE_SET_2": null,
            "DICE_SET_3": null,
            "DICE_SET_4": null,
            "DICE_SET_5": null,
            "DICE_SET_6": null,
            "DICE_SET_7": null,
        },
        "SUBSECTION_2": {
            "DICE_SET_1": null,
            "DICE_SET_2": null,
            "DICE_SET_3": null,
            "DICE_SET_4": null,
            "DICE_SET_5": null,
            "DICE_SET_6": null,
            "DICE_SET_7": null,
        },
        "SUBSECTION_3": {
            "DICE_SET_1": null,
            "DICE_SET_2": null,
            "DICE_SET_3": null,
            "DICE_SET_4": null,
            "DICE_SET_5": null,
            "DICE_SET_6": null,
            "DICE_SET_7": null,
        },
        "SUBSECTION_4": {
            "DICE_SET_1": null,
            "DICE_SET_2": null,
            "DICE_SET_3": null,
            "DICE_SET_4": null,
            "DICE_SET_5": null,
            "DICE_SET_6": null,
            "DICE_SET_7": null,
        },
    }
}


/**
 * Reset the values of Section 4 in the global state object.
 *
 * @return null
 **/
function resetSection4 ()
{
    for (let subsection in NAME_DATA["SECTION_4"]) {
        for (let diceSet in NAME_DATA["SECTION_4"][subsection]) {
            NAME_DATA["SECTION_4"][subsection][diceSet] = null;
        }
    }
}


/**
 * Roll a die and get the result.
 *
 * @param int sides: the number of sides of the die to roll.
 * @return int: the result of the die roll.
 **/
function rollDie (sides)
{
    return Math.ceil(Math.random() * (sides));
}


/**
 * Handle a die roll from Section 4.
 *
 * @param Event e: the event that triggered the die roll.
 * @return null
 **/
function handleDieRoll_4_Generic (e)
{
    // Since the die element is composed of other elements, the target might get
    // reported as one of the children elements. In order to get the button itself, we
    // "bubble up" through the parents until we arrive at a button element.
    let target = e.target;
    while (target.tagName !== "BUTTON") {
        target = target.parentElement;
    }

    // The button has a class of `die-<section>-<subsection>-<dice set>`.
    let dieSubSection = target.id.substring(6, 7);
    let diceSetNumber = target.id.substring(8);

    // Roll the die depending on which subsection we're in and compute the message to
    // show to the user.
    let roll = null;
    let message = "";
    if (dieSubSection === "1") {
        // The -man condition.
        roll = rollDie(4);
        message = "You rolled a " + roll + ". ";
        if (roll === 4) {
            message += "Your last name will include the suffix -man.";
        } else {
            message += "You do not have this condition.";
        }
    } else if (dieSubSection === "2") {
        // The condition condition.
        roll = rollDie(8);
        message = "You rolled a " + roll + ". ";
        if (roll === 6) {
            message += 'Your name must have "Big" at the beginning of it.';
        } else if (roll === 7) {
            message += 'Your name must have "Old" at the beginning of it.';
        } else if (roll === 8) {
            message += "You are how you currently are.";
        } else {
            message += "You do not have this condition.";
        }
    } else if (dieSubSection === "3") {
        // The clone condition.
        roll = rollDie(12);
        message = "You rolled a " + roll + ". ";
        if (roll === 12) {
            message += "You are a clone of someone else.";
        } else {
            message += "You do not have this condition.";
        }
    } else {
        // The Kojima condition.
        roll = rollDie(100);
        message = "You rolled a " + roll + ". ";
        if (roll === 69) {
            message += "Oh no. You are Hideo Kojima.";
        } else {
            message += "You do not have this condition.";
        }
    }

    // Update the global data object.
    NAME_DATA["SECTION_4"]["SUBSECTION_" + dieSubSection][
        "DICE_SET_" + diceSetNumber
    ] = roll;

    // Update the message next to the die.
    let dieButtonParent = target.parentElement;
    let resultElement = dieButtonParent.getElementsByClassName("die-result")[0];
    resultElement.innerHTML = message;
}


/**
 * Handle a die roll from Section 1, Subsection 1.
 *
 * @return null
 **/
function handleDieRoll_1_1 ()
{
    // First, reset section 4; since that section depends on this roll, it should be
    // reset.
    // We need to do two things to reset it: reset the values in the NAME_DATA object,
    // and also reset all the "die-result" fields that might be populated on the page.
    resetSection4();
    Array.from(document.getElementsByClassName("die-result")).forEach(
        function(dieResultElement) {
            dieResultElement.innerHTML = "";
        }
    );

    // Roll the die and compute the message to show to the user.
    let roll = rollDie(6);
    let message = "";
    if (roll === 6) {
        message = "You rolled a 6. Congrats, you get to roll a lot of dice later.";
    } else {
        message = "You rolled a " + roll + ". You'll get one name per category.";
    }

    // If the user rolled anything but a 6, we have 1 dice set. Otherwise, we have 7.
    NAME_DATA["DICE_SETS"] = roll === 6 ? 7 : 1;
        
    // Since we have just calculated the number of dice sets, we need to reset the
    // number of dice displayed in Section 4. The simplest way to do that is to delete
    // all dice from Section 4 and put them back based on how many dice sets we have.
    
    // First, we need to clone the first dice set, so that we can spawn them back.
    let diceSet = Array.from(document.getElementsByClassName("dice-set-1"));
    let baseDiceSet = diceSet.map(function(set) {
        return set.cloneNode(true);
    });
    // We also need the closest previous sibling to the dice set, so that we know where
    // to spawn new dice sets.
    let baseDiceSetSiblings = diceSet.map(function(set) {
        return set.previousSibling;
    });
    // Now that we've got all the information we need, we can go ahead and delete the
    // dice sets.
    Array.from(document.querySelectorAll('[class^="dice-set-"]')).forEach(
        function(set) {
            set.remove();
        }
    );

    // Let's now iterate over every dice of every dice set and spawn it again if needed.
    for (let i = 0; i < baseDiceSet.length; i++) {
        setSibling = baseDiceSetSiblings[i];
        diceSet = baseDiceSet[i];

        // We need to iterate backwards on the dice set number, because we're using
        // `.after()` to add the dice sets to the page, which means that they will
        // always get added right after the closest previous sibling. However, we need
        // the dice sets to be in order (1 first, 7 last), so the most convenient way is
        // to insert the last one first.
        for (let j = NAME_DATA["DICE_SETS"]; j > 0; j--) {
            // Clone the dice set to spawn it.
            let newDiceSet = diceSet.cloneNode(true);
            // Adjust the class, to reflect the correct dice set number.
            newDiceSet.className = "dice-set-" + j;

            // Rename the button's ID.
            let newButton = newDiceSet.getElementsByTagName("button")[0];
            newButton.id = newButton.id.substring(0, newButton.id.length - 1) + j;

            // Add the correct handler to the button.
            newButton.addEventListener("click", handleDieRoll_4_Generic);

            // Add the new dice set to the page.
            setSibling.after(newDiceSet);
        }
    }

    // Update the message next to the die.
    let dieButtonParent = document.getElementById("die-1-1").parentElement;
    let resultElement = dieButtonParent.getElementsByClassName("die-result")[0];
    resultElement.innerHTML = message;
}


/**
 * Prepare the input for the name generators.
 *
 * This function parses all the raw inputs, performs validity checks where needed and
 * populates the global state object. At the end, it either signals a failure or
 * guarantees that the global state object is populated correctly and ready to go for
 * name generation.
 *
 * @return bool: true if no errors were detected, false otherwise.
 **/
function prepareInput ()
{
    // We need a flag to report if we had errors or not when returning.
    let hadError = false;

    // Clear all the error messages.
    Array.from(document.querySelectorAll('[id^="error-"]')).forEach(
        function(errorElement) {
            errorElement.innerHTML = "";
        }
    );

    // Check the first die.
    if (NAME_DATA["DICE_SETS"] === null) {
        hadError = true;
        document.getElementById(
            "error-die-1-1"
        ).innerHTML = "You need to roll the die.";
    }

    // Check the dice on section 4.
    for (let subsection = 1; subsection <= 4; subsection++) {
        for (let diceSet = 1; diceSet <= NAME_DATA["DICE_SETS"]; diceSet++) {
            if (
                NAME_DATA["SECTION_4"]["SUBSECTION_" + subsection][
                    "DICE_SET_" + diceSet
                ] === null
            ) {
                hadError = true;
                console.log(subsection, diceSet);

                let errorMessage = "You need to roll all the dice.";
                if (NAME_DATA["DICE_SETS"] === 1) {
                    errorMessage = "You need to roll the die.";
                }

                document.getElementById(
                    "error-die-4-" + subsection
                ).innerHTML = errorMessage;
                break;
            }
        }
    }

    // Check that the inputs are non-empty.
    for (let input in NAME_DATA["SECTION_2_3"]) {
        let inputValue = document.getElementById(input).value.trim();

        if (input === "input-14") {
            // This is the Zodiac sign input, which is always non-null.
            NAME_DATA["SECTION_2_3"]["input-14"] = inputValue;
            continue
        }

        if (inputValue === "") {
            hadError = true;
            document.getElementById(
                "error-" + input
            ).innerHTML = "You need to fill this in.";
        }
    }

    // Check inputs that have to be one or two words.
    let limitedWordInputs = [
        [
            [
                "input-2a",
                "input-6",
                "input-11",
                "input-12",
                "input-13",
                "input-15",
                "input-17",
                "input-18",
                "input-21a"
            ],
            1
        ],
        [["input-4a"], 2]
    ]

    for (let limitGroup in limitedWordInputs) {
        let inputs = limitedWordInputs[limitGroup][0];
        let wordLimit = limitedWordInputs[limitGroup][1];

        for (let input in inputs) {
            let inputValue = document.getElementById(inputs[input]).value.trim();
            let numberOfWords = 0;
            if (inputValue !== "") {
                numberOfWords = inputValue.split(" ").length;
            }
            if (numberOfWords !== wordLimit) {
                hadError = true;
                document.getElementById(
                    "error-" + inputs[input]
                ).innerHTML += (
                    " Answer must be "
                    + wordLimit
                    + " "
                    + (wordLimit === 1 ? "word" : "words")
                    + " long."
                );
            }
        }
    }

    if (!hadError) {
        // All should be good now; let's copy the inputs over.
        for (let input in NAME_DATA["SECTION_2_3"]) {
            NAME_DATA["SECTION_2_3"][input] = document.getElementById(
                input
            ).value.trim();
        }
    } else {
        // We found at least one error, so we need to report that to the user.
        document.getElementById("error-submit").innerHTML = (
            "Some things don't look right. Scroll back up to see how you can fix them."
        );
    }

    return !hadError;
}


/**
 * Apply conditions from a dice set from Section 4 to a name.
 *
 * @param int set: the set number to apply conditions from.
 * @param str name: the name to apply conditions to.
 * @return str: the name with the conditions applied.
 **/
function applyConditions (set, name)
{
    if (NAME_DATA["SECTION_4"]["SUBSECTION_1"]["DICE_SET_" + set] === 4) {
        name += "man";
    }
    
    if (NAME_DATA["SECTION_4"]["SUBSECTION_2"]["DICE_SET_" + set] === 6) {
        name = "Big " + name;
    } else if (NAME_DATA["SECTION_4"]["SUBSECTION_2"]["DICE_SET_" + set] === 7) {
        name = "Old " + name;
    } else if (NAME_DATA["SECTION_4"]["SUBSECTION_2"]["DICE_SET_" + set] === 8) {
        name = NAME_DATA["SECTION_2_3"]["input-11"] + " " + name;
    }
    
    return name;
}


/**
 * Compute the Normal Name.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getNormalName (set)
{
    let fullName = NAME_DATA["SECTION_2_3"]["input-1"];

    return applyConditions(set, fullName);
}


/**
 * Compute the Occupational Name.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getOccupationalName (set)
{
    let lastName = NAME_DATA["SECTION_2_3"]["input-2a"];
    let firstName = null;

    let roll = rollDie(4);
    if (roll === 1) {
        firstName = NAME_DATA["SECTION_2_3"]["input-15"];
    } else if (roll === 2) {
        firstName = NAME_DATA["SECTION_2_3"]["input-6"];
    } else if (roll === 3) {
        firstName = NAME_DATA["SECTION_2_3"]["input-13"];
    } else {
        firstName = NAME_DATA["SECTION_2_3"]["input-16"];
    }

    return applyConditions(set, firstName + " " + lastName);
}


/**
 * Compute the Horny Name.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getHornyName (set)
{
    let lastName = NAME_DATA["SECTION_2_3"]["input-3"];
    let firstName = null;

    let roll = rollDie(4);
    if (roll === 1) {
        firstName = NAME_DATA["SECTION_2_3"]["input-12"];
    } else if (roll === 2) {
        firstName = "Naked";
    } else if (roll === 3) {
        firstName = NAME_DATA["SECTION_2_3"]["input-6"];
    } else {
        firstName = NAME_DATA["SECTION_2_3"]["input-14"];
    }

    roll = rollDie(2);
    if (roll === 2) {
        middleName = " Lickable ";
    } else {
        middleName = " ";
    }

    return applyConditions(set, firstName + middleName + lastName);
}


/**
 * Compute the The Name.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getTheName (set)
{
    let roll = rollDie(4);
    if (roll === 1) {
        lastName = NAME_DATA["SECTION_2_3"]["input-8"];
    } else if (roll === 2) {
        lastName = NAME_DATA["SECTION_2_3"]["input-9"];
    } else if (roll === 3) {
        lastName = NAME_DATA["SECTION_2_3"]["input-4a"];
    } else {
        lastName = NAME_DATA["SECTION_2_3"]["input-20"];
    }

    return "The " + applyConditions(set, lastName);
}


/**
 * Compute the Cool Name.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getCoolName (set)
{
    let firstName = NAME_DATA["SECTION_2_3"]["input-21a"];

    let roll = rollDie(6);
    if (roll === 1) {
        lastName = NAME_DATA["SECTION_2_3"]["input-17"];
    } else if (roll === 2) {
        lastName = NAME_DATA["SECTION_2_3"]["input-18"];
    } else if (roll === 3) {
        lastName = NAME_DATA["SECTION_2_3"]["input-19"];
    } else if (roll === 4) {
        lastName = NAME_DATA["SECTION_2_3"]["input-6"];
    } else if (roll === 5) {
        lastName = NAME_DATA["SECTION_2_3"]["input-8"];
    } else {
        lastName = NAME_DATA["SECTION_2_3"]["input-13"];
    }

    return applyConditions(set, firstName + " " + lastName);
}


/**
 * Compute the Violent Name.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getViolentName (set)
{
    let lastName = NAME_DATA["SECTION_2_3"]["input-5"];
    let firstName = null;

    let roll = rollDie(4);
    if (roll === 1) {
        firstName = NAME_DATA["SECTION_2_3"]["input-19"];
    } else if (roll === 2) {
        firstName = NAME_DATA["SECTION_2_3"]["input-12"];
    } else if (roll === 3) {
        firstName = NAME_DATA["SECTION_2_3"]["input-20"];
    } else {
        firstName = NAME_DATA["SECTION_2_3"]["input-9"];
    }

    return firstName + " " + lastName;
}


/**
 * Compute the Name That Lacks Subtext.
 *
 * @param int set: the set number to compute the name from.
 * @return str: the computed name.
 **/
function getSubtextName (set)
{
    let fullName = NAME_DATA["SECTION_2_3"]["input-10"];

    return applyConditions(set, fullName);
}


/**
 * Handle a submit event.
 *
 * This event is triggered when the user clicks on the submit button at the bottom of
 * the page.
 *
 * @return null
 **/
function handleSubmit ()
{
    // First, prepare the input; if any validation errors came up, they are already
    // reported to the user. However, we cannot proceede if there are errors; so we need
    // to stop right here.
    let result = prepareInput();
    if (!result) {
        return
    }

    // If there are multiple dice sets, there's a chance that some names might be
    // identical. We don't want to display the same name multiple times, so we want to
    // use Sets to store the names, so that the duplicates get filtered out.
    let normalNames = new Set();
    let occupationalNames = new Set();
    let hornyNames = new Set();
    let theNames = new Set();
    let coolNames = new Set();
    let violentNames = new Set();
    let subtextNames = new Set();

    // Populate the name sets for each dice set.
    for (let set = 1; set <= NAME_DATA["DICE_SETS"]; set++) {
        normalNames.add(getNormalName(set));
        occupationalNames.add(getOccupationalName(set));
        hornyNames.add(getHornyName(set));
        theNames.add(getTheName(set));
        coolNames.add(getCoolName(set));
        violentNames.add(getViolentName(set));
        subtextNames.add(getSubtextName(set));
    }

    // The names are shown on a different page, and they are embedded in the URL as
    // URI components.
    let namesURL = "names.html?";

    namesURL += "normalNames=" + Array.from(normalNames).map(function(name) {
        return encodeURIComponent(name);
    }).join("%2C");

    namesURL += "&occupationalNames=" + Array.from(occupationalNames).map(
        function(name) {
            return encodeURIComponent(name);
        }
    ).join("%2C");

    namesURL += "&hornyNames=" + Array.from(hornyNames).map(function(name) {
        return encodeURIComponent(name);
    }).join("%2C");

    namesURL += "&theNames=" + Array.from(theNames).map(function(name) {
        return encodeURIComponent(name);
    }).join("%2C");

    namesURL += "&coolNames=" + Array.from(coolNames).map(function(name) {
        return encodeURIComponent(name);
    }).join("%2C");

    namesURL += "&violentNames=" + Array.from(violentNames).map(function(name) {
        return encodeURIComponent(name);
    }).join("%2C");

    namesURL += "&subtextNames=" + Array.from(subtextNames).map(function(name) {
        return encodeURIComponent(name);
    }).join("%2C");

    window.location.href = namesURL;
}


document.addEventListener("DOMContentLoaded", function (event) { 
    // Add listeners for dice.
    Array.from(document.querySelectorAll('[id^="die-"]')).forEach(
        function(dieElement) {
            if (dieElement.id === "die-1-1") {
                dieElement.addEventListener("click", handleDieRoll_1_1);
            } else {
                dieElement.addEventListener("click", handleDieRoll_4_Generic);
            }
        }
    );

    // Add listener for submit button.
    document.getElementById("submit-button").addEventListener("click", handleSubmit);
});
