from bs4 import BeautifulSoup


def parse_federal_district(soup: BeautifulSoup):
	"""
	Парсит федеральные округа.
	Возвращает список федеральных округов.
	"""
	federal_districts_data = []
	federal_district_blocks = soup.find_all('div', class_='accordion-item')

	for federal_district_block in federal_district_blocks:
		accordion_headers = federal_district_block.find('div', class_='accordion-header')
		h4 = accordion_headers.find('h4') if accordion_headers else None
		if h4:
			federal_district_name = h4.text.strip()
			federal_districts_data.append(federal_district_name)

	return federal_districts_data
