FROM python:3.12-slim as builder

ENV PYTHONDONTWRITEBYTECODE 1  # Отключаем создание .pyc файлов
ENV PYTHONUNBUFFERED 1  # Убеждаемся, что вывод логов сразу идет в консоль (без буферизации)

RUN pip install --upgrade pip
COPY requirements.txt .
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /opt/venv /opt/venv
COPY src /src
WORKDIR /src
RUN chmod +x /src/web/alembic.sh
RUN useradd -ms /bin/bash developer
USER developer
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH='/src:$PYTHONPATH'
ENTRYPOINT [ "/src/web/alembic.sh" ]
CMD ["uvicorn", "web.app.app:app", "--host", "0.0.0.0", "--port", "80", "--reload", "--forwarded-allow-ips=*", "--proxy-headers"]