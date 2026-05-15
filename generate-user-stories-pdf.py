#!/usr/bin/env python3
"""Convert SabiHR_User_Stories_QA.md to a professionally formatted PDF."""

import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.colors import HexColor
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether, Preformatted,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from datetime import datetime

# ── Colors ──
BLUE = HexColor("#2563EB")
DARK = HexColor("#0f172a")
GRAY = HexColor("#64748b")
LIGHT_BG = HexColor("#f8fafc")
BORDER = HexColor("#e2e8f0")
WHITE = HexColor("#ffffff")
GREEN = HexColor("#16a34a")
AMBER = HexColor("#d97706")
RED = HexColor("#dc2626")
CODE_BG = HexColor("#f1f5f9")

OUTPUT_PATH = "/Users/mac/Documents/SabiHR_User_Stories_QA.pdf"
MD_PATH = "/Users/mac/Documents/sabi-hr-vite/docs/SabiHR_User_Stories_QA.md"


def build_styles():
    styles = getSampleStyleSheet()
    custom = {}

    custom["title"] = ParagraphStyle("CTitle", parent=styles["Title"],
        fontSize=24, textColor=DARK, spaceAfter=4, alignment=TA_CENTER)
    custom["subtitle"] = ParagraphStyle("CSubtitle", parent=styles["Normal"],
        fontSize=11, textColor=GRAY, alignment=TA_CENTER, spaceAfter=6)
    custom["h1"] = ParagraphStyle("CH1", parent=styles["Heading1"],
        fontSize=18, textColor=BLUE, spaceBefore=20, spaceAfter=8,
        borderWidth=0, keepWithNext=1)
    custom["h2"] = ParagraphStyle("CH2", parent=styles["Heading2"],
        fontSize=14, textColor=DARK, spaceBefore=14, spaceAfter=6,
        borderWidth=0, keepWithNext=1)
    custom["h3"] = ParagraphStyle("CH3", parent=styles["Heading3"],
        fontSize=11, textColor=DARK, spaceBefore=10, spaceAfter=4,
        borderWidth=0, keepWithNext=1)
    custom["body"] = ParagraphStyle("CBody", parent=styles["Normal"],
        fontSize=9.5, textColor=DARK, leading=14, spaceAfter=4)
    custom["bold_body"] = ParagraphStyle("CBoldBody", parent=styles["Normal"],
        fontSize=9.5, textColor=DARK, leading=14, spaceAfter=4,
        fontName="Helvetica-Bold")
    custom["bullet"] = ParagraphStyle("CBullet", parent=styles["Normal"],
        fontSize=9.5, textColor=DARK, leading=14, spaceAfter=2,
        leftIndent=16, bulletIndent=6)
    custom["bullet2"] = ParagraphStyle("CBullet2", parent=styles["Normal"],
        fontSize=9, textColor=GRAY, leading=13, spaceAfter=2,
        leftIndent=28, bulletIndent=18)
    custom["ac_title"] = ParagraphStyle("ACTitle", parent=styles["Normal"],
        fontSize=9.5, textColor=BLUE, leading=14, spaceAfter=1,
        fontName="Helvetica-Bold", leftIndent=8)
    custom["ac_body"] = ParagraphStyle("ACBody", parent=styles["Normal"],
        fontSize=9, textColor=DARK, leading=13, spaceAfter=4,
        leftIndent=16)
    custom["meta_label"] = ParagraphStyle("CMetaLabel", parent=styles["Normal"],
        fontSize=9, textColor=GRAY, fontName="Helvetica-Bold")
    custom["meta_value"] = ParagraphStyle("CMetaValue", parent=styles["Normal"],
        fontSize=9, textColor=DARK)
    custom["code"] = ParagraphStyle("CCode", parent=styles["Normal"],
        fontSize=8, textColor=DARK, leading=11, fontName="Courier",
        leftIndent=8, backColor=CODE_BG, spaceAfter=4, spaceBefore=4)
    custom["note"] = ParagraphStyle("CNote", parent=styles["Normal"],
        fontSize=9, textColor=AMBER, leading=13, spaceAfter=4,
        leftIndent=8, fontName="Helvetica-BoldOblique")
    custom["hr_line"] = ParagraphStyle("CHR", parent=styles["Normal"],
        fontSize=2, spaceAfter=4, spaceBefore=4)
    custom["toc_item"] = ParagraphStyle("CTocItem", parent=styles["Normal"],
        fontSize=10, textColor=DARK, leading=16, spaceAfter=2, leftIndent=8)
    custom["toc_module"] = ParagraphStyle("CTocModule", parent=styles["Normal"],
        fontSize=10, textColor=BLUE, leading=16, spaceAfter=2,
        fontName="Helvetica-Bold")

    return custom


def escape_xml(text):
    """Escape XML special characters for reportlab Paragraph."""
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    return text


def inline_format(text):
    """Convert markdown inline formatting to reportlab XML."""
    # Escape first
    text = escape_xml(text)
    # Bold + italic
    text = re.sub(r'\*\*\*(.*?)\*\*\*', r'<b><i>\1</i></b>', text)
    # Bold
    text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
    # Italic
    text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
    # Inline code
    text = re.sub(r'`([^`]+)`', r'<font face="Courier" size="8" color="#2563EB">\1</font>', text)
    return text


def parse_md_table(lines):
    """Parse a markdown table into a list of rows (list of cell strings)."""
    rows = []
    for line in lines:
        line = line.strip()
        if not line.startswith("|"):
            continue
        cells = [c.strip() for c in line.split("|")]
        cells = cells[1:-1] if len(cells) > 2 else cells
        # skip separator rows
        if all(re.match(r'^[-:]+$', c) for c in cells):
            continue
        rows.append(cells)
    return rows


def build_table(rows, styles, col_widths=None, is_header_blue=True):
    """Build a reportlab Table from parsed rows."""
    if not rows:
        return None

    num_cols = max(len(r) for r in rows)
    # Normalize rows
    for r in rows:
        while len(r) < num_cols:
            r.append("")

    # Convert to Paragraphs
    table_data = []
    for i, row in enumerate(rows):
        prow = []
        for cell in row:
            cell_text = inline_format(cell)
            if i == 0:
                style = ParagraphStyle("TH", fontName="Helvetica-Bold",
                    fontSize=8, textColor=WHITE if is_header_blue else DARK,
                    leading=11)
            else:
                style = ParagraphStyle("TD", fontName="Helvetica",
                    fontSize=8, textColor=DARK, leading=11)
            prow.append(Paragraph(cell_text, style))
        table_data.append(prow)

    if not col_widths:
        avail = 170 * mm
        col_widths = [avail / num_cols] * num_cols

    t = Table(table_data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ]
    if is_header_blue and len(table_data) > 0:
        style_cmds.append(("BACKGROUND", (0, 0), (-1, 0), BLUE))
        style_cmds.append(("TEXTCOLOR", (0, 0), (-1, 0), WHITE))
    if len(table_data) > 1:
        style_cmds.append(("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG))
    t.setStyle(TableStyle(style_cmds))
    return t


def build_pdf():
    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=A4,
        leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=18 * mm, bottomMargin=18 * mm,
    )
    s = build_styles()
    elements = []

    # Read the markdown
    with open(MD_PATH, "r", encoding="utf-8") as f:
        md_lines = f.readlines()

    # ── Cover Page ──
    elements.append(Spacer(1, 30 * mm))
    elements.append(Paragraph("SabiHR", s["title"]))
    elements.append(Paragraph("Comprehensive User Stories for QA Testing", ParagraphStyle(
        "CSub2", fontName="Helvetica", fontSize=14, textColor=GRAY,
        alignment=TA_CENTER, spaceAfter=4)))
    elements.append(Spacer(1, 4 * mm))
    elements.append(HRFlowable(width="40%", thickness=1, color=BORDER,
        spaceAfter=6, hAlign="CENTER"))
    elements.append(Spacer(1, 6 * mm))

    meta = [
        ["Document Version", "1.0"],
        ["Date", datetime.now().strftime("%B %d, %Y")],
        ["Prepared For", "QA Team"],
        ["Platform", "Web Application (React + Vite + TypeScript)"],
        ["User Stories", "59"],
        ["Acceptance Criteria", "250+"],
        ["Modules Covered", "17"],
        ["Routes Covered", "120+"],
    ]
    meta_table = Table(meta, colWidths=[45 * mm, 100 * mm])
    meta_table.setStyle(TableStyle([
        ("FONT", (0, 0), (0, -1), "Helvetica-Bold", 9),
        ("FONT", (1, 0), (1, -1), "Helvetica", 9),
        ("TEXTCOLOR", (0, 0), (0, -1), GRAY),
        ("TEXTCOLOR", (1, 0), (1, -1), DARK),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ]))
    elements.append(meta_table)
    elements.append(PageBreak())

    # ── Parse and render markdown ──
    i = 0
    in_code_block = False
    code_block_lines = []
    in_table = False
    table_lines = []

    while i < len(md_lines):
        line = md_lines[i].rstrip("\n")
        stripped = line.strip()

        # Code blocks
        if stripped.startswith("```"):
            if in_code_block:
                # End code block
                code_text = "\n".join(code_block_lines)
                if code_text.strip():
                    elements.append(Spacer(1, 2 * mm))
                    for cl in code_block_lines:
                        escaped = escape_xml(cl) if cl.strip() else " "
                        elements.append(Paragraph(
                            f'<font face="Courier" size="7.5" color="#334155">{escaped}</font>',
                            ParagraphStyle("CodeLine", fontSize=7.5, leading=10,
                                leftIndent=10, backColor=CODE_BG, spaceBefore=0, spaceAfter=0)))
                    elements.append(Spacer(1, 2 * mm))
                code_block_lines = []
                in_code_block = False
            else:
                # Flush any table
                if in_table:
                    rows = parse_md_table(table_lines)
                    tbl = build_table(rows, s)
                    if tbl:
                        elements.append(tbl)
                        elements.append(Spacer(1, 2 * mm))
                    table_lines = []
                    in_table = False
                in_code_block = True
            i += 1
            continue

        if in_code_block:
            code_block_lines.append(line)
            i += 1
            continue

        # Tables
        if stripped.startswith("|") and "|" in stripped[1:]:
            if not in_table:
                in_table = True
                table_lines = []
            table_lines.append(stripped)
            i += 1
            continue
        elif in_table:
            rows = parse_md_table(table_lines)
            tbl = build_table(rows, s)
            if tbl:
                elements.append(tbl)
                elements.append(Spacer(1, 2 * mm))
            table_lines = []
            in_table = False

        # Empty line
        if not stripped:
            i += 1
            continue

        # Page break (horizontal rules used as section dividers)
        if stripped == "---":
            elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=4, spaceBefore=4))
            i += 1
            continue

        # Headings
        if stripped.startswith("# ") and not stripped.startswith("## "):
            text = inline_format(stripped[2:].strip())
            elements.append(PageBreak())
            elements.append(Paragraph(text, s["h1"]))
            elements.append(HRFlowable(width="100%", thickness=1, color=BLUE, spaceAfter=8))
            i += 1
            continue

        if stripped.startswith("## ") and not stripped.startswith("### "):
            text = inline_format(stripped[3:].strip())
            elements.append(Spacer(1, 3 * mm))
            elements.append(Paragraph(text, s["h2"]))
            elements.append(HRFlowable(width="100%", thickness=0.5, color=BORDER, spaceAfter=6))
            i += 1
            continue

        if stripped.startswith("### "):
            text = inline_format(stripped[4:].strip())
            elements.append(Paragraph(text, s["h3"]))
            i += 1
            continue

        # Acceptance criteria lines (AC-N: ...)
        ac_match = re.match(r'\*\*(AC-\d+:.*?)\*\*', stripped)
        if ac_match:
            ac_text = inline_format(stripped)
            elements.append(Paragraph(ac_text, s["ac_title"]))
            i += 1
            continue

        # Given/When/Then lines
        gwt_match = re.match(r'^-\s+\*\*(Given|When|Then)\*\*\s+(.*)', stripped)
        if gwt_match:
            keyword = gwt_match.group(1)
            rest = gwt_match.group(2)
            text = f'<b>{escape_xml(keyword)}</b> {inline_format(rest)}'
            elements.append(Paragraph(text, s["ac_body"]))
            i += 1
            continue

        # Bold note lines (like **Note:**)
        if stripped.startswith("**Note:**") or stripped.startswith("**Note:**"):
            text = inline_format(stripped)
            elements.append(Paragraph(text, s["note"]))
            i += 1
            continue

        # Bullet points (level 2)
        if re.match(r'^\s{2,}-\s', line):
            text = inline_format(re.sub(r'^\s+-\s', '', line))
            elements.append(Paragraph(f"\u2022 {text}", s["bullet2"]))
            i += 1
            continue

        # Bullet points (level 1)
        if stripped.startswith("- "):
            text = inline_format(stripped[2:])
            elements.append(Paragraph(f"\u2022 {text}", s["bullet"]))
            i += 1
            continue

        # Regular paragraph
        text = inline_format(stripped)
        if text.strip():
            elements.append(Paragraph(text, s["body"]))

        i += 1

    # Flush any remaining table
    if in_table:
        rows = parse_md_table(table_lines)
        tbl = build_table(rows, s)
        if tbl:
            elements.append(tbl)

    # ── Footer ──
    elements.append(Spacer(1, 10 * mm))
    elements.append(HRFlowable(width="100%", thickness=1, color=BORDER, spaceAfter=6))
    elements.append(Paragraph(
        f"Generated for SabiHR QA Team \u2014 {datetime.now().strftime('%B %d, %Y')}",
        ParagraphStyle("Footer", fontSize=8, textColor=GRAY, alignment=TA_CENTER)))

    doc.build(elements)
    print(f"PDF generated: {OUTPUT_PATH}")


if __name__ == "__main__":
    build_pdf()
