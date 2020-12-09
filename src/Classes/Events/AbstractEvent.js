class AbstractEvent {
  constructor(eventId, group, metadata, startTime, endTime) {
    this.EventId = eventId;
    this.Group = group;
    this.Metadata = metadata;
    this.StartTime = startTime;
    this.EndTime = endTime;
  }
}

module.exports = AbstractEvent;
