# NIWE Wind Stations

An interactive web platform for exploring and visualizing NIWE wind measurement stations across India.

---

## Overview

This single-page application provides an interactive map interface to explore wind measurement stations maintained by the National Institute of Wind Energy (NIWE) across India. Built for researchers, policymakers, and wind energy professionals to visualize station distribution, operational status, and geographic context.

**Problem addressed:** NIWE station data was previously available only in static PDF reports, making spatial analysis and quick lookup difficult. This platform transforms that data into an explorable, filterable web map.

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Interactive Map** | Leaflet-powered map with pan, zoom, and layer switching |
| **Station Markers** | Clustered markers showing all wind measurement stations |
| **Status Visualization** | Color-coded markers: green (In Operation) / red (Closed) |
| **Detailed Popups** | Click any station for name, status, state, district, mast height, coordinates |
| **Base Layers** | Switch between OpenStreetMap (street) and Esri (satellite) |
| **State Boundaries** | Optional Indian state boundary overlay (GeoJSON) |
| **Map Controls** | Scale bar, legend, reset-to-India button |
| **Auto-fit Bounds** | Map automatically centers to show all loaded stations |
| **Tooltip Hover** | Quick station name + status on hover |

---

## How It Works

```
┌─────────────────────┐
│   Public Data Files │
│  /public/data/      │
│  • stations.geojson │
│  • india-states.json│
└─────────┬───────────┘
          │ fetch (on load)
          ▼
┌─────────────────────┐
│    WindMap Component│
│  (React + Leaflet)  │
├─────────────────────┤
│ • Load GeoJSON data │
│ • Render base layers│
│ • Cluster markers   │
│ • Bind popups/tooltips│
│ • Add controls      │
└─────────────────────┘
```

1. **Data Loading**: On mount, the `WindMap` component fetches `stations.geojson` and `india-states.json` from the public directory.
2. **Rendering**: Stations are rendered as clustered markers using `react-leaflet-cluster`. State boundaries render as a GeoJSON overlay.
3. **Interaction**: Markers display tooltips on hover and detailed popups on click. Users can toggle base layers and state boundaries via the layer control.
4. **Controls**: Legend, scale, and reset button provide context and navigation aids.

---

## Technology Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | React 19, TypeScript |
| **Build Tool** | Vite 8 |
| **Mapping** | Leaflet 1.9, react-leaflet 5, react-leaflet-cluster 4 |
| **Styling** | CSS (component-scoped via inline styles) |
| **Linting** | ESLint 10, TypeScript ESLint |
| **Data Processing** | Python 3, pdfplumber (extract script) |

---

## Project Structure

```
niwe-wind-stations/
├── public/
│   ├── data/
│   │   ├── stations.geojson      # Station locations & properties
│   │   └── india-states.json     # State boundary polygons
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   └── map/
│   │       └── WindMap.jsx       # Main map component
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.tsx                   # App entry (renders WindMap)
│   ├── main.tsx                  # React bootstrap
│   ├── index.css                 # Global styles
│   └── App.css                   # App-specific styles
├── data-processing/
│   ├── requirements.txt          # Python deps (pdfplumber)
│   └── scripts/
│       └── extract.py            # PDF → CSV/GeoJSON extractor
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── eslint.config.js
└── .gitignore
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/SHREYA-G-AMIN/niwe-wind-stations.git
cd niwe-wind-stations

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with HMR
npm run dev
```

Open `http://localhost:5173` in your browser.

### Production Build

```bash
# Type-check and build for production
npm run build
```

Output is written to `dist/`.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Data Processing (Optional)

The repository includes a Python script to extract station data from the official NIWE PDF report.

```bash
cd data-processing

# Install Python dependencies
pip install -r requirements.txt

# Place the PDF at data/raw/LIST_OF_WMS_AS_ON_31072026.pdf
# Then run extraction
python scripts/extract.py
```

Outputs raw tables and text to `data/processed/` for further transformation into the GeoJSON format used by the frontend.

---

## Team

| Contributor | GitHub | Contribution |
|-------------|--------|--------------|
| Shreya G Amin | [@SHREYA-G-AMIN](https://github.com/SHREYA-G-AMIN) | Map & Visualization |
| Moulya Hegde | [@moulya-hegde](https://github.com/moulya-hegde) | Search & Filtering |
| Manish D Rao | [@Manish-D-Rao](https://github.com/Manish-D-Rao) | Dashboard & Analytics |
| Manya Jain | [@Manya-Jain-66](https://github.com/Manya-Jain-66) | Station Explorer |
| Ishta P Jain | [@Ishta-P-Jain](https://github.com/Ishta-P-Jain) | Data Processing & Export |

---

## Screenshots

> **Note:** Add screenshots here by placing images in `public/screenshots/` and referencing them below.
>
> ```markdown
> ![Map View](public/screenshots/map-view.png)
> ![Station Popup](public/screenshots/station-popup.png)
> ```

---

## License

This project is licensed under the MIT License.

---

## Data Source

Station data sourced from **National Institute of Wind Energy (NIWE)**, Ministry of New and Renewable Energy, Government of India. The application visualizes publicly available station metadata; no proprietary or sensitive data is included.