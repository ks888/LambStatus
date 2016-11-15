module.exports = {
  cmd: 'cd packages/frontend && npm install && npm run test',
  build: true,
  branches: true,
  docker: {
    cluster: 'lambci-ecs-Cluster-7V5M1CB50WP1',
    task: 'lambci-ecs-BuildTask-1ATBBSYTY0L2M',
  },
  env: {
    LAMBCI_REPO: LambStatus
  }
}
