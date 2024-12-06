import asyncio
import logging
import signal
from src.worker import settings, queue
from saq.worker import start
from windows_worker import WindowsWorker


async def main():
    logging.basicConfig(level=logging.INFO)
    worker = WindowsWorker(**settings)
    await worker.queue.connect()
    await worker.start()


if __name__ == '__main__':
    asyncio.run(main())
