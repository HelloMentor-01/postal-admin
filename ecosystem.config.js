module.exports = {
  apps: [
    {
      name: "postlogin-client",
      script: "npm",
      args: "start",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
