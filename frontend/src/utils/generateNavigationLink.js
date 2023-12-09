/**
 * Generate navigation link for notification
 *
 * @param notification Notification object
 * @returns {string} Navigation link
 */
export default function generateNavigationLink(notification) {
    if (notification === null) return '/'; // Should never happen
    if (notification.related_link === null) return '/'; // Should never happen

    // Get the second last part of the link
    const linkParts = notification.related_link.split('/');
    const page = linkParts[linkParts.length - 2];
    const id = linkParts[linkParts.length - 1];

    let related_link = '/';

    console.log(page);
    if (page === 'pet_listings') {
        related_link = `/pet_listings/details/${id}`;
    } else if (page === 'applications') {
        related_link = '/applications';
    }

    console.log(related_link);
    return related_link;
}
