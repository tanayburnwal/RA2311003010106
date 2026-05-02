# Notification System Design

## Stage 1: REST API Design

### APIs

* GET /notifications
  Fetch all notifications of a user

* POST /notifications
  Create a new notification

* PUT /notifications/:id/read
  Mark a notification as read

* DELETE /notifications/:id
  Delete a notification

### Data Structure

```json
{
  "id": "string",
  "userId": "string",
  "type": "Event | Result | Placement",
  "message": "string",
  "timestamp": "datetime",
  "isRead": false
}
```

---

## Stage 2: Database Design

### Tables

Users:

* userId (Primary Key)

Notifications:

* id (Primary Key)
* userId (Foreign Key)
* type
* message
* timestamp
* isRead

### Approach

I would use **PostgreSQL** because the data is structured and requires efficient querying.

### Scaling Considerations

As the number of notifications increases:

* Queries may slow down
* Storage will grow significantly

### Improvements

* Add index on `(userId, isRead, timestamp)`
* Use partitioning based on userId or time

---

## Stage 3: Query Optimization

### Existing Query

```sql
SELECT * FROM notifications 
WHERE studentId = 1042 AND isRead = false 
ORDER BY createdAt DESC;
```

### Issue

This query can become slow due to full table scan when data size grows.

### Optimization

```sql
CREATE INDEX idx_user_unread 
ON notifications(studentId, isRead, createdAt DESC);
```

This helps in faster filtering and sorting.

### Additional Query

```sql
SELECT * FROM notifications
WHERE type = 'Placement'
AND timestamp >= NOW() - INTERVAL '7 days';
```

---

## Stage 4: Performance Improvement

### Problem

Fetching notifications from database on every request can overload the system.

### Solution

* Use **Redis caching** for frequently accessed data
* Cache unread notifications for each user
* Implement pagination (limit, offset) to reduce response size

---

## Stage 5: Handling Large Scale Notifications

### Problem

Sending notifications to thousands of users at once is inefficient if done synchronously.

### Solution

I would introduce a **message queue system** like Kafka or RabbitMQ.

### Flow

1. Add notification job to queue
2. Worker services process jobs asynchronously
3. Notifications are sent and stored

This improves scalability and reliability.

---

## Stage 6: Priority Notifications

### Requirement

Show top important unread notifications first.

### Logic

Priority can be calculated using:

* Type importance (Placement > Result > Event)
* Recent notifications get higher priority

### Implementation

* Maintain a **priority queue (max heap)**
* Keep only top N (e.g., 10) notifications
* Update dynamically when new notifications arrive

---

## Conclusion

This design focuses on scalability and performance by using:

* Proper indexing
* Caching
* Asynchronous processing
* Priority-based filtering

These techniques ensure the system performs efficiently even with large user data.
