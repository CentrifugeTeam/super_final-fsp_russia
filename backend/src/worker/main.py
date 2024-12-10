import asyncio
import logging
import signal
from src.worker import settings, queue
from windows_worker import WindowsWorker

async def main():
    """
    Главная асинхронная функция, которая запускает рабочий процесс.

    Эта функция устанавливает уровень логирования на INFO, создает экземпляр WindowsWorker с настройками, подключается к очереди и запускает рабочий процесс.
    """
    logging.basicConfig(level=logging.INFO)
    worker = WindowsWorker(**settings)
    await worker.queue.connect()
    await worker.start()

if __name__ == '__main__':
    asyncio.run(main())
