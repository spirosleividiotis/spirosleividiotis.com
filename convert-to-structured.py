#!/usr/bin/env python3
"""
Convert existing projects from bodyHtml to structured data format
"""
import json
import re

def parse_flink_project():
    """Convert Flink HTML to structured data"""
    return {
        "tags": ["Brand Design", "Motion Graphics", "Startup"],
        "intro": "Flink, a fast-growing grocery delivery startup, needed motion design for their core brand touchpoints—logo animation, app endscreen, and splashscreen. The brief: create animations that communicated speed, reliability, and energy while maintaining technical feasibility for fast-paced product development.",
        "meta": "2021 - 2022 Senior Motion Designer",
        "sections": [
            {
                "type": "text",
                "label": "Context",
                "title": "The Challenge",
                "paragraphs": [
                    "Flink's brand promise was <strong>fast delivery</strong>—groceries in minutes. The motion design had to reflect that: snappy, energetic, immediate. But it also had to work at scale: lightweight files, performant animations, and designs that wouldn't slow down app load times.",
                    "I focused on three key deliverables: a <strong>logo animation</strong> for brand moments, an <strong>app endscreen</strong> for post-order confirmation, and a <strong>splashscreen</strong> for app launch—each serving a specific user need and brand moment."
                ]
            },
            {
                "type": "showcase",
                "label": "Deliverables",
                "title": "Core Brand Animations",
                "items": [
                    {
                        "title": "Logo Animation",
                        "description": "A quick, energetic reveal for brand moments—ads, presentations, app launches. The animation reinforces Flink's speed and energy without overstaying its welcome.",
                        "media": ["flink-finallogo.mp4"],
                        "layout": "full"
                    },
                    {
                        "title": "Overview",
                        "description": "",
                        "media": ["flink-overview.mp4"],
                        "layout": "full"
                    },
                    {
                        "title": "Endscreen for Ads & Video",
                        "description": "A versatile end card for commercials, YouTube videos, social content, and other video formats. Reinforces the brand at the close of any spot.",
                        "media": ["flink-endscreen.mp4"],
                        "layout": "full"
                    },
                    {
                        "title": "App Splashscreen",
                        "description": "An optimized launch animation that loads instantly and feels fast—even during network delays. Reinforces brand identity without creating perceived slowness.",
                        "media": ["flink-splashscreen.mp4"],
                        "layout": "full"
                    },
                    {
                        "title": "Alternative",
                        "description": "",
                        "media": ["flink-logo-alt1.mp4", "flink-logo-alt2.mp4"],
                        "layout": "grid-2"
                    },
                    {
                        "title": "Explorations",
                        "description": "",
                        "media": [
                            "explorations/exp-corporate-white.mp4",
                            "explorations/exp-corporate.mp4",
                            "explorations/exp-logo-appscreen.mp4",
                            "explorations/exp-transition-2.mp4",
                            "explorations/exp-typography-smooth.mp4",
                            "explorations/exp-test.mp4"
                        ],
                        "layout": "grid-6"
                    }
                ]
            },
            {
                "type": "text",
                "label": "Design Approach",
                "title": "Fast, Light, Energetic",
                "paragraphs": [
                    "Every animation was designed with <strong>speed as a constraint</strong>. I kept timings tight—most animations under 1 second. File sizes were optimized (Lottie exports under 30KB). Colors and shapes were simplified for performance.",
                    "The motion language was consistent: <strong>sharp, confident movements with quick easings</strong>. Nothing felt sluggish or over-animated. The brand moved like it delivered—<strong>fast, precise, and reliable</strong>.",
                    "These weren't just brand decorations—they were functional touchpoints that reinforced Flink's value proposition at key moments in the user journey."
                ]
            },
            {
                "type": "text",
                "label": "Impact",
                "title": "Motion as Brand Identity",
                "paragraphs": [
                    "These animations became part of Flink's brand toolkit—used across the app, marketing materials, and internal presentations. They gave the brand a <strong>consistent motion personality</strong>: energetic, fast, and confident.",
                    "More importantly, they demonstrated how motion design can work within tight constraints—startup timelines, performance budgets, and rapid iteration cycles—while still delivering polished, on-brand results."
                ]
            }
        ]
    }

def parse_lotties_project():
    """Convert Lotties HTML to structured data"""
    return {
        "tags": ["Animation Production", "Lottie", "Technical Pipeline"],
        "intro": "I <strong>led the management of a 1,000+ Lottie animation library</strong> at Qonto—producing animations, leading the JSON → .lottie migration, and managing the technical pipeline across teams.",
        "meta": "2022 - 2026 Staff Motion Designer, Design System",
        "sections": [
            {
                "type": "text",
                "label": "TLDR",
                "title": "1,000+ Lottie library. JSON → .lottie migration. Technical owner.",
                "paragraphs": [
                    "Managed 1,000+ Lottie library across product, website, marketing. Produced animations, led 6-month JSON → .lottie migration, and became technical owner for format guidelines and cross-platform compatibility."
                ],
                "style": "tldr-box"
            },
            {
                "type": "stats",
                "items": [
                    {"number": "1,000+", "label": "Lottie Files"},
                    {"number": "3", "label": "Platforms"},
                    {"number": "JSON → .lottie", "label": "Format Migration"}
                ]
            },
            {
                "type": "text",
                "label": "Production",
                "title": "Managing at Scale",
                "paragraphs": [
                    "I <strong>managed a 1,000+ Lottie animation library</strong> across Qonto's product, website, and marketing. Produced animations alongside other motion designers, optimized for performance, and ensured consistency across platforms.",
                    "Built the pipeline: LottieFiles library structure, export standards, and led <strong>JSON → .lottie migration</strong> with engineers over 6 months—reducing file sizes, improving Android performance. Became technical owner for format guidelines and cross-platform troubleshooting."
                ]
            },
            {
                "type": "text",
                "label": "Documentation",
                "title": "Lottie Center",
                "paragraphs": [
                    "<strong>Lottie Center</strong> is the internal hub I created so designers and stakeholders have one place for standards and how‑to's: step-by-step guides (create, export, naming, delivery), technical specs, and handoff paths for in-app vs website.",
                    "<p><strong>Standards I documented:</strong></p><ul style=\"margin:0.5em 0 1em 1.2em;padding:0;list-style:disc;\"><li><strong>Size:</strong> up to 500kb</li><li><strong>Frame rate:</strong> 25fps or 30fps</li><li><strong>Format:</strong> .json for web, .lottie for Android, iOS and Web</li></ul>",
                    "Documented flows: create & export, naming (in-app vs website), delivery to product and web, LottieFiles workflow, and sharing with internal and external partners."
                ]
            },
            {
                "type": "showcase",
                "label": "Library",
                "title": "Selected Work",
                "items": [
                    {
                        "title": "",
                        "description": "",
                        "media": [
                            "lottie-1.webm",
                            "lottie-2.webm",
                            "lottie-3.webm",
                            "lottie-4.webm",
                            "lottie-5.webm",
                            "lottie-6.webm",
                            "lottie-7.webm",
                            "lottie-8.webm",
                            "lottie-9.webm"
                        ],
                        "layout": "lottie-grid"
                    }
                ]
            },
            {
                "type": "text",
                "label": "Impact",
                "title": "Beyond Individual Files",
                "paragraphs": [
                    "The library became a shared production asset across teams. Engineers integrated confidently. Designers referenced existing work. The .lottie migration improved Android performance across the entire product."
                ]
            }
        ]
    }

if __name__ == '__main__':
    # Read current content
    with open('content.json', 'r') as f:
        content = json.load(f)
    
    # Convert projects
    for proj in content['projects']:
        if proj['id'] == 5:  # Flink
            proj['structuredContent'] = parse_flink_project()
            print(f"✓ Converted Flink to structured format")
        elif proj['id'] == 3:  # Lotties
            proj['structuredContent'] = parse_lotties_project()
            print(f"✓ Converted Lotties to structured format")
    
    # Write back
    with open('content-structured.json', 'w') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    
    print("✓ Created content-structured.json with new schema")
