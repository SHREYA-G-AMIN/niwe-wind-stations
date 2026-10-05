export interface StationProperties {
  id: string;
  serial_no: number | null;
  state_serial_no: number | null;
  station_name: string;
  district: string | null;
  state: string;
  commenced_on: string;
  closed_on: string | null;
  financial_year_commenced: string | null;
  financial_year_closed: string | null;
  mast_height_m: number;
  elevation_m: number;
  maws: number | null;
  mawpd: number | null;
  latitude: number;
  longitude: number;
  status: string;
  project_type: string | null;
  is_revision: boolean;
  review_required: boolean;
  review_reason: string | null;
  clean_notes: string | null;
  pdf_page: number;
  source_table: string;
}

export interface StationFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [longitude: number, latitude: number];
  };
  properties: StationProperties;
}

export interface StationFeatureCollection {
  type: "FeatureCollection";
  features: StationFeature[];
}
