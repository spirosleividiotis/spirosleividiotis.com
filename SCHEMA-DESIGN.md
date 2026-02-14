# Project Content Schema Design

## Universal Project Structure

Every project can have:

```json
{
  "id": 1,
  "name": "Project Name",
  "company": "Company",
  "color": "#141414",
  "cardPreview": "cover.mp4",
  "passwordProtected": false,
  "password": "",
  
  "content": {
    "tags": ["Tag 1", "Tag 2", "Tag 3"],
    "intro": "Introduction paragraph",
    "meta": "2021 - 2022 Role Title",
    
    "sections": [
      {
        "type": "text",
        "label": "Context",
        "title": "Section Title",
        "paragraphs": [
          "Paragraph 1 text with <strong>bold</strong>",
          "Paragraph 2 text"
        ]
      },
      {
        "type": "showcase",
        "label": "Deliverables",
        "title": "Core Brand Animations",
        "items": [
          {
            "title": "Logo Animation",
            "description": "Description text",
            "media": "flink-finallogo.mp4",
            "layout": "full"
          },
          {
            "title": "Alternative",
            "media": ["flink-logo-alt1.mp4", "flink-logo-alt2.mp4"],
            "layout": "grid-2"
          },
          {
            "title": "Explorations",
            "media": ["exp1.mp4", "exp2.mp4", "exp3.mp4", "exp4.mp4", "exp5.mp4", "exp6.mp4"],
            "layout": "grid-6"
          }
        ]
      },
      {
        "type": "stats",
        "items": [
          { "number": "1,000+", "label": "Lottie Files" },
          { "number": "3", "label": "Platforms" }
        ]
      }
    ]
  }
}
```

## CMS UI for Each Section Type

### Text Section:
- Label input
- Title input
- Paragraphs: + Add paragraph button, each with rich text area
- - Remove paragraph button

### Showcase Section:
- Label input
- Title input  
- Items: + Add item button
  - Item title
  - Item description (optional)
  - Media: Upload button(s) depending on layout
  - Layout dropdown: full / grid-2 / grid-3 / grid-6
- - Remove item button

### Stats Section:
- Items: + Add stat button
  - Number/text
  - Label
- - Remove stat button

This schema is flexible enough to handle all current projects and future ones.
