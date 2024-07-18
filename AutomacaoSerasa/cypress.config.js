const { defineConfig } = require('cypress');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const os = require('os');
const { merge } = require('mochawesome-merge');
const generate = require('mochawesome-report-generator');

function ensureDirectoryExistence(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const logsDir = path.join(__dirname, 'logs');
      const reportsDir = path.join(__dirname, 'reports');

      ensureDirectoryExistence(logsDir);
      ensureDirectoryExistence(reportsDir);

      on('after:run', async (results) => {
        const report = await merge({
          files: [path.join(reportsDir, '*.json')],
        });

        await generate.create(report, {
          reportDir: reportsDir,
          inlineAssets: true,
          charts: true,
          reportPageTitle: 'Relatório de Testes API',
          reportTitle: 'Relatório Detalhado de Testes',
          reportFilename: 'relatorio_detalhado.html',
          autoOpen: true,
          code: true,
          assetsDir: 'custom-assets',
          reportJson: true,
          quiet: true,
          dev: false
        }).catch(err => {
          console.error('Erro na geração do relatório:', err);
        });
      });

      const logEvent = (event, details) => {
        const logFilePath = path.join(logsDir, `${event}.log`);
        fs.writeFileSync(logFilePath, `Detalhes do evento ${event}: ${JSON.stringify(details, null, 2)}\n`, { flag: 'a' });
        console.log(`${event}: `, JSON.stringify(details, null, 2));
      };

      on('before:run', details => logEvent('antes_do_teste', details));
      on('after:run', results => logEvent('depois_do_teste', results));
      on('before:spec', spec => logEvent('antes_da_spec', spec));
      on('after:spec', (spec, results) => logEvent('depois_da_spec', { spec, results }));
      on('task', {
        log(message) {
          logEvent('tarefa', { message });
          return null;
        },
        logDebug(message) {
          logEvent('debug', { message });
          return null;
        }
      });

      // Capturando Dados Ambientais de Forma Automática
      const environmentInfo = {
        navegador: config.browser,
        sistema_operacional: `${os.type()} ${os.release()} (${os.platform()})`,
        arquitetura: os.arch(),
        versao_node: process.version,
        memoria_total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        memoria_livre: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        cpus: os.cpus().map(cpu => cpu.model).join(', ')
      };

      fs.writeFileSync(path.join(logsDir, 'environment.log'), `Informações do ambiente: ${JSON.stringify(environmentInfo, null, 2)}\n`, { flag: 'a' });

      // Informações de CI/CD
      const ciInfo = {
        ci: process.env.CI,
        branch: process.env.GIT_BRANCH,
        commit: process.env.GIT_COMMIT
      };
      fs.writeFileSync(path.join(logsDir, 'ci_info.log'), `Informações de CI/CD: ${JSON.stringify(ciInfo, null, 2)}\n`, { flag: 'a' });
    },
    baseUrl: 'https://api.trello.com/1',
    supportFile: 'cypress/support/e2e.js',
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'reports',
      overwrite: true,
      html: true,
      json: true,
      charts: true,
      reportTitle: 'Relatório Detalhado de Testes',
      reportPageTitle: 'Relatório de Testes API',
      autoOpen: true
    },
  },
  browser: 'auto',
});
