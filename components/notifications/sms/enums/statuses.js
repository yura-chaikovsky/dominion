module.exports = {
    NEW                 : "NEW",                // A new message has not been sent
    ENQUEUED            : "ENQUEUED",           // Message hassed moderated and in queued for sending
    ACCEPTED            : "ACCEPTED",           // Sms sent from the system and accepted by the operator to forward to the recipient
    UNDELIVERED         : "UNDELIVERED",        // Do not delivered to the recipient
    REJECTED            : "REJECTED",           // Rejected by the operator on one of a variety of reasons - wrong number of the recipient, the forbidden text, etc.
    PARTLY_DELIVERED    : "PARTLY_DELIVERED",   // Not all segments of the message delivered to the recipient, some operators report only return the first delivered to the segment, so this message after the expiration of the life enters DELIVERED status
    DELIVERED           : "DELIVERED",          // Delivered to the recipient in full
    EXPIRED             : "EXPIRED",            // Delivery failed because the life of expired messages (default 3 days)
    DELETED             : "DELETED"             // Removed due to limitations and is not delivered to the recipient
};
