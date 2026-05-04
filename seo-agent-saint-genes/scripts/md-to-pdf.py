#!/usr/bin/env python3
"""Convertit le markdown de synthese en PDF avec FPDF2.

Mise en page sobre, type publication editoriale :
- Couverture avec titre + auteur + date
- Sommaire avec ancres
- Marges 25mm
- Helvetica corps + monospace pour code
- Saut de page sur chaque H1
"""
from __future__ import annotations

import re
import sys
from datetime import date
from pathlib import Path

from fpdf import FPDF

# ── Parametres ────────────────────────────────────────────────────────────────
TITLE = "Synthese des prompts - pipeline 4 agents IA"
SUBTITLE = "Auto-Ecole Saint-Genes - Plateforme SEO multi-agents"
AUTHOR = "Auto-Ecole Saint-Genes"

ROOT = Path(__file__).resolve().parent.parent
INPUT_MD = ROOT / "prompts-agents-synthese.md"
OUTPUT_PDF = ROOT / "prompts-agents-synthese.pdf"

# Couleurs (RGB)
ACCENT = (19, 73, 166)
INK = (11, 18, 32)
INK_DIM = (74, 81, 99)
MUTED = (139, 146, 163)
BG_CODE = (245, 246, 248)
BORDER = (227, 229, 235)


# ── PDF ───────────────────────────────────────────────────────────────────────
class SynthesePDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_margins(25, 25, 25)
        self.set_auto_page_break(auto=True, margin=25)
        self.set_title(TITLE)
        self.set_author(AUTHOR)
        self.toc_entries: list[tuple[int, str, int]] = []  # (level, label, page)
        self.in_cover = False

    # — Header / Footer ——————————————————————————————————————————————
    def header(self):
        if self.in_cover or self.page_no() <= 1:
            return
        self.set_y(12)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 5, TITLE, align="L")
        self.cell(0, 5, "Auto-Ecole Saint-Genes", align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(*BORDER)
        self.set_line_width(0.2)
        self.line(25, 20, 185, 20)

    def footer(self):
        if self.in_cover:
            return
        self.set_y(-18)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 5, f"Page {self.page_no()}", align="C")

    # — Couverture ——————————————————————————————————————————————————
    def cover(self):
        self.in_cover = True
        self.add_page()
        # Bandeau accent en haut
        self.set_fill_color(*ACCENT)
        self.rect(0, 0, 210, 6, "F")

        # Bloc d'identite haut
        self.set_y(45)
        self.set_font("Courier", "B", 9)
        self.set_text_color(*ACCENT)
        self.cell(0, 5, "AUTO-ECOLE SAINT-GENES  -  BORDEAUX", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 5, "DOCUMENT INTERNE  -  AVRIL 2026", new_x="LMARGIN", new_y="NEXT")

        # Titre central
        self.set_y(110)
        self.set_font("Helvetica", "B", 28)
        self.set_text_color(*INK)
        self.multi_cell(0, 12, TITLE, align="L")
        self.ln(4)
        self.set_font("Helvetica", "", 14)
        self.set_text_color(*INK_DIM)
        self.multi_cell(0, 7, SUBTITLE, align="L")

        # Hairline
        self.set_y(170)
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.5)
        self.line(25, self.get_y(), 70, self.get_y())

        # Meta bas
        self.set_y(230)
        self.set_font("Courier", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 4, f"AUTEUR     {AUTHOR.upper()}", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 4, f"DATE       {date.today().strftime('%d %B %Y').upper()}", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 4, "MODELE     CLAUDE-SONNET-4-20250514", new_x="LMARGIN", new_y="NEXT")
        self.cell(0, 4, "AGENTS     04 (SEO  -  CONTENU  -  DESIGN  -  DEV)", new_x="LMARGIN", new_y="NEXT")

        self.in_cover = False

    # — Sommaire ——————————————————————————————————————————————————————
    def sommaire(self):
        self.add_page()
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(*INK)
        self.cell(0, 12, "Sommaire", new_x="LMARGIN", new_y="NEXT")
        self.ln(6)

        self.set_draw_color(*BORDER)
        self.set_line_width(0.2)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(4)

        for level, label, page in self.toc_entries:
            indent = (level - 1) * 6
            self.set_x(25 + indent)
            if level == 1:
                self.set_font("Helvetica", "B", 11)
                self.set_text_color(*INK)
            else:
                self.set_font("Helvetica", "", 10)
                self.set_text_color(*INK_DIM)
            # Label tronque si trop long
            label_clean = label[:80]
            label_w = self.get_string_width(label_clean)
            avail = 160 - indent - 14
            self.cell(label_w, 7, label_clean)
            # Pointilles
            self.set_font("Helvetica", "", 10)
            self.set_text_color(*MUTED)
            dots_w = avail - label_w
            n_dots = max(1, int(dots_w / self.get_string_width(".")))
            self.cell(dots_w, 7, "." * n_dots, align="C")
            # Numero de page
            self.set_font("Courier", "", 10)
            self.cell(14, 7, str(page), align="R", new_x="LMARGIN", new_y="NEXT")

    # — Helpers contenu ——————————————————————————————————————————————
    def h1(self, text: str):
        self.add_page()
        self.toc_entries.append((1, text, self.page_no()))
        self.ln(4)
        self.set_font("Courier", "B", 9)
        self.set_text_color(*ACCENT)
        self.cell(0, 5, "SECTION", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "B", 22)
        self.set_text_color(*INK)
        self.multi_cell(0, 10, text)
        self.ln(2)
        self.set_draw_color(*ACCENT)
        self.set_line_width(0.5)
        self.line(25, self.get_y(), 50, self.get_y())
        self.ln(4)

    def h2(self, text: str):
        self.toc_entries.append((2, text, self.page_no()))
        self.ln(5)
        self.set_font("Helvetica", "B", 15)
        self.set_text_color(*INK)
        self.multi_cell(0, 8, text)
        self.ln(1)

    def h3(self, text: str):
        self.ln(3)
        self.set_font("Helvetica", "B", 12)
        self.set_text_color(*INK)
        self.multi_cell(0, 6, text)
        self.ln(1)

    def para(self, text: str):
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(*INK_DIM)
        self.multi_cell(0, 5.6, text)
        self.ln(2)

    def bullet(self, text: str, indent: int = 0):
        self.set_font("Helvetica", "", 10.5)
        self.set_text_color(*INK_DIM)
        x = 25 + indent * 5
        self.set_x(x)
        # Puce
        self.set_text_color(*ACCENT)
        self.cell(4, 5.6, "-")
        self.set_text_color(*INK_DIM)
        # Texte (largeur restante)
        remaining_w = 185 - x - 4
        self.multi_cell(remaining_w, 5.6, text)

    def code_block(self, text: str):
        self.ln(2)
        self.set_fill_color(*BG_CODE)
        self.set_draw_color(*BORDER)
        self.set_text_color(*INK)
        self.set_font("Courier", "", 8.5)
        # Calculer hauteur du bloc
        lines = text.split("\n")
        line_h = 4.2
        block_h = len(lines) * line_h + 4
        x = self.get_x()
        y = self.get_y()
        # Pas de saut auto au milieu d'un bloc trop long : on gere
        if y + block_h > self.h - 30:
            self.add_page()
            y = self.get_y()
        self.rect(x, y, 160, block_h, "DF")
        self.set_xy(x + 3, y + 2)
        for line in lines:
            # Tronquer ligne si trop longue
            max_chars = 92
            chunks = [line[i:i + max_chars] for i in range(0, max(len(line), 1), max_chars)] or [""]
            for chunk in chunks:
                self.set_x(x + 3)
                self.cell(157, line_h, chunk, new_x="LMARGIN", new_y="NEXT")
        self.ln(3)

    def hr(self):
        self.ln(3)
        self.set_draw_color(*BORDER)
        self.set_line_width(0.3)
        self.line(25, self.get_y(), 185, self.get_y())
        self.ln(4)

    def table_simple(self, headers: list[str], rows: list[list[str]], widths: list[int]):
        # Header
        self.set_font("Helvetica", "B", 9)
        self.set_fill_color(*ACCENT)
        self.set_text_color(255, 255, 255)
        for h, w in zip(headers, widths):
            self.cell(w, 7, h, border=0, align="L", fill=True)
        self.ln()
        # Rows
        self.set_font("Helvetica", "", 9)
        self.set_text_color(*INK_DIM)
        zebra = False
        for row in rows:
            if zebra:
                self.set_fill_color(*BG_CODE)
            else:
                self.set_fill_color(255, 255, 255)
            for c, w in zip(row, widths):
                self.cell(w, 6.5, str(c)[:int(w / 1.7)], border=0, align="L", fill=True)
            self.ln()
            zebra = not zebra
        self.ln(3)


# ── Markdown parser minimaliste ──────────────────────────────────────────────
def normalize(text: str) -> str:
    """FPDF2 (latin-1 fonts) ne supporte pas tous les unicode. On remplace
    les caracteres typographiques courants."""
    repl = {
        "—": "-",   # em dash
        "–": "-",   # en dash
        "‘": "'", "’": "'",
        "“": '"', "”": '"',
        "…": "...",
        " ": " ",
        "→": "->",
        "←": "<-",
        "×": "x",
        "³": "3",
        "²": "2",
        "≥": ">=",
        "≤": "<=",
        "·": "-",
        "•": "-",
        "✓": "OK",
        "✗": "X",
        "…": "...",
        "£": "GBP",
        "€": "EUR",
        "»": ">>",
        "«": "<<",
        "﻿": "",
        # accent souvent vu  -  on tente latin-1 sinon fallback
    }
    for k, v in repl.items():
        text = text.replace(k, v)
    # Encode latin-1 with replace pour tous les caracteres restants
    return text.encode("latin-1", "replace").decode("latin-1")


INLINE_RX = re.compile(r"(\*\*[^*]+\*\*|`[^`]+`)")


def render_inline(pdf: SynthesePDF, text: str):
    """Rendu inline simple : conserve **gras** et `code` via cell sequentielles."""
    pdf.set_font("Helvetica", "", 10.5)
    pdf.set_text_color(*INK_DIM)
    parts = INLINE_RX.split(text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            pdf.set_font("Helvetica", "B", 10.5)
            pdf.set_text_color(*INK)
            pdf.write(5.6, normalize(part[2:-2]))
            pdf.set_font("Helvetica", "", 10.5)
            pdf.set_text_color(*INK_DIM)
        elif part.startswith("`") and part.endswith("`"):
            pdf.set_font("Courier", "", 10)
            pdf.set_text_color(*ACCENT)
            pdf.write(5.6, normalize(part[1:-1]))
            pdf.set_font("Helvetica", "", 10.5)
            pdf.set_text_color(*INK_DIM)
        else:
            pdf.write(5.6, normalize(part))
    pdf.ln(7)


def parse_table(lines: list[str], start: int) -> tuple[int, list[str], list[list[str]]]:
    """Parse a markdown table starting at line index `start`.
    Returns (next_index, headers, rows)."""
    header_line = lines[start].strip().strip("|")
    headers = [h.strip() for h in header_line.split("|")]
    # Skip alignment line
    i = start + 2
    rows: list[list[str]] = []
    while i < len(lines) and "|" in lines[i]:
        row_line = lines[i].strip().strip("|")
        cells = [c.strip() for c in row_line.split("|")]
        rows.append(cells)
        i += 1
    return i, headers, rows


def render_markdown(pdf: SynthesePDF, md: str):
    lines = md.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i].rstrip()

        # Code block
        if line.startswith("```"):
            buf = []
            i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i])
                i += 1
            pdf.code_block(normalize("\n".join(buf)))
            i += 1
            continue

        # Headings
        if line.startswith("# "):
            pdf.h1(normalize(line[2:].strip()))
            i += 1; continue
        if line.startswith("## "):
            pdf.h2(normalize(line[3:].strip()))
            i += 1; continue
        if line.startswith("### "):
            pdf.h3(normalize(line[4:].strip()))
            i += 1; continue

        # HR
        if line.strip() == "---":
            pdf.hr()
            i += 1; continue

        # Table (markdown style)
        if line.startswith("|") and i + 1 < len(lines) and re.match(r"\|[\s\-:|]+\|", lines[i + 1]):
            next_i, headers, rows = parse_table(lines, i)
            # Largeurs proportionnelles selon nombre de colonnes
            n = len(headers)
            avail = 160
            widths = [int(avail / n)] * n
            pdf.table_simple([normalize(h) for h in headers],
                             [[normalize(c) for c in r] for r in rows],
                             widths)
            i = next_i
            continue

        # Bullet
        m = re.match(r"^(\s*)[-*] (.+)$", line)
        if m:
            indent = len(m.group(1)) // 2
            pdf.bullet(normalize(m.group(2)), indent=indent)
            i += 1; continue

        # Numbered
        m = re.match(r"^\s*\d+\.\s+(.+)$", line)
        if m:
            pdf.bullet(normalize(m.group(1)))
            i += 1; continue

        # Blockquote
        if line.startswith("> "):
            pdf.set_font("Helvetica", "I", 10.5)
            pdf.set_text_color(*ACCENT)
            pdf.set_left_margin(30)
            pdf.multi_cell(0, 5.6, normalize(line[2:].strip()))
            pdf.set_left_margin(25)
            pdf.ln(2)
            i += 1; continue

        # Paragraphe (lignes consecutives non vides)
        if line.strip():
            buf = [line]
            j = i + 1
            while j < len(lines) and lines[j].strip() and not lines[j].startswith(("#", "```", "- ", "* ", "|", "> ")):
                buf.append(lines[j])
                j += 1
            render_inline(pdf, " ".join(buf))
            i = j
            continue

        i += 1


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not INPUT_MD.exists():
        print(f"Markdown introuvable: {INPUT_MD}", file=sys.stderr)
        sys.exit(1)

    md = INPUT_MD.read_text(encoding="utf-8")

    # Premiere passe : on construit le PDF avec contenu
    pdf = SynthesePDF()
    pdf.cover()
    # Page placeholder pour TOC : on la construira a la fin et on l'inserera apres
    pdf.add_page()
    toc_page_no = pdf.page_no()

    # Render content
    render_markdown(pdf, md)

    # Maintenant qu'on connait toutes les ancres, on retourne en arriere pour la TOC
    # FPDF ne permet pas d'inserer une page : on regenere tout
    # 2eme passe : on a toc_entries, on regenere proprement
    final = SynthesePDF()
    final.toc_entries = pdf.toc_entries
    final.cover()
    # Sommaire (utilise les entries deja calculees, pages vont decaler de la longueur du sommaire)
    # Calcul du nombre de pages que prendra la TOC : ~30 entrees par page
    toc_pages_estimated = max(1, (len(final.toc_entries) + 28) // 29)
    # Decaler les pages dans toc_entries (la TOC va prendre toc_pages_estimated pages)
    final.toc_entries = [(lvl, lbl, page + toc_pages_estimated) for lvl, lbl, page in final.toc_entries]
    final.sommaire()
    render_markdown(final, md)
    final.output(str(OUTPUT_PDF))

    print(str(OUTPUT_PDF))


if __name__ == "__main__":
    main()
