
from pathlib import Path
import csv
import json

import pdfplumber


# Project paths
BASE_DIR = Path(__file__).resolve().parents[1]

PDF_PATH = BASE_DIR / "data" / "raw" / "LIST_OF_WMS_AS_ON_31072026.pdf"
OUTPUT_DIR = BASE_DIR / "data" / "processed"

RAW_TABLES_FILE = OUTPUT_DIR / "raw_tables.csv"
RAW_TEXT_FILE = OUTPUT_DIR / "raw_text.txt"


def extract_pdf():
    if not PDF_PATH.exists():
        raise FileNotFoundError(
            f"PDF not found: {PDF_PATH}"
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    extracted_tables = []
    extracted_text = []

    with pdfplumber.open(PDF_PATH) as pdf:
        print(f"Total PDF pages: {len(pdf.pages)}")

        for page_number, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""

            extracted_text.append(
                f"\n--- PAGE {page_number} ---\n{text}"
            )

            tables = page.extract_tables()

            print(
                f"Page {page_number}: "
                f"{len(tables)} table(s) detected"
            )

            for table_number, table in enumerate(tables, start=1):
                for row_number, row in enumerate(table, start=1):
                    extracted_tables.append({
                        "page_number": page_number,
                        "table_number": table_number,
                        "row_number": row_number,
                        "row_data": json.dumps(
                            row,
                            ensure_ascii=False
                        )
                    })

    # Save the extracted text for inspection
    RAW_TEXT_FILE.write_text(
        "\n".join(extracted_text),
        encoding="utf-8"
    )

    # Save every extracted table row without
    # assuming the final column structure yet
    with RAW_TABLES_FILE.open(
        "w",
        newline="",
        encoding="utf-8-sig"
    ) as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "page_number",
                "table_number",
                "row_number",
                "row_data"
            ]
        )

        writer.writeheader()
        writer.writerows(extracted_tables)

    print("\nExtraction completed.")
    print(f"Extracted table rows: {len(extracted_tables)}")
    print(f"Text saved to: {RAW_TEXT_FILE}")
    print(f"Tables saved to: {RAW_TABLES_FILE}")


if __name__ == "__main__":
    extract_pdf()