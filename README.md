# NDS project

## Полезные штуки

### export_realm.sh

В файле [`export_realm.sh`](/helpers/export_realm.sh) содержится скрипт для извлечения realm из docker образа keycloak. 
Пример запуска: 

```shell
./helpers/export_realm.sh $docker_keycloak_container $realm_name
```

**точно работает на этом проекте, для отдельный контейнеров не тестил

## Запуск

### ifconfig (необходимо сделать только один раз после запуска системы)

```shell
sudo ifconfig lo:1 10.0.0.11 netmask 255.255.255.0 up
```

### Добавление значений в /etc/hosts (необходимо сделать только один раз)

```shell
./helpers/hosts_init.sh
```

### Компиляция 

```shell
mvn clean package -Pnative
```

### Запуск docker-compose

#### Сборка образов

```shell
docker-compose -f nds_compose.yml build
```

#### Запуск

```shell
docker-compose -f nds_compose.yml up
```