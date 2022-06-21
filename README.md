This is a project to study a bit of Kafka using Node.js and PostgreSQL.

There's a main API that'll receive requests, send these requests to a payment service, the payment service will handle data and store it in a PostgreSQL database and return something to the main api.
Communication between Main api and Payment service will work through Kafka.
