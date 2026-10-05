# NIWE Wind Stations

### Interactive Visualization of Wind Measurement Stations Across India

An interactive web application for visualizing and exploring **National Institute of Wind Energy (NIWE)** wind measurement stations across India.

The application combines geospatial visualization with structured station data to make wind measurement locations easier to explore through an interactive map.

---

## Overview

The project transforms NIWE wind measurement data into an interactive geographical interface.

Users can:

* Explore wind measurement stations across India
* Navigate and zoom across the map
* Switch between street and satellite map views
* View clustered station markers
* Identify station status through marker colors
* View detailed station information
* Interact with state boundaries
* Automatically fit the map to available stations
* Reset the map to the India view

---

## Key Features

### Interactive Map

Built with **Leaflet** and **React Leaflet**, providing an interactive map centered on India.

### Station Visualization

Wind measurement stations are displayed as map markers with:

* Station name
* Operational status
* State
* District
* Mast height
* Coordinates

### Marker Clustering

Nearby stations are automatically grouped into clusters to keep the map readable and improve visualization when working with a large number of locations.

### Status-Based Markers

Station markers are visually differentiated based on operational status:

* Green — In Operation
* Red — Closed

### Map Layers

Users can switch between:

* OpenStreetMap street view
* Esri satellite imagery

### Map Controls

The application includes:

* Station tooltips
* Detailed station popups
* Map legend
* Scale indicator
* State boundary overlay
* Automatic station bounds
* Reset-to-India control

---

## Data Flow

```text
NIWE Wind Measurement Data
          |
          v
   Python PDF Extraction
          |
          v
      Structured Data
          |
          v
       GeoJSON
          |
          v
 React + Leaflet Application
          |
          v
 Interactive Station Map
```

The data-processing workflow uses Python and `pdfplumber` to extract information from the NIWE source PDF. The frontend consumes station data in **GeoJSON** format.

---

## Technology Stack

| Technology            | Purpose                              |
| --------------------- | ------------------------------------ |
| React                 | Frontend application                 |
| TypeScript            | Type-safe project configuration      |
| Vite                  | Development server and build tooling |
| Leaflet               | Interactive map rendering            |
| React Leaflet         | React integration for Leaflet        |
| React Leaflet Cluster | Marker clustering                    |
| Python                | Data processing                      |
| pdfplumber            | PDF data extraction                  |
| GeoJSON               | Geospatial station data format       |

---

## Project Structure

```text
niwe-wind-stations/
│
├── data-processing/
│   ├── scripts/
│   │   └── extract.py
│   └── requirements.txt
│
├── public/
│   └── data/
│       ├── stations.geojson
│       └── india-states.json
│
├── src/
│   ├── components/
│   │   └── map/
│   │       └── WindMap.jsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── App.css
│   └── index.css
│
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/SHREYA-G-AMIN/niwe-wind-stations.git
cd niwe-wind-stations
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available through the local Vite development server.

### 4. Build for production

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## Team Contributions

| Contributor       | GitHub                                            | Contribution             |
| ----------------- | ------------------------------------------------- | ------------------------ |
| **Shreya G Amin** | [SHREYA-G-AMIN](https://github.com/SHREYA-G-AMIN) | Map & Visualization      |
| **Moulya Hegde**  | [moulya-hegde](https://github.com/moulya-hegde)   | Search & Filtering       |
| **Manish D Rao**  | [Manish-D-Rao](https://github.com/Manish-D-Rao)   | Dashboard & Analytics    |
| **Manya Jain**    | [Manya-Jain-66](https://github.com/Manya-Jain-66) | Station Explorer         |
| **Ishta P Jain**  | [Ishta-P-Jain](https://github.com/Ishta-P-Jain)   | Data Processing & Export |

---

## Repository

**GitHub:** [SHREYA-G-AMIN/niwe-wind-stations](https://github.com/SHREYA-G-AMIN/niwe-wind-stations)
