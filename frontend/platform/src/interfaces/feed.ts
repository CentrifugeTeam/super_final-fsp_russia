export interface IRegion {
	region_name: string;
	leader: string;
	contacts: string;
}

export interface IFederalDistrictData {
	region_name: string;
	regions: IRegion[];
}

export interface IFederalDistrict {
	district: IFederalDistrictData;
}

export interface IRegion {
	region: IRegion;
}
