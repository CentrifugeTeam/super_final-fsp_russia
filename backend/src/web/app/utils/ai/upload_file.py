import base64
import re
from uuid import uuid4

import aiofiles
from gigachat import GigaChat
from gigachat.models import Image
from gigachat.models import ChatCompletion
from ...conf import BASE_PATH
from ...exceptions import FileDoesntSave
from logging import getLogger

logger = getLogger(__name__)
default_prompt = 'сгенерируй изображение без людей, где будет только изображенно главный символ спорта: футбол'


class IAFile:

    def __init__(self, model: GigaChat):
        """
        Инициализация класса IAFile.

        :param model: Модель GigaChat для работы с изображениями.
        """
        self.model = model

    async def prompt_for_file(self, prompt: str):
        """
        Генерация изображения по заданному prompt.

        :param prompt: Запрос для генерации изображения.
        :return: URL изображения.
        """
        response = await self.model.achat({
            "messages": [
                {"role": "user", "content": prompt}], "function_call": "auto"})
        file_id = self.get_file_id_from_response(response)
        image = await self.model.aget_image(file_id)
        return await self.save_to_file(file_id, image)

    def get_file_id_from_response(self, response: ChatCompletion):
        """
        Получение идентификатора файла из ответа.

        :param response: Ответ от модели GigaChat.
        :return: Идентификатор файла.
        """
        content = response.choices[0].message.content
        found = re.findall(r'(\w+)="(\S+)"', content)
        return found[0][1]

    async def save_to_file(self, url: str, file: Image):
        """
        Сохранение изображения в файл.

        :param url: URL изображения.
        :param file: Объект изображения.
        :return: URL сохраненного изображения.
        """
        url = f"{uuid4()}_{url}.jpg"
        filename = BASE_PATH / 'static' / url
        try:
            async with aiofiles.open(filename, 'wb') as f:
                await f.write(base64.b64decode(file.content))

        except Exception as e:
            logger.exception('Downloaded file with url %s from gigachat', url, exc_info=e)
            raise FileDoesntSave from e
        finally:
            await f.close()
