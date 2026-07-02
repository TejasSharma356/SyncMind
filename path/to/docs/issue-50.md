# Issue 50: Align Analytics with Real Meeting and Action Item Data

## Summary

The analytics page currently derives completion and duration-related insights from assumptions that do not match actual UI behavior. For example, action item completion is tracked only in local component state, while analytics reads `action_items[].completed`. This makes parts of the analytics dashboard misleading or non-functional.

## Current Problem

* Action item completion in analytics is disconnected from the actual checklist UI
* “Completion rate” may remain empty or inaccurate
* Pending action item counts may be misleading
* Duration is estimated only from transcript word count, which may be too rough if real duration metadata exists or becomes available

## Expected Behavior

* Analytics should reflect the same source of truth as the meeting details UI
* Completion metrics should be based on persisted action item state
* Duration logic should prefer real duration metadata when available
* Derived charts should degrade gracefully when data is incomplete

## Suggested Scope

This can be one PR focused on analytics correctness:
* Align action-item completion storage and analytics computation
* Define expected meeting/action-item shape
* Improve fallback rules for duration calculation
* Add defensive handling for partial/malformed meeting payloads

## Acceptance Criteria

* [ ] Completion rate reflects real persisted action item state
* [ ] Pending action item count is accurate
* [ ] Duration uses a better source of truth when available
* [ ] Analytics UI handles incomplete meeting data safely