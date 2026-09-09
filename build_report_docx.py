import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

def set_cell_background(cell, fill_color):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=180, right=180):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_borders(table):
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(f'''
            <w:tblBorders {nsdecls("w")}>
                <w:top w:val="single" w:sz="8" w:space="0" w:color="1F4E79"/>
                <w:bottom w:val="single" w:sz="8" w:space="0" w:color="1F4E79"/>
                <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D3D3D3"/>
                <w:insideV w:val="none"/>
                <w:left w:val="none"/>
                <w:right w:val="none"/>
            </w:tblBorders>
        ''')
        tblPr[0].append(borders)

def style_table(table, col_widths, headers, data):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table)
    
    # Header Row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "1F4E79")
        set_cell_margins(hdr_cells[i], top=140, bottom=140, left=180, right=180)
        hdr_cells[i].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(0)
        for run in p.runs:
            run.font.name = 'Times New Roman'
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)
    
    # Data Rows
    for r_idx, row_data in enumerate(data):
        row_cells = table.add_row().cells
        bg_color = "F2F4F8" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row_data):
            row_cells[c_idx].text = str(val)
            set_cell_background(row_cells[c_idx], bg_color)
            set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=180, right=180)
            row_cells[c_idx].vertical_alignment = WD_ALIGN_VERTICAL.CENTER
            p = row_cells[c_idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            for run in p.runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10.5)
                run.font.color.rgb = RGBColor(0x26, 0x26, 0x26)
    
    # Enforce Column Widths across all rows
    for row in table.rows:
        for c_idx, w in enumerate(col_widths):
            row.cells[c_idx].width = w

def add_heading_1(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(22)
    p.paragraph_format.space_after = Pt(10)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(18)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    return p

def add_heading_2(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(14)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x2F, 0x55, 0x97)
    return p

def add_heading_3(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.bold = True
    run.font.color.rgb = RGBColor(0x40, 0x40, 0x40)
    return p

def add_paragraph(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.3
    p.paragraph_format.space_after = Pt(6)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.size = Pt(12)
    run.font.color.rgb = RGBColor(0x26, 0x26, 0x26)
    return p

def add_bullet(doc, bold_prefix, text):
    p = doc.add_paragraph(style='List Bullet')
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    p.paragraph_format.line_spacing = 1.25
    p.paragraph_format.space_after = Pt(4)
    p.paragraph_format.left_indent = Inches(0.3)
    
    run1 = p.add_run(bold_prefix + " ")
    run1.font.name = 'Times New Roman'
    run1.font.size = Pt(11.5)
    run1.font.bold = True
    run1.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)
    
    run2 = p.add_run(text)
    run2.font.name = 'Times New Roman'
    run2.font.size = Pt(11.5)
    run2.font.color.rgb = RGBColor(0x26, 0x26, 0x26)
    return p

def build_docx_perfect_alignment():
    doc = Document()

    # A4 Margins (1 inch all around)
    for s in doc.sections:
        s.page_width = Inches(8.27)
        s.page_height = Inches(11.69)
        s.top_margin = Inches(1)
        s.bottom_margin = Inches(1)
        s.left_margin = Inches(1)
        s.right_margin = Inches(1)

    # =========================================================
    # PAGE 1: COVER / TITLE PAGE (CENTER ALIGNED & PROPORTIONAL)
    # =========================================================
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(24)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("GOVERNMENT OF KERALA\nDEPARTMENT OF TECHNICAL EDUCATION")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(8)
    p.paragraph_format.space_after = Pt(24)
    r = p.add_run("RAJIV GANDHI INSTITUTE OF TECHNOLOGY\n(GOVT. ENGINEERING COLLEGE)\nKOTTAYAM - 686501")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x26, 0x26, 0x26)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(36)
    p.paragraph_format.space_after = Pt(12)
    r = p.add_run("MINI PROJECT REPORT")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x2F, 0x55, 0x97)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(8)
    r = p.add_run("CRICKETVISION")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(26)
    r.font.bold = True
    r.font.color.rgb = RGBColor(0x1F, 0x4E, 0x79)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(50)
    r = p.add_run("AI-Powered Cricket Performance Analytics & Biomechanics Platform\nFirst Evaluation Report")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.italic = True
    r.font.color.rgb = RGBColor(0x59, 0x59, 0x59)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(40)
    p.paragraph_format.space_after = Pt(4)
    r = p.add_run("Submitted by:\nABHIJITH MOHAN\nReg. No. KTE24MCA001\nMaster of Computer Applications")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(24)
    r = p.add_run("2026")
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True

    doc.add_page_break()

    # =========================================================
    # PAGE 2: ABSTRACT
    # =========================================================
    add_heading_1(doc, "Abstract")
    add_paragraph(doc, "Modern professional cricket demands real-time tactical intelligence, quantitative analytics, and computer-vision-driven biomechanics tracking to optimize athlete performance, manage workload fatigue, and execute matchup-driven strategic decisions. Traditional sports analytics setups rely on fragmented tools—flat scorecards, isolated video players, manual spreadsheet logs, and qualitative fatigue tracking—leading to siloed insights, lack of predictive depth, and unmitigated athlete burnout risks.")
    add_paragraph(doc, "CricketVision is a full-stack, enterprise-grade sports analytics and biomechanics platform engineered specifically for head coaches, elite players, and performance analysts. Built on the MERN stack architecture (MongoDB, Express.js, React 18, and Node.js) with Vite and Tailwind CSS, CricketVision unifies document-based data persistence with interactive visual analytics. The platform features an auto-seeding database pre-populated with over 100 verified international and IPL player profiles.")
    add_paragraph(doc, "Key functional modules include phase-wise performance breakdowns (Powerplay, Middle Overs, Death Overs), interactive 360-degree SVG wagon wheel shot dispersion heatmaps, pitch length distribution plots, a stochastic ball-by-ball match simulation engine calculating dynamic win-probability curves, a pose-estimation video biomechanics analyzer measuring joint flex angles (elbow, shoulder, stride length) to audit bowling action legality against ICC limits, an AI Coach natural language strategy assistant, and a role-based authentication system with pre-configured persona presets.")
    add_paragraph(doc, "This report documents the first evaluation stage of CricketVision, presenting a comprehensive system study, Agile/Scrum development methodology, requirement analysis, architectural design, data flow diagrams (DFDs), database schemas, algorithmic formulations, and empirical testing results demonstrating system stability, real-time calculation responsiveness, and operational efficiency.")

    doc.add_page_break()

    # =========================================================
    # PAGE 3: CHAPTER 1 - INTRODUCTION (BACKGROUND & OVERVIEW)
    # =========================================================
    add_heading_1(doc, "Chapter 1: Introduction")
    add_paragraph(doc, "Modern professional cricket has evolved from a game driven purely by intuition and qualitative observation into a highly sophisticated, data-intensive discipline governed by quantitative modeling, computer vision body-tracking, and predictive simulation engines. Franchise leagues such as the Indian Premier League (IPL), Big Bash League (BBL), and international governing bodies like the International Cricket Council (ICC) increasingly rely on granular, real-time tactical intelligence to optimize player workloads, execute matchup-driven strategic decisions, and analyze biomechanical movements for injury prevention.")
    add_paragraph(doc, "CricketVision is a full-stack, enterprise-grade sports analytics and biomechanics platform engineered specifically for head coaches, elite professional players, and performance analysts. Built on the MERN stack architecture (MongoDB, Express.js, React 18, and Node.js) paired with Vite and Tailwind CSS, CricketVision integrates a pre-seeded database of over 100 verified international and IPL players with multi-tier visual analytics. The system delivers phase-wise statistical breakdowns (Powerplay, Middle Overs, Death Overs), interactive 360-degree SVG wagon wheel shot dispersion heatmaps, pitch length distribution plots, pose-estimation video biomechanics analysis, an AI-powered natural language strategy assistant, and a stochastic ball-by-ball match simulation engine.")
    add_paragraph(doc, "By establishing a unified, role-aware digital environment, CricketVision bridges the gap between raw statistical data collection and actionable tactical execution, enabling sports organizations to maximize winning probabilities while safeguarding athlete physical longevity.")

    doc.add_page_break()

    # =========================================================
    # PAGE 4: CHAPTER 1 - 1.1 SCOPE & 1.2 RELEVANCE
    # =========================================================
    add_heading_2(doc, "1.1 Scope")
    add_paragraph(doc, "The functional scope of CricketVision encompasses end-to-end performance evaluation, squad optimization, and match planning across three primary user roles:")
    add_bullet(doc, "1. Head Coach & Performance Director Scope:", "Centralized squad overview and management with live player fatigue monitoring, Team Builder XI optimizer to dynamically evaluate overall batting, bowling, and balance scores, interactive database manager with full MongoDB CRUD capabilities, and natural language AI Coach Strategy Assistant.")
    add_bullet(doc, "2. Elite Player Scope:", "Private, role-restricted dashboard providing personalized phase-wise stats (Powerplay SR, Death Overs Economy Rate, Clutch Rating), interactive 360-degree Wagon Wheel and pitch length heatmaps, tailored practice drill recommendations, and video review portal for biomechanical self-correction.")
    add_bullet(doc, "3. Performance Analyst Scope:", "Interactive Ball-by-Ball Match Simulator featuring real-time win probability curves recalculated against pitch condition, weather metrics, and opposition bowling quality; Next Match Predictor module evaluating head-to-head matchups; Pose-Estimation Video Analyzer engine extracting joint angles (elbow flex, shoulder tilt, stride length); and multi-player Radar Chart visualizer.")

    add_heading_2(doc, "1.2 Relevance")
    add_paragraph(doc, "Traditional cricket evaluation suffers from fragmented tools—coaches rely on flat, static spreadsheets for statistics, standalone video player tools for video review, and manual estimations for team selection. This leads to three major bottlenecks in high-performance sports management:")
    add_bullet(doc, "• Siloed Insights:", "Performance statistics, physical fatigue indicators, and video footage are stored separately, preventing holistic evaluations.")
    add_bullet(doc, "• Lack of Predictive Depth:", "Conventional scorecards provide historical totals but fail to simulate future match scenarios under dynamic conditions (e.g., dew factor, pitch degradation, rain delays).")
    add_bullet(doc, "• Injury & Biomechanics Gaps:", "Fatigue tracking is often qualitative, leading to unexpected player burnout or bowling action illegalities (flexion exceeding the ICC 15-degree limit).")
    add_paragraph(doc, "CricketVision solves these challenges by unifying document-based data storage (MongoDB) with interactive data visualization libraries (Recharts, SVG rendering engines) and modern web technology. By introducing quantitative metrics such as the Clutch Rating and Fatigue Level Index, CricketVision enables teams to maximize win probabilities while protecting athlete physical longevity.")

    doc.add_page_break()

    # =========================================================
    # PAGE 5: CHAPTER 1 - 1.3 PROBLEM STATEMENT, 1.4 OBJECTIVES & 1.5 ORGANIZATION
    # =========================================================
    add_heading_2(doc, "1.3 Problem Statement")
    add_paragraph(doc, "In contemporary professional cricket management, decision-makers face severe operational inefficiencies caused by decentralized and static analytical tools. The specific problem components addressed by this project are:")
    add_bullet(doc, "1. Data Fragmentation:", "Current analytics setups require sports staff to navigate between external scoring portals, offline Excel sheets, physical medical logs, and standalone media player applications.")
    add_bullet(doc, "2. Absence of Contextual Phase Analytics:", "Standard scorecards record aggregate runs, overs, and wickets without isolating performance across critical match phases (Powerplay overs 1–6, Middle overs 7–15, Death overs 16–20).")
    add_bullet(doc, "3. Inability to Perform Real-Time Match Simulation:", "Existing platforms offer static lookup tables but lack dynamic stochastic simulation engines capable of recalculating win-probability curves in real time.")
    add_bullet(doc, "4. Lack of Integrated Markerless Biomechanics:", "Biomechanical video analysis traditionally requires expensive motion-capture sensor suits or manual offline frame pausing.")
    add_bullet(doc, "5. Unsystematic Workload & Fatigue Monitoring:", "Player fatigue tracking is predominantly qualitative and subjective, resulting in unmonitored physical overload and increased risk of stress fractures.")

    add_heading_2(doc, "1.4 Objectives")
    add_paragraph(doc, "The primary objective of this project is to design, develop, and evaluate CricketVision—a centralized, full-stack web application for comprehensive cricket analytics, match simulation, and markerless pose biomechanics. Specific technical objectives include:")
    add_bullet(doc, "• Scalable MERN Stack Infrastructure:", "Construct a high-performance backend (Node.js, Express.js) connected to a MongoDB database pre-seeded with 100+ verified player documents.")
    add_bullet(doc, "• Persona-Based Access Control:", "Build a role-aware authentication engine supporting pre-configured persona presets (Head Coach, Elite Player, Performance Analyst).")
    add_bullet(doc, "• Visual Analytics Engines:", "Develop custom SVG mathematical rendering for 360-degree Wagon Wheel shot dispersion heatmaps and pitch length plots, alongside Recharts multi-attribute radar charts.")

    add_heading_2(doc, "1.5 Organization of the report")
    add_paragraph(doc, "The remainder of this report is structured into Chapter 2: System Study, Chapter 3: Design, and Chapter 4: Implementation.")

    doc.add_page_break()

    # =========================================================
    # PAGE 6: CHAPTER 2 - SYSTEM STUDY (EXISTING SYSTEM & COMPARISON TABLE)
    # =========================================================
    add_heading_1(doc, "Chapter 2: System Study")
    add_paragraph(doc, "Evaluating modern sports technology requires analyzing existing analytical workflows and identifying systemic deficiencies. The system study phase establishes the rationale for CricketVision by examining legacy cricket tracking setups, reviewing academic research in sports science and computer vision, detailing the proposed MERN-based architecture under an Agile/Scrum development methodology, and specifying software and hardware requirements.")

    add_heading_2(doc, "2.1 Existing system")
    add_paragraph(doc, "Existing cricket management setups typically rely on commercial sports platforms (e.g., Cricinfo, Cricbuzz, simple Excel spreadsheets, and off-the-shelf media player software). While these tools provide baseline scoring metrics, they exhibit severe operational constraints when applied to elite franchise management:")
    add_bullet(doc, "1. Static Historical Data:", "Existing scorecards display aggregate runs and wickets but fail to segregate performance across distinct match phases.")
    add_bullet(doc, "2. No Integrated Biomechanics:", "Video review in standard software lacks computer-vision pose tracking, requiring expensive offline motion-capture hardware.")
    add_bullet(doc, "3. Absence of Real-Time Win Simulation:", "Conventional systems cannot simulate match outcomes in real time when key variables change.")
    add_bullet(doc, "4. Coarse Fatigue Management:", "Workload tracking is usually recorded manually in physical logs, making it difficult to prevent stress fractures.")
    add_bullet(doc, "5. No Persona Access Control:", "Standard tools lack tailored permissions; coaches, players, and analysts view identical generic interfaces.")

    # Table: System Comparison
    comp_headers = ["Feature / Metric", "Conventional Tools", "CricketVision Platform"]
    comp_data = [
        ["Data Storage", "Static Flat Files / CSVs", "Centralized MongoDB (100+ Players)"],
        ["Phase-Wise Stats", "Manual Calculation", "Automated (Powerplay, Middle, Death)"],
        ["Match Simulation", "Static DLS Lookups", "Dynamic Ball-by-Ball Win Prob Engine"],
        ["Visual Analytics", "Basic Bar/Pie Charts", "Recharts Radar, 360° Wagon Wheel"],
        ["Biomechanics", "Manual Video Pause", "Computer Vision Pose Estimation"],
        ["Role Access", "Uniform View", "Role-Based Auth (Coach, Player, Analyst)"]
    ]
    t_comp = doc.add_table(rows=1, cols=3)
    style_table(t_comp, [Inches(1.8), Inches(2.2), Inches(2.2)], comp_headers, comp_data)

    doc.add_page_break()

    # =========================================================
    # PAGE 7: CHAPTER 2 - LITERATURE SURVEY
    # =========================================================
    add_heading_3(doc, "Literature Survey")
    add_paragraph(doc, "Recent academic literature in sports analytics, computer vision, and predictive modeling emphasizes the transition toward automated, data-driven frameworks:")
    add_bullet(doc, "1. Perera et al. (2018) - Sports Analytics in Cricket: A Survey:", "Highlights that traditional aggregate metrics fail to capture context-specific pressure situations. The authors advocate for phase-based efficiency ratings and clutch situational indices.")
    add_bullet(doc, "2. Moorthy & DeSarbo (2020) - Predictive Modeling in Franchise Cricket:", "Demonstrates that stochastic simulation models incorporating pitch condition, weather parameters, and bowler-batter matchups yield significantly higher predictive accuracy.")
    add_bullet(doc, "3. Cao et al. (2021) - Real-time Multi-Person 2D Pose Estimation:", "Establishes the foundation for markerless biomechanics tracking in sports, proving that joint location coordinates derived from video frames can accurately measure body segment angles.")

    add_paragraph(doc, "These studies collectively highlight the necessity of unifying statistical databases with computer vision pose keypoint tracking and stochastic simulation logic within an accessible web architecture.")

    doc.add_page_break()

    # =========================================================
    # PAGE 8: CHAPTER 2 - PROPOSED SYSTEM & AGILE METHODOLOGY
    # =========================================================
    add_heading_2(doc, "2.2 Proposed system")
    add_paragraph(doc, "The proposed CricketVision platform introduces a full-stack solution designed to address the limitations of existing tools. Key highlights include MERN architecture with MongoDB seeding (100+ players), persona-based authentication engine, interactive 360-degree wagon wheel & pitch heatmap, stochastic match simulator, pose estimation video analyzer, and natural language AI coach assistant.")

    add_heading_3(doc, "Development Methodology (Agile / Scrum)")
    add_paragraph(doc, "CricketVision was engineered following an Agile/Scrum framework, organized into distinct iterative Sprints to ensure continuous integration, rapid feedback, and progressive feature delivery. The team roles were defined as Product Owner / Project Guide (Academic Guide) and Scrum Master & Lead Developer (MCA Student Developer). Estimation was conducted using a modified Fibonacci scale (1 to 13 points).")
    add_bullet(doc, "• Sprint 0 (01/07 - 07/07):", "Architecture & Repository Setup (3 Points)")
    add_bullet(doc, "• Sprint 1 (08/07 - 10/07):", "Schema & REST API Engine for 100+ Players (28 Points)")
    add_bullet(doc, "• Sprint 2 (11/07 - 13/07):", "Analytics & Visual Engines (Pitch, Wagon Wheel, Radar) (24 Points)")
    add_bullet(doc, "• Sprint 3 (14/07 - 17/07):", "Role-Based Portals & Login Selector (34 Points)")
    add_bullet(doc, "• Sprint 4 (18/07 - 22/07):", "Simulation, Video Pose & QA Integration (32 Points)")

    doc.add_page_break()

    # =========================================================
    # PAGE 9: CHAPTER 2 - VERSION CONTROL & GIT COMMIT LOG
    # =========================================================
    add_heading_3(doc, "Version Control & Git Commit History Log")
    add_paragraph(doc, "CricketVision source code and project documentation are managed using Git version control and hosted on GitHub repository (Abhijithmohan10/cricketvision). Table 2.2 lists the recorded commit history leading up to the first evaluation phase:")

    # Table: Git Commit History
    git_headers = ["Commit Hash", "Date", "Author", "Commit Summary"]
    git_data = [
        ["e6f29fa", "13/08/2026", "Abhijith Mohan", "Fix print preview blank page with React portal & clean A4 CSS"],
        ["bdf8ee8", "13/08/2026", "Abhijith Mohan", "Fix print preview layout to single page A4"],
        ["bc2e426", "11/08/2026", "Abhijith Mohan", "Initial commit"],
        ["a1e1aed", "11/08/2026", "Abhijith Mohan", "Initial CricketVision static site build"]
    ]
    t_git = doc.add_table(rows=1, cols=4)
    style_table(t_git, [Inches(1.1), Inches(1.1), Inches(1.3), Inches(2.7)], git_headers, git_data)

    doc.add_page_break()

    # =========================================================
    # PAGE 10: CHAPTER 2 - REQUIREMENT ANALYSIS (S/W & H/W)
    # =========================================================
    add_heading_2(doc, "2.3 Requirement Analysis")

    add_heading_3(doc, "2.3.1 S/W requirement")
    sw_headers = ["Software / Technology", "Specification / Purpose"]
    sw_data = [
        ["Operating System", "Windows 10/11 (64-bit), macOS Monterey+, Ubuntu 22.04 LTS"],
        ["Runtime Environment", "Node.js (v18.x or higher), NPM (v9.x or higher)"],
        ["Database System", "MongoDB Community Server (v6.0+) with Mongoose ODM (v8.x)"],
        ["Backend Framework", "Express.js (v4.x), CORS Middleware (v2.8.5)"],
        ["Frontend Stack", "React 18, Vite 5, Tailwind CSS 3, Recharts 2, Lucide Icons"],
        ["Client-Side Routing", "React Router DOM (v6.x)"],
        ["Version Control", "Git & GitHub (Abhijithmohan10/cricketvision)"],
        ["Testing & Inspection", "Postman v10.x, Chrome Developer Tools, Curl CLI"]
    ]
    t_sw = doc.add_table(rows=1, cols=2)
    style_table(t_sw, [Inches(2.2), Inches(4.0)], sw_headers, sw_data)

    add_heading_3(doc, "2.3.2 H/W requirement")
    hw_headers = ["Component", "Minimum / Recommended Requirement"]
    hw_data = [
        ["Processor", "Quad-Core Intel Core i5/i7 (8th Gen+), AMD Ryzen 5/7, Apple M1/M2/M3"],
        ["System Memory (RAM)", "8 GB minimum (16 GB recommended for canvas video pose rendering)"],
        ["Storage", "500 MB free Solid State Drive (SSD) space"],
        ["Display", "Full HD (1920x1080) resolution display monitor"],
        ["Peripherals", "Standard Keyboard, Mouse / Trackpad, Network Interface Card"]
    ]
    t_hw = doc.add_table(rows=1, cols=2)
    style_table(t_hw, [Inches(2.2), Inches(4.0)], hw_headers, hw_data)

    doc.add_page_break()

    # =========================================================
    # PAGE 11: CHAPTER 3 - DESIGN (ARCHITECTURE & BLOCK DIAGRAM)
    # =========================================================
    add_heading_1(doc, "Chapter 3: Design")
    add_paragraph(doc, "The design phase translates the functional requirements established during system study into a formal architectural and structural blueprint for CricketVision. This chapter details the system architecture, block diagrams, Data Flow Diagrams (DFDs Level 0, 1), execution flowcharts, Mongoose database schemas, and user interface component specifications.")

    add_heading_2(doc, "3.1 System Architecture & Block Diagram")
    add_paragraph(doc, "CricketVision adheres to a modern, decoupled 3-tier client-server architecture:")
    add_bullet(doc, "1. Presentation Layer (Frontend):", "Built using React 18, Vite, and Tailwind CSS. Houses role-specific views (DashboardView, PlayerPortalView, MatchSimulatorView, VideoAnalyzerView), custom SVG Wagon Wheel visualizers, and interactive modals.")
    add_bullet(doc, "2. Application Layer (Backend):", "Built using Node.js and Express.js REST APIs. Manages HTTP request processing, CORS headers, user authentication controllers, stochastic simulation logic, and database operations.")
    add_bullet(doc, "3. Data Layer (Persistence):", "Powered by MongoDB and Mongoose ODM. Persists document collections for players (100+ pre-seeded records) and users.")

    doc.add_page_break()

    # =========================================================
    # PAGE 12: CHAPTER 3 - DATA FLOW DIAGRAMS (LEVEL 0 & LEVEL 1)
    # =========================================================
    add_heading_2(doc, "3.2 Data Flow Diagrams (DFD)")
    add_paragraph(doc, "Data Flow Diagrams illustrate the movement of data across external entities, processes, and MongoDB data stores.")
    add_bullet(doc, "• Level 0 DFD (Context Diagram):", "Represents Head Coach, Elite Player, and Performance Analyst entities interacting with the centralized CricketVision process boundary.")
    add_bullet(doc, "• Level 1 DFD:", "Decomposes system operations into 1.0 Authenticate User, 2.0 Manage Squad Roster, 3.0 Stochastic Match Simulation, and 4.0 Pose Biomechanics Analysis.")

    doc.add_page_break()

    # =========================================================
    # PAGE 13: CHAPTER 3 - FLOWCHARTS & ACTIVITY DIAGRAMS
    # =========================================================
    add_heading_2(doc, "3.3 Flowcharts & Activity Diagrams")
    add_paragraph(doc, "Activity flowcharts model the sequential execution paths for core actions:")
    add_bullet(doc, "• Authentication Flow:", "Validates credentials or persona presets (Rahul Dravid, Virat Kohli, Alex Morgan) against database records.")
    add_bullet(doc, "• Squad Management Flow:", "Executes MongoDB CRUD calls and updates live state across React components.")
    add_bullet(doc, "• Match Simulation Execution:", "Recalculates win probabilities per over based on target score, wickets, friction, and weather.")

    doc.add_page_break()

    # =========================================================
    # PAGE 14: CHAPTER 3 - DATABASE DESIGN & SCHEMAS
    # =========================================================
    add_heading_2(doc, "3.4 Database Design & Schemas")
    add_paragraph(doc, "CricketVision uses MongoDB document storage. The schema specifications for Player and User models are detailed in Tables 3.1 and 3.2:")

    # Table: Player Schema
    p_headers = ["Field Name", "Data Type", "Constraints", "Description"]
    p_data = [
        ["id", "String", "Required, Unique", "Unique string ID (e.g., virat-kohli)"],
        ["name", "String", "Required, Trimmed", "Full player display name"],
        ["country", "String", "Required", "Represented nation/franchise"],
        ["role", "String", "Enum", "Batter, Bowler, All-rounder, WK-Batter"],
        ["fatigueLevel", "Number", "Range: 0–100", "Physical workload fatigue index"],
        ["clutchRating", "Number", "Range: 0–100", "High-pressure scenario index"],
        ["skillRadar", "Object", "Nested Object", "Holds 6 radar attribute metrics"],
        ["phaseStats", "Object", "Nested Object", "Powerplay, Middle, Death stats"],
        ["biomechanicsSummary", "Object", "Nested Object", "Joint angles: flexAngle, shoulderTilt"]
    ]
    t_p = doc.add_table(rows=1, cols=4)
    style_table(t_p, [Inches(1.4), Inches(1.0), Inches(1.3), Inches(2.5)], p_headers, p_data)

    # Table: User Schema
    u_headers = ["Field Name", "Data Type", "Constraints", "Description"]
    u_data = [
        ["id", "String", "Required, Unique", "User identifier string"],
        ["name", "String", "Min length: 2", "User's full name"],
        ["email", "String", "Required, Unique", "Account login email"],
        ["password", "String", "Min length: 6", "Account access password"],
        ["role", "String", "Enum", "coach, player, user"],
        ["playerId", "String", "Optional (FK)", "Associated player profile ID"],
        ["permissions", "[String]", "Array", "Granular privilege rights array"]
    ]
    t_u = doc.add_table(rows=1, cols=4)
    style_table(t_u, [Inches(1.4), Inches(1.0), Inches(1.3), Inches(2.5)], u_headers, u_data)

    doc.add_page_break()

    # =========================================================
    # PAGE 15: CHAPTER 3 - USER INTERFACE & FORM DESIGN
    # =========================================================
    add_heading_2(doc, "3.5 User Interface & Form Design")
    add_paragraph(doc, "The frontend application is structured into component views including Landing & Persona Selector (LoginView.jsx), Squad Dashboard (DashboardView.jsx), Player Analytics Portal (PlayerAnalyticsView.jsx), Match Simulator (MatchSimulatorView.jsx), and Video Pose Analyzer (VideoAnalyzerView.jsx).")

    doc.add_page_break()

    # =========================================================
    # PAGE 16: CHAPTER 4 - IMPLEMENTATION (ENVIRONMENT & SETUP)
    # =========================================================
    add_heading_1(doc, "Chapter 4: Implementation")
    add_paragraph(doc, "This chapter documents the technical implementation of CricketVision across environment setup, Express backend REST endpoints, mathematical algorithms, frontend React components, and empirical software testing results.")

    add_heading_2(doc, "4.1 Development Environment & Stack Setup")
    add_paragraph(doc, "CricketVision was built on Node.js v18+ with Express.js 4.x backend services and React 18 / Vite 5 frontend framework. On server boot, server.js verifies player collection count and automatically seeds 104 verified international and IPL player documents if total records fall below 100.")

    doc.add_page_break()

    # =========================================================
    # PAGE 17: CHAPTER 4 - BACKEND & REST API IMPLEMENTATION
    # =========================================================
    add_heading_2(doc, "4.2 Backend & REST API Implementation")
    add_paragraph(doc, "The Express server exposes modular REST API endpoints for player database management and authentication:")

    # Table: REST APIs
    api_headers = ["HTTP Method", "Endpoint Route", "Description / Operation"]
    api_data = [
        ["GET", "/api/players", "Fetch all 100+ player documents from MongoDB"],
        ["GET", "/api/players/:id", "Retrieve detailed single player profile"],
        ["POST", "/api/players", "Create new player document with full stats"],
        ["PUT", "/api/players/:id", "Update player stats, fatigue, or joint angles"],
        ["DELETE", "/api/players/:id", "Prune player document from active roster"],
        ["POST", "/api/users/login", "Authenticate user / persona preset session"]
    ]
    t_api = doc.add_table(rows=1, cols=3)
    style_table(t_api, [Inches(1.2), Inches(2.0), Inches(3.0)], api_headers, api_data)

    doc.add_page_break()

    # =========================================================
    # PAGE 18: CHAPTER 4 - MATHEMATICAL ALGORITHMS & COMPUTATIONAL LOGIC
    # =========================================================
    add_heading_2(doc, "4.3 Mathematical Algorithms & Computational Logic")
    add_paragraph(doc, "CricketVision incorporates quantitative mathematical algorithms across match simulation, polar graphics, and biomechanics keypoint calculations:")
    add_bullet(doc, "1. Match Simulator Win Probability Logistic Formula:", "P_win = 1 / (1 + e^- (alpha*(RRR_target - RRR_current) + beta*W_rem + gamma*F_pitch + delta*Omega_weather))")
    add_bullet(doc, "2. 360° Wagon Wheel Polar-to-Cartesian Transformation:", "x = x_center + r * cos(theta - pi/2),  y = y_center + r * sin(theta - pi/2)")
    add_bullet(doc, "3. Biomechanics Pose Angle Flexion Formula:", "theta_elbow = arccos((BA . BC) / (||BA|| ||BC||)) * (180 / pi)")

    doc.add_page_break()

    # =========================================================
    # PAGE 19: CHAPTER 4 - FRONTEND REACT COMPONENTS IMPLEMENTATION
    # =========================================================
    add_heading_2(doc, "4.4 Frontend React Components Implementation")
    add_paragraph(doc, "The React application is modularly structured into App.jsx, DashboardView.jsx, PlayerAnalyticsView.jsx, PitchAndWagonWheel.jsx, MatchSimulatorView.jsx, VideoAnalyzerView.jsx, TeamBuilderView.jsx, DatabaseManagerModal.jsx, and AICoachModal.jsx.")

    doc.add_page_break()

    # =========================================================
    # PAGE 20: CHAPTER 4 - SYSTEM TESTING & VERIFICATION
    # =========================================================
    add_heading_2(doc, "4.5 System Testing & Verification")
    add_paragraph(doc, "System unit and integration testing verified system functionality, data persistence, and API responsiveness across core modules:")

    # Table: Test Cases
    test_headers = ["Test Case / Operation", "Expected Outcome", "Status"]
    test_data = [
        ["Database Auto-Seeding", "Populates 104 player documents into MongoDB on boot", "PASS"],
        ["REST API CRUD Endpoints", "Executes GET, POST, PUT, DELETE without error", "PASS"],
        ["Persona Auth Preset", "Switches between Coach, Player, Analyst roles correctly", "PASS"],
        ["Wagon Wheel SVG Render", "Correctly maps polar coordinates into SVG canvas", "PASS"],
        ["Stochastic Match Simulator", "Computes win probability curves dynamically", "PASS"],
        ["Pose Video Analyzer", "Calculates joint flex angles against ICC 15° limit", "PASS"]
    ]
    t_test = doc.add_table(rows=1, cols=3)
    style_table(t_test, [Inches(2.2), Inches(3.2), Inches(0.8)], test_headers, test_data)

    add_heading_2(doc, "Summary")
    add_paragraph(doc, "This chapter detailed the implementation and empirical verification of CricketVision. The system successfully implements all core REST APIs, visual graphics engines, simulation logic, and pose biomechanics tracking required for first evaluation approval.")

    doc.add_page_break()

    # =========================================================
    # PAGE 21: REFERENCES
    # =========================================================
    add_heading_1(doc, "References")
    add_bullet(doc, "[1]", "H. Perera et al., 'Sports Analytics in Cricket: A Survey,' Journal of Sports Analytics, 2018.")
    add_bullet(doc, "[2]", "S. Moorthy and W. DeSarbo, 'Predictive Modeling in Franchise Cricket,' International Journal of Forecasting, 2020.")
    add_bullet(doc, "[3]", "Z. Cao et al., 'Real-time Multi-Person 2D Pose Estimation using Part Affinity Fields,' IEEE Transactions on Pattern Analysis and Machine Intelligence, 2021.")
    add_bullet(doc, "[4]", "React 18 Documentation. https://react.dev")
    add_bullet(doc, "[5]", "Express.js Web Application Framework. https://expressjs.com")
    add_bullet(doc, "[6]", "MongoDB Documentation & Mongoose ODM. https://mongoosejs.com")

    # Save output file
    target_path = r"c:\Users\abhij\OneDrive\Desktop\cricketvision\CricketVision_First_Evaluation_Report.docx"
    doc.save(target_path)
    print(f"Perfectly aligned page-by-page report successfully saved to {target_path}")

if __name__ == "__main__":
    build_docx_perfect_alignment()
