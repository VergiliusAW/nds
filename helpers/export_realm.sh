docker exec -it $1 /opt/jboss/keycloak/bin/standalone.sh \
        -Dkeycloak.migration.action=export \
        -Dkeycloak.migration.provider=singleFile \
        -Dkeycloak.migration.realmName=$2 \
        -Dkeycloak.migration.usersExportStrategy=REALM_FILE \
        -Dkeycloak.migration.file=/tmp/export.json

docker exec -it $1 cat /tmp/export.json >> realm.json
