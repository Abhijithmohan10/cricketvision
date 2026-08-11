import sys
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_charts():
    os.makedirs("temp_charts", exist_ok=True)
    
    # 1. Burndown Chart
    fig, ax = plt.subplots(figsize=(6, 3.8), facecolor='#1E293B')
    ax.set_facecolor('#0F172A')
    
    days = ['S0: D1', 'S0: D5', 'S1: D8', 'S2: D11', 'S3: D15', 'S4: D18', 'S5: D21']
    planned = [137, 134, 106, 82, 49, 20, 0]
    actual = [137, 134, 106, 82, 49, 20, 16]
    
    ax.plot(days, planned, label='Planned Trajectory', color='#94A3B8', linestyle='--', marker='o', linewidth=2)
    ax.plot(days, actual, label='Actual Velocity (121 Pts Done)', color='#10B981', marker='s', linewidth=3)
    
    ax.set_title('Sprint Burndown Chart (137 Total Story Points)', color='#F8FAFC', fontsize=12, fontweight='bold', pad=10)
    ax.set_ylabel('Remaining Points', color='#CBD5E1', fontsize=10)
    ax.tick_params(colors='#94A3B8', labelsize=8)
    ax.grid(True, linestyle=':', color='#334155', alpha=0.6)
    ax.legend(facecolor='#1E293B', edgecolor='#334155', labelcolor='#F8FAFC', fontsize=8)
    
    for spine in ax.spines.values():
        spine.set_color('#334155')
        
    plt.tight_layout()
    plt.savefig("temp_charts/burndown.png", dpi=200, bbox_inches='tight')
    plt.close()

    # 2. Skill Radar Chart
    categories = ['Power', 'Consistency', 'Spin Bowling', 'Pace Bowling', 'Fielding', 'Clutch']
    N = len(categories)
    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    angles += angles[:1]
    
    kohli_stats = [92, 95, 88, 45, 90, 98]
    kohli_stats += kohli_stats[:1]
    
    bumrah_stats = [65, 96, 40, 99, 85, 95]
    bumrah_stats += bumrah_stats[:1]
    
    fig, ax = plt.subplots(figsize=(4.5, 4.5), subplot_kw=dict(polar=True), facecolor='#1E293B')
    ax.set_facecolor('#0F172A')
    
    plt.xticks(angles[:-1], categories, color='#F8FAFC', size=9, fontweight='bold')
    ax.set_rlabel_position(0)
    plt.yticks([20, 40, 60, 80, 100], ["20","40","60","80","100"], color='#94A3B8', size=7)
    plt.ylim(0,100)
    
    ax.plot(angles, kohli_stats, linewidth=2, linestyle='solid', label='Virat Kohli (Batter)', color='#F59E0B')
    ax.fill(angles, kohli_stats, '#F59E0B', alpha=0.25)
    
    ax.plot(angles, bumrah_stats, linewidth=2, linestyle='solid', label='Jasprit Bumrah (Bowler)', color='#38BDF8')
    ax.fill(angles, bumrah_stats, '#38BDF8', alpha=0.25)
    
    ax.set_title('Multi-Player Skill Radar Comparison', color='#F8FAFC', fontsize=11, fontweight='bold', pad=15)
    ax.grid(color='#334155', linestyle='--')
    ax.spines['polar'].set_color('#334155')
    plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1), facecolor='#1E293B', edgecolor='#334155', labelcolor='#F8FAFC', fontsize=8)
    
    plt.tight_layout()
    plt.savefig("temp_charts/radar.png", dpi=200, bbox_inches='tight')
    plt.close()

    # 3. Architecture Chart
    fig, ax = plt.subplots(figsize=(6, 3.8), facecolor='#1E293B')
    ax.set_facecolor('#0F172A')
    ax.axis('off')
    
    # Draw boxes
    boxes = [
        ("React 18 SPA\n(Vite + Tailwind)", 0.15, 0.7, '#38BDF8'),
        ("Recharts & SVG\nVisualizers", 0.15, 0.3, '#818CF8'),
        ("Express.js REST API\nGateway & Auth", 0.5, 0.5, '#10B981'),
        ("MongoDB Database\n(Mongoose ODM)", 0.85, 0.7, '#F59E0B'),
        ("100+ Player Seeding\n& JSON Presets", 0.85, 0.3, '#EC4899')
    ]
    
    for text, x, y, col in boxes:
        ax.text(x, y, text, ha='center', va='center', color='#FFFFFF', fontweight='bold', fontsize=9,
                bbox=dict(boxstyle='round,pad=0.6', facecolor='#1E293B', edgecolor=col, linewidth=2))
        
    # Draw arrows
    arrows = [
        (0.28, 0.7, 0.38, 0.55),
        (0.28, 0.3, 0.38, 0.45),
        (0.62, 0.55, 0.72, 0.7),
        (0.62, 0.45, 0.72, 0.3)
    ]
    for x1, y1, x2, y2 in arrows:
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->", color='#94A3B8', lw=2))
        
    ax.set_title('3-Tier Full-Stack System Architecture', color='#F8FAFC', fontsize=12, fontweight='bold', pad=10)
    plt.tight_layout()
    plt.savefig("temp_charts/architecture.png", dpi=200, bbox_inches='tight')
    plt.close()

create_charts()
print("Charts generated successfully!")
