FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1  # Отключаем создание .pyc файлов
ENV PYTHONUNBUFFERED 1  # Убеждаемся, что вывод логов сразу идет в консоль (без буферизации)

WORKDIR /app

RUN pip install --upgrade pip
COPY tests/test.txt .
COPY ../backend/requirements.txt .
RUN pip install -r requirements.txt
RUN pip install -r test.txt

COPY ../tests ./tests
COPY ../backend ./backend
COPY ../pyproject.toml .
COPY .env .
ENV PYTHONPATH='/app/backend/src:$PYTHONPATH'
