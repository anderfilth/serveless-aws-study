# install
npm i -g serverless

# get started
sls

# always deploy after a change
sls deploy

# invoke in AWS
sls invoke -f hello

# invoke local
sls invoke local -f hello -l

# config dashboard
sls # register to service

# logs
sls logs -f hello -t