export const sendEmailReport = async (recipients, template, attachments) => {
    // Mock email sending
    console.log(`Sending ${template} email to ${recipients.join(', ')} with ${attachments.length} attachments.`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
};