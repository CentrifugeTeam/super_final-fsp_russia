docker exec postgres bash -c "psql -U postgres -c 'DROP DATABASE db1;' -c 'CREATE DATABASE db1;'"
docker exec backend alembic revision --autogenerate
docker exec backend alembic upgrade head