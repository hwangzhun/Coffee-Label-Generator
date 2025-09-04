{
  "apps": [
    {
      "name": "coffee-card-editor",
      "script": "server.js",
      "instances": 1,
      "exec_mode": "fork",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000
      },
      "env_production": {
        "NODE_ENV": "production",
        "PORT": 3000
      },
      "log_file": "./log/pm2.log",
      "out_file": "./log/pm2-out.log",
      "error_file": "./log/pm2-error.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "max_memory_restart": "1G",
      "restart_delay": 4000,
      "max_restarts": 10,
      "min_uptime": "10s"
    }
  ]
}