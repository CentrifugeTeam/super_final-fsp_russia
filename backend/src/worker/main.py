import asyncio
import signal
from src.worker import settings
from saq.worker import start, Worker

if __name__ == '__main__':
    class GracefulExit(SystemExit):
        code = 1


    def raise_graceful_exit(*args):
        tasks = asyncio.all_tasks(loop=loop)
        for t in tasks:
            t.cancel()

        loop.stop()
        print("Gracefully shutdown")
        raise GracefulExit()


    def do_something():
        while True:
            pass


    loop = asyncio.new_event_loop()
    signal.signal(signal.SIGINT,  raise_graceful_exit)
    signal.signal(signal.SIGTERM, raise_graceful_exit)
    worker = Worker(**settings)


    async def worker_start() -> None:
        try:
            await worker.queue.connect()
            await worker.start()
        finally:
            await worker.queue.disconnect()


    loop.run_until_complete(worker_start())

