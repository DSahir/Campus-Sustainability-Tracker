# Functional Requirements (Use Cases)
## Use Case 1 – User Authentication
Actor: Student, Facility Manager, Administrator
Trigger: User attempts to log into the system.

Main Success Scenario:
1) User enters username and password.
2) System verifies the credentials.
3) System authenticates the user and grants access to the dashboard based on role.

Failure Case:
1) Invalid credentials entered.
2) Authentication service unavailable.
   
## Use Case 2 – View Sustainability Dashboard
Actor: Student, Facility Manager, Administrator
Trigger: User opens the dashboard interface.

Main Success Scenario:
1) System retrieves real-time sustainability data.
2) System processes energy, water, waste, and CO₂ metrics.
3) Dashboard displays the data through charts and metrics.

Failure Case:
1) Data source unavailable.
2) Database connection failure.

## Use Case 3 – Monitor Building Resource Usage
Actor: Facility Manager
Trigger: Manager selects a building from the dashboard.

Main Success Scenario:
1) System retrieves building-specific resource data.
2) System displays energy, water, and waste usage.
3) Manager analyzes resource consumption trends.

Failure Case:
1) Building data unavailable.
2) Sensor data corrupted or missing.

## Use Case 4 – Configure Sustainability Thresholds
Actor: Administrator
Trigger: Admin updates system monitoring settings.

Main Success Scenario:
1) Admin accesses configuration settings.
2) Admin sets threshold limits for resource consumption.
3) System stores updated configuration.

Failure Case:
1) Invalid threshold values entered.
2) Configuration update fails.

## Use Case 5 – Generate Sustainability Report
Actor: Administrator
Trigger: Admin requests a sustainability report.

Main Success Scenario:
1) Admin selects reporting timeframe.
2) System aggregates sustainability data.
3) System generates a report.
4) Report is available for download.

Failure Case:
1) Report generation fails due to missing data.

## Use Case 6 – Receive Resource Usage Alert
Actor: Facility Manager
Trigger: Resource consumption exceeds predefined threshold.

Main Success Scenario:
1) System detects abnormal resource usage.
2) System triggers alert mechanism.
3) Facility manager receives notification via dashboard or email.

Failure Case:
1) Notification system unavailable.

## Use Case 7 – Predict Future Resource Usage
Actor: System
Trigger: System performs scheduled predictive analysis.

Main Success Scenario:
1) System retrieves historical resource usage data.
2) AI model analyzes consumption trends.
3) System generates resource usage predictions.
4) Predictions are displayed on the dashboard.

Failure Case:
1) Insufficient historical data.
2) AI model processing error.

## Use Case 8 – View Sustainability Recommendations
Actor: Student, Facility Manager
Trigger: User accesses the recommendations section.

Main Success Scenario:
1) System analyzes current sustainability data.
2) System generates optimization recommendations.
3) User views suggestions for reducing environmental impact.

Failure Case:
Recommendation system unavailable.
