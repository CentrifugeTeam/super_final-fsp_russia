from saq import Worker
from saq.worker import logger
import asyncio


class WindowsWorker(Worker):
    async def start(self):
        logger.info("Worker starting: %s", repr(self.queue))
        logger.debug("Registered functions:\n%s", "\n".join(f"  {key}" for key in self.functions))

        try:
            self.event = asyncio.Event()
            loop = asyncio.get_running_loop()

            if self.startup:
                for s in self.startup:
                    await s(self.context)

            self.tasks.update(await self.upkeep())

            for _ in range(self.concurrency):
                self._process()

            await self.event.wait()

        except asyncio.CancelledError:
            pass
        finally:
            logger.info("Worker shutting down")

            if self.shutdown:
                for s in self.shutdown:
                    await s(self.context)

            await self.stop()
