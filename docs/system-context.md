## System Context Diagram (Textual)

```
┌─────────────────────────────────────────────────────────────────┐
│                   Campus Sustainability Tracker                 │
│                                                                 │
│  ┌──────────────────┐   ┌──────────────────┐                    │
│  │  Web Application │   │  REST / Event API │                   │
│  │  (React Frontend)│   │  (Spring Boot)    │                   │
│  └────────┬─────────┘   └────────┬──────────┘                   │
│           │                      │                              │
│  ┌────────▼──────────────────────▼──────────┐                   │
│  │           Core Business Logic            │                   │
│  │  Auth · Dashboard · Alerts · AI Engine   │                   │
│  └────────────────────┬──────────────────────┘                  │
│                       │                                         │
│  ┌────────────────────▼──────────────────────┐                  │
│  │       Data Layer                           │                 │
│  └────────────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
       ▲             ▲                ▲
       │             │                │
  Students    Facility/IT/Uni    IoT Sensors &
  (Browser)   Admins (Browser)   BMS Systems
  