const axios = require('axios');
require('dotenv').config();

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message/push';

const sendLineMessage = async (message, imageUrl = null) => {
    const token = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const userId = process.env.LINE_USER_ID;

    if (!token || !userId) {
        console.warn('LINE_CHANNEL_ACCESS_TOKEN or LINE_USER_ID is missing in .env');
        return;
    }

    const messages = [
        {
            type: 'text',
            text: message
        }
    ];

    if (imageUrl) {
        messages.push({
            type: 'image',
            originalContentUrl: imageUrl,
            previewImageUrl: imageUrl // LINE requires both, usually preview can be same or smaller
        });
    }

    try {
        await axios.post(
            LINE_MESSAGING_API,
            {
                to: userId,
                messages: messages
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        console.log('Line message sent successfully');
    } catch (error) {
        console.error('Error sending Line message:', error.response ? error.response.data : error.message);
    }
};

module.exports = { sendLineMessage };
