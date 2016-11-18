module.exports = {
  cmd: 'cd packages/frontend && npm install && npm run test',
  build: true,
  branches: true,
  docker: {
    cluster: 'lambci-ecs-Cluster-1FJNWUTUC84IZ',
    task: 'lambci-ecs-BuildTask-18633OZUNZR48',
  },
  env: {
    LAMBCI_DOCKER_TAG: 'lambstatus'
  },
  allowConfigOverrides: false
}
