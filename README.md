# Projet RabbitMQ

## Description

Ce projet est une architecture de microservices orchestrée avec Docker Compose et RabbitMQ. Il se compose de plusieurs services :

- `api-gateway` : un point d'entrée HTTP qui redirige les routes vers les services en aval.
- `microservice-films` : service Node.js producteur RabbitMQ, il publie les films reçus dans une file `films_queue`.
- `microservice-projections` : service Node.js consommateur RabbitMQ, il écoute la file `films_queue` et stocke les films reçus en mémoire.
- `microservice-reservations` : service PHP simple qui simule la création de réservations.
- `rabbitmq` : broker RabbitMQ avec interface de management.

## Architecture

- Le service `microservice-films` publie des messages sur RabbitMQ.
- Le service `microservice-projections` consomme ces messages et expose les films reçus via une API.
- Le service `api-gateway` redirige les appels HTTP vers les services appropriés.
- Le service `microservice-reservations` accepte des données de réservation en POST et renvoie un objet de réservation avec un `id` unique.

## Services et ports exposés

- API Gateway : `http://localhost:3000`
- Microservice Films : `http://localhost:3001`
- Microservice Projections : `http://localhost:3002`
- Microservice Réservations : `http://localhost:3003`
- RabbitMQ Management : `http://localhost:15672`

## Dépendances principales

### API Gateway

- `express`
- `cors`
- `http-proxy-middleware`
- `morgan`

### Microservice Films

- `express`
- `amqplib`
- `cors`

### Microservice Projections

- `express`
- `amqplib`
- `cors`

### Microservice Réservations

- PHP 8.1
- Composer (facultatif si aucune dépendance définie)

## Endpoints principaux

### API Gateway

- `GET /films/*` -> redirige vers `microservice-films`
- `GET /projections/*` -> redirige vers `microservice-projections`
- `GET /reservations/*` -> redirige vers `microservice-reservations`

### Microservice Films

- `GET /health` : vérifie que le service est en ligne.
- `POST /api/films` : crée un film et publie le message sur RabbitMQ.

Exemple de requête `POST /api/films` :

```json
{
  "title": "Titre du film",
  "year": 2025,
  "genre": "Drame"
}
```

### Microservice Projections

- `GET /health` : vérifie que le service est en ligne.
- `GET /api/projections` : retourne la liste des films reçus depuis RabbitMQ.

### Microservice Réservations

- `POST /` : crée une réservation en retourant un objet JSON avec un `id` unique.

Exemple de requête `POST http://localhost:3003/` :

```json
{
  "id_film": "123",
  "id_utilisateur": "456"
}
```

## Variables d'environnement

Le fichier `docker-compose.yml` utilise ces variables :

- `RABBITMQ_USER` (par défaut `admin`)
- `RABBITMQ_PASS` (par défaut `admin123`)

Les services Node utilisent également :

- `PORT` : port exposé du service
- `RABBITMQ_URL` : URL de connexion RabbitMQ
- `FILMS_SERVICE_URL`, `PROJECTIONS_SERVICE_URL`, `RESERVATIONS_SERVICE_URL` pour le `api-gateway`

## Installation et exécution

### Prérequis

- Docker
- Docker Compose

### Lancer l'application

À la racine du projet :

```bash
docker compose up --build
```

Cela construira et démarrera :

- `rabbitmq`
- `api-gateway`
- `microservice-films`
- `microservice-projections`
- `microservice-reservations`

### Arrêter l'application

```bash
docker compose down
```

## Tests manuels

1. Ouvrir RabbitMQ Management `http://localhost:15672` avec les identifiants par défaut.
2. Envoyer un `POST /api/films` via l'API Gateway :

```bash
curl -X POST http://localhost:3000/films/api/films \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mon film","year":2025,"genre":"Action"}'
```

3. Vérifier que le film apparaît dans `microservice-projections` :

```bash
curl http://localhost:3000/projections/api/projections
```

4. Créer une réservation :

```bash
curl -X POST http://localhost:3000/reservations/ \
  -H 'Content-Type: application/json' \
  -d '{"id_film":"123","id_utilisateur":"456"}'
```

## Structure du projet

- `api-gateway/` : gateway Node.js
- `microservice-films/` : producteur Node.js RabbitMQ
- `microservice-projections/` : consommateur Node.js RabbitMQ
- `microservice-reservations/` : service de réservation PHP
- `docker-compose.yml` : orchestration Docker

## Remarques

- `microservice-projections` stocke les films en mémoire dans un tableau JavaScript. Une fois le service redémarré, les données sont perdues.
- `microservice-reservations` est un exemple minimal en PHP et ne persiste pas les réservations.
- Le broker RabbitMQ doit être accessible à tous les services via le réseau Docker interne `megaram-network`.
