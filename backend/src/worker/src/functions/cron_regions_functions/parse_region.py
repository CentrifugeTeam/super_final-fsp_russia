async def parse_region(block, federal_district_name: str):
	"""
	Парсит данные о регионе из одного блока.
	Возвращает словарь с данными о регионе.
	"""
	region_name = None
	leader = None
	contacts = None

	if block.find('p', class_='hide_region') and block.find('p', class_='hide_region').text == "Субъект РФ":
		region_name_tag = block.find('a')
		if region_name_tag:
			region_name = region_name_tag.get_text(strip=True)

	if block.find('p', class_='hide_region') and block.find('p', class_='hide_region').text == "Руководитель":
		leader_tag = block.find('a')
		if leader_tag:
			leader = leader_tag.get_text(strip=True)

	if block.find('p', class_='hide_region') and block.find('p', class_='hide_region').text == "Контакты":
		contact_tag = block.find('p', class_='white_region')
		if contact_tag:
			contacts = contact_tag.get_text(strip=True)

	# Возвращаем данные о регионе, если они собраны
	if region_name and contacts:
		return {
			'federal_district': federal_district_name,
			'region_name': region_name,
			'leader': leader,
			'contacts': contacts
		}
	return None
