
const adjectives = [
    'Strong', 'Mighty', 'Steady', 'Firm', 'Gritty', 'Tough', 'Rough', 'Sturdy',
    'Rugged', 'Heave', 'Brute', 'Muscular', 'Heavy', 'Relentless', 'Stalwart',
    'Iron', 'Steel', 'Brawny', 'Solid', 'Powerful', 'Nimble', 'Quick', 'Fast',
    'Tight', 'Grippy', 'Anchored', 'Balanced', 'Sweaty', 'Determined', 'Bold'
];

const tugNouns = [
    'Puller', 'Heaver', 'Anchor', 'Roper', 'Hitcher', 'Tugger', 'Gripper',
    'Strander', 'Knotter', 'Twister', 'Hauler', 'Dragger', 'Yanker', 'Slinger',
    'Wrencher', 'Grinder', 'Gladiatow', 'Tuglord', 'Ropeburn', 'Mudslider',
    'Footing', 'Cleat', 'Glove', 'Pulley', 'WinningTeam', 'TugChamp', 'IronGrip'
];


/**
 * Generates a random tug-of-war-themed nickname.
 * @returns {string} A random nickname like "StrongPuller42" or "MightyAnchor7".
 */
const generateRandomNickname = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = tugNouns[Math.floor(Math.random() * tugNouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
};

export default generateRandomNickname;