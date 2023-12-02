/**
 * Generate navigation link for notification
 *
 * @param notification Notification object
 * @returns {string} Navigation link
 */
export default function generateNavigationLink(notification) {
    if (notification === null) return '/'; // Should never happen
    if (notification.related_link === null) return '/'; // Should never happen

    // TODO: generate navigation link
    console.log(notification.related_link);

    return notification.related_link;
}
