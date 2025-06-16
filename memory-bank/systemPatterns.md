# System Patterns - Script Writing App

## Navigation Architecture

### Sidebar Structure (Persistent)
```
[App Logo] (commented out for now)
+ New Script (Primary CTA Button)
--- (Divider) ---
📊 Dashboard
📝 Capture
  ├── Notes
  └── Recordings
📄 Scripts
💡 Inspiration
  ├── AI Suggestions
  └── Collections
--- (Bottom Divider) ---
👤 [User Profile/Name] → Settings
```

### Page Hierarchy
```
Dashboard (Home)
├── Quick Access
│   ├── Recent Scripts
│   ├── Recent Captures
│   └── AI Suggestions Preview
└── Social Stats
    ├── Follower Metrics
    ├── Growth Charts
    └── Profile Links

Script Creation Flow
├── Step A: Script Creator (Input)
├── Step B: Script Response (Chat UI)
│   ├── Left Pane: Chat History
│   └── Right Pane: Script Elements
└── Step C: Final Script Editor

Capture System
├── Notes (Two-pane layout)
│   ├── Left: Notes List
│   └── Right: Markdown Editor
└── Recordings
    ├── Audio Player
    ├── Transcription
    └── Recording Modal

Scripts Library
└── Table View (Title, Status, Modified, Actions)

Inspiration Hub
├── AI Suggestions (Grid + Endless Scroll)
└── Collections (Grid → Two-column Detail)

Settings
├── Profile Management
├── Social Connections
├── Integrations (Email-to-app)
└── Subscription
```

## UI Design Patterns

### Primary Actions
- **+ New Script**: Dominant primary button in sidebar
- **Generate Script**: Main CTA in Script Creator
- **Save as Draft**: Secondary action in Script Response
- **Finalize Script**: Primary action when satisfied

### Layout Patterns
1. **Dashboard**: Cards + Charts layout
2. **Chat Interface**: Two-pane (conversation + elements)
3. **Library Views**: Table + Grid combinations
4. **Editors**: Full-width, distraction-free
5. **Two-pane**: List + Detail pattern

### Component Relationships

#### Script Elements System
```
Script
├── Hook (swappable alternatives)
├── Bridge/Body (multiple angles)
└── Call to Action (various endings)
```

#### Capture Integration
```
Capture Item
├── Create Script from Note
├── Create Script from Recording
└── Direct to Script Response (Chat UI)
```

#### Status Flow
```
Idea → Draft → In-Progress → Completed
  ↓       ↓         ↓          ↓
Notes   Script    Chat UI    Editor
        Creator
```

## Data Flow Architecture

### Script Generation Pipeline
1. **Input**: User prompt + tone selection
2. **Processing**: AI generation with chat interface
3. **Refinement**: Component swapping + chat iterations
4. **Finalization**: Markdown editor + export options

### Content State Management
- **Notes**: Markdown content + metadata
- **Recordings**: Audio file + transcription + metadata
- **Scripts**: Content + status + version history
- **Collections**: User-curated content + external links

### Integration Points
- **Social APIs**: TikTok, Instagram for analytics
- **Email Service**: Unique address generation + parsing
- **AI Service**: Script generation + suggestions
- **Export Services**: PDF, TXT generation

## Responsive Behavior

### Desktop (Primary)
- Full sidebar navigation
- Multi-pane layouts
- Rich editing tools
- Complete feature set

### Tablet
- Collapsible sidebar
- Stacked layouts
- Touch-optimized controls
- Essential features

### Mobile
- Bottom navigation
- Single-pane flows
- Voice recording focus
- Core functionality

## Accessibility Patterns
- Keyboard navigation for all flows
- Screen reader support for content
- High contrast mode compatibility
- Focus management in modals/dialogs 