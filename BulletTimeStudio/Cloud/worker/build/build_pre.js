const path = require('path');
const colors = require('colors/safe');
const fs = require('fs');
const appVersion = require('../package.json').version;
const { gitDescribe, gitDescribeSync } = require('git-describe');

const gitInfo = gitDescribeSync(__dirname, {
  longSemver: true,
  dirtySemver: false
});
const versionFilePath = path.join(
  __dirname + '/../src/environments/version.ts'
);

console.log(JSON.stringify(gitInfo));
const src = `export const version = '${appVersion}';
export const gitInfo=${JSON.stringify(gitInfo)};
`;

// ensure version module pulls value from package.json
fs.writeFile(versionFilePath, src, { flat: 'w' }, function(err) {
  if (err) {
    return console.log(colors.red(err));
  }

  console.log(
    colors.green(`Updating application version ${colors.yellow(appVersion)}`)
  );
  console.log(
    `${colors.green('Writing version module to ')}${colors.yellow(
      versionFilePath
    )}\n`
  );
});