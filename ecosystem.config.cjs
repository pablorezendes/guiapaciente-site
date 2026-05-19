/* PM2 - Guia do Paciente HSFA */
module.exports = {
  apps: [
    {
      name:                 'guiapaciente-site',
      script:               'server.js',
      cwd:                  __dirname,
      instances:            1,
      exec_mode:            'fork',
      autorestart:          true,
      watch:                false,
      max_memory_restart:   '400M',
      env: {
        NODE_ENV: 'production',
        PORT:     3010,
        HOST:     '0.0.0.0'
      },
      out_file:   './logs/out.log',
      error_file: './logs/err.log',
      merge_logs: true,
      time:       true
    }
  ]
};
