const fs = require('fs');
const path = require('path');

/**
 * Recursively get the structure of files and directories.
 * @param {string} dir - The directory to scan.
 * @returns {object} - The structure as a JSON-like object.
 */
function getDirectoryStructure(dir) {
  const structure = fs.readdirSync(dir, { withFileTypes: true }).map((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return {
        type: 'directory',
        name: entry.name,
        children: getDirectoryStructure(fullPath),
      };
    } else {
      return {
        type: 'file',
        name: entry.name,
      };
    }
  });
  return structure;
}

// Path to your project root (adjust if necessary)
const projectPath = "C:\\Users\\joako\\Desktop\\Capstone\\capstone-front-end";

// Get structure and save as JSON
const structure = getDirectoryStructure("C:\\Users\\joako\\Desktop\\Capstone\\capstone-front-end\\app");

// Print structure to console or save it to a file
console.log(JSON.stringify(structure, null, 2));

// Optional: Save structure to a file
fs.writeFileSync(
  path.join(projectPath, 'project-structure.json'),
  JSON.stringify(structure, null, 2)
);
