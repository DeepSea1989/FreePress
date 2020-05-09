const chalk = require('chalk');
const { logger, getCurrentTime } = require('@freepress/util');

module.exports = class WebpackLogPlugin {
  apply(compiler) {
    compiler.hooks.compile.tap('freepress-log-compile', () => {
      const time = getCurrentTime();

      logger.wait(`${chalk.gray(`[${time}]`)} Compiling...`);
    });

    compiler.hooks.invalid.tap('freepress-log-building', () => {
      const time = getCurrentTime();

      logger.wait(`${chalk.gray(`[${time}]`)} Building...`);
    });

    compiler.hooks.done.tap('freepress-log-done', stats => {
      if (stats.compilation.errors && stats.compilation.errors.length) {
        for (const e of stats.compilation.errors) {
          logger.error(e.message || e);
        }
        return;
      }
      const time = getCurrentTime();

      logger.success(
        `${chalk.gray(`[${time}]`)} Build ${chalk.italic(
          stats.hash.slice(0, 6)
        )} finished in ${stats.endTime - stats.startTime} ms!`
      );
    });
  }
};
