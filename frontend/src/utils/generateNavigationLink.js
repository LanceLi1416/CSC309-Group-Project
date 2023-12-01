/**
 * Generate navigation link for notification
 *
 * @param notification Notification object
 * @returns {string} Navigation link
 */
export default function generateNavigationLink(notification) {
    // TODO: generate navigation link
    if (notification.related_link === null) return ''; // Should not happen
    console.log(notification.related_link);
    return notification.related_link;
}
