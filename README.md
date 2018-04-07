> Задача написать приложение, работающее с redis, умеющее как генерировать сообщения, так и обрабатывать. Параллельно может быть запущено сколько угодно приложений.
>
> Обмен любой информацией между приложениями осуществлять только через redis.
>
> Все запущенные копии приложения кроме генератора, являются обработчиками сообщений и в любой момент готовы получить сообщение из redis.
>
> Все сообщения должны быть обработаны, причём только один раз, только одним из обработчиков.
>
> Генератором должно быть только одно из запущенных приложений. Т.е. каждое приложение может стать генератором. Но в любой момент времени может работать только один генератор.
>
> Если текущий генератор завершить принудительно (обработчик завершения запрещен, например, выключили из розетки), то одно из приложений должно заменить завершённое (упавшее) и стать генератором. Для определения кто генератор нельзя использовать средства ОС, считается что все приложения запущенны на разных серверах и общаются только через redis.
>
> Сообщения генерируются раз в 500 мс.
>
> Для генерации сообщения использовать любую функцию с рандомным текстовым ответом.
>
> Приложение, получая сообщение, с вероятностью 5% определяет, что сообщение содержит ошибку.
>
> Если сообщение содержит ошибку, то сообщение следует поместить в redis для дальнейшего изучения.
>
> Если приложение запустить с параметром 'getErrors', то оно заберет из redis все сообщения с ошибкой, выведет их на экран и завершится, при этом из базы сообщения удаляются.


## CLI

`app [COMMAND] [ARG...]`

```

Usage: app [command] [options]

Commands:
  start       Start worker
  get-errors  Get errors

Options:
  --version  Show version number
  --env
  --help     Show help

```

`app start [ARG...]`

| CLI argument          | Environment variable  | Default value         |
| ---                   | ---                   | ---                   |
| `--host`, `-h`        | `REDIS_HOST`          | `localhost`           |
| `--port`, `-p`        | `REDIS_PORT`          | `6379`                |
| `--pass`              | `REDIS_PASS`          |                       |
| `--db`                | `REDIS_DB`            | `0`                   |
| `--concurrency`       |                       | `1`                   |
| `--help`              |                       |                       |


`app get-errors [ARG...]`

| CLI argument          | Environment variable  | Default value         |
| ---                   | ---                   | ---                   |
| `--host`, `-h`        | `REDIS_HOST`          | `localhost`           |
| `--port`, `-p`        | `REDIS_PORT`          | `6379`                |
| `--pass`              | `REDIS_PASS`          |                       |
| `--db`                | `REDIS_DB`            | `0`                   |
| `--limit`             |                       | `100`                 |
| `--help`              |                       |                       |



## Running `redis-ql-example` without docker

Setup
```
docker run -d --rm --name redis-ql-standalone -p 6379:6379 redis:3.2.11-alpine
```
Run
```
node . start
node . get-errors
node . start --concurrency 1000
```
Teardown
```
docker stop redis-ql-standalone
```



## Running `redis-ql-example` with docker

Setup
```
docker network create --driver bridge redis-ql-net
docker run -d --rm --name redis-ql-docker --network redis-ql-net redis:3.2.11-alpine
docker build --rm -t redis-ql .
```
Run
```
docker run --rm --network redis-ql-net redis-ql start -h redis-ql-docker
```
Teardown
```
docker rmi redis-ql
docker stop redis-ql-docker
docker network rm redis-ql-net
```



## Running `redis-ql-example` with docker-compose

```
# single worker
docker-compose up -d

# 200x workers
docker-compose up -d --scale redis-ql=200
```
