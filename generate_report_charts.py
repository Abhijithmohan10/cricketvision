import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

os.makedirs("temp_charts", exist_ok=True)

# 1. DFD Level 1 Diagram
fig, ax = plt.subplots(figsize=(6.5, 3.8), facecolor='#FFFFFF')
ax.set_facecolor('#F8FAFC')
ax.axis('off')

boxes = [
    ("User / Coach\n(Client Interface)", 0.12, 0.75, '#1F4E79'),
    ("Video Source\n(Match / Practice Footage)", 0.12, 0.25, '#2F5597'),
    ("1.0 Authentication\n& Persona Controller", 0.45, 0.85, '#059669'),
    ("2.0 Player & Roster\nAnalytics Engine", 0.45, 0.55, '#0284C7'),
    ("3.0 Stochastic Match\nSimulation Service", 0.45, 0.25, '#D97706'),
    ("4.0 Computer Vision\nPose Extraction", 0.45, -0.05, '#DB2777'),
    ("MongoDB Cluster\n(Collections: players, users)", 0.82, 0.55, '#1F4E79'),
    ("ICC Rule Engine\n(15° Limit Verifier)", 0.82, -0.05, '#DC2626')
]

for text, x, y, col in boxes:
    ax.text(x, y, text, ha='center', va='center', color='#0F172A', fontweight='bold', fontsize=8,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#FFFFFF', edgecolor=col, linewidth=1.8))

arrows = [
    ((0.23, 0.78), (0.33, 0.85), "Credentials"),
    ((0.23, 0.72), (0.33, 0.58), "Roster Queries"),
    ((0.23, 0.70), (0.33, 0.30), "Sim Config"),
    ((0.23, 0.25), (0.33, 0.0), "MP4 Video"),
    ((0.57, 0.55), (0.70, 0.55), "Mongoose ODM"),
    ((0.57, 0.85), (0.72, 0.65), "Verify User"),
    ((0.57, -0.05), (0.71, -0.05), "Joint Coordinates"),
    ((0.71, 0.0), (0.57, 0.0), "Legality Flag")
]

for (x1, y1), (x2, y2), label in arrows:
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle="->", color='#475569', lw=1.5))
    mid_x = (x1 + x2) / 2
    mid_y = (y1 + y2) / 2 + 0.03
    ax.text(mid_x, mid_y, label, ha='center', va='center', color='#64748B', fontsize=6.5, fontstyle='italic')

ax.set_title('Figure 4.1: CricketVision Data Flow Diagram (DFD Level 1)', color='#1F4E79', fontsize=11, fontweight='bold', pad=10)
plt.tight_layout()
plt.savefig("temp_charts/dfd_level1.png", dpi=220, bbox_inches='tight')
plt.close()

# 2. Pose Biomechanics Flowchart
fig, ax = plt.subplots(figsize=(6.5, 3.4), facecolor='#FFFFFF')
ax.set_facecolor('#F8FAFC')
ax.axis('off')

steps = [
    ("Video Upload\n(60 FPS MP4)", 0.1, 0.5),
    ("Frame Extraction\n& Normalization", 0.28, 0.5),
    ("Part Affinity\nKeypoint Detection", 0.46, 0.5),
    ("Joint Angle\nVector Math", 0.64, 0.5),
    ("ICC 15° Compliance\n& Action Audit", 0.84, 0.5)
]

for idx, (label, x, y) in enumerate(steps):
    ax.text(x, y, label, ha='center', va='center', color='#0F172A', fontweight='bold', fontsize=8,
            bbox=dict(boxstyle='square,pad=0.5', facecolor='#FFFFFF', edgecolor='#1F4E79', linewidth=1.5))
    if idx < len(steps) - 1:
        next_x = steps[idx+1][1]
        ax.annotate('', xy=(next_x - 0.07, y), xytext=(x + 0.07, y),
                    arrowprops=dict(arrowstyle="->", color='#059669', lw=2))

ax.set_title('Figure 4.2: Biomechanics Computer Vision Processing Pipeline', color='#1F4E79', fontsize=11, fontweight='bold', pad=10)
plt.tight_layout()
plt.savefig("temp_charts/pose_pipeline.png", dpi=220, bbox_inches='tight')
plt.close()

# 3. Dynamic Win Probability Simulation Graph
fig, ax = plt.subplots(figsize=(6.5, 3.6), facecolor='#FFFFFF')
ax.set_facecolor('#F8FAFC')

overs = np.linspace(1, 20, 20)
prob_team_a = [50, 48, 55, 62, 58, 65, 60, 52, 45, 40, 48, 55, 63, 58, 70, 78, 72, 85, 92, 100]
prob_team_b = [100 - p for p in prob_team_a]

ax.plot(overs, prob_team_a, label='Chasing Team (RCB)', color='#059669', marker='o', linewidth=2.5)
ax.plot(overs, prob_team_b, label='Defending Team (CSK)', color='#DC2626', marker='s', linestyle='--', linewidth=2)

ax.axvline(x=6, color='#64748B', linestyle=':', label='End of Powerplay (Overs 1-6)')
ax.axvline(x=15, color='#D97706', linestyle=':', label='Death Overs (Overs 16-20)')
ax.fill_between(overs, prob_team_a, color='#059669', alpha=0.15)

ax.set_title('Figure 6.1: Ball-by-Ball Dynamic Win-Probability Convergence (Target: 185)', color='#1F4E79', fontsize=11, fontweight='bold', pad=10)
ax.set_xlabel('Overs Completed', color='#334155', fontsize=9)
ax.set_ylabel('Win Probability (%)', color='#334155', fontsize=9)
ax.set_ylim(0, 105)
ax.grid(True, linestyle='--', color='#E2E8F0', alpha=0.8)
ax.legend(facecolor='#FFFFFF', edgecolor='#CBD5E1', fontsize=8, loc='upper left')

plt.tight_layout()
plt.savefig("temp_charts/win_prob_simulation.png", dpi=220, bbox_inches='tight')
plt.close()

# 4. Fatigue vs Performance Degradation Curve
fig, ax = plt.subplots(figsize=(6.5, 3.4), facecolor='#FFFFFF')
ax.set_facecolor('#F8FAFC')

matches_played = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
bowling_speed = np.array([145.2, 144.8, 144.5, 143.9, 143.1, 141.5, 139.8, 138.2, 136.5, 134.8])
fatigue_score = np.array([12, 18, 25, 32, 45, 58, 72, 81, 89, 94])

ax.plot(matches_played, bowling_speed, color='#0284C7', marker='o', linewidth=2.5, label='Bowling Release Speed (km/h)')
ax.set_xlabel('Consecutive Matches Without Rest', color='#334155', fontsize=9)
ax.set_ylabel('Release Speed (km/h)', color='#0284C7', fontsize=9)
ax.tick_params(axis='y', labelcolor='#0284C7')

ax2 = ax.twinx()
ax2.plot(matches_played, fatigue_score, color='#DC2626', marker='^', linestyle='--', linewidth=2, label='Algorithmic Fatigue Index (%)')
ax2.set_ylabel('Fatigue Index (%)', color='#DC2626', fontsize=9)
ax2.tick_params(axis='y', labelcolor='#DC2626')

ax.set_title('Figure 6.2: Algorithmic Workload Fatigue vs Pace Degradation', color='#1F4E79', fontsize=11, fontweight='bold', pad=10)
ax.grid(True, linestyle=':', color='#E2E8F0')

plt.tight_layout()
plt.savefig("temp_charts/fatigue_performance.png", dpi=220, bbox_inches='tight')
plt.close()

print("All advanced report diagrams generated successfully!")
