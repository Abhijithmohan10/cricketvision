// Pre-loaded sample video clips for AI Video Upload & Pose Estimation Testing

export const SAMPLE_VIDEOS = [
  {
    id: "kohli-cover-drive-cummins",
    title: "VIRAT KOHLI Cover Drive off Pat Cummins",
    category: "Featured Audio/Video Highlight",
    player: "Virat Kohli vs Pat Cummins (Star Sports)",
    description: "Stunning front-foot boundary through extra cover off Pat Cummins 144 km/h delivery. High elbow elevation, perfection in stride transfer.",
    videoUrl: "/media/virat_kohli_cover_drive_cummins.mp3",
    thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    metrics: {
      batSpeed: "142.8 km/h",
      impactPoint: "Directly under chin & nose (+0.5cm optimal alignment)",
      elbowElevation: "86.5° (Elite Master Class Range 85°-90°)",
      footStrideLength: "82 cm",
      balanceScore: "99 / 100",
      detectedFlaw: "Perfection achieved - Zero head tilt during impact moment.",
      recommendedDrill: "Pace acceleration drill off 140+ km/h throwdowns"
    },
    poseKeypoints: [
      { time: 0.5, head: { x: 50, y: 25 }, shoulderRight: { x: 45, y: 38 }, elbowRight: { x: 38, y: 46 }, wristRight: { x: 40, y: 60 }, kneeLeft: { x: 55, y: 72 }, ankleLeft: { x: 58, y: 88 } },
      { time: 1.2, head: { x: 52, y: 28 }, shoulderRight: { x: 48, y: 40 }, elbowRight: { x: 42, y: 42 }, wristRight: { x: 49, y: 55 }, kneeLeft: { x: 60, y: 74 }, ankleLeft: { x: 62, y: 90 } },
      { time: 2.0, head: { x: 54, y: 30 }, shoulderRight: { x: 52, y: 42 }, elbowRight: { x: 58, y: 36 }, wristRight: { x: 62, y: 48 }, kneeLeft: { x: 65, y: 75 }, ankleLeft: { x: 67, y: 90 } }
    ]
  },
  {
    id: "cover-drive-kohli",
    title: "Classic High-Elbow Cover Drive",
    category: "Batting Technique",
    player: "Virat Kohli Style",
    description: "Front foot push through cover with high elbow elevation and head positioned over ball impact point.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=400&q=80",
    metrics: {
      batSpeed: "138.4 km/h",
      impactPoint: "Direct under eyes (+1.2cm alignment)",
      elbowElevation: "84° (Optimal range 80°-90°)",
      footStrideLength: "78 cm",
      balanceScore: "96 / 100",
      detectedFlaw: "Minimal error - textbook weight transfer to front knee.",
      recommendedDrill: "Stationary ball drop drive drill (3 sets of 20 reps)"
    },
    poseKeypoints: [
      { time: 0.5, head: { x: 50, y: 25 }, shoulderRight: { x: 45, y: 38 }, elbowRight: { x: 38, y: 46 }, wristRight: { x: 40, y: 60 }, kneeLeft: { x: 55, y: 72 }, ankleLeft: { x: 58, y: 88 } },
      { time: 1.2, head: { x: 52, y: 28 }, shoulderRight: { x: 48, y: 40 }, elbowRight: { x: 42, y: 42 }, wristRight: { x: 49, y: 55 }, kneeLeft: { x: 60, y: 74 }, ankleLeft: { x: 62, y: 90 } },
      { time: 2.0, head: { x: 54, y: 30 }, shoulderRight: { x: 52, y: 42 }, elbowRight: { x: 58, y: 36 }, wristRight: { x: 62, y: 48 }, kneeLeft: { x: 65, y: 75 }, ankleLeft: { x: 67, y: 90 } }
    ]
  },
  {
    id: "inswinger-bumrah",
    title: "Express In-Swinging Yorker",
    category: "Bowling Action",
    player: "Jasprit Bumrah Style",
    description: "Hyper-extended arm release at 145+ km/h creating late tailing movement into right-hander pads.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=400&q=80",
    metrics: {
      releaseSpeed: "146.2 km/h",
      releaseAngle: "14.8° high release",
      seamPosition: "Strict 45° angled inward seam",
      pitchLocation: "Yorker length (0.4m from stumps)",
      balanceScore: "94 / 100",
      detectedFlaw: "Increased hyperextension load on right shoulder joint.",
      recommendedDrill: "Band-resisted deceleration shoulder mobility routine"
    },
    poseKeypoints: [
      { time: 0.6, head: { x: 48, y: 20 }, shoulderRight: { x: 55, y: 30 }, elbowRight: { x: 60, y: 22 }, wristRight: { x: 64, y: 15 }, kneeLeft: { x: 45, y: 70 }, ankleLeft: { x: 43, y: 88 } },
      { time: 1.4, head: { x: 50, y: 24 }, shoulderRight: { x: 52, y: 34 }, elbowRight: { x: 50, y: 42 }, wristRight: { x: 48, y: 56 }, kneeLeft: { x: 52, y: 74 }, ankleLeft: { x: 54, y: 90 } }
    ]
  },
  {
    id: "pull-shot-rohit",
    title: "Express Short-Ball Pull Shot",
    category: "Batting Technique",
    player: "Rohit Sharma Style",
    description: "Early weight swivel on back foot with high wrist roll over the ball to control elevation.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnail: "https://images.unsplash.com/photo-1508802913482-f3da9e4b5171?auto=format&fit=crop&w=400&q=80",
    metrics: {
      batSpeed: "144.1 km/h",
      impactPoint: "Eye level pull contact zone",
      wristRollAngle: "32° downward arc",
      balanceScore: "98 / 100",
      detectedFlaw: "None - elite hip rotational speed.",
      recommendedDrill: "Weighted medicine ball swivel throw drill"
    },
    poseKeypoints: [
      { time: 0.8, head: { x: 44, y: 26 }, shoulderRight: { x: 40, y: 36 }, elbowRight: { x: 34, y: 42 }, wristRight: { x: 38, y: 52 }, kneeLeft: { x: 48, y: 70 }, ankleLeft: { x: 50, y: 86 } }
    ]
  }
];
