/**
 * Calculate expected score for player A
 * @param {number} ratingA - Player A's rating
 * @param {number} ratingB - Player B's rating
 * @returns {number} Expected score (0-1)
 */
function expectedScore(ratingA, ratingB) {
    return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculate new ELO rating
 * @param {number} currentRating - Current rating
 * @param {number} expectedScore - Expected score (0-1)
 * @param {number} actualScore - Actual score (1=win, 0.5=draw, 0=loss)
 * @param {number} kFactor - K-factor (default 32)
 * @returns {number} New rating
 */
function calculateNewRating(currentRating, expectedScore, actualScore, kFactor = 32) {
    return Math.round(currentRating + kFactor * (actualScore - expectedScore));
}

/**
 * Calculate rating changes for both players
 * @param {number} whiteRating - White player's current rating
 * @param {number} blackRating - Black player's current rating
 * @param {string} result - Game result ('white', 'black', 'draw')
 * @returns {object} { whiteNewRating, blackNewRating, whiteChange, blackChange }
 */
function calculateRatingChanges(whiteRating, blackRating, result) {
    const whiteExpected = expectedScore(whiteRating, blackRating);
    const blackExpected = 1 - whiteExpected;

    let whiteActual, blackActual;
    if (result === 'white') {
        whiteActual = 1;
        blackActual = 0;
    } else if (result === 'black') {
        whiteActual = 0;
        blackActual = 1;
    } else { // draw
        whiteActual = 0.5;
        blackActual = 0.5;
    }

    // Ensure ratings are valid numbers, default to 1500 if undefined/null
    const currentWhite = typeof whiteRating === 'number' ? whiteRating : 1500;
    const currentBlack = typeof blackRating === 'number' ? blackRating : 1500;

    const whiteNewRating = calculateNewRating(currentWhite, whiteExpected, whiteActual);
    const blackNewRating = calculateNewRating(currentBlack, blackExpected, blackActual);

    return {
        whiteNewRating,
        blackNewRating,
        whiteChange: whiteNewRating - currentWhite,
        blackChange: blackNewRating - currentBlack
    };
}

export { calculateRatingChanges };
