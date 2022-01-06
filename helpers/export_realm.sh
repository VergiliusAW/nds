#!/bin/bash
# $1 docker container
# $2 realm name
docker exec -it $1 /opt/jboss/keycloak/bin/standalone.sh \
        -Dkeycloak.migration.action=export \
        -Dkeycloak.migration.provider=singleFile \
        -Dkeycloak.migration.realmName=$2 \
        -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
        -Dkeycloak.migration.file=/tmp/export.json

mv realm.json realm_prev.json

docker exec -it $1 cat /tmp/export.json >> realm.json
