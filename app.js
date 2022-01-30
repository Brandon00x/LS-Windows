const fs = require('fs');
const util = require('util');
const path = require('path');

const { lstat } = fs.promises;
const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, filenames) => {
    if (err) {
        console.log(err);
    }

    const statsPromises = filenames.map(filename => {
        return lstat(path.join(targetDir, filename));
    });

    const allStats = await Promise.all(statsPromises);
    for (let stats of allStats) {
        const index = allStats.indexOf(stats);

        if (stats.isFile()){
            console.log(
                '\x1b[0m', 
                `${stats.birthtime.toDateString().padEnd(18).slice(4)}`,
                `${filenames[index].padEnd(25)}`,
                '\x1b[33m',
                `Size: ${(stats.size / (1024)).toFixed(2) + " KBs"}`,
                '\x1b[36m',
                ` Modified: ${stats.mtime.toLocaleString()}`,
                '\x1b[0m'
                );
        } else {
            console.log(
                "\x1b[34m",
                `${stats.birthtime.toDateString().padEnd(18).slice(4)}`,
                `${filenames[index].padEnd(25)}`,
                '\x1b[0m'
                );
        } 
    }
});
