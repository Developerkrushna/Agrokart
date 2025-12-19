const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
    constructor() {
        this.subscribers = new Map(); // Store WebSocket connections
    }

    // Subscribe to notifications (WebSocket connection)
    subscribe(userId, connection) {
        this.subscribers.set(userId, connection);
        console.log(`User ${userId} subscribed to notifications`);
    }

    // Unsubscribe from notifications
    unsubscribe(userId) {
        this.subscribers.delete(userId);
        console.log(`User ${userId} unsubscribed from notifications`);
    }

    // Send real-time notification
    async sendRealTimeNotification(userId, notification) {
        const connection = this.subscribers.get(userId);
        if (connection && connection.readyState === 1) { // WebSocket.OPEN
            try {
                connection.send(JSON.stringify({
                    type: 'notification',
                    data: notification
                }));
            } catch (error) {
                console.error('Failed to send real-time notification:', error);
                this.subscribers.delete(userId);
            }
        }
    }

    // Create and send notification
    async createAndSendNotification(notificationData) {
        try {
            // Create notification in database
            const notification = await Notification.createNotification(notificationData);

            // Send real-time notification if user is online
            if (notificationData.recipient) {
                await this.sendRealTimeNotification(notificationData.recipient, notification);
            }

            // Send email/SMS if enabled
            if (notificationData.channels?.email) {
                await this.sendEmailNotification(notificationData);
            }

            if (notificationData.channels?.sms) {
                await this.sendSMSNotification(notificationData);
            }

            return notification;
        } catch (error) {
            console.error('Notification service error:', error);
            throw error;
        }
    }

    // Send email notification
    async sendEmailNotification(notificationData) {
        try {
            // Get user email
            const user = await User.findById(notificationData.recipient);
            if (!user || !user.email) return;

            // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
            console.log(`Email notification sent to ${user.email}: ${notificationData.title}`);
            
            // For demo purposes, we'll just log it
            // In production, implement actual email sending
        } catch (error) {
            console.error('Email notification error:', error);
        }
    }

    // Send SMS notification
    async sendSMSNotification(notificationData) {
        try {
            // Get user phone
            const user = await User.findById(notificationData.recipient);
            if (!user || !user.phone) return;

            // Here you would integrate with your SMS service (Twilio, AWS SNS, etc.)
            console.log(`SMS notification sent to ${user.phone}: ${notificationData.title}`);
            
            // For demo purposes, we'll just log it
            // In production, implement actual SMS sending
        } catch (error) {
            console.error('SMS notification error:', error);
        }
    }

    // Notification templates for different events
    getNotificationTemplate(type, data) {
        const templates = {
            order_placed: {
                vendor: {
                    title: 'New Order Received',
                    message: `You have received a new order #${data.trackingNumber} worth ₹${data.amount}`,
                    priority: 'high'
                }
            },
            order_confirmed: {
                customer: {
                    title: 'Order Confirmed',
                    message: `Your order #${data.trackingNumber} has been confirmed by the vendor`,
                    priority: 'medium'
                }
            },
            order_cancelled: {
                customer: {
                    title: 'Order Cancelled',
                    message: `Your order #${data.trackingNumber} has been cancelled. ${data.reason || ''}`,
                    priority: 'high'
                }
            },
            delivery_assigned: {
                customer: {
                    title: 'Delivery Partner Assigned',
                    message: `Your order #${data.trackingNumber} is now out for delivery`,
                    priority: 'medium'
                },
                delivery_partner: {
                    title: 'New Delivery Assignment',
                    message: `You have been assigned delivery for order #${data.trackingNumber}`,
                    priority: 'high'
                }
            },
            order_delivered: {
                customer: {
                    title: 'Order Delivered',
                    message: `Your order #${data.trackingNumber} has been delivered successfully`,
                    priority: 'high'
                },
                vendor: {
                    title: 'Order Delivered',
                    message: `Order #${data.trackingNumber} has been delivered to the customer`,
                    priority: 'medium'
                }
            },
            low_stock: {
                vendor: {
                    title: 'Low Stock Alert',
                    message: `${data.productName} is running low on stock (${data.currentStock} units remaining)`,
                    priority: 'medium'
                }
            },
            payment_received: {
                vendor: {
                    title: 'Payment Received',
                    message: `Payment of ₹${data.amount} has been received for order #${data.trackingNumber}`,
                    priority: 'medium'
                }
            },
            earnings_update: {
                vendor: {
                    title: 'Earnings Updated',
                    message: `Your earnings have been updated. New balance: ₹${data.amount}`,
                    priority: 'low'
                },
                delivery_partner: {
                    title: 'Earnings Updated',
                    message: `Your earnings have been updated. New balance: ₹${data.amount}`,
                    priority: 'low'
                }
            }
        };

        return templates[type] || {};
    }

    // Send notification to multiple users
    async sendBulkNotification(userIds, notificationData) {
        const promises = userIds.map(userId => 
            this.createAndSendNotification({
                ...notificationData,
                recipient: userId
            })
        );

        try {
            await Promise.all(promises);
            console.log(`Bulk notification sent to ${userIds.length} users`);
        } catch (error) {
            console.error('Bulk notification error:', error);
        }
    }

    // Send notification based on user role and event
    async sendEventNotification(eventType, eventData, targetRoles = []) {
        try {
            const templates = this.getNotificationTemplate(eventType, eventData);

            for (const role of targetRoles) {
                if (templates[role]) {
                    const users = await User.find({ role: role });
                    const userIds = users.map(user => user._id);

                    await this.sendBulkNotification(userIds, {
                        recipientType: role,
                        type: eventType,
                        title: templates[role].title,
                        message: templates[role].message,
                        priority: templates[role].priority,
                        data: eventData
                    });
                }
            }
        } catch (error) {
            console.error('Event notification error:', error);
        }
    }

    // Get unread notifications for a user
    async getUnreadNotifications(userId) {
        try {
            return await Notification.find({
                recipient: userId,
                isRead: false,
                status: { $in: ['sent', 'delivered'] }
            }).sort({ createdAt: -1 });
        } catch (error) {
            console.error('Get unread notifications error:', error);
            return [];
        }
    }

    // Mark notification as read
    async markAsRead(notificationId, userId) {
        try {
            const notification = await Notification.findOne({
                _id: notificationId,
                recipient: userId
            });

            if (notification) {
                notification.markAsRead();
                await notification.save();
            }

            return notification;
        } catch (error) {
            console.error('Mark as read error:', error);
            throw error;
        }
    }

    // Mark all notifications as read for a user
    async markAllAsRead(userId) {
        try {
            return await Notification.markAllAsRead(userId);
        } catch (error) {
            console.error('Mark all as read error:', error);
            throw error;
        }
    }
}

// Export singleton instance
module.exports = new NotificationService();
